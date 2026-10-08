"""Owner-only: give a family free membership, or take it away again.

A free family has the subscription status "grandfathered", the same as the families who were here before
memberships began: everything works and they are never asked to pay.
"""
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import actor, get_authenticated_user
from database import get_db
from models import User
from newsletter_access import is_admin

router = APIRouter(prefix="/api/admin/free-accounts", tags=["admin"])

FREE = "grandfathered"


def _require_owner(user: User = Depends(get_authenticated_user)) -> User:
    if not is_admin(actor(user)):
        raise HTTPException(status_code=403, detail="Only the site owner can do this")
    return user


def _out(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat() + "Z" if user.created_at else None,
    }


class GiveFreeIn(BaseModel):
    email: str


@router.get("")
def list_free(db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    families = (
        db.query(User)
        .filter(User.role == "parent", User.subscription_status == FREE, User.is_demo.is_not(True))
        .order_by(func.lower(User.username))
        .all()
    )
    return [_out(u) for u in families]


@router.post("")
def give_free(body: GiveFreeIn, db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    email = body.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email).first() if email else None
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="Nobody has signed up with that email yet. Ask them to sign up first (the free trial needs no card), then add them here.",
        )
    if user.role != "parent" or user.is_demo:
        raise HTTPException(status_code=400, detail="That email belongs to a child or a second grown-up. Use the main account holder's email.")
    if user.subscription_status == FREE:
        raise HTTPException(status_code=400, detail=f"{user.username} already has a free account.")
    if user.stripe_subscription_id and user.subscription_status != "canceled":
        raise HTTPException(
            status_code=400,
            detail=f"{user.username} has a paid membership in Stripe. Cancel it in Stripe first so they aren't charged, then add them here.",
        )
    user.subscription_status = FREE
    db.commit()
    return _out(user)


@router.delete("/{user_id}")
def take_away_free(user_id: int, db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    user = db.query(User).filter(User.id == user_id, User.role == "parent", User.subscription_status == FREE).first()
    if user is None:
        raise HTTPException(status_code=404, detail="That family doesn't have a free account")
    # Back to wherever their free trial got to: any days left are theirs, otherwise they're asked to choose a membership.
    user.subscription_status = "trialing"
    now = datetime.utcnow()
    if not user.trial_ends_at or user.trial_ends_at < now:
        user.trial_ends_at = now
    db.commit()
    return {"ok": True}
