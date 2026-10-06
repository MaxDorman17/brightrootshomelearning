"""Finding and removing everything that hangs off a row: a whole family, one child, one lesson, one planner slot.

The database does not tidy up after a delete by itself, so this walks the links between tables in the
models. New tables are picked up automatically as long as they link back (directly, or via another
table that does) to the row being removed.
"""
import logging
import os

from sqlalchemy import select
from sqlalchemy.orm import Session

from database import Base
from storage import upload_dir

logger = logging.getLogger(__name__)


def _keeps_row(fk) -> bool:
    """A link marked SET NULL means the row outlives what it points at: it is unhooked, not removed."""
    return (fk.ondelete or "").upper() == "SET NULL"


def linked_rows(db: Session, start: dict[str, set]) -> dict[str, list[dict]]:
    """Every row reachable from the starting rows ({table name: ids}), keyed by table name."""
    found: dict[str, set] = {name: set(ids) for name, ids in start.items() if ids}

    # Follow the links outwards until nothing new turns up.
    changed = True
    while changed:
        changed = False
        for table in Base.metadata.sorted_tables:
            pk_cols = list(table.primary_key.columns)
            if len(pk_cols) != 1:
                continue
            pk = pk_cols[0]
            for fk in table.foreign_keys:
                if _keeps_row(fk):
                    continue
                ids = found.get(fk.column.table.name)
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


def uploaded_files(rows: dict[str, list[dict]]) -> list[tuple[str, str]]:
    """(folder, file name) for every uploaded file these rows own."""
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
    for r in rows.get("custom_badges", []):
        if r.get("image"):
            files.append(("badges", r["image"]))
    for r in rows.get("resources", []):
        if r.get("file_name"):
            files.append(("resources", r["file_name"]))
    for r in rows.get("reading_worksheets", []):
        url = r.get("url") or ""
        if url.startswith("/api/reading/files/"):
            files.append(("worksheets", url.rsplit("/", 1)[-1]))
    return [(kind, os.path.basename(name)) for kind, name in files if os.path.basename(name)]


def delete_rows(db: Session, rows: dict[str, list[dict]]) -> None:
    """Delete these rows (from linked_rows). The caller commits."""
    ids_by_table = {
        name: [r[list(Base.metadata.tables[name].primary_key.columns)[0].name] for r in table_rows]
        for name, table_rows in rows.items() if table_rows
    }

    # Rows that outlive what they point at are unhooked first. Scores for a lesson are the same,
    # though that link is not declared in the models.
    for table in Base.metadata.sorted_tables:
        for fk in table.foreign_keys:
            ids = ids_by_table.get(fk.column.table.name)
            if ids and _keeps_row(fk):
                db.execute(table.update().where(fk.parent.in_(ids)).values({fk.parent.name: None}))
    entry_ids = ids_by_table.get("planner_entries")
    if entry_ids:
        results = Base.metadata.tables["test_results"]
        db.execute(results.update().where(results.c.entry_id.in_(entry_ids)).values(entry_id=None))

    # Furthest from the start first, so nothing is left pointing at a deleted row.
    for table in reversed(Base.metadata.sorted_tables):
        ids = ids_by_table.get(table.name)
        if not ids:
            continue
        pk = list(table.primary_key.columns)[0]
        if table.name == "users":
            # Children and other grown-ups first, then the parent, since they point at the parent.
            db.execute(table.delete().where(pk.in_(ids), table.c.parent_id.is_not(None) | table.c.family_owner_id.is_not(None)))
        db.execute(table.delete().where(pk.in_(ids)))


def remove_files(files: list[tuple[str, str]]) -> None:
    """Remove uploaded files once their rows are gone. A file that will not go is logged, not fatal."""
    for kind, name in files:
        path = os.path.join(upload_dir(kind), name)
        try:
            if os.path.isfile(path):
                os.remove(path)
        except OSError:
            logger.warning("Could not remove %s", path)
