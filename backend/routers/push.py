from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import PushSubscription, User
from push import endpoint_hash, send_to_user, vapid_keys

router = APIRouter(prefix="/api/push", tags=["push"])


class Keys(BaseModel):
    p256dh: str
    auth: str


class SubscriptionIn(BaseModel):
    endpoint: str
    keys: Keys

    @field_validator("endpoint")
    @classmethod
    def valid_endpoint(cls, value: str) -> str:
        if not value.startswith("https://") or len(value) > 2000:
            raise ValueError("Invalid endpoint")
        return value


class EndpointIn(BaseModel):
    endpoint: str


@router.get("/key")
def public_key():
    return {"key": vapid_keys()[0]}


@router.post("/status")
def status(body: EndpointIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Whether this device is set up to get this user's notifications."""
    sub = db.query(PushSubscription).filter(PushSubscription.endpoint_hash == endpoint_hash(body.endpoint)).first()
    return {"subscribed": bool(sub and sub.user_id == current_user.id)}


@router.post("/subscribe")
def subscribe(body: SubscriptionIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    h = endpoint_hash(body.endpoint)
    sub = db.query(PushSubscription).filter(PushSubscription.endpoint_hash == h).first()
    if sub is None:
        sub = PushSubscription(endpoint=body.endpoint, endpoint_hash=h)
        db.add(sub)
    # A shared tablet belongs to whoever turned notifications on last.
    sub.user_id = current_user.id
    sub.p256dh = body.keys.p256dh[:255]
    sub.auth = body.keys.auth[:255]
    db.commit()
    return {"ok": True}


@router.post("/unsubscribe")
def unsubscribe(body: EndpointIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(PushSubscription).filter(
        PushSubscription.endpoint_hash == endpoint_hash(body.endpoint),
        PushSubscription.user_id == current_user.id,
    ).delete()
    db.commit()
    return {"ok": True}


@router.post("/test")
def test(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sent = send_to_user(
        db,
        current_user.id,
        "Notifications are on 🌱",
        "This is how Bright Roots reminders will look.",
        "/app",
        "test",
    )
    if not sent:
        raise HTTPException(status_code=400, detail="This device isn't set up for notifications yet.")
    return {"sent": sent}
