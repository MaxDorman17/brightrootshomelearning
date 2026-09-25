import hashlib
import hmac
import json
import time
from datetime import datetime
from typing import Literal

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_authenticated_user
from config import settings
from database import get_db
from models import User

router = APIRouter(prefix="/api/billing", tags=["billing"])


class CheckoutRequest(BaseModel):
    plan: Literal["monthly", "yearly"]


def _stripe_headers() -> dict:
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Billing is not configured yet.",
        )
    return {
        "Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}",
        "Content-Type": "application/x-www-form-urlencoded",
    }


def _price_for_plan(plan: str) -> str:
    if plan == "monthly":
        return settings.STRIPE_MONTHLY_PRICE_ID
    if plan == "yearly":
        return settings.STRIPE_YEARLY_PRICE_ID
    raise HTTPException(status_code=400, detail="Invalid billing plan")


def _stripe_post(path: str, data: dict[str, str]) -> dict:
    response = httpx.post(
        f"https://api.stripe.com/v1/{path}",
        headers=_stripe_headers(),
        data=data,
        timeout=15.0,
    )
    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Stripe could not start checkout. Please try again.",
        )
    return response.json()


def _stripe_get(path: str) -> dict:
    response = httpx.get(
        f"https://api.stripe.com/v1/{path}",
        headers={"Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}"},
        timeout=15.0,
    )
    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Stripe could not load subscription details. Please try again.",
        )
    return response.json()


def _apply_subscription_state(user: User, obj: dict) -> None:
    user.stripe_customer_id = obj.get("customer") or user.stripe_customer_id
    user.stripe_subscription_id = obj.get("id") or user.stripe_subscription_id
    user.billing_plan = (obj.get("metadata") or {}).get("plan") or user.billing_plan

    cancel_at_period_end = bool(obj.get("cancel_at_period_end"))
    cancel_at = obj.get("cancel_at")
    if not cancel_at and cancel_at_period_end:
        cancel_at = obj.get("trial_end") or obj.get("current_period_end")

    user.subscription_cancel_at_period_end = cancel_at_period_end or bool(cancel_at)
    user.subscription_cancel_at = (
        datetime.fromtimestamp(cancel_at) if cancel_at else None
    )

    stripe_status = obj.get("status")
    if user.subscription_cancel_at_period_end and user.subscription_cancel_at:
        user.subscription_status = "canceling"
    elif stripe_status == "trialing":
        user.subscription_status = "trialing"
        if obj.get("trial_end"):
            user.trial_ends_at = datetime.fromtimestamp(obj["trial_end"])
    elif stripe_status == "active":
        user.subscription_status = "active"
    elif stripe_status in {"past_due", "unpaid", "incomplete", "incomplete_expired"}:
        user.subscription_status = stripe_status
    elif stripe_status == "canceled":
        user.subscription_status = "canceled"


@router.post("/checkout")
def create_checkout(
    body: CheckoutRequest,
    current_user: User = Depends(get_authenticated_user),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")
    if current_user.email_verified_at is None:
        raise HTTPException(status_code=403, detail="Please verify your email address first")

    if current_user.subscription_status in {"active", "grandfathered"}:
        raise HTTPException(status_code=400, detail="This account already has active access")
    if current_user.stripe_subscription_id:
        raise HTTPException(status_code=400, detail="A Stripe subscription is already attached to this account")

    price_id = _price_for_plan(body.plan)
    frontend = settings.FRONTEND_URL.rstrip("/")

    data: dict[str, str] = {
        "mode": "subscription",
        "line_items[0][price]": price_id,
        "line_items[0][quantity]": "1",
        "success_url": f"{frontend}/billing/success?session_id={{CHECKOUT_SESSION_ID}}",
        "cancel_url": f"{frontend}/billing?cancelled=1",
        "client_reference_id": str(current_user.id),
        "customer_email": current_user.email,
        "metadata[user_id]": str(current_user.id),
        "metadata[plan]": body.plan,
        "subscription_data[metadata][user_id]": str(current_user.id),
        "subscription_data[metadata][plan]": body.plan,
        "allow_promotion_codes": "true",
    }

    if current_user.trial_ends_at:
        trial_end = int(current_user.trial_ends_at.timestamp())
        if trial_end > int(time.time()) + 60:
            data["subscription_data[trial_end]"] = str(trial_end)

    session = _stripe_post("checkout/sessions", data)
    return {"url": session["url"]}


@router.post("/sync")
def sync_subscription(
    current_user: User = Depends(get_authenticated_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")
    if not current_user.stripe_subscription_id:
        return {"synced": False}

    subscription = _stripe_get(f"subscriptions/{current_user.stripe_subscription_id}")
    _apply_subscription_state(current_user, subscription)
    db.commit()
    db.refresh(current_user)
    return {
        "synced": True,
        "subscription_status": current_user.subscription_status,
        "billing_plan": current_user.billing_plan,
        "subscription_cancel_at_period_end": current_user.subscription_cancel_at_period_end,
        "subscription_cancel_at": current_user.subscription_cancel_at,
    }


@router.post("/portal")
def create_portal(
    current_user: User = Depends(get_authenticated_user),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No Stripe billing account exists yet")

    frontend = settings.FRONTEND_URL.rstrip("/")
    session = _stripe_post(
        "billing_portal/sessions",
        {
            "customer": current_user.stripe_customer_id,
            "return_url": f"{frontend}/account",
        },
    )
    return {"url": session["url"]}


def _verify_stripe_signature(payload: bytes, signature_header: str) -> bool:
    if not settings.STRIPE_WEBHOOK_SECRET:
        return False

    timestamp = None
    signatures = []

    for part in signature_header.split(","):
        key, _, value = part.partition("=")
        if key == "t":
            timestamp = value
        elif key == "v1":
            signatures.append(value)

    if not timestamp or not signatures:
        return False

    try:
        if abs(time.time() - int(timestamp)) > 300:
            return False
    except ValueError:
        return False

    signed_payload = timestamp.encode() + b"." + payload
    expected = hmac.new(
        settings.STRIPE_WEBHOOK_SECRET.encode(),
        signed_payload,
        hashlib.sha256,
    ).hexdigest()

    return any(hmac.compare_digest(expected, candidate) for candidate in signatures)


def _user_from_object(db: Session, obj: dict) -> User | None:
    metadata = obj.get("metadata") or {}
    user_id = metadata.get("user_id")

    if user_id:
        try:
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user:
                return user
        except (TypeError, ValueError):
            pass

    customer_id = obj.get("customer")
    if customer_id:
        return db.query(User).filter(User.stripe_customer_id == customer_id).first()

    subscription_id = obj.get("id") if obj.get("object") == "subscription" else obj.get("subscription")
    if subscription_id:
        return db.query(User).filter(User.stripe_subscription_id == subscription_id).first()

    return None


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.body()
    signature = request.headers.get("stripe-signature", "")

    if not _verify_stripe_signature(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")

    event = json.loads(payload.decode("utf-8"))
    event_type = event.get("type")
    obj = (event.get("data") or {}).get("object") or {}

    if event_type == "checkout.session.completed":
        user = _user_from_object(db, obj)
        if user:
            user.stripe_customer_id = obj.get("customer") or user.stripe_customer_id
            user.stripe_subscription_id = obj.get("subscription") or user.stripe_subscription_id
            user.billing_plan = (obj.get("metadata") or {}).get("plan") or user.billing_plan
            if user.trial_ends_at and user.trial_ends_at.timestamp() > time.time():
                user.subscription_status = "trialing"
            else:
                user.subscription_status = "active"
            db.commit()

    elif event_type in {
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
    }:
        user = _user_from_object(db, obj)
        if user:
            if event_type == "customer.subscription.deleted":
                user.subscription_status = "canceled"
                user.subscription_cancel_at_period_end = False
                user.subscription_cancel_at = None
                user.stripe_subscription_id = None
            else:
                _apply_subscription_state(user, obj)
            db.commit()

    return {"received": True}
