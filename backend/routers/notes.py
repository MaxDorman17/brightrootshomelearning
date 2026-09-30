"""Notes from home: a grown-up leaves a short message and it shows on the child's Today page.

A note sent to several children is stored once per child, so each child can read it and reply
(with a heart or a smile) on their own, and the grown-up can see who has seen it.
"""
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import FamilyNote, User
from routers.moments import _clean_child_ids, _family_children, _family_id
from schemas import _parse_avatar

router = APIRouter(prefix="/api/notes", tags=["notes"])

REACTIONS = {"❤️", "😊", "👍", "🎉"}
MAX_LENGTH = 1000


class NoteIn(BaseModel):
    body: str
    child_ids: list[int] = []

    @field_validator("body")
    @classmethod
    def not_empty(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Write a message first")
        if len(value) > MAX_LENGTH:
            raise ValueError(f"Please keep notes under {MAX_LENGTH} characters")
        return value


class ReactionIn(BaseModel):
    reaction: Optional[str] = None


def _iso(value: Optional[datetime]) -> Optional[str]:
    """SQLite hands back times without a time zone. They're UTC, so say so, or browsers read them as UK time."""
    if value is None:
        return None
    return (value if value.tzinfo else value.replace(tzinfo=timezone.utc)).isoformat()


def _note_out(note: FamilyNote, people: dict[int, User]) -> dict:
    author = people.get(note.author_id)
    child = people.get(note.child_id)
    return {
        "id": note.id,
        "body": note.body,
        "created_at": _iso(note.created_at),
        "read_at": _iso(note.read_at),
        "reaction": note.reaction,
        "author": {
            "id": note.author_id,
            "username": author.username if author else "",
            "avatar": _parse_avatar(author.avatar) if author else None,
        },
        "child_id": note.child_id,
        "child": child.username if child else "",
    }


def _people(db: Session, family: int) -> dict[int, User]:
    people = dict(_family_children(db, family))
    parent = db.query(User).filter(User.id == family).first()
    if parent:
        people[parent.id] = parent
    return people


@router.get("/")
def list_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = _family_id(current_user)
    q = db.query(FamilyNote).filter(FamilyNote.parent_id == family)
    if current_user.role == "child":
        q = q.filter(FamilyNote.child_id == current_user.id)
    rows = q.order_by(FamilyNote.created_at.desc(), FamilyNote.id.desc()).limit(50).all()
    people = _people(db, family)
    return [_note_out(n, people) for n in rows]


@router.post("/", status_code=201)
def send_note(body: NoteIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only grown-ups can leave notes")
    children = _clean_child_ids(db, current_user.id, body.child_ids)
    if not children:
        raise HTTPException(status_code=400, detail="Pick who the note is for")
    notes = [FamilyNote(parent_id=current_user.id, author_id=current_user.id, child_id=c, body=body.body) for c in children]
    db.add_all(notes)
    db.commit()
    people = _people(db, current_user.id)
    return [_note_out(n, people) for n in notes]


@router.post("/{note_id}/read")
def read_note(note_id: int, body: ReactionIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """The child has seen the note, optionally replying with a heart or a smile."""
    note = db.query(FamilyNote).filter(FamilyNote.id == note_id, FamilyNote.child_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if body.reaction is not None and body.reaction not in REACTIONS:
        raise HTTPException(status_code=400, detail="Unknown reaction")
    if not note.read_at:
        note.read_at = datetime.now(timezone.utc)
    if body.reaction is not None:
        note.reaction = body.reaction
    db.commit()
    return _note_out(note, _people(db, note.parent_id))


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Ask a grown-up to remove this")
    note = db.query(FamilyNote).filter(FamilyNote.id == note_id, FamilyNote.parent_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
