"""Clubs (chess, football, swimming...) and the activity diary behind P.E., Outdoors and clubs.

Parents add the clubs their children go to and tick off each session. P.E. and Outdoors activities
can be ticked off too ("We did this"). Everything lands in one diary, which the learning report
and the council report read through `active_summary`.
"""
import json
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import ActivityLog, Club, User
from routers.moments import _clean_child_ids, _family_children, _family_id

router = APIRouter(prefix="/api/activities", tags=["activities"])

KINDS = {"club", "pe", "outdoor"}
KIND_LABEL = {"club": "Club", "pe": "P.E.", "outdoor": "Outdoors"}
# Planner lessons in these subjects count as P.E. or Outdoors too (P.E. and Outdoors activities
# added to the planner get these subjects).
PLANNER_SUBJECTS = {
    "pe": "pe", "p.e.": "pe", "p.e": "pe", "physical education": "pe",
    "outdoor learning": "outdoor", "outdoors": "outdoor", "outdoor": "outdoor",
}


def _ids(raw: Optional[str]) -> list[int]:
    try:
        value = json.loads(raw or "[]")
        return [int(v) for v in value] if isinstance(value, list) else []
    except (ValueError, TypeError):
        return []


def _clip(value: Optional[str], limit: int) -> Optional[str]:
    value = (value or "").strip()
    return value[:limit] or None


class ClubIn(BaseModel):
    name: str
    activity: str
    emoji: Optional[str] = None
    schedule: Optional[str] = None
    place: Optional[str] = None
    minutes: Optional[int] = None
    child_ids: list[int] = []
    notes: Optional[str] = None
    is_active: bool = True

    @field_validator("name", "activity")
    @classmethod
    def required(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Please fill this in")
        return value[:150]

    @field_validator("minutes")
    @classmethod
    def sensible_minutes(cls, value: Optional[int]) -> Optional[int]:
        if value is None:
            return None
        if value < 1 or value > 600:
            raise ValueError("Minutes should be between 1 and 600")
        return value


class LogIn(BaseModel):
    kind: str
    title: Optional[str] = None
    club_id: Optional[int] = None
    make_item_id: Optional[int] = None
    done_on: date
    minutes: Optional[int] = None
    note: Optional[str] = None
    child_ids: list[int] = []

    @field_validator("kind")
    @classmethod
    def known_kind(cls, value: str) -> str:
        if value not in KINDS:
            raise ValueError("Unknown kind of activity")
        return value

    @field_validator("minutes")
    @classmethod
    def sensible_minutes(cls, value: Optional[int]) -> Optional[int]:
        if value is None:
            return None
        if value < 1 or value > 600:
            raise ValueError("Minutes should be between 1 and 600")
        return value


def _club_out(club: Club, kids: dict[int, User], sessions: int = 0, minutes: int = 0, last: Optional[date] = None) -> dict:
    ids = [i for i in _ids(club.child_ids) if i in kids]
    return {
        "id": club.id,
        "name": club.name,
        "activity": club.activity,
        "emoji": club.emoji,
        "schedule": club.schedule,
        "place": club.place,
        "minutes": club.minutes,
        "child_ids": ids,
        "children": [kids[i].username for i in ids],
        "notes": club.notes,
        "is_active": bool(club.is_active),
        "sessions": sessions,
        "session_minutes": minutes,
        "last_session": last.isoformat() if last else None,
    }


def _get_club(db: Session, family: int, club_id: int) -> Club:
    club = db.query(Club).filter(Club.id == club_id, Club.parent_id == family).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    return club


def _require_parent(user: User) -> None:
    if user.role != "parent":
        raise HTTPException(status_code=403, detail="Ask a grown-up to do this")


# ---------- clubs ----------

@router.get("/clubs")
def list_clubs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    kids = _family_children(db, family)
    clubs = db.query(Club).filter(Club.parent_id == family).order_by(Club.is_active.desc(), Club.name).all()
    logs = db.query(ActivityLog).filter(ActivityLog.parent_id == family, ActivityLog.club_id.is_not(None)).all()
    out = []
    for club in clubs:
        if current_user.role == "child" and current_user.id not in _ids(club.child_ids):
            continue
        mine = [l for l in logs if l.club_id == club.id and (current_user.role == "parent" or l.child_id == current_user.id)]
        # A session two children went to together is one session, not two.
        dates = {l.done_on for l in mine}
        minutes = sum(max((l.minutes or 0) for l in mine if l.done_on == d) for d in dates)
        out.append(_club_out(club, kids, len(dates), minutes, max(dates) if dates else None))
    return out


@router.post("/clubs")
def add_club(body: ClubIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _require_parent(current_user)
    club = Club(parent_id=current_user.id)
    _apply_club(db, club, body, current_user.id)
    db.add(club)
    db.commit()
    db.refresh(club)
    return _club_out(club, _family_children(db, current_user.id))


@router.put("/clubs/{club_id}")
def update_club(club_id: int, body: ClubIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _require_parent(current_user)
    club = _get_club(db, current_user.id, club_id)
    _apply_club(db, club, body, current_user.id)
    # Keep the diary's names in step with the club's.
    db.query(ActivityLog).filter(ActivityLog.club_id == club.id).update({ActivityLog.title: club.name})
    db.commit()
    return _club_out(club, _family_children(db, current_user.id))


def _apply_club(db: Session, club: Club, body: ClubIn, family: int) -> None:
    club.name = body.name
    club.activity = body.activity[:100]
    club.emoji = _clip(body.emoji, 16)
    club.schedule = _clip(body.schedule, 150)
    club.place = _clip(body.place, 150)
    club.minutes = body.minutes
    club.child_ids = json.dumps(_clean_child_ids(db, family, body.child_ids))
    club.notes = _clip(body.notes, 2000)
    club.is_active = body.is_active


@router.delete("/clubs/{club_id}", status_code=204)
def delete_club(club_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _require_parent(current_user)
    club = _get_club(db, current_user.id, club_id)
    db.query(ActivityLog).filter(ActivityLog.club_id == club.id).delete()
    db.delete(club)
    db.commit()


# ---------- the diary ----------

def _log_out(log: ActivityLog, kids: dict[int, User], viewer: Optional[User] = None) -> dict:
    child = kids.get(log.child_id)
    return {
        "id": log.id,
        "kind": log.kind,
        "title": log.title,
        "club_id": log.club_id,
        "make_item_id": log.make_item_id,
        "done_on": log.done_on.isoformat(),
        "minutes": log.minutes,
        "note": log.note,
        "child_id": log.child_id,
        "child": child.username if child else "",
        # Children can only remove what they added themselves.
        "can_remove": viewer is None or viewer.role == "parent" or log.created_by == viewer.id,
    }


@router.get("/")
def list_logs(
    child_id: Optional[int] = Query(None),
    kind: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    family = _family_id(current_user)
    kids = _family_children(db, family)
    q = db.query(ActivityLog).filter(ActivityLog.parent_id == family)
    if current_user.role == "child":
        q = q.filter(ActivityLog.child_id == current_user.id)
    elif child_id:
        q = q.filter(ActivityLog.child_id == child_id)
    if kind:
        q = q.filter(ActivityLog.kind == kind)
    if start_date:
        q = q.filter(ActivityLog.done_on >= start_date)
    if end_date:
        q = q.filter(ActivityLog.done_on <= end_date)
    rows = q.order_by(ActivityLog.done_on.desc(), ActivityLog.id.desc()).limit(500).all()
    return [_log_out(r, kids, current_user) for r in rows]


@router.post("/")
def add_log(body: LogIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    kids = _family_children(db, family)
    if current_user.role == "child":
        children = [current_user.id]
    else:
        children = _clean_child_ids(db, family, body.child_ids)
        if not children:
            raise HTTPException(status_code=400, detail="Pick who did it")

    title = _clip(body.title, 200)
    club_id = None
    if body.kind == "club" and body.club_id:
        club = _get_club(db, family, body.club_id)
        club_id, title = club.id, club.name
        minutes = body.minutes or club.minutes
    else:
        minutes = body.minutes
    if not title:
        raise HTTPException(status_code=400, detail="Say what they did")

    made = []
    for cid in children:
        # A grown-up and a child both ticking off the same session only records it once.
        existing = (
            db.query(ActivityLog)
            .filter(
                ActivityLog.parent_id == family,
                ActivityLog.child_id == cid,
                ActivityLog.kind == body.kind,
                ActivityLog.done_on == body.done_on,
                ActivityLog.club_id == club_id if club_id else ActivityLog.title == title,
            )
            .first()
        )
        if existing:
            if body.note and not existing.note:
                existing.note = _clip(body.note, 1000)
            made.append(existing)
            continue
        log = ActivityLog(
            parent_id=family,
            child_id=cid,
            kind=body.kind,
            club_id=club_id,
            make_item_id=body.make_item_id,
            title=title,
            done_on=body.done_on,
            minutes=minutes,
            note=_clip(body.note, 1000),
            created_by=current_user.id,
        )
        db.add(log)
        made.append(log)
    db.commit()
    return [_log_out(l, kids) for l in made]


@router.delete("/{log_id}", status_code=204)
def delete_log(log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    log = db.query(ActivityLog).filter(ActivityLog.id == log_id, ActivityLog.parent_id == family).first()
    if not log:
        raise HTTPException(status_code=404, detail="Not found")
    if current_user.role == "child" and log.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Ask a grown-up to remove this")
    db.delete(log)
    db.commit()


# ---------- reports ----------

def active_summary(db: Session, parent_id: int, child_ids: list[int], start: Optional[date], end: Optional[date]) -> dict:
    """P.E., Outdoors and clubs for the reports: the diary plus P.E./Outdoors lessons done from the planner."""
    from routers.council_report import _completed_lessons  # imported here to avoid a circular import

    kids = _family_children(db, parent_id)
    child_ids = [c for c in child_ids if c in kids]
    q = db.query(ActivityLog).filter(ActivityLog.parent_id == parent_id, ActivityLog.child_id.in_(child_ids))
    if start:
        q = q.filter(ActivityLog.done_on >= start)
    if end:
        q = q.filter(ActivityLog.done_on <= end)
    entries = [
        {"date": l.done_on, "kind": l.kind, "title": l.title, "child": kids[l.child_id].username,
         "minutes": l.minutes, "note": l.note, "club_id": l.club_id, "from": "diary"}
        for l in q.all()
    ]

    lo, hi = start or date(2000, 1, 1), end or date(2100, 1, 1)
    for cid in child_ids:
        for lesson in _completed_lessons(db, kids[cid], parent_id, lo, hi):
            kind = PLANNER_SUBJECTS.get((lesson["subject"] or "").strip().lower())
            if kind:
                entries.append({"date": lesson["date"], "kind": kind, "title": lesson["title"], "child": kids[cid].username,
                                "minutes": None, "note": lesson["note"], "club_id": None, "from": "planner"})

    # The same activity ticked off in the diary and in the planner on one day only counts once.
    seen, unique = set(), []
    for e in sorted(entries, key=lambda e: (e["date"], e["from"] != "diary")):
        key = (e["date"], e["kind"], e["title"].strip().lower(), e["child"])
        if key not in seen:
            seen.add(key)
            unique.append(e)
    entries = unique

    def group(kind: str) -> list[dict]:
        found: dict[str, dict] = {}
        for e in entries:
            if e["kind"] != kind:
                continue
            g = found.setdefault(e["title"].lower(), {"title": e["title"], "times": 0, "minutes": 0, "last": e["date"]})
            g["times"] += 1
            g["minutes"] += e["minutes"] or 0
            g["last"] = max(g["last"], e["date"])
        return [dict(g, last=g["last"].isoformat()) for g in sorted(found.values(), key=lambda g: (-g["times"], g["title"]))]

    clubs = []
    for club in db.query(Club).filter(Club.parent_id == parent_id).order_by(Club.name).all():
        goers = [i for i in _ids(club.child_ids) if i in child_ids]
        mine = [e for e in entries if e["club_id"] == club.id]
        if not goers and not mine:
            continue
        if not mine and not club.is_active:
            continue
        clubs.append({
            "name": club.name,
            "activity": club.activity,
            "emoji": club.emoji,
            "schedule": club.schedule,
            "place": club.place,
            "is_active": bool(club.is_active),
            "children": [kids[i].username for i in goers],
            "sessions": len(mine),
            "minutes": sum(e["minutes"] or 0 for e in mine),
            "notes": club.notes,
        })

    return {
        "totals": {
            "sessions": len(entries),
            "days": len({e["date"] for e in entries}),
            "minutes": sum(e["minutes"] or 0 for e in entries),
            "pe": sum(1 for e in entries if e["kind"] == "pe"),
            "outdoor": sum(1 for e in entries if e["kind"] == "outdoor"),
            "club": sum(1 for e in entries if e["kind"] == "club"),
        },
        "clubs": clubs,
        "pe": group("pe"),
        "outdoor": group("outdoor"),
        "log": [
            {"date": e["date"].isoformat(), "kind": e["kind"], "kind_label": KIND_LABEL[e["kind"]], "title": e["title"],
             "child": e["child"], "minutes": e["minutes"], "note": e["note"]}
            for e in sorted(entries, key=lambda e: e["date"], reverse=True)
        ],
    }


@router.get("/summary")
def summary(
    child_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    family = _family_id(current_user)
    if current_user.role == "child":
        ids = [current_user.id]
    elif child_id:
        ids = [child_id]
    else:
        ids = list(_family_children(db, family))
    return active_summary(db, family, ids, start_date, end_date)
