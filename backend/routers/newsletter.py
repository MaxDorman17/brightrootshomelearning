import html
import logging
import re
import secrets
import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta
from threading import Lock
from time import monotonic

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_authenticated_user
from config import settings
import emails
from database import SessionLocal, get_db
from models import Newsletter, NewsletterSubscriber, User
from newsletter_access import find_subscriber, is_admin, subscribe_member

router = APIRouter(prefix="/api/newsletter", tags=["newsletter"])
logger = logging.getLogger(__name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
SUBSCRIBE_WINDOW_SECONDS = 15 * 60
MAX_SUBSCRIBES_PER_IP = 5
SEND_PAUSE_SECONDS = 0.6  # keeps well inside Resend's rate limit

_subscribes_by_ip = defaultdict(deque)
_lock = Lock()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _client_ip(request: Request) -> str:
    for header in ("cf-connecting-ip", "x-forwarded-for"):
        value = request.headers.get(header)
        if value:
            return value.split(",", 1)[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_limit(ip: str) -> None:
    now = monotonic()
    with _lock:
        attempts = _subscribes_by_ip[ip]
        while attempts and attempts[0] <= now - SUBSCRIBE_WINDOW_SECONDS:
            attempts.popleft()
        if len(attempts) >= MAX_SUBSCRIBES_PER_IP:
            raise HTTPException(status_code=429, detail="Too many attempts. Please try again later.")
        attempts.append(now)


def _email_configured() -> bool:
    return bool(settings.RESEND_API_KEY and settings.RESEND_FROM_EMAIL)


def _send_email(to: str, subject: str, body_html: str, unsubscribe_url: str | None = None) -> None:
    emails.send(to, subject, body_html, unsubscribe_url)


def _site() -> str:
    return settings.FRONTEND_URL.rstrip("/")


def _inline(text: str) -> str:
    """Escape, then allow **bold**, *italic* and [links](https://...)."""
    out = html.escape(text)
    out = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"<em>\1</em>", out)
    out = re.sub(
        r"\[([^\]]+)\]\((https?://[^\s)]+)\)",
        lambda m: f'<a href="{m.group(2)}" style="color:#3F5D46">{m.group(1)}</a>',
        out,
    )
    return out


def render_body(body: str) -> str:
    """A small, safe subset of markdown: # and ## headings, - bullet lists, paragraphs."""
    blocks, bullets, para = [], [], []

    def flush_para():
        if para:
            blocks.append(f"<p style='line-height:1.6'>{'<br>'.join(_inline(l) for l in para)}</p>")
            para.clear()

    def flush_bullets():
        if bullets:
            blocks.append("<ul>" + "".join(f"<li style='margin-bottom:4px'>{_inline(b)}</li>" for b in bullets) + "</ul>")
            bullets.clear()

    for raw in body.replace("\r\n", "\n").split("\n"):
        line = raw.rstrip()
        if not line.strip():
            flush_para()
            flush_bullets()
        elif line.startswith("## "):
            flush_para(); flush_bullets()
            blocks.append(f"<h3 style='color:#3F5D46;margin:18px 0 6px'>{_inline(line[3:])}</h3>")
        elif line.startswith("# "):
            flush_para(); flush_bullets()
            blocks.append(f"<h2 style='color:#3F5D46;margin:20px 0 8px'>{_inline(line[2:])}</h2>")
        elif line.lstrip().startswith(("- ", "* ")):
            flush_para()
            bullets.append(line.lstrip()[2:])
        else:
            flush_bullets()
            para.append(line)
    flush_para()
    flush_bullets()
    return "".join(blocks)


def _without_repeated_title(subject: str, body: str) -> str:
    """The subject is already the email's heading, so drop a first line that just repeats it."""
    lines = body.replace("\r\n", "\n").split("\n")
    first = next((i for i, line in enumerate(lines) if line.strip()), None)
    if first is not None and lines[first].lstrip("# ").strip().lower() == subject.strip().lower():
        del lines[first]
    return "\n".join(lines)


def _newsletter_html(subject: str, body: str, unsubscribe_url: str) -> str:
    body = _without_repeated_title(subject, body)
    inner = (
        f"<div style=\"font-family:{emails.FONT};font-size:15px;color:{emails.INK}\">{render_body(body)}</div>"
        + emails.button("Visit Bright Roots", _site())
    )
    footer = (
        "You're receiving this because you asked for the Bright Roots newsletter. "
        f'<a href="{unsubscribe_url}" style="color:#8A7A69">Unsubscribe</a>'
    )
    return emails.layout(subject, inner, eyebrow="Newsletter", footer=footer)


def _unsubscribe_url(sub: NewsletterSubscriber) -> str:
    return f"{_site()}/newsletter/unsubscribe#token={sub.token}"


def _require_admin(user: User = Depends(get_authenticated_user)) -> User:
    if not is_admin(user):
        raise HTTPException(status_code=403, detail="Only the site owner can do this")
    return user


def _recipients(db: Session) -> list[NewsletterSubscriber]:
    rows = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.status == "subscribed").all()
    if not rows:
        return []
    # Members only receive it once their account email has been verified.
    member_ids = [r.user_id for r in rows if r.user_id]
    verified = {
        u.id for u in db.query(User).filter(User.id.in_(member_ids or [0]), User.email_verified_at.is_not(None)).all()
    }
    return [r for r in rows if not r.user_id or r.user_id in verified]


# ---------------------------------------------------------------------------
# Public: subscribe, confirm, unsubscribe
# ---------------------------------------------------------------------------

class SubscribeIn(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def valid_email(cls, value: str) -> str:
        value = value.strip().lower()
        if len(value) > 255 or not EMAIL_RE.match(value):
            raise ValueError("Please enter a valid email address")
        return value


class TokenIn(BaseModel):
    token: str


def invite_to_newsletter(db: Session, email: str, source: str = "visitor") -> None:
    """Ask someone to confirm they want the newsletter. Nobody is added until they click the link in the email."""
    email = email.strip().lower()
    row = find_subscriber(db, email)
    if row and row.status == "subscribed":
        return
    if not row:
        row = NewsletterSubscriber(email=email, token=secrets.token_urlsafe(32), source=source, status="pending")
        db.add(row)
    else:
        row.status = "pending"
    db.commit()
    _send_confirmation(row)


@router.post("/subscribe")
def subscribe(body: SubscribeIn, request: Request, db: Session = Depends(get_db)):
    _rate_limit(_client_ip(request))
    # Same answer whether or not they're already subscribed, so nobody can find out who is.
    invite_to_newsletter(db, body.email)
    return {"message": "Nearly there! Check your inbox and click the link to confirm."}


def _send_confirmation(row: NewsletterSubscriber) -> None:
    if _email_configured():
        subject, body = emails.newsletter_confirm_email(f"{_site()}/newsletter/confirm#token={row.token}")
        try:
            _send_email(row.email, subject, body, _unsubscribe_url(row))  # lets an inbox show its own Unsubscribe button
        except Exception:
            logger.exception("Could not send newsletter confirmation")


@router.post("/confirm")
def confirm(body: TokenIn, db: Session = Depends(get_db)):
    row = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.token == body.token).first()
    if not row:
        raise HTTPException(status_code=400, detail="This link isn't valid any more")
    row.status = "subscribed"
    row.confirmed_at = row.confirmed_at or datetime.utcnow()
    row.unsubscribed_at = None
    db.commit()
    return {"message": "You're subscribed. Thank you!"}


@router.post("/unsubscribe")
def unsubscribe(body: TokenIn, db: Session = Depends(get_db)):
    row = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.token == body.token).first()
    if not row:
        raise HTTPException(status_code=400, detail="This link isn't valid any more")
    row.status = "unsubscribed"
    row.unsubscribed_at = datetime.utcnow()
    db.commit()
    return {"message": "You've been unsubscribed. Sorry to see you go!"}


# ---------------------------------------------------------------------------
# Parents: their own choice, from Account
# ---------------------------------------------------------------------------

class ChoiceIn(BaseModel):
    subscribed: bool


@router.get("/me")
def my_choice(db: Session = Depends(get_db), current_user: User = Depends(get_authenticated_user)):
    if current_user.role != "parent" or not current_user.email:
        return {"subscribed": False}
    row = find_subscriber(db, current_user.email)
    return {"subscribed": bool(row and row.status == "subscribed")}


@router.put("/me")
def set_choice(body: ChoiceIn, db: Session = Depends(get_db), current_user: User = Depends(get_authenticated_user)):
    if current_user.role != "parent" or not current_user.email:
        raise HTTPException(status_code=403, detail="Parent access required")
    subscribe_member(db, current_user, body.subscribed)
    return {"subscribed": body.subscribed}


# ---------------------------------------------------------------------------
# Site owner: write, preview, test and send
# ---------------------------------------------------------------------------

class DraftIn(BaseModel):
    subject: str
    body: str

    @field_validator("subject")
    @classmethod
    def valid_subject(cls, value: str) -> str:
        # A subject is plain text, so a heading mark typed by habit ("# My title") is dropped.
        value = value.strip().lstrip("#").strip()
        if not value:
            raise ValueError("Add a subject")
        return value[:200]

    @field_validator("body")
    @classmethod
    def valid_body(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Write the newsletter first")
        return value[:50000]


@router.get("/admin")
def admin_overview(db: Session = Depends(get_db), admin: User = Depends(_require_admin)):
    rows = db.query(NewsletterSubscriber).all()
    recipients = _recipients(db)
    past = db.query(Newsletter).order_by(Newsletter.created_at.desc()).limit(50).all()
    receiving = {r.id for r in recipients}
    names = {u.id: u.username for u in db.query(User).filter(User.id.in_([r.user_id for r in rows if r.user_id] or [0])).all()}

    def state(row: NewsletterSubscriber) -> str:
        if row.id in receiving:
            return "subscribed"
        if row.status == "subscribed":
            return "unverified"  # a member who ticked the box but hasn't confirmed their email address yet
        return row.status

    return {
        "email_enabled": _email_configured(),
        "subscribers": [
            {
                "id": r.id,
                "email": r.email,
                "name": names.get(r.user_id),
                "source": r.source,
                "status": state(r),
                "since": (r.confirmed_at or r.created_at).isoformat() if (r.confirmed_at or r.created_at) else None,
            }
            for r in sorted(rows, key=lambda r: (r.confirmed_at or r.created_at or datetime.min).replace(tzinfo=None), reverse=True)
        ],
        "counts": {
            "subscribed": len(recipients),
            "members": sum(1 for r in recipients if r.source == "member"),
            "visitors": sum(1 for r in recipients if r.source == "visitor"),
            "pending": sum(1 for r in rows if r.status == "pending"),
            "unsubscribed": sum(1 for r in rows if r.status == "unsubscribed"),
        },
        "newsletters": [
            {
                "id": n.id,
                "subject": n.subject,
                "status": n.status,
                "recipients": n.recipients,
                "sent_count": n.sent_count,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in past
        ],
    }


@router.delete("/admin/subscribers/{subscriber_id}", status_code=204)
def remove_subscriber(subscriber_id: int, db: Session = Depends(get_db), admin: User = Depends(_require_admin)):
    """Take someone off the list completely. If they have an account, it is not touched."""
    row = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.id == subscriber_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="That person isn't on the list")
    db.delete(row)
    db.commit()


@router.post("/admin/preview")
def preview(body: DraftIn, admin: User = Depends(_require_admin)):
    return {"html": emails.for_browser(_newsletter_html(body.subject, body.body, f"{_site()}/newsletter/unsubscribe"))}


@router.post("/admin/test")
def send_test(body: DraftIn, admin: User = Depends(_require_admin)):
    if not _email_configured():
        raise HTTPException(status_code=400, detail="Email isn't set up on the server")
    try:
        _send_email(admin.email, f"[Test] {body.subject}", _newsletter_html(body.subject, body.body, f"{_site()}/newsletter/unsubscribe"))
    except Exception:
        logger.exception("Newsletter test failed")
        raise HTTPException(status_code=502, detail="The email service didn't accept the test. Please try again.")
    return {"message": f"Test sent to {admin.email}"}


def _send_all(newsletter_id: int) -> None:
    db = SessionLocal()
    try:
        newsletter = db.query(Newsletter).filter(Newsletter.id == newsletter_id).first()
        for sub in _recipients(db):
            try:
                _send_email(sub.email, newsletter.subject, _newsletter_html(newsletter.subject, newsletter.body, _unsubscribe_url(sub)), _unsubscribe_url(sub))
                newsletter.sent_count += 1
                db.commit()
            except Exception:
                logger.exception("Newsletter %s failed for subscriber %s", newsletter_id, sub.id)
            time.sleep(SEND_PAUSE_SECONDS)
        newsletter.status = "sent"
        newsletter.finished_at = datetime.utcnow()
        db.commit()
    finally:
        db.close()


@router.post("/admin/send")
def send_newsletter(body: DraftIn, db: Session = Depends(get_db), admin: User = Depends(_require_admin)):
    if not _email_configured():
        raise HTTPException(status_code=400, detail="Email isn't set up on the server")
    # A send interrupted by a restart would otherwise block new ones forever, so only recent ones count.
    recent = datetime.utcnow() - timedelta(hours=3)
    if db.query(Newsletter).filter(Newsletter.status == "sending", Newsletter.created_at >= recent).first():
        raise HTTPException(status_code=400, detail="A newsletter is still sending. Please wait for it to finish.")
    recipients = _recipients(db)
    if not recipients:
        raise HTTPException(status_code=400, detail="There are no subscribers yet")
    newsletter = Newsletter(subject=body.subject, body=body.body, status="sending", recipients=len(recipients), created_by=admin.id)
    db.add(newsletter)
    db.commit()
    threading.Thread(target=_send_all, args=(newsletter.id,), name=f"newsletter-{newsletter.id}", daemon=True).start()
    return {"id": newsletter.id, "recipients": len(recipients)}
