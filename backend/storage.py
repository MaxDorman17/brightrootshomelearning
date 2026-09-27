"""Where uploaded files (photos, worksheets, resources) are kept.

Files used to be saved in ./uploads inside the app folder, which is replaced on every
redeploy, so they disappeared. They now live next to the database file, which is on
storage that survives redeploys. Set UPLOAD_ROOT to choose a different folder.
"""
import logging
import os
import shutil

from database import engine

logger = logging.getLogger(__name__)

LEGACY_ROOT = os.path.abspath("./uploads")


def _default_root() -> str:
    configured = os.getenv("UPLOAD_ROOT")
    if configured:
        return os.path.abspath(configured)
    if engine.dialect.name == "sqlite":
        db_path = engine.url.database
        if db_path and db_path != ":memory:":
            return os.path.join(os.path.dirname(os.path.abspath(db_path)), "uploads")
    return LEGACY_ROOT


UPLOAD_ROOT = _default_root()


def upload_dir(kind: str) -> str:
    """Folder for one kind of upload, e.g. "avatars", created if missing."""
    path = os.path.join(UPLOAD_ROOT, kind)
    os.makedirs(path, exist_ok=True)
    return path


def move_legacy_uploads() -> None:
    """One-off and safe to repeat: copy anything left in the old ./uploads folder across."""
    if UPLOAD_ROOT == LEGACY_ROOT or not os.path.isdir(LEGACY_ROOT):
        return
    for kind in os.listdir(LEGACY_ROOT):
        source = os.path.join(LEGACY_ROOT, kind)
        if not os.path.isdir(source):
            continue
        target = upload_dir(kind)
        for name in os.listdir(source):
            src, dst = os.path.join(source, name), os.path.join(target, name)
            if os.path.isfile(src) and not os.path.exists(dst):
                try:
                    shutil.copy2(src, dst)
                except OSError:
                    logger.exception("Could not move upload %s", src)
