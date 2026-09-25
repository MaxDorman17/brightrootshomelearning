from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import DayOff, User
from schemas import DayOffCreate, DayOffOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/days-off", tags=["days-off"])


@router.get("/", response_model=List[DayOffOut])
def list_days_off(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    parent_id = current_user.parent_id if current_user.role == "child" else current_user.id
    if not parent_id:
        return []
    return db.query(DayOff).filter(
        DayOff.parent_id == parent_id
    ).order_by(DayOff.date.desc()).all()


@router.post("/", response_model=DayOffOut)
def add_day_off(
    body: DayOffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    existing = db.query(DayOff).filter(
        DayOff.parent_id == current_user.id,
        DayOff.date == body.date,
    ).first()
    if existing:
        return existing
    day = DayOff(parent_id=current_user.id, date=body.date, reason=body.reason)
    db.add(day)
    db.commit()
    db.refresh(day)
    return day


@router.delete("/{day_off_id}", status_code=204)
def remove_day_off(
    day_off_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    day = db.query(DayOff).filter(
        DayOff.id == day_off_id,
        DayOff.parent_id == current_user.id,
    ).first()
    if not day:
        raise HTTPException(status_code=404, detail="Day off not found")
    db.delete(day)
    db.commit()
