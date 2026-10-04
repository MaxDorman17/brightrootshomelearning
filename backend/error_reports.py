"""Tells the owner when the server hits an unexpected error, by sending a short report to our own
GlitchTip server. Off until GLITCHTIP_DSN is filled in.

A report holds the kind of error, its message, where in the code it happened, and which route was
being served (the route's pattern, such as /api/children/{child_id}, never the real address). It
never holds what a family typed, their cookies, their names or their IP address.
"""
import logging
import threading
import time
import traceback
import uuid
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urlparse

import httpx

from config import settings

log = logging.getLogger("error_reports")

MAX_PER_MINUTE = 20
_sent_at: list = []
_lock = threading.Lock()


def _endpoint(dsn: str):
    """Turn a DSN (https://KEY@host/PROJECT) into the address and key that reports are posted with."""
    parts = urlparse(dsn)
    project = parts.path.strip("/")
    if not (parts.scheme and parts.hostname and parts.username and project):
        return None
    host = parts.hostname + (f":{parts.port}" if parts.port else "")
    return f"{parts.scheme}://{host}/api/{project}/store/", parts.username


def configured() -> bool:
    return bool(settings.GLITCHTIP_DSN and _endpoint(settings.GLITCHTIP_DSN))


def build_event(exc: BaseException, method: str = "", route: str = "") -> dict:
    frames = [
        {
            "filename": frame.filename.replace("\\", "/").split("/backend/")[-1],
            "function": frame.name,
            "lineno": frame.lineno,
            "context_line": frame.line or "",
            "in_app": "site-packages" not in frame.filename,
        }
        for frame in traceback.extract_tb(exc.__traceback__)
    ]
    return {
        "event_id": uuid.uuid4().hex,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "platform": "python",
        "level": "error",
        "logger": "backend",
        "transaction": f"{method} {route}".strip(),
        "tags": {"route": route, "method": method},
        "exception": {
            "values": [
                {
                    "type": type(exc).__name__,
                    "value": str(exc)[:500],
                    "stacktrace": {"frames": frames},
                }
            ]
        },
    }


def _allowed() -> bool:
    """A burst of the same failure shouldn't flood the inbox."""
    now = time.time()
    with _lock:
        _sent_at[:] = [t for t in _sent_at if now - t < 60]
        if len(_sent_at) >= MAX_PER_MINUTE:
            return False
        _sent_at.append(now)
        return True


def send(event: dict) -> bool:
    target = _endpoint(settings.GLITCHTIP_DSN)
    if not target:
        return False
    url, key = target
    try:
        response = httpx.post(
            url,
            json=event,
            headers={"X-Sentry-Auth": f"Sentry sentry_version=7, sentry_key={key}, sentry_client=brightroots/1.0"},
            timeout=5,
        )
        return response.status_code < 300
    except Exception as error:  # reporting must never cause a second failure
        log.warning("Could not send an error report: %s", error)
        return False


def report(exc: BaseException, method: str = "", route: str = "") -> Optional[threading.Thread]:
    """Send a report in the background, so the family's request isn't held up."""
    if not configured() or not _allowed():
        return None
    thread = threading.Thread(target=send, args=(build_event(exc, method, route),), daemon=True)
    thread.start()
    return thread
