"""Calendar sync: a private feed of the family's plans that Google, Apple or Outlook calendars can subscribe to.

The feed address contains a long random secret instead of a login, because calendar apps can't log in.
Anyone with the address can read the feed, so it can be switched off or replaced at any time.
"""
import secrets
from datetime import date, datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from auth import require_parent, user_has_membership_access
from database import get_db
from models import DayOff, ExamEntry, Lesson, PlannerEntry, User

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

PAST_DAYS = 14
FUTURE_DAYS = 120


@router.get("/link")
def get_link(current_user: User = Depends(require_parent)):
    """The family's feed secret, or null if calendar sync is off."""
    return {"token": current_user.calendar_token}


@router.post("/link")
def make_link(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Switch calendar sync on, or replace the address so the old one stops working."""
    current_user.calendar_token = secrets.token_urlsafe(32)
    db.commit()
    return {"token": current_user.calendar_token}


@router.delete("/link", status_code=204)
def remove_link(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    current_user.calendar_token = None
    db.commit()


# ---------- the feed itself ----------

def _escape(text: str) -> str:
    return (text or "").replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\r", "").replace("\n", "\\n")


def _fold(line: str) -> str:
    """Calendar lines must be at most 75 bytes; longer ones carry on after a newline and a space."""
    out, current = [], b""
    for ch in line:
        encoded = ch.encode("utf-8")
        if len(current) + len(encoded) > 75:
            out.append(current.decode("utf-8"))
            current = b" " + encoded
        else:
            current += encoded
    out.append(current.decode("utf-8"))
    return "\r\n".join(out)


def _all_day(uid: str, day: date, summary: str, description: str = "", stamp: str = "") -> list[str]:
    return [
        "BEGIN:VEVENT",
        f"UID:{uid}@brightrootshomelearning.co.uk",
        f"DTSTAMP:{stamp}",
        f"DTSTART;VALUE=DATE:{day.strftime('%Y%m%d')}",
        f"DTEND;VALUE=DATE:{(day + timedelta(days=1)).strftime('%Y%m%d')}",
        f"SUMMARY:{_escape(summary)}",
        *([f"DESCRIPTION:{_escape(description)}"] if description else []),
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
    ]


def build_feed(db: Session, family: User) -> str:
    today = date.today()
    start, end = today - timedelta(days=PAST_DAYS), today + timedelta(days=FUTURE_DAYS)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    kids = {c.id: c.username for c in db.query(User).filter(User.parent_id == family.id, User.role == "child")}
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Bright Roots Home Learning//Family calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Bright Roots",
        "X-PUBLISHED-TTL:PT1H",
        "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    ]

    entries = (
        db.query(PlannerEntry, Lesson)
        .join(Lesson, Lesson.id == PlannerEntry.lesson_id)
        .filter(Lesson.created_by == family.id, PlannerEntry.scheduled_date >= start, PlannerEntry.scheduled_date <= end)
        .all()
    )
    # One event per lesson per day, listing the children doing it.
    grouped: dict[tuple, dict] = {}
    for entry, lesson in entries:
        key = (entry.scheduled_date, lesson.id)
        g = grouped.setdefault(key, {"lesson": lesson, "children": [], "done": True, "id": entry.id})
        if entry.assigned_to in kids:
            g["children"].append(kids[entry.assigned_to])
        g["done"] = g["done"] and bool(entry.is_complete)
    for (day, _), g in sorted(grouped.items(), key=lambda kv: (kv[0][0], kv[1]["lesson"].subject)):
        lesson = g["lesson"]
        who = f" ({', '.join(sorted(g['children']))})" if g["children"] else ""
        tick = "✓ " if g["done"] else ""
        description = lesson.description or ""
        if lesson.duration_minutes:
            description = (description + f"\n\nAbout {lesson.duration_minutes} minutes").strip()
        lines += _all_day(f"lesson-{g['id']}", day, f"{tick}{lesson.subject}: {lesson.title}{who}", description, stamp)

    for exam in db.query(ExamEntry).filter(ExamEntry.parent_id == family.id).all():
        child = kids.get(exam.child_id, "")
        name = f"{exam.qualification} {exam.subject}" + (f" {exam.paper}" if exam.paper else "")
        if exam.exam_date and start <= exam.exam_date <= end:
            details = ", ".join(x for x in [exam.exam_time, exam.centre, exam.board] if x)
            lines += _all_day(f"exam-{exam.id}", exam.exam_date, f"Exam: {name} ({child})", details, stamp)
        if exam.entry_deadline and start <= exam.entry_deadline <= end and exam.status == "planning":
            lines += _all_day(f"exam-deadline-{exam.id}", exam.entry_deadline, f"Exam entry deadline: {name} ({child})", exam.centre or "", stamp)

    for off in db.query(DayOff).filter(DayOff.parent_id == family.id, DayOff.date >= start, DayOff.date <= end).all():
        lines += _all_day(f"dayoff-{off.id}", off.date, "Day off" + (f": {off.reason}" if off.reason else ""), "", stamp)

    lines.append("END:VCALENDAR")
    return "\r\n".join(_fold(line) for line in lines) + "\r\n"


@router.get("/{token}.ics")
def feed(token: str, db: Session = Depends(get_db)):
    family = None
    if len(token) >= 20:
        family = db.query(User).filter(User.calendar_token == token, User.role == "parent").first()
    if family is None:
        raise HTTPException(status_code=404, detail="Calendar not found")
    if not user_has_membership_access(family, db):
        # Membership ended: the feed stays but shows nothing new.
        body = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Bright Roots Home Learning//Family calendar//EN\r\nX-WR-CALNAME:Bright Roots\r\nEND:VCALENDAR\r\n"
    else:
        body = build_feed(db, family)
    return Response(
        content=body,
        media_type="text/calendar; charset=utf-8",
        headers={"Cache-Control": "private, max-age=900", "Content-Disposition": 'inline; filename="bright-roots.ics"'},
    )
