from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator, model_validator
from sqlalchemy.orm import Session

from auth import get_current_user, require_parent
from database import get_db
from models import Challenge, ChallengeTick, User
from routers import activity
from routers.activity import naive
from routers.test_results import _own_child
from schemas import _parse_avatar

router = APIRouter(prefix="/api/family", tags=["family"])

CHALLENGE_KINDS = {"lessons", "spelling", "oak", "books", "stars", "custom"}
KINDS_WITH_THRESHOLD = {"spelling", "oak"}
RECENTLY_ENDED_DAYS = 14


class ChallengeIn(BaseModel):
    title: str
    kind: str
    target: int
    threshold_pct: Optional[int] = None
    mode: str = "each"
    start_date: date
    end_date: date
    bonus_stars: int = 0

    @field_validator("title")
    @classmethod
    def valid_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Give the challenge a name")
        return value[:120]

    @field_validator("kind")
    @classmethod
    def valid_kind(cls, value: str) -> str:
        if value not in CHALLENGE_KINDS:
            raise ValueError("Unknown challenge type")
        return value

    @field_validator("mode")
    @classmethod
    def valid_mode(cls, value: str) -> str:
        if value not in {"each", "team"}:
            raise ValueError("Choose each child or team")
        return value

    @field_validator("target")
    @classmethod
    def valid_target(cls, value: int) -> int:
        if not 1 <= value <= 10000:
            raise ValueError("Target must be between 1 and 10000")
        return value

    @field_validator("bonus_stars")
    @classmethod
    def valid_bonus(cls, value: int) -> int:
        if not 0 <= value <= 1000:
            raise ValueError("Bonus must be between 0 and 1000 stars")
        return value

    @model_validator(mode="after")
    def check(self):
        if self.end_date < self.start_date:
            raise ValueError("The end date is before the start date")
        if self.kind in KINDS_WITH_THRESHOLD:
            if self.threshold_pct is None or not 0 <= self.threshold_pct <= 100:
                raise ValueError("Set the score needed (0 to 100%)")
        else:
            self.threshold_pct = None
        return self


class TickIn(BaseModel):
    child_id: int


# ---------------------------------------------------------------------------
# Progress
# ---------------------------------------------------------------------------

def _family_children(db: Session, parent_id: int) -> list[User]:
    return db.query(User).filter(User.parent_id == parent_id, User.role == "child").order_by(User.id).all()


class _ActivityCache:
    """Loads each child's activity once per request, however many challenges use it."""

    def __init__(self, db: Session, parent_id: int):
        self.db = db
        self.parent_id = parent_id
        self._cache: dict = {}

    def get(self, name: str, child: User):
        key = (name, child.id)
        if key not in self._cache:
            self._cache[key] = self._load(name, child)
        return self._cache[key]

    def _load(self, name: str, child: User):
        db, parent_id = self.db, self.parent_id
        if name == "lessons":
            return activity.lesson_completions(db, child, parent_id)
        if name == "spelling":
            return activity.spelling_scores(db, child, parent_id)
        if name == "oak":
            return activity.oak_scores(db, child, parent_id)
        if name == "books":
            return activity.books_finished(db, child, parent_id)
        if name == "stars":
            # Stars from rules and bonus stars only, never other challenge bonuses (which would loop).
            from routers.rewards import _award_events, _earned_events

            return [
                (e["when"], e["stars"])
                for e in _earned_events(db, child, parent_id) + _award_events(db, child, parent_id)
                if e["stars"] > 0 and e["when"]
            ]
        raise ValueError(name)


def _events_for(challenge: Challenge, child: User, cache: _ActivityCache) -> list[tuple[datetime, int]]:
    """(when, amount) for everything this child did towards the challenge, within its dates."""
    kind = challenge.kind
    threshold = challenge.threshold_pct or 0
    if kind == "lessons":
        raw = [(when, 1) for when, _ in cache.get("lessons", child)]
    elif kind == "spelling":
        raw = [(when, 1) for when, score, _ in cache.get("spelling", child) if score >= threshold]
    elif kind == "oak":
        raw = [(when, 1) for when, score, _ in cache.get("oak", child) if score >= threshold]
    elif kind == "books":
        raw = [(datetime.combine(d, datetime.min.time()), 1) for d, _ in cache.get("books", child)]
    elif kind == "stars":
        raw = cache.get("stars", child)
    else:
        raw = [
            (naive(t.created_at), 1)
            for t in cache.db.query(ChallengeTick)
            .filter(ChallengeTick.challenge_id == challenge.id, ChallengeTick.child_id == child.id)
            .all()
        ]
    return sorted(
        ((when, amount) for when, amount in raw if when and challenge.start_date <= when.date() <= challenge.end_date),
        key=lambda e: e[0],
    )


def _completed_at(events: list[tuple[datetime, int]], target: int) -> Optional[datetime]:
    total = 0
    for when, amount in sorted(events, key=lambda e: e[0]):
        total += amount
        if total >= target:
            return when
    return None


def _challenge_progress(challenge: Challenge, children: list[User], cache: _ActivityCache) -> dict:
    per_child = {c.id: _events_for(challenge, c, cache) for c in children}
    out = {
        "children": [
            {
                "child_id": c.id,
                "username": c.username,
                "progress": sum(a for _, a in per_child[c.id]),
                "completed_at": None,
            }
            for c in children
        ],
        "team_progress": None,
        "team_completed_at": None,
    }
    if challenge.mode == "team":
        merged = [e for events in per_child.values() for e in events]
        out["team_progress"] = sum(a for _, a in merged)
        done = _completed_at(merged, challenge.target)
        out["team_completed_at"] = done.isoformat() if done else None
    else:
        for row in out["children"]:
            done = _completed_at(per_child[row["child_id"]], challenge.target)
            row["completed_at"] = done.isoformat() if done else None
    return out


def challenge_bonus_events(db: Session, child: User, parent_id: int) -> list:
    """Bonus stars this child has won from completed challenges (used in their star balance)."""
    challenges = (
        db.query(Challenge)
        .filter(Challenge.parent_id == parent_id, Challenge.bonus_stars > 0)
        .all()
    )
    if not challenges:
        return []
    cache = _ActivityCache(db, parent_id)
    children = _family_children(db, parent_id)
    events = []
    for challenge in challenges:
        if challenge.mode == "team":
            merged = [e for c in children for e in _events_for(challenge, c, cache)]
            done = _completed_at(merged, challenge.target)
        else:
            done = _completed_at(_events_for(challenge, child, cache), challenge.target)
        if done:
            events.append({"when": done, "stars": challenge.bonus_stars, "reason": f"Challenge complete: {challenge.title}"})
    return events


def _challenge_out(challenge: Challenge, progress: dict) -> dict:
    return {
        "id": challenge.id,
        "title": challenge.title,
        "kind": challenge.kind,
        "target": challenge.target,
        "threshold_pct": challenge.threshold_pct,
        "mode": challenge.mode,
        "start_date": challenge.start_date.isoformat(),
        "end_date": challenge.end_date.isoformat(),
        "bonus_stars": challenge.bonus_stars,
        **progress,
    }


# ---------------------------------------------------------------------------
# Leaderboard
# ---------------------------------------------------------------------------

def _streak(days_with_learning: set, today: date) -> int:
    """Consecutive learning days up to today. Weekends never break a streak, and today
    doesn't break it before anything has been done."""
    day = today
    if day not in days_with_learning:
        day -= timedelta(days=1)
    streak = 0
    while True:
        if day in days_with_learning:
            streak += 1
        elif day.weekday() < 5:
            break
        day -= timedelta(days=1)
        if streak > 366:
            break
    return streak


def _leaderboard(db: Session, parent_id: int, children: list[User], cache: _ActivityCache) -> dict:
    from routers.rewards import _award_events, _earned_events

    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    rows = []
    for child in children:
        events = _earned_events(db, child, parent_id) + _award_events(db, child, parent_id)
        events += challenge_bonus_events(db, child, parent_id)
        stars_week = sum(
            e["stars"] for e in events if e["stars"] > 0 and e["when"] and week_start <= e["when"].date() <= week_end
        )
        lessons = cache.get("lessons", child)
        rows.append({
            "child_id": child.id,
            "username": child.username,
            "avatar": _parse_avatar(child.avatar),
            "has_photo": bool(child.avatar_photo),
            "stars_week": stars_week,
            "lessons_week": sum(1 for when, _ in lessons if week_start <= when.date() <= week_end),
            "streak": _streak({when.date() for when, _ in lessons}, today),
        })
    rows.sort(key=lambda r: (-r["stars_week"], -r["lessons_week"], r["username"].lower()))
    return {
        "week_start": week_start.isoformat(),
        "week_end": week_end.isoformat(),
        "family_total": sum(r["stars_week"] for r in rows),
        "children": rows,
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/overview")
def family_overview(
    include_ended: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Weekly leaderboard and current challenges, for parents and children alike."""
    parent_id = current_user.id if current_user.role == "parent" else current_user.parent_id
    if not parent_id:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    children = _family_children(db, parent_id)
    cache = _ActivityCache(db, parent_id)

    today = datetime.utcnow().date()
    query = db.query(Challenge).filter(Challenge.parent_id == parent_id, Challenge.is_archived.is_not(True))
    if not include_ended:
        query = query.filter(Challenge.end_date >= today - timedelta(days=RECENTLY_ENDED_DAYS))
    challenges = query.order_by(Challenge.end_date, Challenge.id).all()

    return {
        "leaderboard": _leaderboard(db, parent_id, children, cache),
        "challenges": [_challenge_out(c, _challenge_progress(c, children, cache)) for c in challenges],
        "today": today.isoformat(),
    }


@router.post("/challenges", status_code=201)
def add_challenge(body: ChallengeIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    challenge = Challenge(parent_id=current_user.id, is_archived=False, **body.model_dump())
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    children = _family_children(db, current_user.id)
    return _challenge_out(challenge, _challenge_progress(challenge, children, _ActivityCache(db, current_user.id)))


@router.delete("/challenges/{challenge_id}", status_code=204)
def remove_challenge(challenge_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id, Challenge.parent_id == current_user.id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    # Hidden rather than deleted, so bonus stars already won stay in the children's balances.
    challenge.is_archived = True
    db.commit()


def _custom_challenge(db: Session, parent: User, challenge_id: int, child_id: int) -> Challenge:
    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id, Challenge.parent_id == parent.id, Challenge.is_archived.is_not(True)
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    if challenge.kind != "custom":
        raise HTTPException(status_code=400, detail="This challenge updates by itself")
    _own_child(db, parent, child_id)
    return challenge


@router.post("/challenges/{challenge_id}/tick", status_code=201)
def tick_challenge(challenge_id: int, body: TickIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    challenge = _custom_challenge(db, current_user, challenge_id, body.child_id)
    today = datetime.utcnow().date()
    if not challenge.start_date <= today <= challenge.end_date:
        raise HTTPException(status_code=400, detail="This challenge isn't running today")
    db.add(ChallengeTick(challenge_id=challenge.id, child_id=body.child_id))
    db.commit()
    return {"ok": True}


@router.delete("/challenges/{challenge_id}/tick", status_code=204)
def untick_challenge(
    challenge_id: int,
    child_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    challenge = _custom_challenge(db, current_user, challenge_id, child_id)
    tick = (
        db.query(ChallengeTick)
        .filter(ChallengeTick.challenge_id == challenge.id, ChallengeTick.child_id == child_id)
        .order_by(ChallengeTick.id.desc())
        .first()
    )
    if not tick:
        raise HTTPException(status_code=400, detail="Nothing to undo")
    db.delete(tick)
    db.commit()
