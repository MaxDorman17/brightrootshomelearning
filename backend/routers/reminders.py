import html
import json
import logging
import re
import threading
import time
from datetime import date, datetime, timedelta
from typing import Optional
from zoneinfo import ZoneInfo

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy import or_, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth import require_child, require_parent
from config import settings
from database import SessionLocal, get_db
from models import (
    Lesson,
    PlannerCompletion,
    PlannerEntry,
    Reminder,
    ReminderEvent,
    SpellingResult,
    StudySession,
    User,
)

router = APIRouter(prefix="/api/reminders", tags=["reminders"])
logger = logging.getLogger(__name__)

UK = ZoneInfo("Europe/London")
WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
KINDS = {"spellings", "extra_work", "custom"}
TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
EXTRA_WORK_LOOKBACK_DAYS = 14
CHECK_EVERY_SECONDS = 60


def uk_now() -> datetime:
    return datetime.now(UK)


def _uk_day_bounds_utc(day: date) -> tuple[datetime, datetime]:
    """The UTC start and end of a UK calendar day (timestamps are stored as naive UTC)."""
    start = datetime.combine(day, datetime.min.time(), tzinfo=UK).astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
    end = datetime.combine(day + timedelta(days=1), datetime.min.time(), tzinfo=UK).astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
    return start, end


# ---------------------------------------------------------------------------
# Request bodies
# ---------------------------------------------------------------------------

class ReminderIn(BaseModel):
    kind: str
    text: Optional[str] = None
    child_id: Optional[int] = None
    time: str
    days: list[str]
    email_child: bool = False
    is_active: bool = True

    @field_validator("kind")
    @classmethod
    def valid_kind(cls, value: str) -> str:
        if value not in KINDS:
            raise ValueError("Unknown reminder type")
        return value

    @field_validator("time")
    @classmethod
    def valid_time(cls, value: str) -> str:
        if not TIME_RE.match(value):
            raise ValueError("Time should look like 09:00")
        return value

    @field_validator("days")
    @classmethod
    def valid_days(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("Pick at least one day")
        if any(d not in WEEKDAYS for d in value):
            raise ValueError("Unknown day")
        return [d for d in WEEKDAYS if d in value]


class SummaryIn(BaseModel):
    time: Optional[str] = None  # None turns the daily summary off

    @field_validator("time")
    @classmethod
    def valid_time(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and not TIME_RE.match(value):
            raise ValueError("Time should look like 17:00")
        return value


# ---------------------------------------------------------------------------
# Status: is a reminder still to do for this child today?
# ---------------------------------------------------------------------------

def _label(reminder: Reminder) -> str:
    if reminder.kind == "spellings":
        return "Practise your spellings"
    if reminder.kind == "extra_work":
        return "Finish your extra work"
    return reminder.text or "Reminder"


def _spellings_done(db: Session, child: User, parent_id: int, day: date) -> bool:
    start, end = _uk_day_bounds_utc(day)
    return (
        db.query(SpellingResult)
        .filter(
            SpellingResult.child_id == child.id,
            SpellingResult.parent_id == parent_id,
            SpellingResult.taken_at >= start,
            SpellingResult.taken_at < end,
        )
        .first()
        is not None
    )


def _pending_extra_work(db: Session, child: User, parent_id: int, day: date) -> list[str]:
    since = day - timedelta(days=EXTRA_WORK_LOOKBACK_DAYS)
    entries = (
        db.query(PlannerEntry, Lesson)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(
            Lesson.created_by == parent_id,
            PlannerEntry.is_extra.is_(True),
            PlannerEntry.scheduled_date >= since,
            PlannerEntry.scheduled_date <= day,
            or_(PlannerEntry.assigned_to == child.id, PlannerEntry.assigned_to.is_(None)),
        )
        .all()
    )
    shared_done = {
        c.entry_id
        for c in db.query(PlannerCompletion).filter(
            PlannerCompletion.user_id == child.id,
            PlannerCompletion.entry_id.in_([e.id for e, _ in entries if e.assigned_to is None] or [0]),
        )
    }
    pending = []
    for entry, lesson in entries:
        done = entry.is_complete if entry.assigned_to is not None else entry.id in shared_done
        if not done:
            pending.append(lesson.title)
    return pending


def _event_exists(db: Session, reminder: Reminder, child: User, day: date, kind: str) -> bool:
    return (
        db.query(ReminderEvent)
        .filter(
            ReminderEvent.reminder_id == reminder.id,
            ReminderEvent.child_id == child.id,
            ReminderEvent.day == day,
            ReminderEvent.kind == kind,
        )
        .first()
        is not None
    )


def _status(db: Session, reminder: Reminder, child: User, day: date) -> dict:
    items: list[str] = []
    if reminder.kind == "spellings":
        done = _spellings_done(db, child, reminder.parent_id, day)
    elif reminder.kind == "extra_work":
        items = _pending_extra_work(db, child, reminder.parent_id, day)
        done = not items
    else:
        done = _event_exists(db, reminder, child, day, "done")
    return {"id": reminder.id, "kind": reminder.kind, "label": _label(reminder), "time": reminder.time, "done": done, "items": items}


def _applies(reminder: Reminder, child: User, now: datetime) -> bool:
    days = json.loads(reminder.days or "[]")
    return (
        reminder.is_active
        and (reminder.child_id is None or reminder.child_id == child.id)
        and WEEKDAYS[now.weekday()] in days
        and now.strftime("%H:%M") >= reminder.time
    )


def _reminder_out(r: Reminder) -> dict:
    return {
        "id": r.id,
        "kind": r.kind,
        "text": r.text,
        "label": _label(r),
        "child_id": r.child_id,
        "time": r.time,
        "days": json.loads(r.days or "[]"),
        "email_child": bool(r.email_child),
        "is_active": bool(r.is_active),
    }


def _own_reminder(db: Session, parent: User, reminder_id: int) -> Reminder:
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.parent_id == parent.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


def _check_child(db: Session, parent: User, child_id: Optional[int]) -> None:
    if child_id is None:
        return
    if not db.query(User).filter(User.id == child_id, User.parent_id == parent.id, User.role == "child").first():
        raise HTTPException(status_code=404, detail="Child not found")


def _fill(reminder: Reminder, body: ReminderIn) -> None:
    reminder.kind = body.kind
    reminder.text = (body.text or "").strip()[:200] or None
    if body.kind == "custom" and not reminder.text:
        raise HTTPException(status_code=400, detail="Write what the reminder should say")
    reminder.child_id = body.child_id
    reminder.time = body.time
    reminder.days = json.dumps(body.days)
    reminder.email_child = body.email_child
    reminder.is_active = body.is_active


# ---------------------------------------------------------------------------
# Parent endpoints
# ---------------------------------------------------------------------------

@router.get("/")
def list_reminders(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    reminders = db.query(Reminder).filter(Reminder.parent_id == current_user.id).order_by(Reminder.time, Reminder.id).all()
    now = uk_now()
    children = db.query(User).filter(User.parent_id == current_user.id, User.role == "child").all()
    today = []
    for child in children:
        for r in reminders:
            if _applies(r, child, now):
                status = _status(db, r, child, now.date())
                today.append({**status, "child": child.username})
    return {
        "reminders": [_reminder_out(r) for r in reminders],
        "summary_time": current_user.summary_email_time,
        "email_enabled": bool(settings.RESEND_API_KEY and settings.RESEND_FROM_EMAIL),
        "today": today,
    }


@router.post("/", status_code=201)
def add_reminder(body: ReminderIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    _check_child(db, current_user, body.child_id)
    reminder = Reminder(parent_id=current_user.id)
    _fill(reminder, body)
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return _reminder_out(reminder)


@router.put("/summary")
def set_summary(body: SummaryIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    current_user.summary_email_time = body.time
    db.commit()
    return {"summary_time": body.time}


@router.put("/{reminder_id}")
def update_reminder(reminder_id: int, body: ReminderIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    reminder = _own_reminder(db, current_user, reminder_id)
    _check_child(db, current_user, body.child_id)
    _fill(reminder, body)
    db.commit()
    db.refresh(reminder)
    return _reminder_out(reminder)


@router.delete("/{reminder_id}", status_code=204)
def delete_reminder(reminder_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    reminder = _own_reminder(db, current_user, reminder_id)
    db.query(ReminderEvent).filter(ReminderEvent.reminder_id == reminder.id).delete()
    db.delete(reminder)
    db.commit()


# ---------------------------------------------------------------------------
# Child endpoints
# ---------------------------------------------------------------------------

@router.get("/today")
def my_reminders(db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    now = uk_now()
    reminders = db.query(Reminder).filter(Reminder.parent_id == current_user.parent_id).order_by(Reminder.time, Reminder.id).all()
    return [_status(db, r, current_user, now.date()) for r in reminders if _applies(r, current_user, now)]


@router.post("/{reminder_id}/done", status_code=201)
def mark_done(reminder_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.parent_id == current_user.parent_id).first()
    if not reminder or (reminder.child_id not in (None, current_user.id)):
        raise HTTPException(status_code=404, detail="Reminder not found")
    if reminder.kind != "custom":
        raise HTTPException(status_code=400, detail="This one ticks itself off when the work is done")
    today = uk_now().date()
    if not _event_exists(db, reminder, current_user, today, "done"):
        db.add(ReminderEvent(reminder_id=reminder.id, child_id=current_user.id, day=today, kind="done"))
        db.commit()
    return {"done": True}


# ---------------------------------------------------------------------------
# Emails, sent by a background loop inside the backend
# ---------------------------------------------------------------------------

def _send_email(to: str, subject: str, body_html: str) -> None:
    response = httpx.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}", "Content-Type": "application/json"},
        json={"from": settings.RESEND_FROM_EMAIL, "to": [to], "subject": subject, "html": body_html},
        timeout=15.0,
    )
    response.raise_for_status()


def _wrap(title: str, inner: str) -> str:
    link = settings.FRONTEND_URL.rstrip("/")
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#2E342F">
      <h2 style="color:#3F5D46">{html.escape(title)}</h2>
      {inner}
      <p><a href="{link}" style="display:inline-block;background:#3F5D46;color:white;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:700">Open Bright Roots</a></p>
      <p style="font-size:12px;color:#8A7A69">You're getting this because reminders are turned on in Bright Roots.</p>
    </div>
    """


def _claim(db: Session, reminder: Reminder, child: User, day: date) -> bool:
    """Record that today's email is being sent. False if it was already sent (even by another worker)."""
    db.add(ReminderEvent(reminder_id=reminder.id, child_id=child.id, day=day, kind="emailed"))
    try:
        db.commit()
        return True
    except IntegrityError:
        db.rollback()
        return False


def _send_child_reminders(db: Session, now: datetime) -> None:
    reminders = db.query(Reminder).filter(Reminder.is_active.is_(True), Reminder.email_child.is_(True)).all()
    for reminder in reminders:
        children = db.query(User).filter(User.parent_id == reminder.parent_id, User.role == "child")
        if reminder.child_id is not None:
            children = children.filter(User.id == reminder.child_id)
        for child in children.all():
            if not child.email or not _applies(reminder, child, now):
                continue
            if _event_exists(db, reminder, child, now.date(), "emailed"):
                continue
            status = _status(db, reminder, child, now.date())
            if status["done"] or not _claim(db, reminder, child, now.date()):
                continue
            items = "".join(f"<li>{html.escape(i)}</li>" for i in status["items"])
            inner = f"<p>Hi {html.escape(child.username)}, just a friendly reminder.</p>" + (f"<ul>{items}</ul>" if items else "")
            try:
                _send_email(child.email, f"Reminder: {status['label']}", _wrap(status["label"], inner))
            except Exception:
                logger.exception("Could not send reminder %s to child %s", reminder.id, child.id)


def _summary_html(db: Session, parent: User, day: date) -> str:
    start, end = _uk_day_bounds_utc(day)
    now = uk_now()
    sections = []
    for child in db.query(User).filter(User.parent_id == parent.id, User.role == "child").order_by(User.username).all():
        direct = (
            db.query(Lesson.title)
            .join(PlannerEntry, PlannerEntry.lesson_id == Lesson.id)
            .filter(PlannerEntry.assigned_to == child.id, PlannerEntry.completed_at >= start, PlannerEntry.completed_at < end)
            .all()
        )
        shared = (
            db.query(Lesson.title)
            .join(PlannerEntry, PlannerEntry.lesson_id == Lesson.id)
            .join(PlannerCompletion, PlannerCompletion.entry_id == PlannerEntry.id)
            .filter(PlannerCompletion.user_id == child.id, PlannerCompletion.completed_at >= start, PlannerCompletion.completed_at < end)
            .all()
        )
        lessons = [t for (t,) in direct + shared]
        minutes = sum(
            s.minutes
            for s in db.query(StudySession).filter(
                StudySession.child_id == child.id, StudySession.created_at >= start, StudySession.created_at < end
            )
        )
        spelling = _spellings_done(db, child, parent.id, day)
        undone = [
            _status(db, r, child, day)["label"]
            for r in db.query(Reminder).filter(Reminder.parent_id == parent.id).all()
            if _applies(r, child, now) and not _status(db, r, child, day)["done"]
        ]
        lesson_list = "".join(f"<li>{html.escape(t)}</li>" for t in lessons[:15])
        sections.append(
            f"<h3 style='margin-bottom:4px'>{html.escape(child.username)}</h3>"
            f"<p style='margin:0'>Lessons completed: <b>{len(lessons)}</b>"
            + (f" &middot; Studied for <b>{minutes} min</b>" if minutes else "")
            + (" &middot; Spellings practised ✓" if spelling else "")
            + "</p>"
            + (f"<ul>{lesson_list}</ul>" if lesson_list else "")
            + (f"<p style='color:#A64F42'>Still to do: {html.escape(', '.join(undone))}</p>" if undone else "")
        )
    body = "".join(sections) or "<p>No children on your account yet.</p>"
    return _wrap(f"Today at Bright Roots: {day.strftime('%A %d %B')}", body)


def _send_summaries(db: Session, now: datetime) -> None:
    today = now.date()
    parents = db.query(User).filter(User.role == "parent", User.summary_email_time.is_not(None)).all()
    for parent in parents:
        if not parent.email or now.strftime("%H:%M") < parent.summary_email_time:
            continue
        if parent.summary_last_sent == today:
            continue
        # Claim today's summary so it's sent once, even if more than one server process runs this.
        claimed = db.execute(
            update(User)
            .where(User.id == parent.id, or_(User.summary_last_sent.is_(None), User.summary_last_sent != today))
            .values(summary_last_sent=today)
        ).rowcount
        db.commit()
        if not claimed:
            continue
        try:
            _send_email(parent.email, f"Your Bright Roots day: {today.strftime('%A %d %B')}", _summary_html(db, parent, today))
        except Exception:
            logger.exception("Could not send daily summary to parent %s", parent.id)


def run_due_emails() -> None:
    if not (settings.RESEND_API_KEY and settings.RESEND_FROM_EMAIL):
        return
    now = uk_now()
    db = SessionLocal()
    try:
        _send_child_reminders(db, now)
        _send_summaries(db, now)
    finally:
        db.close()


_scheduler_started = False


def start_email_scheduler() -> None:
    global _scheduler_started
    if _scheduler_started:
        return
    _scheduler_started = True

    def loop():
        while True:
            try:
                run_due_emails()
            except Exception:
                logger.exception("Reminder email check failed")
            time.sleep(CHECK_EVERY_SECONDS)

    threading.Thread(target=loop, name="reminder-emails", daemon=True).start()
