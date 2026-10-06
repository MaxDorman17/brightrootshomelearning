"""Languages: a practice diary for any language (French, Polish, BSL...), for badges and the reports.

Parents and children tick off each day's practice. One row is one child, one language, one day,
so logging the same day twice updates it rather than counting twice. The learning report and the
council report read everything through `language_summary`.
"""
from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator
from sqlalchemy import func
from sqlalchemy.orm import Session

from clock import uk_today
from auth import get_current_user
from database import get_db
from models import LanguageLog, User
from routers.moments import _clean_child_ids, _family_children, _family_id

router = APIRouter(prefix="/api/languages", tags=["languages"])


def _clip(value: Optional[str], limit: int) -> Optional[str]:
    value = (value or "").strip()
    return value[:limit] or None


class LanguageLogIn(BaseModel):
    language: str
    done_on: date
    minutes: Optional[int] = None
    xp: Optional[int] = None
    how: Optional[str] = None
    note: Optional[str] = None
    child_ids: list[int] = []

    @field_validator("language")
    @classmethod
    def required(cls, value: str) -> str:
        value = " ".join(value.split())
        if not value:
            raise ValueError("Pick a language")
        # "french" and "French" are the same language
        return value[:60][0].upper() + value[:60][1:]

    @field_validator("minutes")
    @classmethod
    def sensible_minutes(cls, value: Optional[int]) -> Optional[int]:
        if value is None:
            return None
        if value < 1 or value > 600:
            raise ValueError("Minutes should be between 1 and 600")
        return value

    @field_validator("xp")
    @classmethod
    def sensible_xp(cls, value: Optional[int]) -> Optional[int]:
        if value is None:
            return None
        if value < 0 or value > 100000:
            raise ValueError("XP should be between 0 and 100,000")
        return value

    @field_validator("done_on")
    @classmethod
    def not_future(cls, value: date) -> date:
        if value > uk_today() + timedelta(days=1):
            raise ValueError("That date is in the future")
        return value


def _log_out(log: LanguageLog, kids: dict[int, User], viewer: Optional[User] = None) -> dict:
    child = kids.get(log.child_id)
    return {
        "id": log.id,
        "language": log.language,
        "done_on": log.done_on.isoformat(),
        "minutes": log.minutes,
        "xp": log.xp,
        "how": log.how,
        "note": log.note,
        "child_id": log.child_id,
        "child": child.username if child else "",
        # Children can only remove what they added themselves.
        "can_remove": viewer is None or viewer.role == "parent" or log.created_by == viewer.id,
    }


@router.get("/")
def list_logs(
    child_id: Optional[int] = Query(None),
    language: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    family = _family_id(current_user)
    kids = _family_children(db, family)
    q = db.query(LanguageLog).filter(LanguageLog.parent_id == family)
    if current_user.role == "child":
        q = q.filter(LanguageLog.child_id == current_user.id)
    elif child_id:
        q = q.filter(LanguageLog.child_id == child_id)
    if language:
        q = q.filter(LanguageLog.language == language)
    if start_date:
        q = q.filter(LanguageLog.done_on >= start_date)
    if end_date:
        q = q.filter(LanguageLog.done_on <= end_date)
    rows = q.order_by(LanguageLog.done_on.desc(), LanguageLog.id.desc()).limit(500).all()
    return [_log_out(r, kids, current_user) for r in rows]


@router.post("/")
def add_log(body: LanguageLogIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    kids = _family_children(db, family)
    if current_user.role == "child":
        children = [current_user.id]
    else:
        children = _clean_child_ids(db, family, body.child_ids)
        if not children:
            raise HTTPException(status_code=400, detail="Pick who practised")

    made = []
    for cid in children:
        # Logging the same language on the same day again updates that day instead of adding another.
        existing = (
            db.query(LanguageLog)
            .filter(
                LanguageLog.parent_id == family,
                LanguageLog.child_id == cid,
                LanguageLog.done_on == body.done_on,
                func.lower(LanguageLog.language) == body.language.lower(),
            )
            .first()
        )
        log = existing or LanguageLog(parent_id=family, child_id=cid, created_by=current_user.id, done_on=body.done_on)
        log.language = body.language
        if body.minutes is not None or not existing:
            log.minutes = body.minutes
        if body.xp is not None or not existing:
            log.xp = body.xp
        if body.how or not existing:
            log.how = _clip(body.how, 100)
        if body.note or not existing:
            log.note = _clip(body.note, 1000)
        if not existing:
            db.add(log)
        made.append(log)
    db.commit()
    return [_log_out(l, kids) for l in made]


@router.delete("/{log_id}", status_code=204)
def delete_log(log_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    log = db.query(LanguageLog).filter(LanguageLog.id == log_id, LanguageLog.parent_id == family).first()
    if not log:
        raise HTTPException(status_code=404, detail="Not found")
    if current_user.role == "child" and log.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Ask a grown-up to remove this")
    db.delete(log)
    db.commit()


# ---------- streaks, badges and reports ----------

def _streaks(days: set[date]) -> tuple[int, int]:
    """(current, best). The current streak still counts if today hasn't been practised yet."""
    if not days:
        return 0, 0
    best = run = 0
    prev = None
    for d in sorted(days):
        run = run + 1 if prev and d - prev == timedelta(days=1) else 1
        best = max(best, run)
        prev = d
    today = uk_today()
    day = today if today in days else today - timedelta(days=1)
    current = 0
    while day in days:
        current += 1
        day -= timedelta(days=1)
    return current, best


def language_summary(db: Session, parent_id: int, child_ids: list[int], start: Optional[date], end: Optional[date]) -> dict:
    kids = _family_children(db, parent_id)
    child_ids = [c for c in child_ids if c in kids]
    q = db.query(LanguageLog).filter(LanguageLog.parent_id == parent_id, LanguageLog.child_id.in_(child_ids))
    if start:
        q = q.filter(LanguageLog.done_on >= start)
    if end:
        q = q.filter(LanguageLog.done_on <= end)
    rows = q.all()

    by_language: dict[str, list[LanguageLog]] = {}
    for r in rows:
        by_language.setdefault(r.language, []).append(r)

    languages = []
    for name, logs in by_language.items():
        days = {l.done_on for l in logs}
        current, best = _streaks(days)
        languages.append({
            "language": name,
            "sessions": len(logs),
            "days": len(days),
            "minutes": sum(l.minutes or 0 for l in logs),
            "xp": sum(l.xp or 0 for l in logs),
            "current_streak": current,
            "best_streak": best,
            "last": max(days).isoformat(),
            "children": sorted({kids[l.child_id].username for l in logs}),
            "ways": sorted({l.how for l in logs if l.how}),
        })
    languages.sort(key=lambda g: (-g["days"], g["language"]))

    all_days = {r.done_on for r in rows}
    current, best = _streaks(all_days)
    return {
        "totals": {
            "sessions": len(rows),
            "days": len(all_days),
            "minutes": sum(r.minutes or 0 for r in rows),
            "xp": sum(r.xp or 0 for r in rows),
            "languages": len(languages),
            "current_streak": current,
            "best_streak": best,
        },
        "languages": languages,
        "log": [
            {"date": r.done_on.isoformat(), "language": r.language, "child": kids[r.child_id].username,
             "minutes": r.minutes, "xp": r.xp, "how": r.how, "note": r.note}
            for r in sorted(rows, key=lambda r: (r.done_on, r.id), reverse=True)
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
    return language_summary(db, family, ids, start_date, end_date)
