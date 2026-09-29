"""What the parent's notification bell shows: today's finished lessons, reading and spelling tests."""
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from auth import require_parent
from database import get_db
from models import (
    Lesson,
    PlannerCompletion,
    PlannerEntry,
    ReadingChapterProgress,
    ReadingLog,
    SpellingResult,
    User,
    WorkFeedback,
    WorkReview,
)

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

UK = ZoneInfo("Europe/London")


def _today_utc_bounds() -> tuple[date, datetime, datetime]:
    """Today in the UK, and its start and end as naive UTC times (how the database stores them)."""
    today = datetime.now(UK).date()
    start = datetime.combine(today, datetime.min.time(), tzinfo=UK).astimezone(timezone.utc).replace(tzinfo=None)
    return today, start, start + timedelta(days=1)


def _naive(value):
    return value.replace(tzinfo=None) if value is not None and value.tzinfo else value


@router.get("/today")
def today_notifications(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    today, start, end = _today_utc_bounds()
    children = db.query(User).filter(User.parent_id == current_user.id, User.role == "child").all()
    names = {c.id: c.username for c in children}
    child_ids = list(names)
    items = []

    # Lessons planned for today that a child has finished. Work that's been handed in but not looked at
    # yet says so, and goes to the review page.
    reviewed = {
        r.entry_id for r in db.query(WorkReview).filter(WorkReview.parent_id == current_user.id).all()
    } | {f.entry_id for f in db.query(WorkFeedback.entry_id).join(PlannerEntry, WorkFeedback.entry_id == PlannerEntry.id).filter(PlannerEntry.scheduled_date == today).all()}
    entries = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .options(joinedload(PlannerEntry.lesson))
        .filter(PlannerEntry.scheduled_date == today, Lesson.created_by == current_user.id)
        .all()
    )
    shared_done = {}
    shared_ids = [e.id for e in entries if e.assigned_to is None]
    if shared_ids and child_ids:
        for comp in db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id.in_(shared_ids), PlannerCompletion.user_id.in_(child_ids)
        ):
            shared_done.setdefault(comp.entry_id, []).append(comp)

    def lesson_item(entry: PlannerEntry, child_id: int, work_url, when):
        needs_review = bool(work_url) and entry.id not in reviewed
        return {
            "key": f"lesson-{entry.id}-{child_id}",
            "kind": "review" if needs_review else "lesson",
            "child": names.get(child_id),
            "title": entry.lesson.title,
            "detail": f"{entry.lesson.subject} · {'work to look at' if needs_review else 'finished'}",
            "link": f"/parent/progress?filter=submitted&entry={entry.id}" if needs_review else "/parent",
            "when": _naive(when).isoformat() if when else None,
        }

    for e in entries:
        if e.assigned_to in names and e.is_complete:
            items.append(lesson_item(e, e.assigned_to, e.completed_work_url, e.completed_at))
        for comp in shared_done.get(e.id, []):
            items.append(lesson_item(e, comp.user_id, comp.completed_work_url, comp.completed_at))

    # Reading: chapters ticked off today (added up per book), and books finished today.
    if child_ids:
        books = {
            b.id: b
            for b in db.query(ReadingLog).filter(ReadingLog.added_by == current_user.id).all()
        }
        progress: dict = {}
        latest: dict = {}
        for p in db.query(ReadingChapterProgress).filter(
            ReadingChapterProgress.book_id.in_(list(books) or [0]),
            ReadingChapterProgress.created_at >= start,
            ReadingChapterProgress.created_at < end,
        ):
            key = (p.book_id, p.child_id or books[p.book_id].child_id)
            progress[key] = progress.get(key, 0) + p.delta
            latest[key] = max(latest.get(key) or p.created_at, p.created_at)
        finished_today = {b.id for b in books.values() if b.status == "completed" and b.finish_date == today}
        for (book_id, child_id), chapters in progress.items():
            if chapters <= 0 or book_id in finished_today:
                continue
            items.append({
                "key": f"reading-{book_id}-{child_id}-{chapters}",
                "kind": "reading",
                "child": names.get(child_id),
                "title": books[book_id].title,
                "detail": f"Read {chapters} chapter{'' if chapters == 1 else 's'}",
                "link": "/reading-log",
                "when": _naive(latest[(book_id, child_id)]).isoformat(),
            })
        for book_id in finished_today:
            b = books[book_id]
            items.append({
                "key": f"book-{book_id}",
                "kind": "reading",
                "child": names.get(b.child_id),
                "title": b.title,
                "detail": "Finished the book!",
                "link": "/reading-log",
                "when": None,
            })

        # Spelling tests taken today (not practice rounds).
        for t in db.query(SpellingResult).filter(
            SpellingResult.parent_id == current_user.id,
            SpellingResult.child_id.in_(child_ids),
            SpellingResult.is_practice_round.is_not(True),
            SpellingResult.taken_at >= start,
            SpellingResult.taken_at < end,
        ):
            items.append({
                "key": f"spelling-{t.id}",
                "kind": "spelling",
                "child": names.get(t.child_id),
                "title": f"Spelling test: {t.score}/{t.total}",
                "detail": "Spellings",
                "link": "/spellings",
                "when": _naive(t.taken_at).isoformat() if t.taken_at else None,
            })

    items.sort(key=lambda i: i["when"] or "", reverse=True)
    return {"date": today.isoformat(), "items": items}
