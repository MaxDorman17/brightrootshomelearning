import json
import os
import uuid
from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Moment, MomentComment, MomentPhoto, MomentReaction, User
from routers.profile import _looks_like_image
from storage import upload_dir

router = APIRouter(prefix="/api/moments", tags=["moments"])

PHOTO_DIR = upload_dir("moments")
MAX_PHOTOS = 5
MAX_PHOTO_SIZE = 10 * 1024 * 1024
PHOTO_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}
REACTIONS = {"⭐", "❤️", "👏"}


class MomentUpdate(BaseModel):
    note: Optional[str] = None
    moment_date: date
    subject: Optional[str] = None
    child_ids: list[int] = []


class ReactionIn(BaseModel):
    emoji: str

    @field_validator("emoji")
    @classmethod
    def valid_emoji(cls, value: str) -> str:
        if value not in REACTIONS:
            raise ValueError("Unknown reaction")
        return value


class CommentIn(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def valid_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Write something first")
        return value[:500]


def _family_id(user: User) -> int:
    family = user.id if user.role == "parent" else user.parent_id
    if not family:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    return family


def _family_children(db: Session, parent_id: int) -> dict[int, User]:
    return {c.id: c for c in db.query(User).filter(User.parent_id == parent_id, User.role == "child").all()}


def _clean_child_ids(db: Session, parent_id: int, ids: list[int]) -> list[int]:
    family = _family_children(db, parent_id)
    return [i for i in dict.fromkeys(ids) if i in family]


def _parse_ids(raw: Optional[str]) -> list[int]:
    try:
        value = json.loads(raw) if raw else []
        return [int(i) for i in value] if isinstance(value, list) else []
    except (ValueError, TypeError):
        return []


def _photo_path(name: str) -> str:
    return os.path.join(PHOTO_DIR, os.path.basename(name))


def _get_moment(db: Session, user: User, moment_id: int) -> Moment:
    moment = db.query(Moment).filter(Moment.id == moment_id, Moment.parent_id == _family_id(user)).first()
    if not moment:
        raise HTTPException(status_code=404, detail="Moment not found")
    return moment


def _can_edit(user: User, moment: Moment) -> bool:
    return user.role == "parent" or moment.author_id == user.id


async def _save_photos(db: Session, moment: Moment, files: List[UploadFile], start: int) -> None:
    # Check every photo before writing any, so a bad one doesn't leave half an upload behind.
    checked = []
    for upload in files:
        ext = PHOTO_TYPES.get(upload.content_type or "")
        if not ext:
            raise HTTPException(status_code=400, detail="Photos must be JPG, PNG, WebP or GIF")
        data = await upload.read(MAX_PHOTO_SIZE + 1)
        if len(data) > MAX_PHOTO_SIZE:
            raise HTTPException(status_code=400, detail="Each photo must be 10 MB or smaller")
        if not _looks_like_image(data):
            raise HTTPException(status_code=400, detail="One of those files doesn't look like a photo")
        checked.append((upload, ext, data))
    for i, (upload, ext, data) in enumerate(checked):
        name = f"{uuid.uuid4().hex}{ext}"
        with open(_photo_path(name), "wb") as fh:
            fh.write(data)
        db.add(MomentPhoto(moment_id=moment.id, file_name=name, content_type=upload.content_type, position=start + i))


def _delete_photo_file(photo: MomentPhoto) -> None:
    try:
        os.remove(_photo_path(photo.file_name))
    except OSError:
        pass


def _moments_out(db: Session, user: User, moments: list[Moment]) -> list[dict]:
    if not moments:
        return []
    parent_id = _family_id(user)
    ids = [m.id for m in moments]
    children = _family_children(db, parent_id)
    people = {**children, **{u.id: u for u in db.query(User).filter(User.id == parent_id).all()}}

    photos: dict = {}
    for p in db.query(MomentPhoto).filter(MomentPhoto.moment_id.in_(ids)).order_by(MomentPhoto.position, MomentPhoto.id).all():
        photos.setdefault(p.moment_id, []).append(p.id)
    reactions: dict = {}
    for r in db.query(MomentReaction).filter(MomentReaction.moment_id.in_(ids)).all():
        entry = reactions.setdefault(r.moment_id, {}).setdefault(r.emoji, {"count": 0, "mine": False})
        entry["count"] += 1
        entry["mine"] = entry["mine"] or r.user_id == user.id
    comments: dict = {}
    for c in db.query(MomentComment).filter(MomentComment.moment_id.in_(ids)).order_by(MomentComment.created_at, MomentComment.id).all():
        author = people.get(c.user_id)
        comments.setdefault(c.moment_id, []).append({
            "id": c.id,
            "text": c.text,
            "author": author.username if author else "Someone",
            "can_delete": user.role == "parent" or c.user_id == user.id,
        })

    out = []
    for m in moments:
        author = people.get(m.author_id)
        child_ids = _parse_ids(m.child_ids)
        out.append({
            "id": m.id,
            "note": m.note,
            "moment_date": m.moment_date.isoformat(),
            "subject": m.subject,
            "child_ids": child_ids,
            "children": [children[i].username for i in child_ids if i in children],
            "author": author.username if author else "Someone",
            "author_id": m.author_id,
            "author_role": author.role if author else None,
            "photo_ids": photos.get(m.id, []),
            "reactions": reactions.get(m.id, {}),
            "comments": comments.get(m.id, []),
            "can_edit": _can_edit(user, m),
        })
    return out


def moments_for_child(db: Session, parent_id: int, child_id: int, start: date, end: date) -> list[dict]:
    """Moments about one child (or about nobody in particular) within a period. Used by the council report."""
    rows = (
        db.query(Moment)
        .filter(Moment.parent_id == parent_id, Moment.moment_date >= start, Moment.moment_date <= end)
        .order_by(Moment.moment_date)
        .all()
    )
    photos: dict = {}
    if rows:
        for p in db.query(MomentPhoto).filter(MomentPhoto.moment_id.in_([m.id for m in rows])).order_by(MomentPhoto.position).all():
            photos.setdefault(p.moment_id, []).append(p.id)
    out = []
    for m in rows:
        tagged = _parse_ids(m.child_ids)
        if tagged and child_id not in tagged:
            continue
        out.append({"date": m.moment_date.isoformat(), "subject": m.subject, "note": m.note, "photo_ids": photos.get(m.id, [])})
    return out


@router.get("/")
def list_moments(
    child_id: Optional[int] = Query(None),
    subject: Optional[str] = Query(None),
    month: Optional[str] = Query(None, description="yyyy-mm"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Moment).filter(Moment.parent_id == _family_id(current_user))
    if subject:
        query = query.filter(Moment.subject == subject)
    if month:
        try:
            year, mon = (int(x) for x in month.split("-"))
            first = date(year, mon, 1)
            next_first = date(year + (mon == 12), mon % 12 + 1, 1)
        except ValueError:
            raise HTTPException(status_code=400, detail="Month should look like 2026-09")
        query = query.filter(Moment.moment_date >= first, Moment.moment_date < next_first)
    moments = query.order_by(Moment.moment_date.desc(), Moment.id.desc()).limit(500).all()
    if child_id is not None:
        moments = [m for m in moments if child_id in _parse_ids(m.child_ids)]
    return _moments_out(db, current_user, moments)


@router.post("/", status_code=201)
async def add_moment(
    note: str = Form(""),
    moment_date: date = Form(...),
    subject: str = Form(""),
    child_ids: str = Form(""),
    files: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    parent_id = _family_id(current_user)
    note = note.strip()[:5000]
    if not note and not files:
        raise HTTPException(status_code=400, detail="Add a photo or write a note")
    if len(files) > MAX_PHOTOS:
        raise HTTPException(status_code=400, detail=f"Up to {MAX_PHOTOS} photos per moment")
    ids = [int(i) for i in child_ids.split(",") if i.strip().isdigit()]
    if current_user.role == "child" and not ids:
        ids = [current_user.id]
    moment = Moment(
        parent_id=parent_id,
        author_id=current_user.id,
        note=note or None,
        moment_date=moment_date,
        subject=subject.strip()[:100] or None,
        child_ids=json.dumps(_clean_child_ids(db, parent_id, ids)),
    )
    db.add(moment)
    db.flush()
    await _save_photos(db, moment, files, 0)
    db.commit()
    return _moments_out(db, current_user, [moment])[0]


@router.put("/{moment_id}")
def update_moment(moment_id: int, body: MomentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    moment = _get_moment(db, current_user, moment_id)
    if not _can_edit(current_user, moment):
        raise HTTPException(status_code=403, detail="Only the person who posted this can change it")
    moment.note = (body.note or "").strip()[:5000] or None
    moment.moment_date = body.moment_date
    moment.subject = (body.subject or "").strip()[:100] or None
    moment.child_ids = json.dumps(_clean_child_ids(db, moment.parent_id, body.child_ids))
    moment.updated_at = datetime.utcnow()
    db.commit()
    return _moments_out(db, current_user, [moment])[0]


@router.delete("/{moment_id}", status_code=204)
def delete_moment(moment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    moment = _get_moment(db, current_user, moment_id)
    if not _can_edit(current_user, moment):
        raise HTTPException(status_code=403, detail="Only the person who posted this can delete it")
    for photo in db.query(MomentPhoto).filter(MomentPhoto.moment_id == moment.id).all():
        _delete_photo_file(photo)
        db.delete(photo)
    db.query(MomentReaction).filter(MomentReaction.moment_id == moment.id).delete()
    db.query(MomentComment).filter(MomentComment.moment_id == moment.id).delete()
    db.delete(moment)
    db.commit()


@router.post("/{moment_id}/photos", status_code=201)
async def add_photos(
    moment_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    moment = _get_moment(db, current_user, moment_id)
    if not _can_edit(current_user, moment):
        raise HTTPException(status_code=403, detail="Only the person who posted this can change it")
    existing = db.query(MomentPhoto).filter(MomentPhoto.moment_id == moment.id).count()
    if existing + len(files) > MAX_PHOTOS:
        raise HTTPException(status_code=400, detail=f"Up to {MAX_PHOTOS} photos per moment")
    await _save_photos(db, moment, files, existing)
    db.commit()
    return _moments_out(db, current_user, [moment])[0]


@router.delete("/{moment_id}/photos/{photo_id}", status_code=204)
def delete_photo(moment_id: int, photo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    moment = _get_moment(db, current_user, moment_id)
    if not _can_edit(current_user, moment):
        raise HTTPException(status_code=403, detail="Only the person who posted this can change it")
    photo = db.query(MomentPhoto).filter(MomentPhoto.id == photo_id, MomentPhoto.moment_id == moment.id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    _delete_photo_file(photo)
    db.delete(photo)
    db.commit()


@router.post("/{moment_id}/react")
def react(moment_id: int, body: ReactionIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    moment = _get_moment(db, current_user, moment_id)
    existing = db.query(MomentReaction).filter(
        MomentReaction.moment_id == moment.id, MomentReaction.user_id == current_user.id, MomentReaction.emoji == body.emoji
    ).first()
    if existing:
        db.delete(existing)
    else:
        db.add(MomentReaction(moment_id=moment.id, user_id=current_user.id, emoji=body.emoji))
    db.commit()
    return _moments_out(db, current_user, [moment])[0]


@router.post("/{moment_id}/comments", status_code=201)
def add_comment(moment_id: int, body: CommentIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    moment = _get_moment(db, current_user, moment_id)
    db.add(MomentComment(moment_id=moment.id, user_id=current_user.id, text=body.text))
    db.commit()
    return _moments_out(db, current_user, [moment])[0]


@router.delete("/comments/{comment_id}", status_code=204)
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comment = db.query(MomentComment).filter(MomentComment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    moment = _get_moment(db, current_user, comment.moment_id)
    if not (current_user.role == "parent" or comment.user_id == current_user.id):
        raise HTTPException(status_code=403, detail="You can only delete your own comments")
    db.delete(comment)
    db.commit()


@router.get("/photos/{photo_id}")
def get_photo(photo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    photo = (
        db.query(MomentPhoto)
        .join(Moment, MomentPhoto.moment_id == Moment.id)
        .filter(MomentPhoto.id == photo_id, Moment.parent_id == _family_id(current_user))
        .first()
    )
    if not photo or not os.path.exists(_photo_path(photo.file_name)):
        raise HTTPException(status_code=404, detail="Photo not found")
    return FileResponse(_photo_path(photo.file_name), media_type=photo.content_type, headers={"Cache-Control": "private, max-age=3600"})
