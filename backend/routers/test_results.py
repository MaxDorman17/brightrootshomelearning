import json
from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user, require_parent
from database import get_db
from models import Lesson, OakQuizResult, PlannerCompletion, PlannerEntry, SpellingResult, TestResult, User
from routers.oak import OAK_SHARE_RE

router = APIRouter(prefix="/api/test-results", tags=["test-results"])


class TestResultIn(BaseModel):
    child_id: int
    subject: str
    title: str
    taken_on: date
    score: float
    total: float
    notes: Optional[str] = None

    @field_validator("subject", "title")
    @classmethod
    def not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Required")
        return value[:255]

    @field_validator("total")
    @classmethod
    def total_positive(cls, value: float) -> float:
        if value <= 0:
            raise ValueError("Total must be more than 0")
        return value

    @field_validator("score")
    @classmethod
    def score_not_negative(cls, value: float) -> float:
        if value < 0:
            raise ValueError("Score can't be negative")
        return value


def _test_out(r: TestResult) -> dict:
    return {
        "id": r.id,
        "child_id": r.child_id,
        "subject": r.subject,
        "title": r.title,
        "taken_on": r.taken_on.isoformat(),
        "score": r.score,
        "total": r.total,
        "notes": r.notes,
        "created_at": r.created_at.isoformat() if r.created_at else None,
    }


def _own_child(db: Session, parent: User, child_id: int) -> User:
    child = db.query(User).filter(
        User.id == child_id, User.parent_id == parent.id, User.role == "child"
    ).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    return child


def _resolve_child(db: Session, current_user: User, child_id: Optional[int]) -> tuple[User, int]:
    """Returns (child, parent_id). Children can only ever see their own results."""
    if current_user.role == "parent":
        if child_id is None:
            raise HTTPException(status_code=400, detail="child_id is required")
        return _own_child(db, current_user, child_id), current_user.id
    if not current_user.parent_id:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    return current_user, current_user.parent_id


def _oak_results_for_child(db: Session, child: User, parent_id: int) -> list:
    """Every completed lesson for this child whose work link is an Oak results share link."""
    rows = []

    direct = (
        db.query(PlannerEntry, Lesson)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(PlannerEntry.assigned_to == child.id, PlannerEntry.completed_work_url.is_not(None))
        .all()
    )
    for entry, lesson in direct:
        rows.append((entry, lesson, entry.completed_work_url, entry.completed_at))

    shared = (
        db.query(PlannerEntry, Lesson, PlannerCompletion)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .join(PlannerCompletion, PlannerCompletion.entry_id == PlannerEntry.id)
        .filter(
            PlannerEntry.assigned_to.is_(None),
            Lesson.created_by == parent_id,
            PlannerCompletion.user_id == child.id,
            PlannerCompletion.completed_work_url.is_not(None),
        )
        .all()
    )
    for entry, lesson, completion in shared:
        rows.append((entry, lesson, completion.completed_work_url, completion.completed_at))

    urls = {}
    for entry, lesson, raw_url, completed_at in rows:
        match = OAK_SHARE_RE.search(raw_url or "")
        if match:
            urls[(entry.id, match.group(0))] = (entry, lesson, completed_at)
    if not urls:
        return []

    cached = {
        r.url: r
        for r in db.query(OakQuizResult).filter(OakQuizResult.url.in_({u for _, u in urls})).all()
    }

    out = []
    for (entry_id, url), (entry, lesson, completed_at) in urls.items():
        result = cached.get(url)
        if not result:
            continue
        out.append({
            "entry_id": entry_id,
            "subject": lesson.subject,
            "lesson_title": lesson.title,
            "scheduled_date": entry.scheduled_date.isoformat(),
            "completed_at": completed_at.isoformat() if completed_at else None,
            "starter_score": result.starter_score,
            "starter_total": result.starter_total,
            "exit_score": result.exit_score,
            "exit_total": result.exit_total,
        })
    out.sort(key=lambda r: r["scheduled_date"], reverse=True)
    return out


@router.get("/overview")
def results_overview(
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """All of one child's results in one place: spelling tests, Oak quizzes and the family's own tests."""
    child, parent_id = _resolve_child(db, current_user, child_id)

    spellings = (
        db.query(SpellingResult)
        .filter(SpellingResult.child_id == child.id, SpellingResult.parent_id == parent_id)
        .order_by(SpellingResult.week_start.desc(), SpellingResult.taken_at.desc())
        .all()
    )
    own_tests = (
        db.query(TestResult)
        .filter(TestResult.child_id == child.id, TestResult.parent_id == parent_id)
        .order_by(TestResult.taken_on.desc(), TestResult.id.desc())
        .all()
    )

    return {
        "child": {"id": child.id, "username": child.username},
        "spelling": [
            {
                "id": r.id,
                "week_start": r.week_start.isoformat(),
                "score": r.score,
                "total": r.total,
                "wrong_words": json.loads(r.wrong_words or "[]"),
                "is_practice_round": bool(r.is_practice_round),
                "taken_at": r.taken_at.isoformat() if r.taken_at else None,
            }
            for r in spellings
        ],
        "oak": _oak_results_for_child(db, child, parent_id),
        "tests": [_test_out(r) for r in own_tests],
    }


@router.post("/", status_code=201)
def add_test_result(
    body: TestResultIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    _own_child(db, current_user, body.child_id)
    result = TestResult(
        child_id=body.child_id,
        parent_id=current_user.id,
        subject=body.subject,
        title=body.title,
        taken_on=body.taken_on,
        score=body.score,
        total=body.total,
        notes=(body.notes or "").strip() or None,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return _test_out(result)


@router.put("/{result_id}")
def update_test_result(
    result_id: int,
    body: TestResultIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    result = db.query(TestResult).filter(
        TestResult.id == result_id, TestResult.parent_id == current_user.id
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    _own_child(db, current_user, body.child_id)
    result.child_id = body.child_id
    result.subject = body.subject
    result.title = body.title
    result.taken_on = body.taken_on
    result.score = body.score
    result.total = body.total
    result.notes = (body.notes or "").strip() or None
    result.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(result)
    return _test_out(result)


@router.delete("/{result_id}", status_code=204)
def delete_test_result(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    result = db.query(TestResult).filter(
        TestResult.id == result_id, TestResult.parent_id == current_user.id
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    db.delete(result)
    db.commit()
