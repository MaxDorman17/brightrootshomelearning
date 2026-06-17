from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import WorkFeedback, User
from schemas import FeedbackCreate, FeedbackOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.get("/", response_model=List[FeedbackOut])
def list_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(WorkFeedback).order_by(WorkFeedback.created_at.desc()).all()


@router.get("/unread-count")
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = db.query(WorkFeedback).filter(WorkFeedback.read_at == None).count()  # noqa: E711
    return {"count": count}


@router.post("/", response_model=FeedbackOut)
def create_feedback(
    body: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
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
    fb = db.query(WorkFeedback).filter(WorkFeedback.id == feedback_id).first()
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
    fb = db.query(WorkFeedback).filter(WorkFeedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.delete(fb)
    db.commit()
