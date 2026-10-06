"""Limits on how much anyone can save, so nobody can fill the database with junk.

SQLite does not enforce the lengths written in the models, so they are checked here just before
anything is saved. A value that is too long is refused with a plain message instead.
"""
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy import String, Text, event, inspect
from sqlalchemy.orm import Session

# Long pieces of writing (notes, journal entries, a newsletter) can be big, but not endless.
MAX_TEXT = 100_000
# Web links are often longer than the room the models give them, and long ones are harmless.
MAX_LINK = 2_000
# Everything except file uploads is a small piece of JSON or a form.
MAX_BODY_BYTES = 1_000_000


def _limit(column) -> int | None:
    if isinstance(column.type, Text):
        return MAX_TEXT
    if isinstance(column.type, String) and column.type.length:
        name = column.name.lower()
        if "url" in name or "link" in name:
            return max(column.type.length, MAX_LINK)
        return column.type.length
    return None


def _check(session: Session, flush_context, instances) -> None:
    for obj in list(session.new) + list(session.dirty):
        state = inspect(obj)
        for column in state.mapper.columns:
            limit = _limit(column)
            if limit is None:
                continue
            attr = state.attrs[column.key]
            value = attr.value
            if isinstance(value, str) and len(value) > limit and attr.history.has_changes():
                label = column.key.replace("_", " ")
                raise HTTPException(
                    status_code=400,
                    detail=f"That's too long to save: the {label} can be up to {limit:,} characters.",
                )


def install(session_factory) -> None:
    event.listen(session_factory, "before_flush", _check)


async def refuse_huge_requests(request: Request, call_next):
    """Turn away anything far bigger than the site ever sends, before it is read. File uploads have their own limits."""
    length = request.headers.get("content-length")
    is_upload = request.headers.get("content-type", "").startswith("multipart/form-data")
    if length and length.isdigit() and int(length) > MAX_BODY_BYTES and not is_upload:
        return JSONResponse(status_code=413, content={"detail": "That's too much to send in one go."})
    return await call_next(request)
