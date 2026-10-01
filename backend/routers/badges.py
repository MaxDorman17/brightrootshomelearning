"""A family's own badges.

Alongside the built-in badges, grown-ups can make badges of their own ("Kind Friend", "Swam a
length"), each with a picture they upload or an emoji, and give them to their children. A badge
can be taken back or removed at any time.
"""
import os
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user, require_parent
from database import get_db
from models import CustomBadge, CustomBadgeAward, User
from routers.moments import _clean_child_ids, _family_children, _family_id
from routers.profile import MAX_PHOTO_SIZE, PHOTO_TYPES, _looks_like_image
from storage import upload_dir

router = APIRouter(prefix="/api/badges", tags=["badges"])

BADGE_DIR = upload_dir("badges")
MAX_BADGES = 100


def _image_path(name: str) -> str:
    return os.path.join(BADGE_DIR, os.path.basename(name))


def _remove_image(badge: CustomBadge) -> None:
    if badge.image:
        try:
            os.remove(_image_path(badge.image))
        except OSError:
            pass
        badge.image = None


async def _save_image(file: UploadFile) -> str:
    ext = PHOTO_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=400, detail="Please choose a JPG, PNG, WebP or GIF picture")
    data = await file.read(MAX_PHOTO_SIZE + 1)
    if len(data) > MAX_PHOTO_SIZE:
        raise HTTPException(status_code=400, detail="Pictures must be 5 MB or smaller")
    if not _looks_like_image(data):
        raise HTTPException(status_code=400, detail="That file doesn't look like a picture")
    os.makedirs(BADGE_DIR, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    with open(_image_path(name), "wb") as fh:
        fh.write(data)
    return name


def _clean_title(title: str) -> str:
    title = " ".join((title or "").split())
    if not title:
        raise HTTPException(status_code=400, detail="Give the badge a name")
    return title[:80]


def _clip(value: Optional[str], limit: int) -> Optional[str]:
    value = (value or "").strip()
    return value[:limit] or None


def _badge_out(badge: CustomBadge, awards: list[CustomBadgeAward], kids: dict[int, User], viewer: User) -> dict:
    mine = [a for a in awards if a.badge_id == badge.id and a.child_id in kids]
    earned_by_viewer = next((a for a in mine if a.child_id == viewer.id), None)
    return {
        "id": badge.id,
        "title": badge.title,
        "description": badge.description,
        "emoji": badge.emoji,
        "has_image": bool(badge.image),
        # Changes when the picture is replaced, so browsers fetch the new one.
        "image_version": badge.image,
        "awarded_to": [a.child_id for a in mine],
        "earned": earned_by_viewer is not None if viewer.role == "child" else None,
    }


def _get_badge(db: Session, family: int, badge_id: int) -> CustomBadge:
    badge = db.query(CustomBadge).filter(CustomBadge.id == badge_id, CustomBadge.parent_id == family).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    return badge


def _awards(db: Session, badge_ids: list[int]) -> list[CustomBadgeAward]:
    if not badge_ids:
        return []
    return db.query(CustomBadgeAward).filter(CustomBadgeAward.badge_id.in_(badge_ids)).all()


@router.get("/")
def list_badges(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    kids = _family_children(db, family)
    badges = db.query(CustomBadge).filter(CustomBadge.parent_id == family).order_by(CustomBadge.id).all()
    awards = _awards(db, [b.id for b in badges])
    return [_badge_out(b, awards, kids, current_user) for b in badges]


@router.post("/", status_code=201)
async def add_badge(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    emoji: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    if db.query(CustomBadge).filter(CustomBadge.parent_id == current_user.id).count() >= MAX_BADGES:
        raise HTTPException(status_code=400, detail=f"You can have up to {MAX_BADGES} of your own badges")
    badge = CustomBadge(
        parent_id=current_user.id,
        title=_clean_title(title),
        description=_clip(description, 300),
        emoji=_clip(emoji, 16),
    )
    if file is not None and file.filename:
        badge.image = await _save_image(file)
    db.add(badge)
    db.commit()
    db.refresh(badge)
    return _badge_out(badge, [], _family_children(db, current_user.id), current_user)


@router.put("/{badge_id}")
async def update_badge(
    badge_id: int,
    title: str = Form(...),
    description: Optional[str] = Form(None),
    emoji: Optional[str] = Form(None),
    remove_image: bool = Form(False),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    badge = _get_badge(db, current_user.id, badge_id)
    badge.title = _clean_title(title)
    badge.description = _clip(description, 300)
    badge.emoji = _clip(emoji, 16)
    if file is not None and file.filename:
        name = await _save_image(file)
        _remove_image(badge)
        badge.image = name
    elif remove_image:
        _remove_image(badge)
    db.commit()
    return _badge_out(badge, _awards(db, [badge.id]), _family_children(db, current_user.id), current_user)


@router.delete("/{badge_id}", status_code=204)
def delete_badge(badge_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    badge = _get_badge(db, current_user.id, badge_id)
    db.query(CustomBadgeAward).filter(CustomBadgeAward.badge_id == badge.id).delete()
    _remove_image(badge)
    db.delete(badge)
    db.commit()


class AwardsIn(BaseModel):
    child_ids: list[int] = []


@router.put("/{badge_id}/awards")
def set_awards(badge_id: int, body: AwardsIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Say exactly which children have this badge. Leaving a child out takes it back."""
    badge = _get_badge(db, current_user.id, badge_id)
    wanted = set(_clean_child_ids(db, current_user.id, body.child_ids))
    existing = {a.child_id: a for a in _awards(db, [badge.id])}
    for child_id, award in existing.items():
        if child_id not in wanted:
            db.delete(award)
    for child_id in wanted - set(existing):
        db.add(CustomBadgeAward(badge_id=badge.id, child_id=child_id))
    db.commit()
    return _badge_out(badge, _awards(db, [badge.id]), _family_children(db, current_user.id), current_user)


@router.get("/{badge_id}/image")
def badge_image(badge_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    badge = _get_badge(db, _family_id(current_user), badge_id)
    if not badge.image or not os.path.exists(_image_path(badge.image)):
        raise HTTPException(status_code=404, detail="No picture")
    return FileResponse(_image_path(badge.image), headers={"Cache-Control": "private, max-age=300"})
