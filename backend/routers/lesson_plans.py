import json
from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import require_parent
from database import get_db
from models import DayOff, Lesson, LessonPlan, LessonPlanItem, PlannerEntry, TimetableConfig, User
from routers.timetable import timetable_for
from schemas import LessonOut

router = APIRouter(prefix="/api/lesson-plans", tags=["lesson-plans"])

WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
MAX_SEARCH_DAYS = 400


class PlanIn(BaseModel):
    title: str
    subject: Optional[str] = None
    description: Optional[str] = None
    lesson_ids: list[int] = []

    @field_validator("title")
    @classmethod
    def valid_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Give the plan a name")
        return value[:255]


class ScheduleIn(BaseModel):
    start_date: date
    assigned_to: Optional[int] = None  # None means all children
    mode: str = "timetable"  # timetable: the subject's timetable days; days: the weekdays listed
    days: list[str] = []

    @field_validator("mode")
    @classmethod
    def valid_mode(cls, value: str) -> str:
        if value not in {"timetable", "days"}:
            raise ValueError("Choose timetable days or specific days")
        return value

    @field_validator("days")
    @classmethod
    def valid_days(cls, value: list[str]) -> list[str]:
        if any(d not in WEEKDAYS for d in value):
            raise ValueError("Unknown day")
        return value


def _own_plan(db: Session, parent: User, plan_id: int) -> LessonPlan:
    plan = db.query(LessonPlan).filter(LessonPlan.id == plan_id, LessonPlan.parent_id == parent.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


def _plan_lessons(db: Session, plan: LessonPlan) -> list[Lesson]:
    rows = (
        db.query(Lesson)
        .join(LessonPlanItem, LessonPlanItem.lesson_id == Lesson.id)
        .filter(LessonPlanItem.plan_id == plan.id)
        .order_by(LessonPlanItem.position, LessonPlanItem.id)
        .all()
    )
    return rows


def _plan_out(db: Session, plan: LessonPlan) -> dict:
    lessons = _plan_lessons(db, plan)
    return {
        "id": plan.id,
        "title": plan.title,
        "subject": plan.subject,
        "description": plan.description,
        "lessons": [LessonOut.model_validate(l).model_dump(mode="json") for l in lessons],
        "total_minutes": sum(l.duration_minutes or 0 for l in lessons),
    }


def _set_items(db: Session, parent: User, plan: LessonPlan, lesson_ids: list[int]) -> None:
    ids = list(dict.fromkeys(lesson_ids))[:100]
    if ids:
        owned = {
            l.id for l in db.query(Lesson).filter(Lesson.id.in_(ids), Lesson.created_by == parent.id).all()
        }
        if len(owned) != len(ids):
            raise HTTPException(status_code=400, detail="One of those lessons isn't yours")
    db.query(LessonPlanItem).filter(LessonPlanItem.plan_id == plan.id).delete()
    for position, lesson_id in enumerate(ids):
        db.add(LessonPlanItem(plan_id=plan.id, lesson_id=lesson_id, position=position))


@router.get("/")
def list_plans(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    plans = db.query(LessonPlan).filter(LessonPlan.parent_id == current_user.id).order_by(LessonPlan.title).all()
    return [_plan_out(db, p) for p in plans]


@router.post("/", status_code=201)
def create_plan(body: PlanIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    plan = LessonPlan(
        parent_id=current_user.id,
        title=body.title,
        subject=(body.subject or "").strip() or None,
        description=(body.description or "").strip() or None,
    )
    db.add(plan)
    db.flush()
    _set_items(db, current_user, plan, body.lesson_ids)
    db.commit()
    return _plan_out(db, plan)


@router.put("/{plan_id}")
def update_plan(plan_id: int, body: PlanIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    plan = _own_plan(db, current_user, plan_id)
    plan.title = body.title
    plan.subject = (body.subject or "").strip() or None
    plan.description = (body.description or "").strip() or None
    _set_items(db, current_user, plan, body.lesson_ids)
    db.commit()
    return _plan_out(db, plan)


@router.delete("/{plan_id}", status_code=204)
def delete_plan(plan_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    plan = _own_plan(db, current_user, plan_id)
    db.query(LessonPlanItem).filter(LessonPlanItem.plan_id == plan.id).delete()
    db.delete(plan)
    db.commit()


@router.post("/{plan_id}/schedule")
def schedule_plan(plan_id: int, body: ScheduleIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Place the plan's lessons in order onto upcoming days, skipping days off."""
    plan = _own_plan(db, current_user, plan_id)
    lessons = _plan_lessons(db, plan)
    if not lessons:
        raise HTTPException(status_code=400, detail="Add some lessons to this plan first")
    if body.assigned_to is not None:
        child = db.query(User).filter(
            User.id == body.assigned_to, User.parent_id == current_user.id, User.role == "child"
        ).first()
        if not child:
            raise HTTPException(status_code=404, detail="Child not found")

    # The child's own timetable if they have one, otherwise the family's.
    timetable = timetable_for(db, current_user.id, body.assigned_to)
    days_off = {
        d.date for d in db.query(DayOff).filter(DayOff.parent_id == current_user.id, DayOff.date >= body.start_date).all()
    }

    if body.mode == "days":
        if not body.days:
            raise HTTPException(status_code=400, detail="Pick at least one day")
        allowed_days = set(body.days)
    else:
        subject = plan.subject or lessons[0].subject
        allowed_days = {day for day, subjects in timetable.items() if subject in (subjects or [])}
        if not allowed_days:
            raise HTTPException(
                status_code=400,
                detail=f"{subject} isn't on your timetable. Pick specific days instead.",
            )

    dates = []
    day = body.start_date
    for _ in range(MAX_SEARCH_DAYS):
        if len(dates) == len(lessons):
            break
        if WEEKDAYS[day.weekday()] in allowed_days and day not in days_off:
            dates.append(day)
        day += timedelta(days=1)
    if len(dates) < len(lessons):
        raise HTTPException(status_code=400, detail="Couldn't find enough days for this plan")

    for lesson, when in zip(lessons, dates):
        db.add(PlannerEntry(lesson_id=lesson.id, assigned_to=body.assigned_to, scheduled_date=when, is_extra=False))
    db.commit()
    return {
        "scheduled": len(dates),
        "first_date": dates[0].isoformat(),
        "last_date": dates[-1].isoformat(),
        "dates": [{"lesson": l.title, "date": d.isoformat()} for l, d in zip(lessons, dates)],
    }


@router.get("/library")
def lesson_library(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """All the parent's lessons with how often and when they were last planned."""
    usage = {
        lesson_id: (count, last)
        for lesson_id, count, last in db.query(
            PlannerEntry.lesson_id, func.count(PlannerEntry.id), func.max(PlannerEntry.scheduled_date)
        )
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(Lesson.created_by == current_user.id)
        .group_by(PlannerEntry.lesson_id)
        .all()
    }
    lessons = db.query(Lesson).filter(Lesson.created_by == current_user.id).order_by(Lesson.subject, Lesson.title).all()
    out = []
    for lesson in lessons:
        count, last = usage.get(lesson.id, (0, None))
        data = LessonOut.model_validate(lesson).model_dump(mode="json")
        data["times_planned"] = count
        data["last_planned"] = (last.isoformat() if hasattr(last, "isoformat") else str(last)) if last else None
        out.append(data)
    return out
