"""Small helpers shared by sign-up (routers/auth.py) and the newsletter router."""
import secrets
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session, object_session

from config import settings
from models import NewsletterSubscriber, User


def admin_emails() -> set[str]:
    return {e.strip().lower() for e in settings.ADMIN_EMAILS.split(",") if e.strip()}


def is_admin(user: User) -> bool:
    """Whether the person logged in is a site owner. Takes the request's user or `actor(user)`.

    A main parent counts once their address is confirmed: otherwise anyone could sign up with an owner's email.
    A second grown-up can't confirm their address, so they count only when they were added to a family whose
    main parent is an owner too. Nobody else can add a grown-up to that family.
    """
    me = getattr(user, "acting_user", None) or user
    if me.role == "parent":
        return _confirmed_owner(me)
    if me.role != "coparent" or not me.family_owner_id or not me.email or me.email.lower() not in admin_emails():
        return False
    owner = user if user is not me and user.id == me.family_owner_id else None
    if owner is None:
        db = object_session(me)
        owner = db.get(User, me.family_owner_id) if db else None
    return owner is not None and owner.role == "parent" and _confirmed_owner(owner)


def _confirmed_owner(parent: User) -> bool:
    return bool(parent.email) and parent.email_verified_at is not None and parent.email.lower() in admin_emails()


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
