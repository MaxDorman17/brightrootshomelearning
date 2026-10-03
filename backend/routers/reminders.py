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
import emails
from database import SessionLocal, get_db
from push import send_to_user
from models import (
    DayOff,
    Lesson,
    PlannerCompletion,
    PlannerEntry,
    PushSubscription,
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
    emails.send(to, subject, body_html)


def _wrap(title: str, inner: str, eyebrow: str = "Reminder") -> str:
    footer = "You're getting this because reminders are turned on in Bright Roots. A grown-up can change them under Family, then Reminders."
    return emails.layout(title, inner + emails.button("Open Bright Roots", settings.FRONTEND_URL.rstrip("/")), eyebrow=eyebrow, footer=footer)


def _claim(db: Session, reminder: Reminder, child: User, day: date, kind: str = "emailed") -> bool:
    """Record that today's email (or notification) is being sent. False if it already was (even by another worker)."""
    db.add(ReminderEvent(reminder_id=reminder.id, child_id=child.id, day=day, kind=kind))
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
            items = "".join(f"<li style='margin-bottom:4px'>{html.escape(i)}</li>" for i in status["items"])
            inner = emails.paragraph(f"Hi {html.escape(child.username)}, just a friendly reminder.") + (
                f"<ul style=\"margin:0 0 14px;padding-left:20px;font-family:{emails.FONT};font-size:15px;line-height:1.5;color:{emails.INK}\">{items}</ul>" if items else ""
            )
            try:
                _send_email(child.email, f"Reminder: {status['label']}", _wrap(status["label"], inner))
            except Exception:
                logger.exception("Could not send reminder %s to child %s", reminder.id, child.id)


def _push_reminders(db: Session, now: datetime, subscribed: set[int]) -> None:
    """Phone notifications for every active reminder, sent to children who turned notifications on."""
    today = now.date()
    for reminder in db.query(Reminder).filter(Reminder.is_active.is_(True)).all():
        children = db.query(User).filter(User.parent_id == reminder.parent_id, User.role == "child")
        if reminder.child_id is not None:
            children = children.filter(User.id == reminder.child_id)
        for child in children.all():
            if child.id not in subscribed or not _applies(reminder, child, now):
                continue
            if _event_exists(db, reminder, child, today, "pushed"):
                continue
            status = _status(db, reminder, child, today)
            if status["done"] or not _claim(db, reminder, child, today, "pushed"):
                continue
            body = "Just a friendly reminder."
            if status["items"]:
                body = "Still to do: " + ", ".join(status["items"][:3])
            try:
                send_to_user(db, child.id, status["label"], body, "/child", f"reminder-{reminder.id}")
            except Exception:
                logger.exception("Could not push reminder %s to child %s", reminder.id, child.id)


def _lessons_done(db: Session, child: User, start: datetime, end: datetime) -> list[str]:
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
    return [t for (t,) in direct + shared]


def _summary_push_text(db: Session, parent: User, day: date) -> str:
    start, end = _uk_day_bounds_utc(day)
    parts = []
    for child in db.query(User).filter(User.parent_id == parent.id, User.role == "child").order_by(User.username).all():
        n = len(_lessons_done(db, child, start, end))
        parts.append(f"{child.username} {n} lesson{'' if n == 1 else 's'}")
    return ("Done today: " + ", ".join(parts) + ". Tap to see more.") if parts else "Tap to see today's learning."


def _planned_today(db: Session, parent: User, child: User, day: date) -> int:
    """How many lessons were on this child's planner for the day."""
    return (
        db.query(PlannerEntry)
        .join(Lesson, Lesson.id == PlannerEntry.lesson_id)
        .filter(Lesson.created_by == parent.id, PlannerEntry.scheduled_date == day, or_(PlannerEntry.assigned_to == child.id, PlannerEntry.assigned_to.is_(None)))
        .count()
    )


def _summary(db: Session, parent: User, day: date) -> tuple[str, bool]:
    """The daily summary email, and whether there is anything worth sending.

    Nothing is sent on a day with no learning recorded and nothing planned (a weekend, or a day off),
    so families don't get an email that only says "Lessons completed: 0".
    """
    start, end = _uk_day_bounds_utc(day)
    now = uk_now()
    day_off = db.query(DayOff).filter(DayOff.parent_id == parent.id, DayOff.date == day).first() is not None
    worth_sending = False
    sections = []
    for child in db.query(User).filter(User.parent_id == parent.id, User.role == "child").order_by(User.username).all():
        lessons = _lessons_done(db, child, start, end)
        planned = _planned_today(db, parent, child, day)
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
        if lessons or minutes or spelling or (planned and not day_off):
            worth_sending = True

        done_text = f"{len(lessons)} of {planned}" if planned and planned >= len(lessons) else str(len(lessons))
        facts = [f"<strong>{done_text}</strong> lesson{'' if done_text == '1' else 's'} done"]
        if minutes:
            facts.append(f"studied for <strong>{minutes} min</strong>")
        if spelling:
            facts.append("spellings practised")
        lesson_list = "".join(f"<li style='margin-bottom:3px'>{html.escape(t)}</li>" for t in lessons[:15])
        text = f"font-family:{emails.FONT};font-size:15px;line-height:1.5;color:{emails.INK}"
        sections.append(emails.panel(
            f"<p style=\"margin:0 0 4px;font-family:{emails.SERIF};font-size:18px;font-weight:700;color:{emails.DEEP}\">{html.escape(child.username)}</p>"
            f"<p style=\"margin:0;{text}\">{' &middot; '.join(facts)}</p>"
            + (f"<ul style=\"margin:10px 0 0;padding-left:20px;{text}\">{lesson_list}</ul>" if lesson_list else "")
            + (f"<p style=\"margin:10px 0 0;{text};color:#A64F42\">Still to do: {html.escape(', '.join(undone))}</p>" if undone else "")
        ))
    body = "".join(sections) or emails.paragraph("No children on your account yet.")
    footer = "You're getting this because the daily summary is turned on. You can change the time or turn it off under Family, then Reminders."
    page = emails.layout(
        day.strftime("%A %d %B").replace(" 0", " "),
        body + emails.button("Open Bright Roots", f"{settings.FRONTEND_URL.rstrip('/')}/parent/dashboard"),
        eyebrow="Today at Bright Roots", footer=footer, preview="What your children did today.",
    )
    return page, worth_sending


def _send_summaries(db: Session, now: datetime, email_on: bool, subscribed: set[int]) -> None:
    today = now.date()
    parents = db.query(User).filter(User.role == "parent", User.summary_email_time.is_not(None)).all()
    for parent in parents:
        wants_email = email_on and bool(parent.email)
        wants_push = parent.id in subscribed
        if not (wants_email or wants_push) or now.strftime("%H:%M") < parent.summary_email_time:
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
            page, worth_sending = _summary(db, parent, today)
        except Exception:
            logger.exception("Could not build daily summary for parent %s", parent.id)
            continue
        if not worth_sending:
            continue  # nothing planned and nothing done today, such as a weekend
        if wants_email:
            try:
                _send_email(parent.email, f"Your Bright Roots day: {today.strftime('%A %d %B')}", page)
            except Exception:
                logger.exception("Could not send daily summary to parent %s", parent.id)
        if wants_push:
            try:
                send_to_user(db, parent.id, "Your Bright Roots day", _summary_push_text(db, parent, today), "/parent/dashboard", "summary")
            except Exception:
                logger.exception("Could not push daily summary to parent %s", parent.id)


def run_due_emails() -> None:
    """Send whatever reminder emails and phone notifications are due."""
    email_on = bool(settings.RESEND_API_KEY and settings.RESEND_FROM_EMAIL)
    now = uk_now()
    db = SessionLocal()
    try:
        subscribed = {uid for (uid,) in db.query(PushSubscription.user_id).distinct()}
        if email_on:
            _send_child_reminders(db, now)
        if subscribed:
            _push_reminders(db, now, subscribed)
        _send_summaries(db, now, email_on, subscribed)
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
