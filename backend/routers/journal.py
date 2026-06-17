from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from database import get_db
from models import JournalEntry, User
from schemas import JournalEntryOut, JournalEntryUpdate
from auth import require_parent

router = APIRouter(prefix="/api/journal", tags=["journal"])


@router.get("/", response_model=List[JournalEntryOut])
def list_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    return (
        db.query(JournalEntry)
        .filter(JournalEntry.created_by == current_user.id)
        .order_by(JournalEntry.entry_date.desc())
        .limit(60)
        .all()
    )


@router.get("/{entry_date}", response_model=Optional[JournalEntryOut])
def get_entry(
    entry_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    return db.query(JournalEntry).filter(
        JournalEntry.created_by == current_user.id,
        JournalEntry.entry_date == entry_date,
    ).first()


@router.put("/{entry_date}", response_model=JournalEntryOut)
def upsert_entry(
    entry_date: date,
    body: JournalEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.created_by == current_user.id,
        JournalEntry.entry_date == entry_date,
    ).first()
    if entry:
        entry.content = body.content
    else:
        entry = JournalEntry(
            entry_date=entry_date,
            content=body.content,
            created_by=current_user.id,
        )
        db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_date}", status_code=204)
def delete_entry(
    entry_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.created_by == current_user.id,
        JournalEntry.entry_date == entry_date,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
