"""A parent's own data: download everything as a ZIP, or delete the whole family account.

Both walk the foreign keys in the models, starting from the parent and their children, so
new tables are picked up automatically as long as they link back to users (directly or via
another table that does).
"""
import json
import logging
import os
import tempfile
import zipfile
from datetime import date, datetime

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth import require_owner, require_parent, verify_password
from config import settings
from database import Base, get_db
from models import User
from storage import upload_dir

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/account", tags=["account"])

# Columns never included in a download.
PRIVATE_COLUMNS = {"users": {"hashed_password", "session_version"}}


def _family_rows(db: Session, parent: User) -> dict[str, list[dict]]:
    """Every row belonging to this family, keyed by table name."""
    family_ids = {parent.id} | {
        cid for (cid,) in db.execute(select(User.id).where(User.parent_id == parent.id))
    }
    found: dict[str, set] = {"users": family_ids}

    # Follow foreign keys outwards until nothing new turns up.
    changed = True
    while changed:
        changed = False
        for table in Base.metadata.sorted_tables:
            pk_cols = list(table.primary_key.columns)
            if len(pk_cols) != 1:
                continue
            pk = pk_cols[0]
            for fk in table.foreign_keys:
                target = fk.column.table.name
                ids = found.get(target)
                if not ids:
                    continue
                rows = db.execute(select(pk).where(fk.parent.in_(ids))).scalars().all()
                new = set(rows) - found.get(table.name, set())
                if new:
                    found.setdefault(table.name, set()).update(new)
                    changed = True

    result: dict[str, list[dict]] = {}
    for table in Base.metadata.sorted_tables:
        ids = found.get(table.name)
        if not ids:
            continue
        pk = list(table.primary_key.columns)[0]
        rows = db.execute(select(table).where(pk.in_(ids)).order_by(pk)).mappings().all()
        result[table.name] = [dict(r) for r in rows]
    return result


def _family_files(rows: dict[str, list[dict]]) -> list[tuple[str, str]]:
    """(folder, file name) for every uploaded file the family owns."""
    files: list[tuple[str, str]] = []
    for r in rows.get("users", []):
        if r.get("avatar_photo"):
            files.append(("avatars", r["avatar_photo"]))
    for r in rows.get("moment_photos", []):
        if r.get("file_name"):
            files.append(("moments", r["file_name"]))
    for r in rows.get("make_items", []):
        if r.get("photo"):
            files.append(("make", r["photo"]))
    for r in rows.get("resources", []):
        if r.get("file_name"):
            files.append(("resources", r["file_name"]))
    for r in rows.get("reading_worksheets", []):
        url = r.get("url") or ""
        if url.startswith("/api/reading/files/"):
            files.append(("worksheets", url.rsplit("/", 1)[-1]))
    return [(kind, os.path.basename(name)) for kind, name in files if os.path.basename(name)]


def _json_default(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return str(value)


@router.get("/export")
def export_account(
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    rows = _family_rows(db, current_user)
    for table, hidden in PRIVATE_COLUMNS.items():
        for r in rows.get(table, []):
            for col in hidden:
                r.pop(col, None)

    tmp = tempfile.NamedTemporaryFile(suffix=".zip", delete=False)
    tmp.close()
    with zipfile.ZipFile(tmp.name, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("bright-roots-data.json", json.dumps(rows, indent=2, default=_json_default))
        zf.writestr(
            "README.txt",
            "This is all the information Bright Roots holds for your family.\n"
            "bright-roots-data.json has every record, grouped by type.\n"
            "The files folder has the photos and documents you uploaded.\n",
        )
        for kind, name in _family_files(rows):
            path = os.path.join(upload_dir(kind), name)
            if os.path.isfile(path):
                zf.write(path, f"files/{kind}/{name}")

    background.add_task(os.remove, tmp.name)
    stamp = datetime.utcnow().strftime("%Y-%m-%d")
    return FileResponse(tmp.name, media_type="application/zip", filename=f"bright-roots-{stamp}.zip")


class DeleteAccountIn(BaseModel):
    password: str
    confirm: str


def _cancel_stripe(user: User) -> None:
    if not (settings.STRIPE_SECRET_KEY and user.stripe_subscription_id):
        return
    if user.subscription_status in ("canceled", "cancelled"):
        return
    try:
        response = httpx.delete(
            f"https://api.stripe.com/v1/subscriptions/{user.stripe_subscription_id}",
            headers={"Authorization": f"Bearer {settings.STRIPE_SECRET_KEY}"},
            timeout=15.0,
        )
    except httpx.HTTPError:
        response = None
    # 404 means Stripe has no live subscription any more, which is fine.
    if response is None or (response.status_code >= 400 and response.status_code != 404):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="We couldn't cancel your subscription with Stripe, so nothing has been deleted. Please try again or contact us.",
        )


@router.post("/delete", status_code=204)
def delete_account(
    body: DeleteAccountIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner),
):
    if body.confirm.strip().upper() != "DELETE":
        raise HTTPException(status_code=400, detail='Type DELETE to confirm.')
    if not verify_password(body.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="That password isn't right.")

    _cancel_stripe(current_user)

    rows = _family_rows(db, current_user)
    files = _family_files(rows)
    email = current_user.email

    # Children before parents, so nothing is left pointing at a deleted row.
    for table in reversed(Base.metadata.sorted_tables):
        table_rows = rows.get(table.name)
        if not table_rows:
            continue
        pk = list(table.primary_key.columns)[0]
        ids = [r[pk.name] for r in table_rows]
        if table.name == "users":
            # Children and other grown-ups first, then the parent, since they point at the parent.
            db.execute(table.delete().where(pk.in_(ids), table.c.parent_id.is_not(None) | table.c.family_owner_id.is_not(None)))
            db.execute(table.delete().where(pk.in_(ids)))
        else:
            db.execute(table.delete().where(pk.in_(ids)))
    if email:
        subs = Base.metadata.tables.get("newsletter_subscribers")
        if subs is not None:
            db.execute(subs.delete().where(subs.c.email == email.lower()))
    db.commit()

    for kind, name in files:
        path = os.path.join(upload_dir(kind), name)
        try:
            if os.path.isfile(path):
                os.remove(path)
        except OSError:
            logger.warning("Could not remove %s after account deletion", path)
