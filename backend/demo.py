"""The demo family: a made-up family anyone can look round without signing up.

Turned on with DEMO_ENABLED=true. The login page then shows "Try the demo" buttons that log a visitor in as
the demo grown-up or one of the demo children, with no password. The family comes with a few weeks of
lessons, scores, books, stars and notes, all dated around today so it always looks lived in.

Visitors share the one family, so:
- anything that would email someone, take payment, add or change a login, or put a file on the site is
  switched off for it (see `guard`);
- every night it is wiped and built again from scratch (see `start_scheduler`), so whatever visitors
  added or changed is gone by the morning.

Nobody can log in to it with a password: each demo login has a long random one nobody knows.
"""
import json
import logging
import random
import re
import secrets
import threading
import time
from datetime import date, datetime, time as dtime, timedelta
from typing import Optional

from fastapi import HTTPException, Request
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from auth import SESSION_COOKIE_NAME, hash_password
from clock import UK, uk_today
from config import settings
from database import SessionLocal
from models import (
    AppSetting, DayOff, JournalEntry, Moment, PlannerEntry, ReadingLog, RewardClaim, RewardItem, RewardRule,
    SpellingResult, SpellingWord, StarAward, TestResult, User, WeeklyGoal,
)

logger = logging.getLogger(__name__)

# The reserved ".invalid" ending means these addresses can never reach a real inbox (emails.send skips them too).
PARENT_EMAIL = "demo-family@brightroots.invalid"
PARENT_NAME = "Jo"
CHILDREN = [
    {"key": "ruby", "name": "Ruby", "age": 9, "level": "young"},
    {"key": "sam", "name": "Sam", "age": 13, "level": "teen"},
]
RESET_HOUR = 4  # UK time; the family is rebuilt once a day at or after this hour
CHECK_EVERY_SECONDS = 10 * 60
_LAST_RESET = "demo_reset_on"


def enabled() -> bool:
    return bool(settings.DEMO_ENABLED)


# ---------- What visitors can't do ----------

_SIGN_UP = "Start your own free trial to try it for real."
# (method, path, what is switched off). "*" means any method that changes something.
_BLOCKED = [
    ("POST", r"/api/account/delete", "Deleting the account"),
    ("POST", r"/api/auth/change-password", "Changing the password"),
    ("POST", r"/api/auth/request-email-verification", "Email"),
    ("*", r"/api/billing/.*", "Memberships and payments"),
    ("*", r"/api/children(/.*)?", "Adding, renaming or removing children"),
    ("*", r"/api/family/adults(/.*)?", "Adding grown-ups"),
    ("*", r"/api/newsletter/.*", "The newsletter"),
    ("*", r"/api/push/(subscribe|test)", "Phone notifications"),
    ("PUT", r"/api/reminders/summary", "The daily summary email"),
    ("POST", r"/api/support/messages", "Sending messages from the demo"),
    ("*", r"/api/backup/.*", "Backups"),
]
_BLOCKED = [(method, re.compile(path + "/?"), what) for method, path, what in _BLOCKED]
_READ_ONLY = {"GET", "HEAD", "OPTIONS"}


def _blocked_reason(method: str, path: str) -> Optional[str]:
    for rule_method, pattern, what in _BLOCKED:
        if rule_method in ("*", method) and pattern.fullmatch(path):
            return what
    return None


def _token_user_id(request: Request) -> Optional[int]:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        header = request.headers.get("authorization", "")
        if header.lower().startswith("bearer "):
            token = header[7:].strip()
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        return None


async def guard(request: Request) -> None:
    """Runs before every request: refuses the few things a demo visitor must not do. Nothing for anyone else."""
    method = request.method.upper()
    if method in _READ_ONLY:
        return
    what = _blocked_reason(method, request.url.path)
    is_upload = not what and request.headers.get("content-type", "").startswith("multipart/form-data")
    if not what and not is_upload:
        return
    user_id = _token_user_id(request)
    if user_id is None:
        return
    db = SessionLocal()
    try:
        is_demo = db.query(User.is_demo).filter(User.id == user_id).scalar()
    finally:
        db.close()
    if not is_demo:
        return
    if is_upload:
        # Other visitors would see whatever is uploaded, so photos and files stay out.
        form = await request.form()
        if not any(isinstance(v, UploadFile) and v.filename for _, v in form.multi_items()):
            return
        what = "Uploading photos and files"
    raise HTTPException(status_code=403, detail=f"{what} is switched off in the demo family. {_SIGN_UP}")


# ---------- Building the family ----------

def demo_users(db: Session) -> list[User]:
    return db.query(User).filter(User.is_demo.is_(True)).all()


def demo_parent(db: Session) -> Optional[User]:
    return db.query(User).filter(User.is_demo.is_(True), User.role == "parent").first()


def _remove(db: Session) -> None:
    from data_removal import delete_rows, linked_rows, remove_files, uploaded_files

    ids = {u.id for u in demo_users(db)}
    if not ids:
        return
    ids |= {cid for (cid,) in db.query(User.id).filter(User.parent_id.in_(ids) | User.family_owner_id.in_(ids))}
    rows = linked_rows(db, {"users": ids})
    files = uploaded_files(rows)
    delete_rows(db, rows)
    db.flush()
    remove_files(files)


def _free_login(db: Session, wanted: str) -> str:
    name = wanted
    while db.query(User.id).filter(User.login_name == name).first():
        name = f"{wanted}-{secrets.token_hex(3)}"
    return name


def _at(day: date, hour: int, minute: int = 0) -> datetime:
    return datetime.combine(day, dtime(hour, minute))


def build(db: Session) -> User:
    """Make the demo family from scratch. The caller commits."""
    from routers.rewards import DEFAULT_REWARDS, DEFAULT_RULES
    from routers.starter_week import _add_lesson, lessons_for_week
    from routers.timetable import DEFAULT_TIMETABLE

    rng = random.Random(7)  # the same family every night
    today = uk_today()
    this_monday = today - timedelta(days=today.weekday())
    first_monday = this_monday - timedelta(weeks=2)
    started = _at(first_monday - timedelta(days=3), 9)

    parent = User(
        email=PARENT_EMAIL,
        login_name=PARENT_EMAIL,
        username=PARENT_NAME,
        hashed_password=hash_password(secrets.token_urlsafe(32)),
        role="parent",
        is_demo=True,
        email_verified_at=started,
        onboarding_completed_at=started,
        subscription_status="grandfathered",
        theme="sage",
        rewards_set_up_at=started,
        ehe_approach=(
            "We follow a mix of structured lessons in the mornings (Maths and English every day, using Oak National "
            "Academy and our own resources) and project-based learning in the afternoons. Trips, reading and practical "
            "life skills are a big part of our week."
        ),
    )
    db.add(parent)
    db.flush()

    kids: dict[str, User] = {}
    for c in CHILDREN:
        child = User(
            username=c["name"],
            login_name=_free_login(db, f"demo-{c['key']}"),
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            role="child",
            parent_id=parent.id,
            is_demo=True,
            activity_level=c["level"],
        )
        db.add(child)
        db.flush()
        kids[c["key"]] = child
    ruby, sam = kids["ruby"], kids["sam"]

    # Lessons: two weeks done, this week under way, next week planned.
    notes = ["Loved this one!", "Found it a bit tricky but got there.", "Did extra questions at the end.", "We did this outside."]
    for c in CHILDREN:
        child = kids[c["key"]]
        week = lessons_for_week(c["level"], DEFAULT_TIMETABLE)
        for w in range(4):
            monday = first_monday + timedelta(weeks=w)
            for offset, items in enumerate(week):
                day = monday + timedelta(days=offset)
                for slot, item in enumerate(items):
                    _add_lesson(db, parent.id, item, day, [child.id])
                    db.flush()
                    entry = db.query(PlannerEntry).filter(PlannerEntry.assigned_to == child.id).order_by(PlannerEntry.id.desc()).first()
                    done = day < today and rng.random() < 0.9 or (day == today and slot == 0)
                    if done:
                        entry.is_complete = True
                        entry.completed_at = _at(day, 10 + slot)
                        if rng.random() < 0.25:
                            entry.completed_note = rng.choice(notes)

    # Scores the grown-up recorded.
    for child, papers in (
        (ruby, [("Maths", "Times tables check", 18, 20), ("Maths", "Fractions quiz", 7, 10), ("English", "Reading comprehension", 13, 15)]),
        (sam, [("Maths", "Algebra practice paper", 31, 40), ("Science", "Cells end-of-topic test", 22, 25), ("English", "Poetry analysis", 16, 20)]),
    ):
        for i, (subject, title, score, total) in enumerate(papers):
            db.add(TestResult(child_id=child.id, parent_id=parent.id, subject=subject, title=title,
                              taken_on=first_monday + timedelta(days=4 + 5 * i), score=score, total=total,
                              created_at=_at(first_monday + timedelta(days=4 + 5 * i), 14)))

    # Spellings: this week's list, and how Ruby got on.
    words = ["because", "different", "favourite", "important", "special", "busy", "minute", "answer"]
    for i, word in enumerate(words):
        db.add(SpellingWord(parent_id=parent.id, week_start=this_monday, word=word, position=i))
    for w, (score, wrong) in enumerate([(8, ["necessary", "separate"]), (9, ["rhythm"])]):
        db.add(SpellingResult(child_id=ruby.id, parent_id=parent.id, week_start=first_monday + timedelta(weeks=w),
                              score=score, total=10, wrong_words=json.dumps(wrong), taken_at=_at(first_monday + timedelta(weeks=w, days=4), 11)))

    # Books.
    for child, title, author, status, chapters, done, rating in (
        (ruby, "Charlotte's Web", "E. B. White", "completed", 22, 22, 5),
        (ruby, "The Worst Witch", "Jill Murphy", "reading", 10, 6, None),
        (ruby, "Matilda", "Roald Dahl", "wishlist", None, 0, None),
        (sam, "Holes", "Louis Sachar", "completed", 50, 50, 4),
        (sam, "Percy Jackson and the Lightning Thief", "Rick Riordan", "reading", 22, 9, None),
    ):
        db.add(ReadingLog(
            title=title, author=author, status=status, total_chapters=chapters, completed_chapters=done, rating=rating,
            added_by=parent.id, child_id=child.id,
            start_date=first_monday if status != "wishlist" else None,
            finish_date=first_monday + timedelta(days=10) if status == "completed" else None,
            reading_journal="Really enjoyed the ending." if status == "completed" else None,
        ))

    # Stars and rewards.
    for rule in DEFAULT_RULES:
        db.add(RewardRule(parent_id=parent.id, counts_from=started, is_active=True, is_hidden=False, **rule))
    rewards = [RewardItem(parent_id=parent.id, is_active=True, **r) for r in DEFAULT_REWARDS]
    db.add_all(rewards)
    db.flush()
    db.add(StarAward(parent_id=parent.id, child_id=ruby.id, stars=5, reason="Brilliant baking", created_at=_at(this_monday - timedelta(days=3), 15)))
    db.add(StarAward(parent_id=parent.id, child_id=sam.id, stars=3, reason="Helped Ruby with her reading", created_at=_at(this_monday - timedelta(days=5), 16)))
    screen = rewards[0]
    db.add(RewardClaim(parent_id=parent.id, child_id=ruby.id, reward_id=screen.id, title=screen.title, emoji=screen.emoji,
                       cost=screen.cost, status="pending", created_at=_at(today, 8)))

    # The grown-up's notes and goals.
    for days_ago, text in (
        (8, "Great week for maths. Ruby finally cracked her 7 times table and Sam finished the algebra unit."),
        (5, "Science museum trip. Both children loved the space gallery; Sam wants to do a project on rockets."),
        (2, "Quieter day. Lots of reading, and Ruby wrote a lovely postcard to Grandma."),
    ):
        db.add(JournalEntry(entry_date=today - timedelta(days=days_ago), content=text, created_by=parent.id))
    for title, child, done in (("Practise 8 times table", ruby, True), ("Finish chapter 7 of The Worst Witch", ruby, False),
                               ("Start the rockets project", sam, False)):
        db.add(WeeklyGoal(week_start=this_monday, title=title, assigned_to=child.id, created_by=parent.id,
                          is_complete=done, completed_at=_at(today, 9) if done else None))

    # The family feed.
    db.add(Moment(parent_id=parent.id, author_id=parent.id, moment_date=today - timedelta(days=5), subject="Science",
                  note="Day out at the Science Museum. Sam spent ages in the space gallery!", trip_place="Science Museum, London",
                  child_ids=json.dumps([ruby.id, sam.id])))
    db.add(Moment(parent_id=parent.id, author_id=parent.id, moment_date=today - timedelta(days=2), subject="Cooking",
                  note="Ruby made scones all by herself and measured everything out.", child_ids=json.dumps([ruby.id])))

    # A day off coming up.
    db.add(DayOff(parent_id=parent.id, date=this_monday + timedelta(weeks=1, days=2), reason="Dentist and swimming"))

    db.flush()
    return parent


def reset(db: Session) -> User:
    """Wipe the demo family and build it again."""
    _remove(db)
    parent = build(db)
    row = db.get(AppSetting, _LAST_RESET)
    if row is None:
        db.add(AppSetting(name=_LAST_RESET, value=uk_today().isoformat()))
    else:
        row.value = uk_today().isoformat()
    db.commit()
    return parent


def ensure(db: Session) -> Optional[User]:
    """The demo grown-up, making the family first if it isn't there yet."""
    if not enabled():
        return None
    parent = demo_parent(db)
    return parent or reset(db)


# ---------- The nightly rebuild ----------

def _due(db: Session) -> bool:
    now = datetime.now(UK)
    if now.hour < RESET_HOUR:
        return False
    row = db.get(AppSetting, _LAST_RESET)
    return row is None or row.value != now.date().isoformat()


_scheduler_started = False


def start_scheduler() -> None:
    global _scheduler_started
    if _scheduler_started or not enabled():
        return
    _scheduler_started = True

    def loop():
        while True:
            db = SessionLocal()
            try:
                if demo_parent(db) is None or _due(db):
                    reset(db)
                    logger.info("Demo family rebuilt")
            except Exception:
                db.rollback()
                logger.exception("Demo family rebuild failed")
            finally:
                db.close()
            time.sleep(CHECK_EVERY_SECONDS)

    threading.Thread(target=loop, name="demo-family", daemon=True).start()
