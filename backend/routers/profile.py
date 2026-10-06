import json
import os
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user, require_parent, actor
from database import get_db
from models import User
from storage import upload_dir

router = APIRouter(prefix="/api/profile", tags=["profile"])

PHOTO_DIR = upload_dir("avatars")
MAX_PHOTO_SIZE = 5 * 1024 * 1024
PHOTO_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}

AVATAR_EMOJIS = {
    "🦊", "🐼", "🦄", "🐸", "🐯", "🐶", "🐱", "🐵", "🦁", "🐨", "🐰", "🐧", "🦉", "🐢", "🐙", "🦖",
    "🐝", "🦋", "🐬", "🦈", "🚀", "⚽", "🎨", "🎸", "🌈", "⭐", "🌻", "🍓", "🤖", "👾", "🧙", "🦸",
    "🧜", "🐲", "🏀", "🎮",
}
# Max's illustrated characters, stored as "pic:<name>". Must match AVATAR_PICTURES in frontend/src/lib/avatar.ts.
# The emojis above stay valid so children who already chose one keep it.
AVATAR_PICTURES = {f"pic:{n}" for n in ("bear", "penguin", "robot", "daisy", "butterfly", "heart", "unicorn", "bee", "pufferfish", "controller", "shark", "starfish", "seahorse", "monkey", "zebra", "panda", "red-panda", "fox", "boat", "football", "rocket", "dinosaur", "duck", "dog", "cat", "bird", "astronaut", "dragon", "pirate")}
# Grown-up characters for parents. Must match PARENT_AVATAR_PICTURES in frontend/src/lib/avatar.ts.
AVATAR_PICTURES |= {f"pic:{n}" for n in ("owl", "stag", "hedgehog", "badger", "heron", "fox-parent", "hare", "robin", "tortoise", "mug", "plant", "books", "camper", "teapot", "lighthouse")}
AVATAR_BACKGROUNDS = {"sky", "mint", "lemon", "peach", "rose", "lilac", "sand", "slate"}
AVATAR_FRAMES = {"none", "ring", "star", "rainbow"}
CHILD_THEMES = {"sage", "ocean", "sunshine", "berry", "sky", "grape", "rainbow"}
SUBJECT_COLOURS = {"blue", "purple", "green", "yellow", "cyan", "indigo", "orange", "pink", "red", "teal", "rose", "slate"}


class AvatarIn(BaseModel):
    emoji: str
    bg: str
    frame: str = "none"

    @field_validator("emoji")
    @classmethod
    def valid_emoji(cls, value: str) -> str:
        if value not in AVATAR_EMOJIS and value not in AVATAR_PICTURES:
            raise ValueError("Pick one of the characters")
        return value

    @field_validator("bg")
    @classmethod
    def valid_bg(cls, value: str) -> str:
        if value not in AVATAR_BACKGROUNDS:
            raise ValueError("Pick one of the colours")
        return value

    @field_validator("frame")
    @classmethod
    def valid_frame(cls, value: str) -> str:
        if value not in AVATAR_FRAMES:
            raise ValueError("Pick one of the frames")
        return value


TEXT_SIZES = ("normal", "large", "larger")


class DisplayIn(BaseModel):
    text_size: str = "normal"
    easy_font: bool = False

    @field_validator("text_size")
    @classmethod
    def valid_size(cls, value: str) -> str:
        if value not in TEXT_SIZES:
            raise ValueError("Unknown text size")
        return value


def display_prefs(user: Optional[User]) -> dict:
    """A person's reading settings, with the defaults filled in."""
    try:
        saved = json.loads(user.display_prefs) if user and user.display_prefs else {}
    except ValueError:
        saved = {}
    size = saved.get("text_size") if isinstance(saved, dict) else None
    return {
        "text_size": size if size in TEXT_SIZES else "normal",
        "easy_font": bool(saved.get("easy_font")) if isinstance(saved, dict) else False,
    }


class ColoursIn(BaseModel):
    theme: Optional[str] = None  # None means "use the family theme"
    subject_colors: dict[str, str] = {}

    @field_validator("theme")
    @classmethod
    def valid_theme(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and value not in CHILD_THEMES:
            raise ValueError("Unknown theme")
        return value

    @field_validator("subject_colors")
    @classmethod
    def valid_colours(cls, value: dict[str, str]) -> dict[str, str]:
        if len(value) > 40:
            raise ValueError("Too many subjects")
        clean = {}
        for subject, colour in value.items():
            if colour not in SUBJECT_COLOURS:
                raise ValueError("Unknown colour")
            clean[subject.strip()[:100]] = colour
        return clean


def _target(db: Session, current_user: User, child_id: Optional[int]) -> User:
    """Children change their own profile; parents can change their own (no child_id) or any of their children's."""
    if current_user.role == "child":
        if child_id not in (None, current_user.id):
            raise HTTPException(status_code=403, detail="You can only change your own profile")
        return current_user
    if child_id is None:
        return actor(current_user)  # a second grown-up changes their own picture, not the main parent's
    child = db.query(User).filter(User.id == child_id, User.parent_id == current_user.id, User.role == "child").first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    return child


def _same_family(viewer: User, child: User) -> bool:
    family_id = viewer.id if viewer.role == "parent" else viewer.parent_id
    return child.parent_id == family_id


def _looks_like_image(data: bytes) -> bool:
    return (
        data.startswith(b"\xff\xd8\xff")
        or data.startswith(b"\x89PNG\r\n\x1a\n")
        or data[:6] in (b"GIF87a", b"GIF89a")
        or (data[:4] == b"RIFF" and data[8:12] == b"WEBP")
    )


def _photo_path(name: str) -> str:
    return os.path.join(PHOTO_DIR, os.path.basename(name))


def _remove_photo_file(user: User) -> None:
    if user.avatar_photo:
        try:
            os.remove(_photo_path(user.avatar_photo))
        except OSError:
            pass
        user.avatar_photo = None


@router.put("/avatar")
def save_avatar(
    body: AvatarIn,
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    child = _target(db, current_user, child_id)
    child.avatar = json.dumps(body.model_dump())
    db.commit()
    return {"avatar": body.model_dump()}


@router.get("/display")
def get_display(
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return display_prefs(_target(db, current_user, child_id))


@router.put("/display")
def save_display(
    body: DisplayIn,
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bigger text and an easy-read font. Children set their own; a parent can set their own or a child's."""
    person = _target(db, current_user, child_id)
    prefs = {"text_size": body.text_size, "easy_font": body.easy_font}
    person.display_prefs = None if prefs == {"text_size": "normal", "easy_font": False} else json.dumps(prefs)
    db.commit()
    return display_prefs(person)


@router.put("/colours")
def save_colours(
    body: ColoursIn,
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    child = _target(db, current_user, child_id)
    child.child_theme = body.theme
    child.subject_colors = json.dumps(body.subject_colors) if body.subject_colors else None
    db.commit()
    return {"theme": body.theme, "subject_colors": body.subject_colors}


@router.post("/photo")
async def upload_photo(
    child_id: int = Query(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child = _target(db, current_user, child_id)
    ext = PHOTO_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=400, detail="Please choose a JPG, PNG, WebP or GIF image")
    data = await file.read(MAX_PHOTO_SIZE + 1)
    if len(data) > MAX_PHOTO_SIZE:
        raise HTTPException(status_code=400, detail="Photos must be 5 MB or smaller")
    if not _looks_like_image(data):
        raise HTTPException(status_code=400, detail="That file doesn't look like a photo")
    os.makedirs(PHOTO_DIR, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    with open(_photo_path(name), "wb") as fh:
        fh.write(data)
    _remove_photo_file(child)
    child.avatar_photo = name
    db.commit()
    return {"has_photo": True}


@router.delete("/photo", status_code=204)
def delete_photo(
    child_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child = _target(db, current_user, child_id)
    _remove_photo_file(child)
    db.commit()


@router.get("/photo/{child_id}")
def get_photo(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    child = db.query(User).filter(User.id == child_id, User.role == "child").first()
    if not child or not _same_family(current_user, child) or not child.avatar_photo:
        raise HTTPException(status_code=404, detail="No photo")
    path = _photo_path(child.avatar_photo)
    if not os.path.exists(path):
        # The file was lost (e.g. saved before uploads survived redeploys): fall back to the avatar.
        child.avatar_photo = None
        db.commit()
        raise HTTPException(status_code=404, detail="No photo")
    return FileResponse(path, headers={"Cache-Control": "private, max-age=300"})
