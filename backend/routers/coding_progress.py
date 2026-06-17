from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import UserCodingProgress, User
from schemas import CodingProgressOut
from auth import get_current_user

router = APIRouter(prefix="/api/coding-progress", tags=["coding-progress"])


@router.get("/", response_model=List[str])
def get_progress(
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "parent" and child_id:
        user_id = child_id
    else:
        user_id = current_user.id
    rows = db.query(UserCodingProgress).filter(UserCodingProgress.user_id == user_id).all()
    return [r.lesson_id for r in rows]


@router.post("/{lesson_id}", response_model=CodingProgressOut)
def mark_complete(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(UserCodingProgress).filter(
        UserCodingProgress.user_id == current_user.id,
        UserCodingProgress.lesson_id == lesson_id,
    ).first()
    if existing:
        return existing
    row = UserCodingProgress(user_id=current_user.id, lesson_id=lesson_id)
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
    row = db.query(UserCodingProgress).filter(
        UserCodingProgress.user_id == current_user.id,
        UserCodingProgress.lesson_id == lesson_id,
    ).first()
    if row:
        db.delete(row)
        db.commit()
