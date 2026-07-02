from fastapi import APIRouter, Depends, HTTPException
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


def _resolve_target_user(current_user: User, child_id: Optional[int], db: Session) -> int:
    """Parents may act on behalf of one of their children via child_id."""
    if current_user.role == "parent" and child_id:
        child = db.query(User).filter(User.id == child_id, User.parent_id == current_user.id).first()
        if not child:
            raise HTTPException(status_code=403, detail="Not your child")
        return child.id
    return current_user.id


@router.post("/{lesson_id}", response_model=CodingProgressOut)
def mark_complete(
    lesson_id: str,
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = _resolve_target_user(current_user, child_id, db)
    existing = db.query(UserCodingProgress).filter(
        UserCodingProgress.user_id == user_id,
        UserCodingProgress.lesson_id == lesson_id,
    ).first()
    if existing:
        return existing
    row = UserCodingProgress(user_id=user_id, lesson_id=lesson_id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{lesson_id}", status_code=204)
def mark_incomplete(
    lesson_id: str,
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = _resolve_target_user(current_user, child_id, db)
    row = db.query(UserCodingProgress).filter(
        UserCodingProgress.user_id == user_id,
        UserCodingProgress.lesson_id == lesson_id,
    ).first()
    if row:
        db.delete(row)
        db.commit()
