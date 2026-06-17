from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List
from datetime import date, timedelta, datetime
from database import get_db
from models import PlannerEntry, Lesson, User
from schemas import PlannerEntryCreate, PlannerEntryUpdate, PlannerEntryOut
from auth import get_current_user, require_parent
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/planner", tags=["planner"])


class SubmitWorkUrl(BaseModel):
    completed_work_url: str


class SubmitNote(BaseModel):
    completed_note: str


def load_entry(db: Session, entry_id: int) -> PlannerEntry:
    return db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).filter(
        PlannerEntry.id == entry_id
    ).first()


@router.post("/", response_model=PlannerEntryOut, status_code=201)
def create_entry(
    entry_in: PlannerEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    lesson = db.query(Lesson).filter(Lesson.id == entry_in.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    entry = PlannerEntry(
        lesson_id=entry_in.lesson_id,
        assigned_to=entry_in.assigned_to,
        scheduled_date=entry_in.scheduled_date,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return load_entry(db, entry.id)


@router.get("/week", response_model=List[PlannerEntryOut])
def get_week(
    start_date: date = None,
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if start_date is None:
        today = date.today()
        start_date = today - timedelta(days=today.weekday())
    end_date = start_date + timedelta(days=6)

    query = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).filter(
        PlannerEntry.scheduled_date >= start_date,
        PlannerEntry.scheduled_date <= end_date,
    )
    if current_user.role == "child":
        query = query.filter(
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None))
        )
    elif child_id:
        query = query.filter(
            or_(PlannerEntry.assigned_to == child_id, PlannerEntry.assigned_to.is_(None))
        )
    return query.order_by(PlannerEntry.scheduled_date).all()


@router.get("/mine", response_model=List[PlannerEntryOut])
def get_mine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """All entries for the current user — child gets their own, parent gets all."""
    query = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson))
    if current_user.role == "child":
        query = query.filter(
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None))
        )
    return query.order_by(PlannerEntry.scheduled_date.desc()).all()


@router.get("/today", response_model=List[PlannerEntryOut])
def get_today(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    query = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).filter(
        PlannerEntry.scheduled_date == today,
    )
    if current_user.role == "child":
        query = query.filter(
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None))
        )
    return query.order_by(PlannerEntry.id).all()


@router.get("/all", response_model=List[PlannerEntryOut])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    return db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).order_by(
        PlannerEntry.scheduled_date.desc()
    ).all()


@router.patch("/{entry_id}/complete", response_model=PlannerEntryOut)
def mark_complete(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = db.query(PlannerEntry).filter(PlannerEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    if current_user.role == "child" and entry.assigned_to is not None and entry.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not your lesson")

    entry.is_complete = not entry.is_complete
    entry.completed_at = datetime.utcnow() if entry.is_complete else None
    db.commit()
    return load_entry(db, entry_id)


@router.patch("/{entry_id}/submit-work", response_model=PlannerEntryOut)
def submit_work(
    entry_id: int,
    body: SubmitWorkUrl,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = db.query(PlannerEntry).filter(PlannerEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    if current_user.role == "child" and entry.assigned_to is not None and entry.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not your lesson")

    entry.completed_work_url = body.completed_work_url
    db.commit()
    return load_entry(db, entry_id)


@router.patch("/{entry_id}/note", response_model=PlannerEntryOut)
def submit_note(
    entry_id: int,
    body: SubmitNote,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = db.query(PlannerEntry).filter(PlannerEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    entry.completed_note = body.completed_note
    db.commit()
    return load_entry(db, entry_id)


@router.put("/{entry_id}", response_model=PlannerEntryOut)
def update_entry(
    entry_id: int,
    entry_in: PlannerEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entry = db.query(PlannerEntry).filter(PlannerEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for field, value in entry_in.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    return load_entry(db, entry_id)


@router.delete("/{entry_id}", status_code=204)
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entry = db.query(PlannerEntry).filter(PlannerEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
