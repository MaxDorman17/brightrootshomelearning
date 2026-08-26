from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import WorkFeedback, User, PlannerEntry, Lesson
from schemas import FeedbackCreate, FeedbackOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


def _child_ids(db: Session, parent: User) -> list:
    return [c.id for c in db.query(User).filter(User.parent_id == parent.id).all()]


def _family_entry_filter(current_user: User, child_ids: list):
    """SQLAlchemy filter: true for PlannerEntry rows relevant to this user's
    family — direct entries assigned to one of the parent's own children (or,
    for a child, assigned directly to them), or shared (assigned_to IS NULL)
    entries whose Lesson was created by the owning parent. Mirrors the
    scoping already used in planner.py's get_all/submission-count/pending-feedback."""
    if current_user.role == "child":
        return or_(
            PlannerEntry.assigned_to == current_user.id,
            and_(PlannerEntry.assigned_to.is_(None), Lesson.created_by == current_user.parent_id),
        )
    return or_(
        PlannerEntry.assigned_to.in_(child_ids),
        and_(PlannerEntry.assigned_to.is_(None), Lesson.created_by == current_user.id),
    )


@router.get("/", response_model=List[FeedbackOut])
def list_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    child_ids = _child_ids(db, current_user) if current_user.role == "parent" else []
    return (
        db.query(WorkFeedback)
        .join(PlannerEntry, WorkFeedback.entry_id == PlannerEntry.id)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(_family_entry_filter(current_user, child_ids))
        .order_by(WorkFeedback.created_at.desc())
        .all()
    )


@router.get("/unread-count")
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    child_ids = _child_ids(db, current_user) if current_user.role == "parent" else []
    count = (
        db.query(WorkFeedback)
        .join(PlannerEntry, WorkFeedback.entry_id == PlannerEntry.id)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(WorkFeedback.read_at.is_(None), _family_entry_filter(current_user, child_ids))
        .count()
    )
    return {"count": count}


@router.post("/", response_model=FeedbackOut)
def create_feedback(
    body: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child_ids = _child_ids(db, current_user)
    entry = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(PlannerEntry.id == body.entry_id, _family_entry_filter(current_user, child_ids))
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Planner entry not found")

    fb = WorkFeedback(
        entry_id=body.entry_id,
        message=body.message,
        emoji=body.emoji,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb


@router.patch("/{feedback_id}/read", response_model=FeedbackOut)
def mark_read(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    child_ids = _child_ids(db, current_user) if current_user.role == "parent" else []
    fb = (
        db.query(WorkFeedback)
        .join(PlannerEntry, WorkFeedback.entry_id == PlannerEntry.id)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(WorkFeedback.id == feedback_id, _family_entry_filter(current_user, child_ids))
        .first()
    )
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    fb.read_at = datetime.utcnow()
    db.commit()
    db.refresh(fb)
    return fb


@router.delete("/{feedback_id}", status_code=204)
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child_ids = _child_ids(db, current_user)
    fb = (
        db.query(WorkFeedback)
        .join(PlannerEntry, WorkFeedback.entry_id == PlannerEntry.id)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(WorkFeedback.id == feedback_id, _family_entry_filter(current_user, child_ids))
        .first()
    )
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.delete(fb)
    db.commit()
