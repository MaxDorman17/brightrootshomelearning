from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from auth import require_parent
from database import get_db
from models import (
    JournalEntry,
    Lesson,
    PlannerCompletion,
    PlannerEntry,
    ReadingLog,
    SpellingResult,
    TestResult,
    User,
)
from routers.activities import active_summary
from routers.oak import OAK_SHARE_RE
from routers.moments import moments_for_child
from routers.study import study_minutes
from routers.test_results import _oak_results_for_child, _own_child

router = APIRouter(prefix="/api/council-report", tags=["council-report"])

MAX_APPROACH_LENGTH = 5000
EXAMPLES_PER_SUBJECT = 6
MAX_WORK_SAMPLES = 20


class ApproachRequest(BaseModel):
    approach: str


def _completed_lessons(db: Session, child: User, parent_id: int, start: date, end: date) -> list:
    """Every lesson this child completed that was scheduled within the period."""
    rows = []

    direct = (
        db.query(PlannerEntry, Lesson)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(
            Lesson.created_by == parent_id,
            PlannerEntry.assigned_to == child.id,
            PlannerEntry.is_complete.is_(True),
            PlannerEntry.scheduled_date >= start,
            PlannerEntry.scheduled_date <= end,
        )
        .all()
    )
    for entry, lesson in direct:
        rows.append({
            "date": entry.scheduled_date,
            "subject": lesson.subject,
            "title": lesson.title,
            "is_extra": bool(entry.is_extra),
            "work_url": entry.completed_work_url,
            "note": entry.completed_note,
        })

    shared = (
        db.query(PlannerEntry, Lesson, PlannerCompletion)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .join(PlannerCompletion, PlannerCompletion.entry_id == PlannerEntry.id)
        .filter(
            Lesson.created_by == parent_id,
            PlannerEntry.assigned_to.is_(None),
            PlannerCompletion.user_id == child.id,
            PlannerEntry.scheduled_date >= start,
            PlannerEntry.scheduled_date <= end,
        )
        .all()
    )
    for entry, lesson, completion in shared:
        rows.append({
            "date": entry.scheduled_date,
            "subject": lesson.subject,
            "title": lesson.title,
            "is_extra": bool(entry.is_extra),
            "work_url": completion.completed_work_url,
            "note": completion.completed_note,
        })

    rows.sort(key=lambda r: r["date"])
    return rows


@router.get("/")
def council_report(
    child_id: int = Query(...),
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    if end_date < start_date:
        raise HTTPException(status_code=400, detail="The end date is before the start date")
    child = _own_child(db, current_user, child_id)
    parent_id = current_user.id

    lessons = _completed_lessons(db, child, parent_id, start_date, end_date)
    planned = [l for l in lessons if not l["is_extra"]]
    extra = [l for l in lessons if l["is_extra"]]

    subjects: dict = {}
    for lesson in planned:
        s = subjects.setdefault(lesson["subject"], {"subject": lesson["subject"], "lessons": 0, "examples": []})
        s["lessons"] += 1
    # Most recent distinct lesson titles make the best examples.
    for lesson in reversed(planned):
        s = subjects[lesson["subject"]]
        if lesson["title"] not in s["examples"] and len(s["examples"]) < EXAMPLES_PER_SUBJECT:
            s["examples"].append(lesson["title"])

    work_samples = []
    for lesson in reversed(lessons):
        url = lesson["work_url"]
        note = (lesson["note"] or "").strip()
        if not url and not note:
            continue
        work_samples.append({
            "date": lesson["date"].isoformat(),
            "subject": lesson["subject"],
            "title": lesson["title"],
            "url": url,
            "is_oak_result": bool(url and OAK_SHARE_RE.search(url)),
            "note": note or None,
        })
        if len(work_samples) >= MAX_WORK_SAMPLES:
            break

    books = (
        db.query(ReadingLog)
        .filter(
            ReadingLog.added_by == parent_id,
            or_(ReadingLog.child_id == child.id, ReadingLog.child_id.is_(None)),
        )
        .all()
    )
    books_finished = [
        {"title": b.title, "author": b.author, "finish_date": b.finish_date.isoformat() if b.finish_date else None, "rating": b.rating}
        for b in books
        if b.status == "completed" and (b.finish_date is None or start_date <= b.finish_date <= end_date)
    ]
    books_reading = [{"title": b.title, "author": b.author} for b in books if b.status == "reading"]

    spelling = (
        db.query(SpellingResult)
        .filter(
            SpellingResult.child_id == child.id,
            SpellingResult.parent_id == parent_id,
            SpellingResult.is_practice_round.is_not(True),
            SpellingResult.week_start >= start_date,
            SpellingResult.week_start <= end_date,
        )
        .all()
    )
    oak = [q for q in _oak_results_for_child(db, child, parent_id) if start_date.isoformat() <= q["scheduled_date"] <= end_date.isoformat()]
    tests = (
        db.query(TestResult)
        .filter(
            TestResult.child_id == child.id,
            TestResult.parent_id == parent_id,
            TestResult.taken_on >= start_date,
            TestResult.taken_on <= end_date,
        )
        .order_by(TestResult.taken_on)
        .all()
    )

    def pct(score, total):
        return round(score / total * 100) if total else None

    spell_score = sum(r.score for r in spelling)
    spell_total = sum(r.total for r in spelling)
    oak_valid = [q for q in oak if q["exit_total"]]
    oak_score = sum(q["exit_score"] or 0 for q in oak_valid)
    oak_total = sum(q["exit_total"] for q in oak_valid)

    journal = (
        db.query(JournalEntry)
        .filter(
            JournalEntry.created_by == parent_id,
            JournalEntry.entry_date >= start_date,
            JournalEntry.entry_date <= end_date,
        )
        .order_by(JournalEntry.entry_date)
        .all()
    )

    minutes_studied, study_sessions = study_minutes(db, child.id, parent_id, start_date, end_date)

    return {
        "child": {"id": child.id, "username": child.username},
        "parent": {"username": current_user.username, "email": current_user.email},
        "period": {"start": start_date.isoformat(), "end": end_date.isoformat()},
        "approach": current_user.ehe_approach or "",
        "summary": {
            "learning_days": len({l["date"] for l in lessons}),
            "lessons_completed": len(planned),
            "extra_activities": len(extra),
            "subjects_covered": len(subjects),
            "minutes_studied": minutes_studied,
            "study_sessions": study_sessions,
        },
        "subjects": sorted(subjects.values(), key=lambda s: -s["lessons"]),
        "results": {
            "spelling_tests": len(spelling),
            "spelling_average": pct(spell_score, spell_total),
            "oak_quizzes": len(oak_valid),
            "oak_exit_average": pct(oak_score, oak_total),
            "tests": [
                {
                    "subject": t.subject,
                    "title": t.title,
                    "taken_on": t.taken_on.isoformat(),
                    "score": t.score,
                    "total": t.total,
                    "percent": pct(t.score, t.total),
                    "notes": t.notes,
                }
                for t in tests
            ],
        },
        "reading": {"finished": books_finished, "reading_now": books_reading},
        "work_samples": work_samples,
        "extra": [
            {"date": l["date"].isoformat(), "subject": l["subject"], "title": l["title"]}
            for l in extra
        ],
        "journal": [{"date": j.entry_date.isoformat(), "content": j.content} for j in journal],
        "moments": moments_for_child(db, parent_id, child.id, start_date, end_date),
        "active": active_summary(db, parent_id, [child.id], start_date, end_date),
    }


@router.put("/approach")
def save_approach(
    body: ApproachRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    text = body.approach.strip()
    if len(text) > MAX_APPROACH_LENGTH:
        raise HTTPException(status_code=400, detail=f"Please keep this under {MAX_APPROACH_LENGTH} characters")
    current_user.ehe_approach = text or None
    db.commit()
    return {"approach": text}
