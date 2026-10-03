"""Help and feedback: a parent tells the owner about a problem, makes a suggestion or leaves a review.

Each message is emailed to the support inbox (reply goes straight back to the parent) and a copy is kept,
so nothing is lost if the email doesn't arrive.
"""
import html
import logging
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

import emails
from auth import actor, get_authenticated_user
from config import settings
from database import get_db
from models import SupportMessage, User
from newsletter_access import is_admin

router = APIRouter(prefix="/api/support", tags=["support"])
logger = logging.getLogger(__name__)

KINDS = {"problem": "A problem", "suggestion": "A suggestion", "review": "A review", "question": "A question"}
MAX_PER_DAY = 10


class MessageIn(BaseModel):
    kind: str
    message: str
    rating: Optional[int] = None  # 1 to 5 stars, for a review
    can_publish: bool = False  # a review may be shown on the website
    display_name: Optional[str] = None  # the name to show with a published review
    page: Optional[str] = None  # where in the site they were, to help with a problem

    @field_validator("kind")
    @classmethod
    def known_kind(cls, value: str) -> str:
        if value not in KINDS:
            raise ValueError("Choose what your message is about")
        return value

    @field_validator("message")
    @classmethod
    def has_message(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 5:
            raise ValueError("Please write a little more")
        return value[:5000]

    @field_validator("rating")
    @classmethod
    def valid_rating(cls, value: Optional[int]) -> Optional[int]:
        if value is not None and not 1 <= value <= 5:
            raise ValueError("Stars are from 1 to 5")
        return value


def _require_grown_up(user: User = Depends(get_authenticated_user)) -> User:
    if user.role != "parent":
        raise HTTPException(status_code=403, detail="Ask a grown-up to send this")
    return user


def _out(row: SupportMessage, sender: Optional[User]) -> dict:
    return {
        "id": row.id,
        "kind": row.kind,
        "message": row.message,
        "rating": row.rating,
        "can_publish": bool(row.can_publish),
        "display_name": row.display_name,
        "page": row.page,
        "from_name": sender.username if sender else None,
        "from_email": row.reply_email,
        "emailed": bool(row.emailed),
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


@router.post("/messages", status_code=201)
def send_message(body: MessageIn, db: Session = Depends(get_db), current_user: User = Depends(_require_grown_up)):
    sender = actor(current_user)  # the grown-up actually logged in, so the reply goes to them
    since = datetime.utcnow() - timedelta(days=1)
    recent = db.query(SupportMessage).filter(SupportMessage.user_id == current_user.id, SupportMessage.created_at >= since).count()
    if recent >= MAX_PER_DAY:
        raise HTTPException(status_code=429, detail="That's a lot of messages for one day. Please email us instead.")

    is_review = body.kind == "review"
    row = SupportMessage(
        user_id=current_user.id,
        kind=body.kind,
        message=body.message,
        rating=body.rating if is_review else None,
        can_publish=bool(body.can_publish) if is_review else False,
        display_name=(" ".join((body.display_name or "").split())[:60] or None) if is_review else None,
        page=(body.page or "")[:200] or None,
        reply_email=sender.email,
        created_at=datetime.utcnow(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    if emails.configured() and settings.SUPPORT_EMAIL:
        stars = ("★" * row.rating + "☆" * (5 - row.rating)) if row.rating else ""
        details = [f"From: {html.escape(sender.username)} ({html.escape(sender.email or 'no email')})"]
        if stars:
            details.append(f"Stars: {stars}")
        if is_review:
            details.append("May be shown on the website: " + ("yes, as “" + html.escape(row.display_name or sender.username) + "”" if row.can_publish else "no"))
        if row.page:
            details.append(f"Page: {html.escape(row.page)}")
        body_html = (
            emails.panel(emails.paragraph(html.escape(row.message).replace("\n", "<br>")))
            + emails.paragraph("<br>".join(details), small=True)
            + emails.paragraph("Reply to this email to answer them directly.", small=True)
        )
        try:
            emails.send(
                settings.SUPPORT_EMAIL,
                f"{KINDS[row.kind]} from {sender.username}",
                emails.layout(KINDS[row.kind], body_html, eyebrow="Help and feedback"),
                reply_to=sender.email,
            )
            row.emailed = True
            db.commit()
        except Exception:
            logger.exception("Could not email support message %s", row.id)
    return {"id": row.id, "emailed": bool(row.emailed)}


@router.get("/messages")
def list_messages(db: Session = Depends(get_db), current_user: User = Depends(get_authenticated_user)):
    """Everything families have sent, newest first. Only the site owner can see this."""
    if not is_admin(actor(current_user)):
        raise HTTPException(status_code=403, detail="Only the site owner can do this")
    rows = db.query(SupportMessage).order_by(SupportMessage.created_at.desc()).limit(300).all()
    senders = {u.id: u for u in db.query(User).filter(User.id.in_([r.user_id for r in rows if r.user_id] or [0])).all()}
    return [_out(r, senders.get(r.user_id)) for r in rows]


@router.delete("/messages/{message_id}", status_code=204)
def delete_message(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_authenticated_user)):
    if not is_admin(actor(current_user)):
        raise HTTPException(status_code=403, detail="Only the site owner can do this")
    row = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(row)
    db.commit()
