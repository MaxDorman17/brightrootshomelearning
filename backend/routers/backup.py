"""Owner-only: see when backups last ran, and run one now."""
import threading
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import backups
from auth import actor, get_authenticated_user
from config import settings
from database import get_db
from models import BackupRun, User
from newsletter_access import is_admin

router = APIRouter(prefix="/api/backup", tags=["backup"])


def _require_owner(user: User = Depends(get_authenticated_user)) -> User:
    if not is_admin(actor(user)):
        raise HTTPException(status_code=403, detail="Only the site owner can do this")
    return user


def _out(row: BackupRun) -> dict:
    return {
        "id": row.id,
        "kind": row.kind,
        "status": row.status,
        "detail": row.detail,
        "started_at": row.started_at.isoformat() + "Z" if row.started_at else None,
        "finished_at": row.finished_at.isoformat() + "Z" if row.finished_at else None,
    }


@router.get("/status")
def status(db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    runs = db.query(BackupRun).order_by(BackupRun.started_at.desc()).limit(15).all()
    last_ok = db.query(BackupRun).filter(BackupRun.status == "ok").order_by(BackupRun.started_at.desc()).first()
    return {
        "configured": backups.configured(),
        "bucket": settings.BACKUP_S3_BUCKET or None,
        "endpoint": settings.BACKUP_S3_ENDPOINT or None,
        "keep_days": settings.BACKUP_KEEP_DAYS,
        "hour": settings.BACKUP_HOUR,
        "last_ok": _out(last_ok) if last_ok else None,
        "runs": [_out(r) for r in runs],
    }


@router.post("/run", status_code=202)
def run_now(db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    if not backups.configured():
        raise HTTPException(status_code=400, detail="Backups aren't set up yet. Add the storage settings on the server first.")
    recent = datetime.utcnow() - timedelta(minutes=30)
    if db.query(BackupRun).filter(BackupRun.status == "running", BackupRun.started_at >= recent).first():
        raise HTTPException(status_code=409, detail="A backup is already running")
    # It can take a while the first time (every photo is copied), so it runs in the background.
    threading.Thread(target=backups.run_and_record, args=("manual",), name="backup-now", daemon=True).start()
    return {"started": True}
