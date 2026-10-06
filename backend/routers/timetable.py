import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import ChildTimetable, TimetableConfig, User
from schemas import TimetableConfigSave, TimetableConfigOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/timetable", tags=["timetable"])

DEFAULT_TIMETABLE = {
    "Monday":    ["Maths", "English", "Science", "History", "Computing"],
    "Tuesday":   ["Maths", "English", "Science", "Geography", "Cooking"],
    "Wednesday": ["Maths", "English", "Science", "Art & Design", "Design and Technology"],
    "Thursday":  ["Maths", "English", "Science", "History", "Life Skills"],
    "Friday":    ["Maths", "English", "Science", "Languages"],
}


def _get_config(db: Session, parent_id: int) -> TimetableConfigOut:
    """The family timetable."""
    row = db.query(TimetableConfig).filter(TimetableConfig.parent_id == parent_id).first()
    if not row:
        return TimetableConfigOut(config=DEFAULT_TIMETABLE, updated_at=None)
    return TimetableConfigOut(config=json.loads(row.config), updated_at=row.updated_at)


def _child_row(db: Session, parent_id: int, child_id: int) -> Optional[ChildTimetable]:
    return db.query(ChildTimetable).filter(
        ChildTimetable.parent_id == parent_id, ChildTimetable.child_id == child_id
    ).first()


def timetable_for(db: Session, parent_id: int, child_id: Optional[int] = None) -> dict:
    """The week a child follows: their own timetable if they have one, otherwise the family's.
    With no child (a lesson for all children) it is the family's."""
    if child_id is not None:
        row = _child_row(db, parent_id, child_id)
        if row:
            return json.loads(row.config)
    return _get_config(db, parent_id).config


def all_subjects(db: Session, parent_id: int) -> list[str]:
    """Every subject on the family timetable or on any child's own, in the order first met."""
    configs = [_get_config(db, parent_id).config]
    configs += [json.loads(r.config) for r in db.query(ChildTimetable).filter(ChildTimetable.parent_id == parent_id).all()]
    subjects: list[str] = []
    for config in configs:
        for day_subjects in config.values():
            for subject in day_subjects or []:
                if subject not in subjects:
                    subjects.append(subject)
    return subjects


def _own_child(db: Session, parent: User, child_id: int) -> User:
    child = db.query(User).filter(User.id == child_id, User.parent_id == parent.id, User.role == "child").first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    return child


def _child_out(db: Session, parent_id: int, child_id: int) -> TimetableConfigOut:
    row = _child_row(db, parent_id, child_id)
    if row:
        return TimetableConfigOut(config=json.loads(row.config), updated_at=row.updated_at, own=True)
    family = _get_config(db, parent_id)
    return TimetableConfigOut(config=family.config, updated_at=family.updated_at, own=False)


@router.get("/", response_model=TimetableConfigOut)
def get_timetable(
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """The family timetable, or one child's. A child always gets the week they follow."""
    if current_user.role == "child":
        parent_id = current_user.parent_id
        if not parent_id:
            return TimetableConfigOut(config=DEFAULT_TIMETABLE, updated_at=None)
        return _child_out(db, parent_id, current_user.id)
    if child_id is not None:
        _own_child(db, current_user, child_id)
        return _child_out(db, current_user.id, child_id)
    return _get_config(db, current_user.id)


@router.get("/subjects")
def family_subjects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Every subject the family teaches: those on the family timetable and on any child's own."""
    parent_id = current_user.id if current_user.role == "parent" else current_user.parent_id
    if not parent_id:
        return {"subjects": []}
    return {"subjects": all_subjects(db, parent_id)}


@router.get("/children")
def children_timetables(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """The children who have a timetable of their own, by child id. Everyone else follows the family's."""
    rows = db.query(ChildTimetable).filter(ChildTimetable.parent_id == current_user.id).all()
    return {str(r.child_id): json.loads(r.config) for r in rows}


@router.put("/", response_model=TimetableConfigOut)
def save_timetable(
    body: TimetableConfigSave,
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Save the family timetable, or (with child_id) give one child a timetable of their own."""
    if child_id is not None:
        _own_child(db, current_user, child_id)
        row = _child_row(db, current_user.id, child_id)
        if row:
            row.config = json.dumps(body.config)
        else:
            row = ChildTimetable(parent_id=current_user.id, child_id=child_id, config=json.dumps(body.config))
            db.add(row)
        db.commit()
        db.refresh(row)
        return TimetableConfigOut(config=json.loads(row.config), updated_at=row.updated_at, own=True)

    row = db.query(TimetableConfig).filter(TimetableConfig.parent_id == current_user.id).first()
    if row:
        row.config = json.dumps(body.config)
    else:
        row = TimetableConfig(parent_id=current_user.id, config=json.dumps(body.config))
        db.add(row)
    db.commit()
    db.refresh(row)
    return TimetableConfigOut(config=json.loads(row.config), updated_at=row.updated_at)


@router.delete("/", status_code=204)
def use_family_timetable(
    child_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Remove a child's own timetable, so they follow the family one again."""
    _own_child(db, current_user, child_id)
    row = _child_row(db, current_user.id, child_id)
    if row:
        db.delete(row)
        db.commit()
