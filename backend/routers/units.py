from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from database import get_db
from models import Unit, UnitQueue, User
from schemas import UnitCreate, UnitOut, UnitQueueCreate, UnitQueueUpdate, UnitQueueOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/units", tags=["units"])


def _family_parent_id(current_user: User) -> Optional[int]:
    if current_user.role == "parent":
        return current_user.id
    if current_user.role == "child":
        return current_user.parent_id
    return None


@router.get("/", response_model=List[UnitOut])
def list_units(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    parent_id = _family_parent_id(current_user)
    if not parent_id:
        return []
    return (
        db.query(Unit)
        .filter(Unit.parent_id == parent_id)
        .order_by(Unit.subject)
        .all()
    )


@router.post("/", response_model=UnitOut)
def upsert_unit(
    unit_in: UnitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    existing = db.query(Unit).filter(
        Unit.parent_id == current_user.id,
        Unit.subject == unit_in.subject,
    ).first()

    if existing:
        existing.title = unit_in.title
        existing.unit_url = unit_in.unit_url
        existing.notes = unit_in.notes
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing

    unit = Unit(
        parent_id=current_user.id,
        subject=unit_in.subject,
        title=unit_in.title,
        unit_url=unit_in.unit_url,
        notes=unit_in.notes,
    )
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit


@router.get("/queue", response_model=List[UnitQueueOut])
def list_unit_queue(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    parent_id = _family_parent_id(current_user)
    if not parent_id:
        return []
    return (
        db.query(UnitQueue)
        .filter(UnitQueue.parent_id == parent_id)
        .order_by(UnitQueue.subject, UnitQueue.position, UnitQueue.id)
        .all()
    )


@router.post("/queue", response_model=UnitQueueOut)
def add_queued_unit(
    unit_in: UnitQueueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    max_position = (
        db.query(func.max(UnitQueue.position))
        .filter(
            UnitQueue.parent_id == current_user.id,
            UnitQueue.subject == unit_in.subject,
        )
        .scalar()
        or 0
    )

    queued = UnitQueue(
        parent_id=current_user.id,
        subject=unit_in.subject,
        title=unit_in.title,
        unit_url=unit_in.unit_url,
        notes=unit_in.notes,
        position=max_position + 1,
    )
    db.add(queued)
    db.commit()
    db.refresh(queued)
    return queued


@router.put("/queue/{queue_id}", response_model=UnitQueueOut)
def update_queued_unit(
    queue_id: int,
    unit_in: UnitQueueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    queued = db.query(UnitQueue).filter(
        UnitQueue.id == queue_id,
        UnitQueue.parent_id == current_user.id,
    ).first()
    if not queued:
        raise HTTPException(status_code=404, detail="Queued unit not found")

    if unit_in.title is not None:
        queued.title = unit_in.title
    if unit_in.unit_url is not None:
        queued.unit_url = unit_in.unit_url
    if unit_in.notes is not None:
        queued.notes = unit_in.notes
    queued.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(queued)
    return queued


@router.delete("/queue/{queue_id}", status_code=204)
def delete_queued_unit(
    queue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    queued = db.query(UnitQueue).filter(
        UnitQueue.id == queue_id,
        UnitQueue.parent_id == current_user.id,
    ).first()
    if not queued:
        raise HTTPException(status_code=404, detail="Queued unit not found")

    subject = queued.subject
    removed_position = queued.position
    db.delete(queued)
    db.flush()

    (
        db.query(UnitQueue)
        .filter(
            UnitQueue.parent_id == current_user.id,
            UnitQueue.subject == subject,
            UnitQueue.position > removed_position,
        )
        .update(
            {UnitQueue.position: UnitQueue.position - 1},
            synchronize_session=False,
        )
    )
    db.commit()


@router.post("/queue/{queue_id}/promote", response_model=UnitOut)
def promote_queued_unit(
    queue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    queued = db.query(UnitQueue).filter(
        UnitQueue.id == queue_id,
        UnitQueue.parent_id == current_user.id,
    ).first()
    if not queued:
        raise HTTPException(status_code=404, detail="Queued unit not found")

    first = (
        db.query(UnitQueue)
        .filter(
            UnitQueue.parent_id == current_user.id,
            UnitQueue.subject == queued.subject,
        )
        .order_by(UnitQueue.position, UnitQueue.id)
        .first()
    )
    if not first or first.id != queued.id:
        raise HTTPException(status_code=400, detail="Only the next queued unit can be made current")

    current = db.query(Unit).filter(
        Unit.parent_id == current_user.id,
        Unit.subject == queued.subject,
    ).first()

    if current:
        current.title = queued.title
        current.unit_url = queued.unit_url
        current.notes = queued.notes
        current.updated_at = datetime.utcnow()
    else:
        current = Unit(
            parent_id=current_user.id,
            subject=queued.subject,
            title=queued.title,
            unit_url=queued.unit_url,
            notes=queued.notes,
        )
        db.add(current)

    subject = queued.subject
    removed_position = queued.position
    db.delete(queued)
    db.flush()

    (
        db.query(UnitQueue)
        .filter(
            UnitQueue.parent_id == current_user.id,
            UnitQueue.subject == subject,
            UnitQueue.position > removed_position,
        )
        .update(
            {UnitQueue.position: UnitQueue.position - 1},
            synchronize_session=False,
        )
    )

    db.commit()
    db.refresh(current)
    return current


@router.delete("/{subject}", status_code=204)
def delete_unit(
    subject: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    unit = db.query(Unit).filter(
        Unit.parent_id == current_user.id,
        Unit.subject == subject,
    ).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    db.delete(unit)
    db.commit()
