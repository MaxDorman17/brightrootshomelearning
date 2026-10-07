"""Bright Roots' own worksheets and comic quizzes: saving a half-done sheet, and keeping each child's best score.

The sheets themselves live in the frontend (src/lib/worksheets.ts and src/lib/comics.ts) and are marked
there, the same way the learning games are. Each child has one row per sheet, so doing a sheet again
can raise their best score but never counts twice for stars.
"""
import json
import re
from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator, model_validator
from sqlalchemy.orm import Session

from auth import get_current_user, require_child, require_parent
from database import get_db
from models import Lesson, PlannerCompletion, PlannerEntry, User, WorksheetScore
from routers.moments import _clean_child_ids
from routers.planner import teaching_days
from routers.test_results import _resolve_child

router = APIRouter(prefix="/api/worksheets", tags=["worksheets"])

KINDS = {"worksheet", "comic"}
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
MAX_QUESTIONS = 50
MAX_ANSWERS_CHARS = 20_000
MAX_PLANNED_AT_ONCE = 10


class SheetIn(BaseModel):
    kind: str
    slug: str
    title: str
    subject: str

    @field_validator("kind")
    @classmethod
    def valid_kind(cls, value: str) -> str:
        if value not in KINDS:
            raise ValueError("Unknown kind")
        return value

    @field_validator("slug")
    @classmethod
    def valid_slug(cls, value: str) -> str:
        if len(value) > 80 or not SLUG_RE.match(value):
            raise ValueError("Unknown sheet")
        return value

    @field_validator("title", "subject")
    @classmethod
    def not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Required")
        return value[:100]


class ProgressIn(SheetIn):
    answers: dict

    @field_validator("answers")
    @classmethod
    def not_huge(cls, value: dict) -> dict:
        if len(json.dumps(value)) > MAX_ANSWERS_CHARS:
            raise ValueError("Too many answers")
        return value


class FinishIn(SheetIn):
    score: int
    total: int

    @model_validator(mode="after")
    def sensible_score(self):
        if not 1 <= self.total <= MAX_QUESTIONS or not 0 <= self.score <= self.total:
            raise ValueError("Score out of range")
        return self


class PlanSheet(SheetIn):
    intro: str = ""


class PlanIn(BaseModel):
    """One sheet, or a topic set in teaching order. A set goes on the days the subject is on the timetable, skipping days off."""
    sheets: list[PlanSheet]
    scheduled_date: date
    child_ids: list[int] = []

    @field_validator("sheets")
    @classmethod
    def some_sheets(cls, value: list) -> list:
        if not 1 <= len(value) <= MAX_PLANNED_AT_ONCE or any(s.kind != "worksheet" for s in value):
            raise ValueError("Choose between 1 and 10 worksheets")
        return value


def _sheet_link(slug: str) -> str:
    return f"/worksheets/{slug}"


def _tick_off_in_planner(db: Session, child: User, slug: str) -> bool:
    """If a grown-up planned this sheet for the child, mark the earliest one still to do as done."""
    waiting = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(
            Lesson.created_by == child.parent_id,
            Lesson.lesson_url == _sheet_link(slug),
            (PlannerEntry.assigned_to == child.id) | PlannerEntry.assigned_to.is_(None),
        )
        .order_by(PlannerEntry.scheduled_date, PlannerEntry.id)
        .all()
    )
    now = datetime.utcnow()
    for entry in waiting:
        if entry.assigned_to == child.id:
            if entry.is_complete:
                continue
            entry.is_complete, entry.completed_at = True, now
            return True
        # Planned for all the children: each one has their own tick.
        mine = db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id == entry.id, PlannerCompletion.user_id == child.id
        ).first()
        if mine:
            continue
        db.add(PlannerCompletion(entry_id=entry.id, user_id=child.id))
        entry.is_complete, entry.completed_at = True, entry.completed_at or now
        return True
    return False


def _out(row: WorksheetScore, with_answers: bool = False) -> dict:
    out = {
        "kind": row.kind,
        "slug": row.slug,
        "title": row.title,
        "subject": row.subject,
        "score": row.score,
        "total": row.total,
        "tries": row.tries or 0,
        "in_progress": bool(row.answers),
        "finished_at": row.finished_at.isoformat() if row.finished_at else None,
    }
    if with_answers:
        out["answers"] = json.loads(row.answers) if row.answers else None
    return out


def _row(db: Session, child: User, kind: str, slug: str) -> Optional[WorksheetScore]:
    return (
        db.query(WorksheetScore)
        .filter(WorksheetScore.child_id == child.id, WorksheetScore.kind == kind, WorksheetScore.slug == slug)
        .first()
    )


def _row_for(db: Session, child: User, body: SheetIn) -> WorksheetScore:
    if not child.parent_id:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    row = _row(db, child, body.kind, body.slug)
    if row is None:
        row = WorksheetScore(child_id=child.id, parent_id=child.parent_id, kind=body.kind, slug=body.slug, tries=0)
        db.add(row)
    row.title, row.subject = body.title, body.subject
    return row


def finished_sheets(db: Session, child: User, parent_id: int) -> list[WorksheetScore]:
    """Every worksheet and comic quiz this child has finished, newest first."""
    return (
        db.query(WorksheetScore)
        .filter(
            WorksheetScore.child_id == child.id,
            WorksheetScore.parent_id == parent_id,
            WorksheetScore.finished_at.is_not(None),
        )
        .order_by(WorksheetScore.finished_at.desc(), WorksheetScore.id.desc())
        .all()
    )


@router.get("/mine")
def my_sheets(db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    """Where this child has got to on every sheet they have opened."""
    rows = db.query(WorksheetScore).filter(WorksheetScore.child_id == current_user.id).all()
    return [_out(r) for r in rows]


@router.get("/mine/{kind}/{slug}")
def my_sheet(kind: str, slug: str, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    """One sheet, with any half-done answers. Empty if the child hasn't opened it yet."""
    row = _row(db, current_user, kind, slug)
    return _out(row, with_answers=True) if row else None


@router.put("/progress")
def save_progress(body: ProgressIn, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    row = _row_for(db, current_user, body)
    row.answers = json.dumps(body.answers) if body.answers else None
    db.commit()
    return _out(row)


@router.post("/finish")
def finish_sheet(body: FinishIn, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    """Record a finished go. Only a better score than before replaces the best one."""
    row = _row_for(db, current_user, body)
    first_time = row.finished_at is None
    better = first_time or body.score * (row.total or 1) > (row.score or 0) * body.total
    if better:
        row.score, row.total = body.score, body.total
        row.finished_at = datetime.utcnow()
    row.tries = (row.tries or 0) + 1
    row.answers = None
    ticked_off = body.kind == "worksheet" and _tick_off_in_planner(db, current_user, body.slug)
    db.commit()
    return {**_out(row), "first_time": first_time, "new_best": better and not first_time, "ticked_off": ticked_off}


@router.post("/plan", status_code=201)
def plan_sheets(body: PlanIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Put worksheets in the planner, so they turn up in the child's Today list like any other lesson."""
    children = _clean_child_ids(db, current_user.id, body.child_ids)
    subject = body.sheets[0].subject
    days_for = {
        child_id: teaching_days(db, current_user, body.scheduled_date, len(body.sheets), subject=subject, child_id=child_id)
        for child_id in children or [None]
    }
    for n, sheet in enumerate(body.sheets):
        lesson = Lesson(
            title=sheet.title,
            subject=sheet.subject,
            description=sheet.intro.strip()[:500] or None,
            lesson_url=_sheet_link(sheet.slug),
            scheme="Bright Roots",
            duration_minutes=15,
            created_by=current_user.id,
        )
        db.add(lesson)
        db.flush()
        for child_id, days in days_for.items():
            db.add(PlannerEntry(lesson_id=lesson.id, assigned_to=child_id, scheduled_date=days[n]))
    db.commit()
    every = [day for days in days_for.values() for day in days]
    return {"planned": len(body.sheets), "first_day": min(every), "last_day": max(every)}


@router.get("/summary")
def sheets_summary(
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Finished sheets for one child. Parents pass child_id; children get their own."""
    child, parent_id = _resolve_child(db, current_user, child_id)
    return [_out(r) for r in finished_sheets(db, child, parent_id)]
