import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Lesson, PlannerEntry, TestResult, User
from schemas import LessonCreate, LessonUpdate, LessonOut
from auth import require_parent, get_current_user

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

MAX_STEPS = 30


def _storable(values: dict) -> dict:
    """Tidy the richer lesson fields and turn lists into JSON for storage."""
    out = dict(values)
    if "steps" in out and out["steps"] is not None:
        steps = [s.strip()[:500] for s in out["steps"] if s and s.strip()][:MAX_STEPS]
        out["steps"] = json.dumps(steps) if steps else None
    if "resource_ids" in out and out["resource_ids"] is not None:
        ids = list(dict.fromkeys(int(i) for i in out["resource_ids"]))[:30]
        out["resource_ids"] = json.dumps(ids) if ids else None
    if "duration_minutes" in out and out["duration_minutes"] is not None:
        out["duration_minutes"] = max(1, min(600, int(out["duration_minutes"])))
    if "scheme" in out and out["scheme"] is not None:
        out["scheme"] = out["scheme"].strip()[:100] or None
    if "objectives" in out and out["objectives"] is not None:
        out["objectives"] = out["objectives"].strip() or None
    return out


@router.post("/", response_model=LessonOut, status_code=201)
def create_lesson(
    lesson_in: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    # Reuse existing lesson if same title+subject to avoid week-on-week duplicates
    existing = db.query(Lesson).filter(
        Lesson.title == lesson_in.title,
        Lesson.subject == lesson_in.subject,
        Lesson.created_by == current_user.id,
    ).first()
    extra = _storable(lesson_in.model_dump(include={"scheme", "objectives", "steps", "duration_minutes", "resource_ids"}, exclude_none=True))
    if existing:
        if lesson_in.lesson_url is not None:
            existing.lesson_url = lesson_in.lesson_url
        if lesson_in.description is not None:
            existing.description = lesson_in.description
        for field, value in extra.items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    lesson = Lesson(
        title=lesson_in.title,
        subject=lesson_in.subject,
        description=lesson_in.description,
        lesson_url=lesson_in.lesson_url,
        created_by=current_user.id,
        **extra,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.get("/", response_model=List[LessonOut])
def list_lessons(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "parent":
        return db.query(Lesson).filter(Lesson.created_by == current_user.id).all()

    if current_user.role == "child" and current_user.parent_id:
        return db.query(Lesson).filter(Lesson.created_by == current_user.parent_id).all()

    return []


@router.put("/{lesson_id}", response_model=LessonOut)
def update_lesson(
    lesson_id: int,
    lesson_in: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.created_by == current_user.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    for field, value in _storable(lesson_in.model_dump(exclude_unset=True)).items():
        setattr(lesson, field, value)

    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/{lesson_id}", status_code=204)
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.created_by == current_user.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    # Scores given to this lesson stay in Results, no longer tied to a planner slot.
    entry_ids = [row.id for row in db.query(PlannerEntry.id).filter(PlannerEntry.lesson_id == lesson.id).all()]
    if entry_ids:
        db.query(TestResult).filter(TestResult.entry_id.in_(entry_ids)).update({TestResult.entry_id: None}, synchronize_session=False)
    db.delete(lesson)
    db.commit()
