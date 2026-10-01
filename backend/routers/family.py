"""The grown-ups on a family account.

The parent who signed up is the main account holder. They can add more grown-ups (the other parent,
a guardian, a grandparent...), each with their own username and password. Everyone sees and manages
the same family; only the main account holder handles billing, deleting the account and who has access.
Each grown-up can say what they are to the children (Mum, Dad, Guardian...).
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import COPARENT_ROLE, actor, hash_password, is_family_owner, require_owner, require_parent
from database import get_db
from models import FamilyNote, User
from schemas import _parse_avatar

router = APIRouter(prefix="/api/family", tags=["family"])

MAX_EXTRA_ADULTS = 3


def _clean_relationship(value: Optional[str]) -> Optional[str]:
    value = " ".join((value or "").split())
    return value[:30] or None


class AdultIn(BaseModel):
    username: str
    password: str
    relationship: Optional[str] = None

    @field_validator("username")
    @classmethod
    def valid_username(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2 or len(value) > 50:
            raise ValueError("Usernames need 2 to 50 characters")
        return value

    @field_validator("password")
    @classmethod
    def valid_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        return value


class RelationshipIn(BaseModel):
    relationship: Optional[str] = None


class PasswordIn(BaseModel):
    new_password: str


def _adult_out(user: User, owner: User, me: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "relationship": user.relationship_label,
        "avatar": _parse_avatar(user.avatar),
        "is_owner": user.id == owner.id,
        "is_you": user.id == me.id,
    }


def _coparents(db: Session, owner: User) -> list[User]:
    return (
        db.query(User)
        .filter(User.family_owner_id == owner.id, User.role == COPARENT_ROLE)
        .order_by(User.id)
        .all()
    )


def _get_adult(db: Session, owner: User, adult_id: int) -> User:
    if adult_id == owner.id:
        return owner
    adult = db.query(User).filter(User.id == adult_id, User.family_owner_id == owner.id, User.role == COPARENT_ROLE).first()
    if not adult:
        raise HTTPException(status_code=404, detail="Grown-up not found")
    return adult


@router.get("/adults")
def list_adults(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    me = actor(current_user)
    return {
        "adults": [_adult_out(u, current_user, me) for u in [current_user, *_coparents(db, current_user)]],
        "can_manage": is_family_owner(current_user),
        "max_extra": MAX_EXTRA_ADULTS,
    }


@router.post("/adults", status_code=201)
def add_adult(body: AdultIn, db: Session = Depends(get_db), current_user: User = Depends(require_owner)):
    if len(_coparents(db, current_user)) >= MAX_EXTRA_ADULTS:
        raise HTTPException(status_code=400, detail=f"You can add up to {MAX_EXTRA_ADULTS} more grown-ups")
    if db.query(User).filter(func.lower(User.username) == body.username.lower()).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    adult = User(
        username=body.username,
        hashed_password=hash_password(body.password),
        role=COPARENT_ROLE,
        family_owner_id=current_user.id,
        relationship_label=_clean_relationship(body.relationship),
    )
    db.add(adult)
    db.commit()
    db.refresh(adult)
    return _adult_out(adult, current_user, actor(current_user))


@router.put("/adults/{adult_id}")
def set_relationship(adult_id: int, body: RelationshipIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """The main account holder can label anyone; other grown-ups can label themselves."""
    me = actor(current_user)
    adult = _get_adult(db, current_user, adult_id)
    if not is_family_owner(current_user) and adult.id != me.id:
        raise HTTPException(status_code=403, detail="Only the main account holder can change this")
    adult.relationship_label = _clean_relationship(body.relationship)
    db.commit()
    return _adult_out(adult, current_user, me)


@router.post("/adults/{adult_id}/reset-password")
def reset_adult_password(adult_id: int, body: PasswordIn, db: Session = Depends(get_db), current_user: User = Depends(require_owner)):
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    adult = _get_adult(db, current_user, adult_id)
    if adult.id == current_user.id:
        raise HTTPException(status_code=400, detail="Change your own password from Account settings")
    adult.hashed_password = hash_password(body.new_password)
    adult.session_version = (adult.session_version or 1) + 1  # signs them out everywhere
    db.commit()
    return {"message": f"Password reset for {adult.username}. They've been signed out everywhere."}


@router.delete("/adults/{adult_id}", status_code=204)
def remove_adult(adult_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_owner)):
    adult = _get_adult(db, current_user, adult_id)
    if adult.id == current_user.id:
        raise HTTPException(status_code=400, detail="You can't remove yourself. Delete the account instead.")
    # Their notes to the children go with them; everything else they added belongs to the family.
    db.query(FamilyNote).filter(FamilyNote.author_id == adult.id).delete()
    db.delete(adult)
    db.commit()
