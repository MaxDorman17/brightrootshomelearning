"""Phone and browser notifications (Web Push).

The signing keys (VAPID) are made once and kept in the database, so there is nothing to set
up in Coolify and notifications keep working across redeploys.
"""
import base64
import hashlib
import json
import logging
import threading

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from config import settings
from database import SessionLocal
from models import AppSetting, PushSubscription

logger = logging.getLogger(__name__)

_keys: tuple[str, str] | None = None
_signer = None
_lock = threading.Lock()


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def endpoint_hash(endpoint: str) -> str:
    return hashlib.sha256(endpoint.encode()).hexdigest()


def vapid_keys() -> tuple[str, str]:
    """(public key for browsers, private key PEM), created on first use."""
    global _keys
    if _keys:
        return _keys
    with _lock:
        if _keys:
            return _keys
        db = SessionLocal()
        try:
            row = db.get(AppSetting, "vapid")
            if row is None:
                private = ec.generate_private_key(ec.SECP256R1())
                pem = private.private_bytes(
                    serialization.Encoding.PEM,
                    serialization.PrivateFormat.PKCS8,
                    serialization.NoEncryption(),
                ).decode()
                db.add(AppSetting(name="vapid", value=pem))
                try:
                    db.commit()
                except IntegrityError:  # another worker made them first
                    db.rollback()
                row = db.get(AppSetting, "vapid")
            private = serialization.load_pem_private_key(row.value.encode(), password=None)
            public = private.public_key().public_bytes(
                serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint
            )
            _keys = (_b64(public), row.value)
            return _keys
        finally:
            db.close()


def _subject() -> str:
    admin = next((e.strip() for e in settings.ADMIN_EMAILS.split(",") if e.strip()), "")
    return f"mailto:{admin or 'hello@brightrootshomelearning.co.uk'}"


def send_to_user(db: Session, user_id: int, title: str, body: str, url: str = "/app", tag: str | None = None) -> int:
    """Send a notification to every device this user turned notifications on for. Returns how many worked."""
    from pywebpush import WebPushException, webpush

    global _signer
    subs = db.query(PushSubscription).filter(PushSubscription.user_id == user_id).all()
    if not subs:
        return 0
    if _signer is None:
        from py_vapid import Vapid

        _signer = Vapid.from_pem(vapid_keys()[1].encode())
    payload = json.dumps({"title": title, "body": body, "url": url, "tag": tag})
    sent = 0
    for sub in subs:
        try:
            webpush(
                subscription_info={"endpoint": sub.endpoint, "keys": {"p256dh": sub.p256dh, "auth": sub.auth}},
                data=payload,
                vapid_private_key=_signer,
                vapid_claims={"sub": _subject()},
                ttl=60 * 60 * 12,
                timeout=10,
            )
            sent += 1
        except WebPushException as exc:
            status = getattr(exc.response, "status_code", None)
            if status in (404, 410):  # the device turned notifications off or was reset
                db.delete(sub)
                db.commit()
            else:
                logger.warning("Push to user %s failed: %s", user_id, exc)
        except Exception:
            logger.exception("Push to user %s failed", user_id)
    return sent


def notify_in_background(user_id: int, title: str, body: str, url: str = "/app", tag: str | None = None) -> None:
    """Fire and forget, so a slow push service never holds up a request."""

    def run():
        db = SessionLocal()
        try:
            send_to_user(db, user_id, title, body, url, tag)
        except Exception:
            logger.exception("Background push failed")
        finally:
            db.close()

    threading.Thread(target=run, daemon=True).start()
