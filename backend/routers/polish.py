from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from database import get_db
from models import PolishSession, User
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/polish", tags=["polish"])


class PolishSessionCreate(BaseModel):
    date: date
    xp: Optional[int] = None
    notes: Optional[str] = None


class PolishSessionOut(BaseModel):
    id: int
    user_id: int
    date: date
    xp: Optional[int]
    notes: Optional[str]

    model_config = {"from_attributes": True}


@router.get("/", response_model=List[PolishSessionOut])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(PolishSession)
        .filter(PolishSession.user_id == current_user.id)
        .order_by(PolishSession.date.desc())
        .all()
    )


@router.post("/", response_model=PolishSessionOut, status_code=201)
def log_session(
    body: PolishSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(PolishSession).filter(
        PolishSession.user_id == current_user.id,
        PolishSession.date == body.date,
    ).first()
    if existing:
        existing.xp = body.xp
        existing.notes = body.notes
        db.commit()
        db.refresh(existing)
        return existing
    session = PolishSession(
        user_id=current_user.id,
        date=body.date,
        xp=body.xp,
        notes=body.notes,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.delete("/{session_id}", status_code=204)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    s = db.query(PolishSession).filter(PolishSession.id == session_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    if s.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not yours")
    db.delete(s)
    db.commit()
