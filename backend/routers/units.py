from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from models import Unit, User
from schemas import UnitCreate, UnitOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/units", tags=["units"])


@router.get("/", response_model=List[UnitOut])
def list_units(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Unit).order_by(Unit.subject).all()


@router.post("/", response_model=UnitOut)
def upsert_unit(
    unit_in: UnitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    existing = db.query(Unit).filter(Unit.subject == unit_in.subject).first()
    if existing:
        existing.title = unit_in.title
        existing.unit_url = unit_in.unit_url
        existing.notes = unit_in.notes
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    unit = Unit(
        subject=unit_in.subject,
        title=unit_in.title,
        unit_url=unit_in.unit_url,
        notes=unit_in.notes,
    )
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit


@router.delete("/{subject}", status_code=204)
def delete_unit(
    subject: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    unit = db.query(Unit).filter(Unit.subject == subject).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(unit)
    db.commit()
