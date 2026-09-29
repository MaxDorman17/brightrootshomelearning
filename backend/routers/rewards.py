import re
from datetime import datetime, timezone
from typing import Optional
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import require_child, require_parent
from database import get_db
from models import RewardClaim, RewardItem, RewardRule, StarAward, User
from push import notify_in_background
from routers import activity
from routers.activity import naive as _naive
from routers.test_results import _own_child

router = APIRouter(prefix="/api/rewards", tags=["rewards"])

UK = ZoneInfo("Europe/London")

RULE_KINDS = {"lesson", "oak", "oak_starter", "spelling", "book", "game"}
GAMES_PER_DAY_CAP = 3  # stars for at most this many games a day, so they can't be farmed
KINDS_WITH_THRESHOLD = {"oak", "oak_starter", "spelling"}

DEFAULT_RULES = [
    {"kind": "lesson", "threshold_pct": None, "stars": 1},
    {"kind": "oak", "threshold_pct": 80, "stars": 3},
    {"kind": "spelling", "threshold_pct": 90, "stars": 5},
    {"kind": "book", "threshold_pct": None, "stars": 5},
]
DEFAULT_REWARDS = [
    {"title": "30 minutes of screen time", "emoji": "🎮", "cost": 20},
    {"title": "Choose what's for dinner", "emoji": "🍕", "cost": 30},
    {"title": "Ice cream trip", "emoji": "🍦", "cost": 50},
    {"title": "Stay up 30 minutes later", "emoji": "🌙", "cost": 40},
]


# ---------------------------------------------------------------------------
# Request bodies
# ---------------------------------------------------------------------------

class RuleIn(BaseModel):
    kind: str
    threshold_pct: Optional[int] = None
    stars: int
    is_active: bool = True

    @field_validator("kind")
    @classmethod
    def valid_kind(cls, value: str) -> str:
        if value not in RULE_KINDS:
            raise ValueError("Unknown rule type")
        return value

    @field_validator("stars")
    @classmethod
    def valid_stars(cls, value: int) -> int:
        if not 1 <= value <= 100:
            raise ValueError("Stars must be between 1 and 100")
        return value

    @field_validator("threshold_pct")
    @classmethod
    def valid_threshold(cls, value: Optional[int]) -> Optional[int]:
        if value is not None and not 0 <= value <= 100:
            raise ValueError("Score must be between 0 and 100")
        return value


class RewardIn(BaseModel):
    title: str
    emoji: Optional[str] = None
    cost: int
    is_active: bool = True

    @field_validator("title")
    @classmethod
    def valid_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Required")
        return value[:120]

    @field_validator("emoji")
    @classmethod
    def valid_emoji(cls, value: Optional[str]) -> Optional[str]:
        value = (value or "").strip()
        return value[:16] or None

    @field_validator("cost")
    @classmethod
    def valid_cost(cls, value: int) -> int:
        if not 1 <= value <= 10000:
            raise ValueError("Cost must be between 1 and 10000 stars")
        return value


class AwardIn(BaseModel):
    child_id: int
    stars: int
    reason: Optional[str] = None

    @field_validator("stars")
    @classmethod
    def valid_stars(cls, value: int) -> int:
        if value == 0 or not -1000 <= value <= 1000:
            raise ValueError("Stars must be between -1000 and 1000, and not 0")
        return value


class ClaimIn(BaseModel):
    reward_id: int
    quantity: int = 1

    @field_validator("quantity")
    @classmethod
    def valid_quantity(cls, value: int) -> int:
        if not 1 <= value <= 50:
            raise ValueError("You can ask for between 1 and 50 at a time")
        return value


def _claim_title(title: str, quantity: int) -> str:
    """ "10 mins on the VR" x 6 becomes "10 mins on the VR x 6 (60 mins)", adding up any minutes or hours in the name."""
    if quantity == 1:
        return title
    label = f"{title} \u00d7 {quantity}"
    match = re.search(r"(\d+)\s*(min|minute|hour|hr)s?\b", title, re.IGNORECASE)
    if match:
        total = int(match.group(1)) * quantity
        unit = "hour" if match.group(2).lower() in ("hour", "hr") else "min"
        label += f" ({total} {unit}{'' if total == 1 else 's'})"
    return label[:120]


# ---------------------------------------------------------------------------
# Star calculation
# ---------------------------------------------------------------------------

def _rule_now() -> datetime:
    """Rule start/end times, to the whole second like the database's own timestamps,
    so work finished in the same second as a rule is added still counts."""
    return datetime.utcnow().replace(microsecond=0)


def _rule_label(rule: RewardRule) -> str:
    if rule.kind == "lesson":
        return "Complete a lesson"
    if rule.kind == "oak":
        return f"Score {rule.threshold_pct or 0}% or more on an Oak exit quiz"
    if rule.kind == "oak_starter":
        return f"Score {rule.threshold_pct or 0}% or more on an Oak starter quiz"
    if rule.kind == "spelling":
        return f"Score {rule.threshold_pct or 0}% or more on a spelling test"
    if rule.kind == "game":
        return f"Play a learning game (up to {GAMES_PER_DAY_CAP} a day)"
    return "Finish a book"


def _earned_events(db: Session, child: User, parent_id: int) -> list:
    """Every star this child has earned under the family's rules, past and present."""
    rules = db.query(RewardRule).filter(RewardRule.parent_id == parent_id).all()
    if not rules:
        return []
    events = []

    def in_window(rule: RewardRule, when: Optional[datetime]) -> bool:
        if when is None:
            return False
        when = _naive(when)
        return when >= _naive(rule.counts_from) and (rule.ended_at is None or when < _naive(rule.ended_at))

    kinds = {r.kind for r in rules}
    lessons = activity.lesson_completions(db, child, parent_id) if "lesson" in kinds else []
    quizzes = activity.oak_scores(db, child, parent_id) if "oak" in kinds else []
    starters = activity.oak_starter_scores(db, child, parent_id) if "oak_starter" in kinds else []
    spellings = activity.spelling_scores(db, child, parent_id) if "spelling" in kinds else []
    books = activity.books_finished(db, child, parent_id) if "book" in kinds else []
    games = sorted(activity.games_played(db, child, parent_id)) if "game" in kinds else []

    for rule in rules:
        threshold = rule.threshold_pct or 0
        if rule.kind == "lesson":
            for when, title in lessons:
                if in_window(rule, when):
                    events.append({"when": when, "stars": rule.stars, "reason": f"Completed: {title}"})
        elif rule.kind == "oak":
            for when, score, title in quizzes:
                if in_window(rule, when) and score >= threshold:
                    events.append({"when": when, "stars": rule.stars, "reason": f"Oak exit quiz {round(score)}%: {title}"})
        elif rule.kind == "oak_starter":
            for when, score, title in starters:
                if in_window(rule, when) and score >= threshold:
                    events.append({"when": when, "stars": rule.stars, "reason": f"Oak starter quiz {round(score)}%: {title}"})
        elif rule.kind == "spelling":
            for when, score, label in spellings:
                if in_window(rule, when) and score >= threshold:
                    events.append({"when": when, "stars": rule.stars, "reason": f"Spelling test {label}"})
        elif rule.kind == "game":
            per_day: dict = {}
            for when, game in games:
                if not in_window(rule, when):
                    continue
                per_day[when.date()] = per_day.get(when.date(), 0) + 1
                if per_day[when.date()] <= GAMES_PER_DAY_CAP:
                    events.append({"when": when, "stars": rule.stars, "reason": f"Played {game.replace('_', ' ')}"})
        elif rule.kind == "book":
            ended = _naive(rule.ended_at).date() if rule.ended_at else None
            for finished, title in books:
                if finished >= _naive(rule.counts_from).date() and (ended is None or finished <= ended):
                    events.append({
                        "when": datetime.combine(finished, datetime.min.time()),
                        "stars": rule.stars,
                        "reason": f"Finished a book: {title}",
                    })

    return events


def _award_events(db: Session, child: User, parent_id: int) -> list:
    """Bonus stars given or taken away by hand."""
    return [
        {
            "when": _naive(award.created_at),
            "stars": award.stars,
            "reason": award.reason or ("Bonus stars" if award.stars > 0 else "Stars taken away"),
        }
        for award in db.query(StarAward).filter(StarAward.parent_id == parent_id, StarAward.child_id == child.id).all()
    ]


def _child_summary(db: Session, child: User, parent_id: int, history_limit: int = 30) -> dict:
    from routers.challenges import challenge_bonus_events  # imported here to avoid a circular import

    events = _earned_events(db, child, parent_id) + _award_events(db, child, parent_id)
    events += challenge_bonus_events(db, child, parent_id)

    claims = (
        db.query(RewardClaim)
        .filter(RewardClaim.parent_id == parent_id, RewardClaim.child_id == child.id)
        .order_by(RewardClaim.created_at.desc())
        .all()
    )
    for claim in claims:
        if claim.status == "approved":
            events.append({
                "when": _naive(claim.decided_at or claim.created_at),
                "stars": -claim.cost,
                "reason": f"Spent on: {claim.title}",
            })

    balance = sum(e["stars"] for e in events)
    pending = sum(c.cost for c in claims if c.status == "pending")
    today = datetime.now(UK).date()
    earned_today = sum(
        e["stars"]
        for e in events
        if e["stars"] > 0 and e["when"] and e["when"].replace(tzinfo=timezone.utc).astimezone(UK).date() == today
    )
    events.sort(key=lambda e: e["when"] or datetime.min, reverse=True)

    return {
        "child": {"id": child.id, "username": child.username},
        "balance": balance,
        "available": balance - pending,
        "earned_total": sum(e["stars"] for e in events if e["stars"] > 0),
        "earned_today": earned_today,
        "history": [
            {"when": e["when"].isoformat() if e["when"] else None, "stars": e["stars"], "reason": e["reason"]}
            for e in events[:history_limit]
        ],
        "claims": [_claim_out(c) for c in claims[:20]],
    }


# ---------------------------------------------------------------------------
# Serialisers
# ---------------------------------------------------------------------------

def _rule_out(r: RewardRule) -> dict:
    return {
        "id": r.id,
        "kind": r.kind,
        "threshold_pct": r.threshold_pct,
        "stars": r.stars,
        "is_active": bool(r.is_active),
        "label": _rule_label(r),
    }


def _reward_out(r: RewardItem) -> dict:
    return {"id": r.id, "title": r.title, "emoji": r.emoji, "cost": r.cost, "is_active": bool(r.is_active)}


def _claim_out(c: RewardClaim) -> dict:
    return {
        "id": c.id,
        "child_id": c.child_id,
        "reward_id": c.reward_id,
        "title": c.title,
        "emoji": c.emoji,
        "cost": c.cost,
        "status": c.status,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "decided_at": c.decided_at.isoformat() if c.decided_at else None,
    }


def _ensure_defaults(db: Session, parent: User) -> None:
    """Give a family example rules and rewards the first time they open Rewards."""
    if parent.rewards_set_up_at is not None:
        return
    now = _rule_now()
    for rule in DEFAULT_RULES:
        db.add(RewardRule(parent_id=parent.id, counts_from=now, is_active=True, is_hidden=False, **rule))
    for reward in DEFAULT_REWARDS:
        db.add(RewardItem(parent_id=parent.id, is_active=True, **reward))
    parent.rewards_set_up_at = now
    db.commit()


def _check_threshold(body: RuleIn) -> Optional[int]:
    if body.kind in KINDS_WITH_THRESHOLD:
        if body.threshold_pct is None:
            raise HTTPException(status_code=400, detail="Please set the score needed")
        return body.threshold_pct
    return None


# ---------------------------------------------------------------------------
# Parent endpoints
# ---------------------------------------------------------------------------

@router.get("/pending-count")
def pending_count(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Reward requests waiting for the parent, without setting up example rewards."""
    return {
        "pending": db.query(RewardClaim)
        .filter(RewardClaim.parent_id == current_user.id, RewardClaim.status == "pending")
        .count()
    }


@router.get("/jars")
def star_jars(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Each child's stars and the family's rewards, for the star jars on the parent home page.
    Unlike /setup, this doesn't create the example rules for families who haven't opened Rewards."""
    children = db.query(User).filter(User.parent_id == current_user.id, User.role == "child").all()
    items = (
        db.query(RewardItem)
        .filter(RewardItem.parent_id == current_user.id, RewardItem.is_active.is_(True))
        .order_by(RewardItem.cost, RewardItem.id)
        .all()
    )
    return {
        "set_up": current_user.rewards_set_up_at is not None,
        "children": [_child_summary(db, c, current_user.id, history_limit=0) for c in children],
        "rewards": [_reward_out(r) for r in items],
    }


@router.get("/setup")
def rewards_setup(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    _ensure_defaults(db, current_user)
    children = db.query(User).filter(User.parent_id == current_user.id, User.role == "child").all()
    rules = (
        db.query(RewardRule)
        .filter(RewardRule.parent_id == current_user.id, RewardRule.is_hidden.is_not(True))
        .order_by(RewardRule.kind, RewardRule.id)
        .all()
    )
    items = db.query(RewardItem).filter(RewardItem.parent_id == current_user.id).order_by(RewardItem.cost, RewardItem.id).all()
    pending = (
        db.query(RewardClaim)
        .filter(RewardClaim.parent_id == current_user.id, RewardClaim.status == "pending")
        .order_by(RewardClaim.created_at)
        .all()
    )
    return {
        "rules": [_rule_out(r) for r in rules],
        "rewards": [_reward_out(r) for r in items],
        "children": [_child_summary(db, c, current_user.id, history_limit=15) for c in children],
        "pending": [_claim_out(c) for c in pending],
    }


@router.post("/rules", status_code=201)
def add_rule(body: RuleIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    now = _rule_now()
    rule = RewardRule(
        parent_id=current_user.id,
        kind=body.kind,
        threshold_pct=_check_threshold(body),
        stars=body.stars,
        is_active=body.is_active,
        is_hidden=False,
        counts_from=now,
        ended_at=None if body.is_active else now,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return _rule_out(rule)


@router.put("/rules/{rule_id}")
def update_rule(rule_id: int, body: RuleIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    old = db.query(RewardRule).filter(
        RewardRule.id == rule_id, RewardRule.parent_id == current_user.id, RewardRule.is_hidden.is_not(True)
    ).first()
    if not old:
        raise HTTPException(status_code=404, detail="Rule not found")
    if body.kind != old.kind:
        raise HTTPException(status_code=400, detail="Add a new rule instead of changing its type")
    # Replace rather than edit, so stars already earned under the old settings don't change.
    now = _rule_now()
    if old.ended_at is None:
        old.ended_at = now
    old.is_hidden = True
    rule = RewardRule(
        parent_id=current_user.id,
        kind=old.kind,
        threshold_pct=_check_threshold(body),
        stars=body.stars,
        is_active=body.is_active,
        is_hidden=False,
        counts_from=now,
        ended_at=None if body.is_active else now,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return _rule_out(rule)


@router.delete("/rules/{rule_id}", status_code=204)
def delete_rule(rule_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    rule = db.query(RewardRule).filter(
        RewardRule.id == rule_id, RewardRule.parent_id == current_user.id, RewardRule.is_hidden.is_not(True)
    ).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    # Kept (hidden) so stars already earned from it stay in the child's balance.
    if rule.ended_at is None:
        rule.ended_at = _rule_now()
    rule.is_hidden = True
    db.commit()


@router.post("/items", status_code=201)
def add_reward(body: RewardIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = RewardItem(parent_id=current_user.id, title=body.title, emoji=body.emoji, cost=body.cost, is_active=body.is_active)
    db.add(item)
    db.commit()
    db.refresh(item)
    return _reward_out(item)


@router.put("/items/{item_id}")
def update_reward(item_id: int, body: RewardIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = db.query(RewardItem).filter(RewardItem.id == item_id, RewardItem.parent_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Reward not found")
    item.title, item.emoji, item.cost, item.is_active = body.title, body.emoji, body.cost, body.is_active
    db.commit()
    db.refresh(item)
    return _reward_out(item)


@router.delete("/items/{item_id}", status_code=204)
def delete_reward(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = db.query(RewardItem).filter(RewardItem.id == item_id, RewardItem.parent_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Reward not found")
    # Pending requests for a deleted reward are cancelled; past claims keep their copied title and cost.
    for claim in db.query(RewardClaim).filter(RewardClaim.reward_id == item.id).all():
        if claim.status == "pending":
            claim.status = "cancelled"
            claim.decided_at = datetime.utcnow()
        claim.reward_id = None
    db.delete(item)
    db.commit()


@router.post("/award", status_code=201)
def award_stars(body: AwardIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    _own_child(db, current_user, body.child_id)
    award = StarAward(
        parent_id=current_user.id,
        child_id=body.child_id,
        stars=body.stars,
        reason=((body.reason or "").strip()[:200] or None),
    )
    db.add(award)
    db.commit()
    return {"id": award.id, "stars": award.stars}


def _decide(db: Session, parent: User, claim_id: int, status: str) -> dict:
    claim = db.query(RewardClaim).filter(RewardClaim.id == claim_id, RewardClaim.parent_id == parent.id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Request not found")
    if claim.status != "pending":
        raise HTTPException(status_code=400, detail="This request has already been dealt with")
    claim.status = status
    claim.decided_at = datetime.utcnow()
    db.commit()
    db.refresh(claim)
    return _claim_out(claim)


@router.post("/claims/{claim_id}/approve")
def approve_claim(claim_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    return _decide(db, current_user, claim_id, "approved")


@router.post("/claims/{claim_id}/decline")
def decline_claim(claim_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    return _decide(db, current_user, claim_id, "declined")


# ---------------------------------------------------------------------------
# Child endpoints
# ---------------------------------------------------------------------------

@router.get("/me")
def my_stars(db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    parent_id = current_user.parent_id
    if not parent_id:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    rules = (
        db.query(RewardRule)
        .filter(RewardRule.parent_id == parent_id, RewardRule.is_active.is_(True), RewardRule.is_hidden.is_not(True))
        .order_by(RewardRule.kind, RewardRule.id)
        .all()
    )
    items = (
        db.query(RewardItem)
        .filter(RewardItem.parent_id == parent_id, RewardItem.is_active.is_(True))
        .order_by(RewardItem.cost, RewardItem.id)
        .all()
    )
    return {
        **_child_summary(db, current_user, parent_id),
        "rules": [_rule_out(r) for r in rules],
        "rewards": [_reward_out(r) for r in items],
    }


@router.post("/claims", status_code=201)
def request_reward(body: ClaimIn, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    parent_id = current_user.parent_id
    item = db.query(RewardItem).filter(
        RewardItem.id == body.reward_id,
        RewardItem.parent_id == parent_id,
        RewardItem.is_active.is_(True),
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Reward not found")
    cost = item.cost * body.quantity
    title = _claim_title(item.title, body.quantity)
    summary = _child_summary(db, current_user, parent_id, history_limit=0)
    if summary["available"] < cost:
        raise HTTPException(status_code=400, detail="Not enough stars yet")
    claim = RewardClaim(
        parent_id=parent_id,
        child_id=current_user.id,
        reward_id=item.id,
        title=title,
        emoji=item.emoji,
        cost=cost,
        status="pending",
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    notify_in_background(
        parent_id,
        "New reward request",
        f"{current_user.username} would like {item.emoji or ''} {title} ({cost} stars).".replace("  ", " "),
        "/parent/rewards",
        "reward-request",
    )
    return _claim_out(claim)


@router.delete("/claims/{claim_id}", status_code=204)
def cancel_request(claim_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    claim = db.query(RewardClaim).filter(RewardClaim.id == claim_id, RewardClaim.child_id == current_user.id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Request not found")
    if claim.status != "pending":
        raise HTTPException(status_code=400, detail="This request has already been dealt with")
    claim.status = "cancelled"
    claim.decided_at = datetime.utcnow()
    db.commit()


@router.get("/history")
def child_history(
    child_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child = _own_child(db, current_user, child_id)
    return _child_summary(db, child, current_user.id, history_limit=100)
