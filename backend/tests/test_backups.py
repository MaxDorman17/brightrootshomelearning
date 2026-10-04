"""Off-site backups: a full backup, the nightly rules, and getting everything back."""
import os
import sqlite3
import tempfile
from datetime import date, datetime, timedelta

from conftest import PASSWORD, sign_up


def _store():
    import backups

    return backups.FolderStore(tempfile.mkdtemp(prefix="brightroots-backup-"))


def _upload(name: str, content: bytes = b"photo") -> str:
    from storage import upload_dir

    path = os.path.join(upload_dir("moments"), name)
    with open(path, "wb") as f:
        f.write(content)
    return path


def test_backup_then_restore_brings_everything_back(family):
    import backups

    child = family.add_child("Backed Up")
    photo = _upload("backup-test-photo.jpg", b"a lovely photo")
    store = _store()
    result = backups.run_backup(store)
    assert result["database"].startswith("database/brightroots-") and result["database_bytes"] > 100
    assert result["files_uploaded"] >= 1

    restored = tempfile.mkdtemp(prefix="brightroots-restore-")
    got = backups.restore(store, restored)
    assert got["files"] >= 1
    with open(os.path.join(restored, "uploads", "moments", "backup-test-photo.jpg"), "rb") as f:
        assert f.read() == b"a lovely photo"
    names = [r[0] for r in sqlite3.connect(os.path.join(restored, "homeschool.db")).execute("select username from users where id = ?", (child["id"],))]
    assert names == ["Backed Up"]
    os.remove(photo)


def test_second_backup_only_copies_what_changed_and_removes_deleted_files(family):
    import backups

    kept, doomed = _upload("backup-keep.jpg"), _upload("backup-delete-me.jpg")
    store = _store()
    backups.run_backup(store)
    again = backups.run_backup(store, datetime.now(backups.UK) + timedelta(minutes=1))
    assert again["files_uploaded"] == 0  # nothing changed
    os.remove(doomed)
    with open(kept, "wb") as f:
        f.write(b"a changed photo, now longer")
    third = backups.run_backup(store, datetime.now(backups.UK) + timedelta(minutes=2))
    assert third["files_uploaded"] == 1 and third["files_removed"] == 1
    assert "uploads/moments/backup-delete-me.jpg" not in store.list("uploads/")
    os.remove(kept)


def test_backup_is_not_emptied_if_the_servers_files_vanish(family):
    import backups

    store = _store()
    for n in range(6):
        store.put_file(f"uploads/moments/earlier-{n}.jpg", _upload("backup-seed.jpg"))
    result = backups.run_backup(store)  # the server has far fewer files than the backup: don't trust it
    assert result["files_removed"] == 0 and len(store.list("uploads/moments/earlier-")) == 6
    os.remove(os.path.join(os.path.dirname(_upload("backup-seed.jpg")), "backup-seed.jpg"))


def test_old_database_copies_are_removed_but_recent_ones_kept(family):
    import backups

    store = _store()
    seed = _upload("backup-seed2.jpg")
    for day in ("2026-01-01", "2026-01-02", "2026-06-01", "2026-06-20", "2026-06-29"):
        store.put_file(f"database/brightroots-{day}-0300.db.gz", seed)
    result = backups.run_backup(store, datetime(2026, 6, 30, 3, 0, tzinfo=backups.UK))
    left = sorted(store.list("database/"))
    assert result["old_copies_removed"] == 2
    assert [k[21:31] for k in left] == ["2026-06-01", "2026-06-20", "2026-06-29", "2026-06-30"]
    assert backups.latest_database_key(store, date(2026, 6, 21)).endswith("2026-06-20-0300.db.gz")
    os.remove(seed)


def test_nightly_backup_runs_once_a_day_and_is_recorded(family, db):
    import backups
    from models import BackupRun

    store = _store()
    first = backups.run_and_record("nightly", store, claim="nightly-test-day")
    second = backups.run_and_record("nightly", store, claim="nightly-test-day")
    assert first is not None and second is None
    row = db.query(BackupRun).filter(BackupRun.id == first).one()
    assert row.status == "ok" and "Database saved" in row.detail


def test_a_failed_backup_is_recorded_with_the_reason(family, db):
    import backups
    from models import BackupRun

    class Broken(backups.FolderStore):
        def put_file(self, key, path):
            raise RuntimeError("storage said no")

    run_id = backups.run_and_record("manual", Broken(tempfile.mkdtemp()))
    row = db.query(BackupRun).filter(BackupRun.id == run_id).one()
    assert row.status == "failed" and "storage said no" in row.detail


def test_only_the_owner_sees_backup_status(family):
    from config import settings

    assert family.parent.get("/api/backup/status").status_code == 403
    assert family.parent.post("/api/backup/run").status_code == 403
    real = settings.ADMIN_EMAILS
    settings.ADMIN_EMAILS = family.email
    try:
        status = family.parent.get("/api/backup/status").json()
        assert status["configured"] is False and status["keep_days"] == 30 and isinstance(status["runs"], list)
        assert family.parent.post("/api/backup/run").status_code == 400  # not set up yet
    finally:
        settings.ADMIN_EMAILS = real
