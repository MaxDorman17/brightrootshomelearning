"""A handful of totals for the owner's own dashboard (his "mission control" board at home).

Counts only: no names, emails or anything about a child. The board asks with a secret key
(OWNER_NUMBERS_KEY). Until that key is set on the server, this address doesn't exist.
"""
import hmac
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import NewsletterSubscriber, User

router = APIRouter(prefix="/api/owner", tags=["owner"])


def _require_key(authorization: str = Header(default="")) -> None:
    key = settings.OWNER_NUMBERS_KEY
    if not key:
        raise HTTPException(status_code=404, detail="Not found")
    given = authorization[7:] if authorization.lower().startswith("bearer ") else ""
    if not hmac.compare_digest(given.encode(), key.encode()):
        raise HTTPException(status_code=401, detail="Wrong key")


@router.get("/numbers")
def numbers(db: Session = Depends(get_db), _: None = Depends(_require_key)):
    now = datetime.utcnow()
    families = db.query(User).filter(User.role == "parent")

    def status(*names):
        return families.filter(User.subscription_status.in_(names))

    return {
        "families": families.count(),
        # Paying now, including anyone who has cancelled but still has time left that they paid for.
        "members": status("active").count()
        + status("canceling").filter(User.subscription_cancel_at > now).count(),
        "on_trial": status("trialing").filter(User.trial_ends_at > now).count(),
        "free_accounts": status("grandfathered").count(),
        "trial_ended": status("trialing").filter((User.trial_ends_at == None) | (User.trial_ends_at <= now)).count(),  # noqa: E711
        "cancelled": status("canceled").count(),
        "new_families_7_days": families.filter(User.created_at >= now - timedelta(days=7)).count(),
        "children": db.query(User).filter(User.role == "child").count(),
        "newsletter_subscribers": db.query(NewsletterSubscriber).filter(NewsletterSubscriber.status == "subscribed").count(),
        "as_of": now.isoformat(timespec="seconds") + "Z",
    }
