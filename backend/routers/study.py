from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator
from sqlalchemy import or_
from sqlalchemy.orm import Session

from auth import get_current_user, require_child
from database import get_db
from models import Lesson, PlannerEntry, StudySession, User
from routers.test_results import _resolve_child

router = APIRouter(prefix="/api/study", tags=["study"])

MAX_MINUTES = 240


class SessionIn(BaseModel):
    planned_minutes: int
    minutes: int
    completed: bool = False
    subject: Optional[str] = None
    label: Optional[str] = None
    entry_id: Optional[int] = None

    @field_validator("planned_minutes", "minutes")
    @classmethod
    def valid_minutes(cls, value: int) -> int:
        if not 1 <= value <= MAX_MINUTES:
            raise ValueError(f"Minutes must be between 1 and {MAX_MINUTES}")
        return value

    @field_validator("subject", "label")
    @classmethod
    def trim(cls, value: Optional[str]) -> Optional[str]:
        value = (value or "").strip()
        return value[:255] or None


def study_minutes(db: Session, child_id: int, parent_id: int, start: date, end: date) -> tuple[int, int]:
    """(total minutes, number of sessions) a child studied between two dates, inclusive."""
    sessions = (
        db.query(StudySession)
        .filter(
            StudySession.child_id == child_id,
            StudySession.parent_id == parent_id,
            StudySession.created_at >= datetime.combine(start, datetime.min.time()),
            StudySession.created_at < datetime.combine(end + timedelta(days=1), datetime.min.time()),
        )
        .all()
    )
    return sum(s.minutes for s in sessions), len(sessions)


@router.post("/sessions", status_code=201)
def save_session(body: SessionIn, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    parent_id = current_user.parent_id
    if not parent_id:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    minutes = min(body.minutes, body.planned_minutes)
    subject, label, entry_id = body.subject, body.label, None

    if body.entry_id is not None:
        entry = (
            db.query(PlannerEntry)
            .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
            .filter(
                PlannerEntry.id == body.entry_id,
                Lesson.created_by == parent_id,
                or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None)),
            )
            .first()
        )
        if entry:
            entry_id = entry.id
            subject = subject or entry.lesson.subject
            label = label or entry.lesson.title

    session = StudySession(
        child_id=current_user.id,
        parent_id=parent_id,
        entry_id=entry_id,
        subject=subject,
        label=label,
        planned_minutes=body.planned_minutes,
        minutes=minutes,
        completed=body.completed,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"id": session.id, "minutes": session.minutes}


@router.get("/summary")
def study_summary(
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Time studied this week, by subject over the last 30 days, and recent sessions."""
    child, parent_id = _resolve_child(db, current_user, child_id)
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    since = today - timedelta(days=29)

    sessions = (
        db.query(StudySession)
        .filter(StudySession.child_id == child.id, StudySession.parent_id == parent_id)
        .order_by(StudySession.created_at.desc())
        .all()
    )

    def day(s: StudySession) -> date:
        return s.created_at.date() if s.created_at else today

    by_subject: dict = {}
    for s in sessions:
        if day(s) >= since:
            key = s.subject or "Other"
            by_subject[key] = by_subject.get(key, 0) + s.minutes

    return {
        "week_minutes": sum(s.minutes for s in sessions if day(s) >= week_start),
        "week_sessions": sum(1 for s in sessions if day(s) >= week_start),
        "last_30_days_minutes": sum(s.minutes for s in sessions if day(s) >= since),
        "by_subject": sorted(
            [{"subject": k, "minutes": v} for k, v in by_subject.items()], key=lambda r: -r["minutes"]
        ),
        "recent": [
            {
                "date": day(s).isoformat(),
                "subject": s.subject,
                "label": s.label,
                "minutes": s.minutes,
                "completed": bool(s.completed),
            }
            for s in sessions[:10]
        ],
    }
