"""Exam planner: GCSEs, IGCSEs and other exams a teenager sits, usually as a private candidate.

Home-educated teenagers book their own exams at a centre, so families need to keep track of entry
deadlines, dates, papers and results themselves. A revision plan can be dropped straight into the planner.
"""
import json
from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user, require_parent
from database import get_db
from models import ExamEntry, Lesson, PlannerEntry, User
from routers.moments import _family_children, _family_id

router = APIRouter(prefix="/api/exams", tags=["exams"])

QUALIFICATIONS = ["GCSE", "IGCSE", "A level", "AS level", "National 4", "National 5", "Higher", "Advanced Higher", "Functional Skills", "Other"]
STATUSES = ["planning", "entered", "sat", "result"]
MAX_REVISION_SESSIONS = 80


def _clip(value: Optional[str], limit: int) -> Optional[str]:
    value = " ".join((value or "").split())
    return value[:limit] or None


class ExamIn(BaseModel):
    child_id: int
    subject: str
    qualification: str = "GCSE"
    board: Optional[str] = None
    paper: Optional[str] = None
    exam_date: Optional[date] = None
    exam_time: Optional[str] = None
    centre: Optional[str] = None
    entry_deadline: Optional[date] = None
    fee: Optional[str] = None
    status: str = "planning"
    result: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("subject")
    @classmethod
    def subject_required(cls, value: str) -> str:
        value = " ".join(value.split())
        if not value:
            raise ValueError("Say which subject")
        return value[:100]

    @field_validator("qualification")
    @classmethod
    def known_qualification(cls, value: str) -> str:
        if value not in QUALIFICATIONS:
            raise ValueError("Unknown qualification")
        return value

    @field_validator("status")
    @classmethod
    def known_status(cls, value: str) -> str:
        if value not in STATUSES:
            raise ValueError("Unknown status")
        return value


class RevisionIn(BaseModel):
    weekdays: list[int]  # 0 = Monday ... 6 = Sunday
    minutes: int = 45
    start_date: Optional[date] = None

    @field_validator("weekdays")
    @classmethod
    def valid_days(cls, value: list[int]) -> list[int]:
        days = sorted({d for d in value if 0 <= d <= 6})
        if not days:
            raise ValueError("Pick at least one day")
        return days

    @field_validator("minutes")
    @classmethod
    def sensible_minutes(cls, value: int) -> int:
        if value < 10 or value > 240:
            raise ValueError("Revision sessions should be 10 to 240 minutes")
        return value


def _exam_out(exam: ExamEntry, kids: dict[int, User]) -> dict:
    child = kids.get(exam.child_id)
    days_to_go = (exam.exam_date - date.today()).days if exam.exam_date else None
    return {
        "id": exam.id,
        "child_id": exam.child_id,
        "child": child.username if child else "",
        "subject": exam.subject,
        "qualification": exam.qualification,
        "board": exam.board,
        "paper": exam.paper,
        "exam_date": exam.exam_date.isoformat() if exam.exam_date else None,
        "exam_time": exam.exam_time,
        "centre": exam.centre,
        "entry_deadline": exam.entry_deadline.isoformat() if exam.entry_deadline else None,
        "fee": exam.fee,
        "status": exam.status,
        "result": exam.result,
        "notes": exam.notes,
        "days_to_go": days_to_go,
    }


def _apply(exam: ExamEntry, body: ExamIn) -> None:
    exam.child_id = body.child_id
    exam.subject = body.subject
    exam.qualification = body.qualification
    exam.board = _clip(body.board, 50)
    exam.paper = _clip(body.paper, 100)
    exam.exam_date = body.exam_date
    exam.exam_time = _clip(body.exam_time, 20)
    exam.centre = _clip(body.centre, 150)
    exam.entry_deadline = body.entry_deadline
    exam.fee = _clip(body.fee, 30)
    exam.status = body.status
    exam.result = _clip(body.result, 30)
    exam.notes = (body.notes or "").strip()[:2000] or None


def _own_child(db: Session, family: int, child_id: int) -> None:
    if child_id not in _family_children(db, family):
        raise HTTPException(status_code=400, detail="Pick one of your children")


def _get_exam(db: Session, family: int, exam_id: int) -> ExamEntry:
    exam = db.query(ExamEntry).filter(ExamEntry.id == exam_id, ExamEntry.parent_id == family).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam


def _sort_key(exam: ExamEntry):
    # Upcoming exams first by date, then ones with no date yet, then the rest.
    return (exam.exam_date is None, exam.exam_date or date.max, exam.subject.lower())


@router.get("/")
def list_exams(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    kids = _family_children(db, family)
    q = db.query(ExamEntry).filter(ExamEntry.parent_id == family)
    if current_user.role == "child":
        q = q.filter(ExamEntry.child_id == current_user.id)
    return [_exam_out(e, kids) for e in sorted(q.all(), key=_sort_key)]


@router.post("/", status_code=201)
def add_exam(body: ExamIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    _own_child(db, current_user.id, body.child_id)
    exam = ExamEntry(parent_id=current_user.id)
    _apply(exam, body)
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return _exam_out(exam, _family_children(db, current_user.id))


@router.put("/{exam_id}")
def update_exam(exam_id: int, body: ExamIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    exam = _get_exam(db, current_user.id, exam_id)
    _own_child(db, current_user.id, body.child_id)
    _apply(exam, body)
    db.commit()
    return _exam_out(exam, _family_children(db, current_user.id))


@router.delete("/{exam_id}", status_code=204)
def delete_exam(exam_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    exam = _get_exam(db, current_user.id, exam_id)
    db.delete(exam)
    db.commit()


@router.post("/{exam_id}/revision", status_code=201)
def plan_revision(exam_id: int, body: RevisionIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Put revision sessions for this exam into the planner, on the chosen days, up to the day before the exam."""
    exam = _get_exam(db, current_user.id, exam_id)
    if not exam.exam_date:
        raise HTTPException(status_code=400, detail="Add the exam date first")
    start = max(body.start_date or date.today(), date.today())
    end = exam.exam_date - timedelta(days=1)
    days = []
    day = start
    while day <= end and len(days) < MAX_REVISION_SESSIONS:
        if day.weekday() in body.weekdays:
            days.append(day)
        day += timedelta(days=1)
    if not days:
        raise HTTPException(status_code=400, detail="There are no days left before the exam on the days you picked")
    title = f"Revise {exam.subject}" + (f": {exam.paper}" if exam.paper else "")
    lesson = Lesson(
        title=title[:255],
        subject=exam.subject[:100],
        description=f"Revision for {exam.qualification} {exam.subject}" + (f" ({exam.board})" if exam.board else "") + f", sat on {exam.exam_date.strftime('%d %B %Y')}.",
        steps=json.dumps([
            "Pick one topic to focus on and write it at the top of the page.",
            "Spend 10 minutes reading notes or watching a short video on it.",
            "Answer some exam-style questions without looking at the answers.",
            "Mark them, and write down anything you got wrong to come back to.",
            "Finish by writing three things you now know about the topic.",
        ]),
        duration_minutes=body.minutes,
        created_by=current_user.id,
    )
    db.add(lesson)
    db.flush()
    for day in days:
        db.add(PlannerEntry(lesson_id=lesson.id, assigned_to=exam.child_id, scheduled_date=day))
    db.commit()
    return {"sessions": len(days), "first": days[0].isoformat(), "last": days[-1].isoformat()}


def exams_for_child(db: Session, parent_id: int, child_id: int, start: date, end: date) -> list[dict]:
    """Exams sat (or with results) in a period, plus any still coming up. Used by the council report."""
    kids = _family_children(db, parent_id)
    rows = db.query(ExamEntry).filter(ExamEntry.parent_id == parent_id, ExamEntry.child_id == child_id).all()
    out = []
    for e in sorted(rows, key=_sort_key):
        in_period = e.exam_date is not None and start <= e.exam_date <= end
        upcoming = e.exam_date is None or e.exam_date > end
        if in_period or upcoming:
            out.append(_exam_out(e, kids))
    return out
