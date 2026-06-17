from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import CodingProgress, User
from schemas import CodingProgressOut
from auth import get_current_user

router = APIRouter(prefix="/api/coding-progress", tags=["coding-progress"])


@router.get("/", response_model=List[str])
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.query(CodingProgress).all()
    return [r.lesson_id for r in rows]


@router.post("/{lesson_id}", response_model=CodingProgressOut)
def mark_complete(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(CodingProgress).filter(CodingProgress.lesson_id == lesson_id).first()
    if existing:
        return existing
    row = CodingProgress(lesson_id=lesson_id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{lesson_id}", status_code=204)
def mark_incomplete(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    row = db.query(CodingProgress).filter(CodingProgress.lesson_id == lesson_id).first()
    if row:
        db.delete(row)
        db.commit()
