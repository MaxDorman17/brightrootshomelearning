"""Nightly backups of the database and uploaded files to storage away from the server.

What is kept:
  database/brightroots-YYYY-MM-DD-HHMM.db.gz   a full copy of the database, one per run, kept for BACKUP_KEEP_DAYS
  uploads/<kind>/<file>                        a mirror of every uploaded photo and file

The storage is any S3-compatible bucket (Scaleway Object Storage, for example), set with the BACKUP_S3_*
settings. Files a family deletes are removed from the mirror at the next run, and old database copies are
removed after BACKUP_KEEP_DAYS, so deleted information leaves the backups within that time.

To get everything back, see restore_backup.py.
"""
import gzip
import logging
import os
import re
import shutil
import sqlite3
import tempfile
import threading
import time
from datetime import date, datetime, timedelta
from typing import Dict, List, Optional
from zoneinfo import ZoneInfo

from sqlalchemy.exc import IntegrityError

from config import settings
from database import SessionLocal, engine
from models import BackupRun
from storage import UPLOAD_ROOT

logger = logging.getLogger(__name__)

DB_PREFIX = "database/"
UPLOAD_PREFIX = "uploads/"
DB_NAME = re.compile(r"brightroots-(\d{4}-\d{2}-\d{2})-\d{4}\.db\.gz$")
CHECK_EVERY_SECONDS = 600
KEEP_AT_LEAST = 3  # database copies never removed, however old
UK = ZoneInfo("Europe/London")


def configured() -> bool:
    return bool(settings.BACKUP_S3_BUCKET and settings.BACKUP_S3_ACCESS_KEY and settings.BACKUP_S3_SECRET_KEY and settings.BACKUP_S3_ENDPOINT)


class S3Store:
    """A bucket on any S3-compatible service."""

    def __init__(self) -> None:
        import boto3  # only needed when backups are switched on
        from botocore.config import Config

        self.bucket = settings.BACKUP_S3_BUCKET
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.BACKUP_S3_ENDPOINT,
            region_name=settings.BACKUP_S3_REGION or None,
            aws_access_key_id=settings.BACKUP_S3_ACCESS_KEY,
            aws_secret_access_key=settings.BACKUP_S3_SECRET_KEY,
            # Newer versions add extra checksums that only Amazon's own storage accepts; ask for them only when required.
            config=Config(request_checksum_calculation="when_required", response_checksum_validation="when_required"),
        )

    def put_file(self, key: str, path: str) -> None:
        self.client.upload_file(path, self.bucket, key)

    def get_file(self, key: str, path: str) -> None:
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        self.client.download_file(self.bucket, key, path)

    def list(self, prefix: str) -> Dict[str, int]:
        found: Dict[str, int] = {}
        for page in self.client.get_paginator("list_objects_v2").paginate(Bucket=self.bucket, Prefix=prefix):
            for item in page.get("Contents", []):
                found[item["Key"]] = item["Size"]
        return found

    def delete(self, keys: List[str]) -> None:
        for start in range(0, len(keys), 500):
            self.client.delete_objects(Bucket=self.bucket, Delete={"Objects": [{"Key": k} for k in keys[start:start + 500]]})


class FolderStore:
    """The same thing in a folder on disk. Used by the tests, and handy for trying a restore."""

    def __init__(self, root: str) -> None:
        self.root = root

    def _path(self, key: str) -> str:
        return os.path.join(self.root, *key.split("/"))

    def put_file(self, key: str, path: str) -> None:
        os.makedirs(os.path.dirname(self._path(key)), exist_ok=True)
        shutil.copyfile(path, self._path(key))

    def get_file(self, key: str, path: str) -> None:
        os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
        shutil.copyfile(self._path(key), path)

    def list(self, prefix: str) -> Dict[str, int]:
        found: Dict[str, int] = {}
        for folder, _dirs, files in os.walk(self.root):
            for name in files:
                full = os.path.join(folder, name)
                key = os.path.relpath(full, self.root).replace(os.sep, "/")
                if key.startswith(prefix):
                    found[key] = os.path.getsize(full)
        return found

    def delete(self, keys: List[str]) -> None:
        for key in keys:
            try:
                os.remove(self._path(key))
            except FileNotFoundError:
                pass


def _local_uploads() -> dict[str, tuple[str, int]]:
    """Every uploaded file: bucket key -> (path on disk, size)."""
    found: dict[str, tuple[str, int]] = {}
    if not os.path.isdir(UPLOAD_ROOT):
        return found
    for folder, _dirs, files in os.walk(UPLOAD_ROOT):
        for name in files:
            full = os.path.join(folder, name)
            key = UPLOAD_PREFIX + os.path.relpath(full, UPLOAD_ROOT).replace(os.sep, "/")
            try:
                found[key] = (full, os.path.getsize(full))
            except OSError:
                continue
    return found


def _database_copy(folder: str) -> Optional[str]:
    """A consistent, compressed copy of the database, taken while the site keeps running."""
    db_path = engine.url.database
    if engine.dialect.name != "sqlite" or not db_path or db_path == ":memory:" or not os.path.exists(db_path):
        return None
    plain = os.path.join(folder, "copy.db")
    source = sqlite3.connect(db_path)
    try:
        target = sqlite3.connect(plain)
        try:
            source.backup(target)
        finally:
            target.close()
    finally:
        source.close()
    packed = plain + ".gz"
    with open(plain, "rb") as src, gzip.open(packed, "wb", compresslevel=6) as dst:
        shutil.copyfileobj(src, dst)
    os.remove(plain)
    return packed


def run_backup(store, now: Optional[datetime] = None) -> dict:
    """Do one backup and return what happened. Raises if the database copy can't be saved."""
    now = now or datetime.now(UK)
    result = {"database": None, "database_bytes": 0, "files_total": 0, "files_uploaded": 0, "files_removed": 0, "old_copies_removed": 0}

    with tempfile.TemporaryDirectory() as folder:
        packed = _database_copy(folder)
        if packed:
            key = f"{DB_PREFIX}brightroots-{now.strftime('%Y-%m-%d-%H%M')}.db.gz"
            store.put_file(key, packed)
            result["database"], result["database_bytes"] = key, os.path.getsize(packed)

    local = _local_uploads()
    remote = store.list(UPLOAD_PREFIX)
    result["files_total"] = len(local)
    for key, (path, size) in local.items():
        if remote.get(key) != size:
            store.put_file(key, path)
            result["files_uploaded"] += 1
    # Files deleted on the site leave the backup too. If most of the files have vanished at once, something is
    # wrong with the server's disk, so nothing is removed and the backup stays whole.
    gone = [key for key in remote if key not in local]
    if gone and len(local) >= len(remote) * 0.5:
        store.delete(gone)
        result["files_removed"] = len(gone)

    cutoff = (now.date() - timedelta(days=settings.BACKUP_KEEP_DAYS)).isoformat()
    copies = sorted(k for k in store.list(DB_PREFIX) if DB_NAME.search(k))
    old = [k for k in copies[:-KEEP_AT_LEAST] if DB_NAME.search(k).group(1) < cutoff]
    if old:
        store.delete(old)
        result["old_copies_removed"] = len(old)
    return result


def _describe(result: dict) -> str:
    size = result["database_bytes"]
    size_text = f"{size / 1_048_576:.1f} MB" if size >= 1_048_576 else f"{max(1, size // 1024)} KB"
    parts = [f"Database saved ({size_text})" if result["database"] else "No database file to save"]
    parts.append(f"{result['files_total']} uploaded file{'' if result['files_total'] == 1 else 's'} checked, {result['files_uploaded']} copied")
    if result["files_removed"]:
        parts.append(f"{result['files_removed']} deleted file{'' if result['files_removed'] == 1 else 's'} removed")
    if result["old_copies_removed"]:
        parts.append(f"{result['old_copies_removed']} old database cop{'y' if result['old_copies_removed'] == 1 else 'ies'} removed")
    return ". ".join(parts) + "."


def run_and_record(kind: str, store=None, claim: Optional[str] = None) -> Optional[int]:
    """Run a backup and write down how it went. With a `claim`, only the first caller for that claim runs."""
    db = SessionLocal()
    try:
        row = BackupRun(kind=kind, claim=claim, started_at=datetime.utcnow(), status="running")
        db.add(row)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            return None  # another server process already took today's backup
        db.refresh(row)
        try:
            result = run_backup(store or S3Store())
            row.status, row.detail = "ok", _describe(result)
        except Exception as exc:
            logger.exception("Backup failed")
            row.status, row.detail = "failed", f"{type(exc).__name__}: {exc}"[:1000]
        row.finished_at = datetime.utcnow()
        db.commit()
        return row.id
    finally:
        db.close()


_scheduler_started = False


def start_scheduler() -> None:
    """Once a day, after BACKUP_HOUR (UK time), run the backup if today's hasn't been done."""
    global _scheduler_started
    if _scheduler_started:
        return
    _scheduler_started = True

    def loop():
        while True:
            try:
                now = datetime.now(UK)
                if configured() and now.hour >= settings.BACKUP_HOUR:
                    run_and_record("nightly", claim=f"nightly-{now.date().isoformat()}")
            except Exception:
                logger.exception("Backup check failed")
            time.sleep(CHECK_EVERY_SECONDS)

    threading.Thread(target=loop, name="backups", daemon=True).start()


def latest_database_key(store, day: Optional[date] = None) -> Optional[str]:
    copies = sorted(k for k in store.list(DB_PREFIX) if DB_NAME.search(k))
    if day:
        copies = [k for k in copies if DB_NAME.search(k).group(1) <= day.isoformat()]
    return copies[-1] if copies else None


def restore(store, folder: str, day: Optional[date] = None) -> dict:
    """Download a database copy and every uploaded file into `folder`, ready to put on a server."""
    os.makedirs(folder, exist_ok=True)
    key = latest_database_key(store, day)
    if not key:
        raise RuntimeError("No database copy found in the backup")
    packed = os.path.join(folder, "database.db.gz")
    store.get_file(key, packed)
    with gzip.open(packed, "rb") as src, open(os.path.join(folder, "homeschool.db"), "wb") as dst:
        shutil.copyfileobj(src, dst)
    os.remove(packed)
    files = store.list(UPLOAD_PREFIX)
    for file_key in files:
        store.get_file(file_key, os.path.join(folder, *file_key.split("/")))
    return {"database": key, "files": len(files)}
