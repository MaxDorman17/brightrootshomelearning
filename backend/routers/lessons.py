from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Lesson, User
from schemas import LessonCreate, LessonUpdate, LessonOut
from auth import require_parent, get_current_user

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


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
    if existing:
        if lesson_in.lesson_url is not None:
            existing.lesson_url = lesson_in.lesson_url
        if lesson_in.description is not None:
            existing.description = lesson_in.description
        db.commit()
        db.refresh(existing)
        return existing

    lesson = Lesson(
        title=lesson_in.title,
        subject=lesson_in.subject,
        description=lesson_in.description,
        lesson_url=lesson_in.lesson_url,
        created_by=current_user.id,
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
    return db.query(Lesson).filter(Lesson.created_by == current_user.id).all() \
        if current_user.role == "parent" \
        else db.query(Lesson).all()


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

    for field, value in lesson_in.model_dump(exclude_unset=True).items():
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
    db.delete(lesson)
    db.commit()
