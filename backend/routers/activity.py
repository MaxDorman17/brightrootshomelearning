"""A child's completed learning, as timestamped events. Shared by stars, challenges and the leaderboard."""
from datetime import date, datetime
from typing import Optional

from sqlalchemy.orm import Session

from models import GameScore, Lesson, PlannerCompletion, PlannerEntry, ReadingLog, SpellingResult, User
from routers.test_results import _oak_results_for_child


def naive(value) -> Optional[datetime]:
    """Timestamps are stored as UTC; compare them without timezone info."""
    if value is None:
        return None
    if isinstance(value, str):
        value = datetime.fromisoformat(value)
    return value.replace(tzinfo=None) if value.tzinfo else value


def pct(score, total) -> Optional[float]:
    return (score / total * 100) if score is not None and total else None


def lesson_completions(db: Session, child: User, parent_id: int) -> list[tuple[datetime, str]]:
    """(completed at, lesson title) for every lesson this child has completed."""
    out = []
    for entry, lesson in (
        db.query(PlannerEntry, Lesson)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(
            Lesson.created_by == parent_id,
            PlannerEntry.assigned_to == child.id,
            PlannerEntry.is_complete.is_(True),
            PlannerEntry.completed_at.is_not(None),
        )
        .all()
    ):
        out.append((naive(entry.completed_at), lesson.title))
    for entry, lesson, completion in (
        db.query(PlannerEntry, Lesson, PlannerCompletion)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .join(PlannerCompletion, PlannerCompletion.entry_id == PlannerEntry.id)
        .filter(
            Lesson.created_by == parent_id,
            PlannerEntry.assigned_to.is_(None),
            PlannerCompletion.user_id == child.id,
        )
        .all()
    ):
        if completion.completed_at:
            out.append((naive(completion.completed_at), lesson.title))
    return out


def oak_scores(db: Session, child: User, parent_id: int) -> list[tuple[datetime, float, str]]:
    """(completed at, exit quiz %, lesson title) for every Oak quiz with a cached score."""
    out = []
    for q in _oak_results_for_child(db, child, parent_id):
        score = pct(q["exit_score"], q["exit_total"])
        if q["completed_at"] and score is not None:
            out.append((naive(q["completed_at"]), score, q["lesson_title"]))
    return out


def oak_starter_scores(db: Session, child: User, parent_id: int) -> list[tuple[datetime, float, str]]:
    """(completed at, starter quiz %, lesson title) for every Oak quiz with a cached starter score."""
    out = []
    for q in _oak_results_for_child(db, child, parent_id):
        score = pct(q["starter_score"], q["starter_total"])
        if q["completed_at"] and score is not None:
            out.append((naive(q["completed_at"]), score, q["lesson_title"]))
    return out


def spelling_scores(db: Session, child: User, parent_id: int) -> list[tuple[datetime, float, str]]:
    """(taken at, %, "score/total") for every real (non-practice) spelling test."""
    out = []
    for t in (
        db.query(SpellingResult)
        .filter(
            SpellingResult.child_id == child.id,
            SpellingResult.parent_id == parent_id,
            SpellingResult.is_practice_round.is_not(True),
        )
        .all()
    ):
        score = pct(t.score, t.total)
        if t.taken_at and score is not None:
            out.append((naive(t.taken_at), score, f"{t.score}/{t.total}"))
    return out


def books_finished(db: Session, child: User, parent_id: int) -> list[tuple[date, str]]:
    """(finish date, title) for books this child has finished."""
    return [
        (b.finish_date, b.title)
        for b in db.query(ReadingLog)
        .filter(
            ReadingLog.added_by == parent_id,
            ReadingLog.child_id == child.id,
            ReadingLog.status == "completed",
            ReadingLog.finish_date.is_not(None),
        )
        .all()
    ]


def games_played(db: Session, child: User, parent_id: int) -> list[tuple[datetime, str]]:
    """(finished at, game) for every learning game round this child finished."""
    return [
        (naive(g.created_at), g.game)
        for g in db.query(GameScore).filter(GameScore.child_id == child.id, GameScore.parent_id == parent_id).all()
        if g.created_at
    ]
