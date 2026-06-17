import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import TimetableConfig, User
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
    row = db.query(TimetableConfig).filter(TimetableConfig.parent_id == parent_id).first()
    if not row:
        return TimetableConfigOut(config=DEFAULT_TIMETABLE, updated_at=None)
    return TimetableConfigOut(config=json.loads(row.config), updated_at=row.updated_at)


@router.get("/", response_model=TimetableConfigOut)
def get_timetable(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "child":
        parent_id = current_user.parent_id
        if not parent_id:
            return TimetableConfigOut(config=DEFAULT_TIMETABLE, updated_at=None)
        return _get_config(db, parent_id)
    return _get_config(db, current_user.id)


@router.put("/", response_model=TimetableConfigOut)
def save_timetable(
    body: TimetableConfigSave,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    row = db.query(TimetableConfig).filter(TimetableConfig.parent_id == current_user.id).first()
    if row:
        row.config = json.dumps(body.config)
    else:
        row = TimetableConfig(parent_id=current_user.id, config=json.dumps(body.config))
        db.add(row)
    db.commit()
    db.refresh(row)
    return TimetableConfigOut(config=json.loads(row.config), updated_at=row.updated_at)
