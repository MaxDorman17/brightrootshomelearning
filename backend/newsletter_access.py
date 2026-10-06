"""Small helpers shared by sign-up (routers/auth.py) and the newsletter router."""
import secrets
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from config import settings
from models import NewsletterSubscriber, User


def admin_emails() -> set[str]:
    return {e.strip().lower() for e in settings.ADMIN_EMAILS.split(",") if e.strip()}


def is_admin(user: User) -> bool:
    # Only once the address is confirmed: otherwise anyone could sign up with an owner's email.
    return (
        user.role == "parent"
        and bool(user.email)
        and user.email_verified_at is not None
        and user.email.lower() in admin_emails()
    )


def find_subscriber(db: Session, email: str):
    return db.query(NewsletterSubscriber).filter(func.lower(NewsletterSubscriber.email) == email.strip().lower()).first()


def subscribe_member(db: Session, user: User, subscribed: bool = True) -> NewsletterSubscriber:
    """Record a parent's newsletter choice. Their account email is verified separately at sign-up."""
    row = find_subscriber(db, user.email)
    now = datetime.utcnow()
    if not row:
        row = NewsletterSubscriber(email=user.email.strip().lower(), token=secrets.token_urlsafe(32), source="member")
        db.add(row)
    row.user_id = user.id
    row.source = "member"
    if subscribed:
        row.status = "subscribed"
        row.confirmed_at = row.confirmed_at or now
        row.unsubscribed_at = None
    else:
        row.status = "unsubscribed"
        row.unsubscribed_at = now
    db.commit()
    return row
