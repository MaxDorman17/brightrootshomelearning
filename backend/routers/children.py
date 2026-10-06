import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import ChildTimetable, User
from schemas import ChildCreate, ChildOut
from auth import require_parent, hash_password, clean_login_name, login_name_taken, suggest_login_names, CHILD_MIN_PASSWORD

router = APIRouter(prefix="/api/children", tags=["children"])


class ChildPasswordReset(BaseModel):
    new_password: str


# "little" is a Little Roots child (3 or 4): no login of their own, a grown-up does everything with them.
ACTIVITY_LEVELS = {"young", "teen", "both", "little"}


class ChildUpdate(BaseModel):
    username: Optional[str] = None
    login_name: Optional[str] = None
    activity_level: Optional[str] = None


def _clean_level(value: Optional[str]) -> Optional[str]:
    value = (value or "").strip().lower()
    if not value:
        return None
    if value not in ACTIVITY_LEVELS:
        raise HTTPException(status_code=400, detail="Choose Little Roots, younger, teens or both")
    return value


@router.get("/", response_model=List[ChildOut])
def list_children(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    return db.query(User).filter(User.parent_id == current_user.id, User.role == "child").all()


@router.get("/login-name")
def check_login_name(
    name: str = "",
    login_name: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """For the add-a-child form: is this login name free, and which ones could they use?"""
    wanted = clean_login_name(login_name)
    return {
        "login_name": wanted,
        "available": len(wanted) >= 2 and not login_name_taken(db, wanted),
        "suggestions": suggest_login_names(db, name or login_name, current_user.username),
    }


MAX_CHILDREN = 10


@router.post("/", response_model=ChildOut, status_code=201)
def add_child(
    body: ChildCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    name = " ".join(body.username.split())
    if not name or len(name) > 50:
        raise HTTPException(status_code=400, detail="Names need 1 to 50 characters")
    # One membership is for one household. The limit is generous so large families fit, but a group can't share one.
    if db.query(User).filter(User.parent_id == current_user.id, User.role == "child").count() >= MAX_CHILDREN:
        raise HTTPException(
            status_code=400,
            detail=f"A family membership covers up to {MAX_CHILDREN} children. If your family is bigger, send us a message in Help & feedback and we'll sort it out.",
        )
    level = _clean_level(body.activity_level)
    if level == "little":
        # Nobody logs in as a little one, so they get no login name and a long random password nobody knows.
        child = User(
            username=name,
            login_name=None,
            activity_level=level,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            role="child",
            parent_id=current_user.id,
        )
        db.add(child)
        db.commit()
        db.refresh(child)
        return child
    if not (body.password or "").strip():
        raise HTTPException(status_code=400, detail="Please choose a password")
    if len(body.password) < CHILD_MIN_PASSWORD:
        raise HTTPException(status_code=400, detail=f"Password must be at least {CHILD_MIN_PASSWORD} characters")
    if body.email and login_name_taken(db, body.email):
        raise HTTPException(status_code=400, detail="Email already taken")
    if body.login_name and body.login_name.strip():
        login_name = clean_login_name(body.login_name)
        if len(login_name) < 2:
            raise HTTPException(status_code=400, detail="Login names need at least 2 letters or numbers")
        if login_name_taken(db, login_name):
            ideas = ", ".join(suggest_login_names(db, name, current_user.username))
            raise HTTPException(status_code=400, detail=f"That login name is taken. Try one of these: {ideas}")
    else:
        # No login name given: use their name if nobody else has it, otherwise the closest free one.
        login_name = suggest_login_names(db, name, current_user.username, count=1)[0]
    child = User(
        username=name,
        login_name=login_name,
        activity_level=level,
        email=body.email,
        hashed_password=hash_password(body.password),
        role="child",
        parent_id=current_user.id,
    )
    db.add(child)
    db.commit()
    db.refresh(child)
    return child


@router.put("/{child_id}", response_model=ChildOut)
def update_child(
    child_id: int,
    body: ChildUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Change a child's name, what they type to log in, or which activity pages they see."""
    child = db.query(User).filter(User.id == child_id, User.parent_id == current_user.id, User.role == "child").first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if body.username is not None:
        name = " ".join(body.username.split())
        if not name or len(name) > 50:
            raise HTTPException(status_code=400, detail="Names need 1 to 50 characters")
        child.username = name
    if body.login_name is not None:
        login_name = clean_login_name(body.login_name)
        if len(login_name) < 2:
            raise HTTPException(status_code=400, detail="Login names need at least 2 letters or numbers")
        if login_name.lower() != (child.login_name or "").lower() and login_name_taken(db, login_name):
            ideas = ", ".join(suggest_login_names(db, child.username, current_user.username))
            raise HTTPException(status_code=400, detail=f"That login name is taken. Try one of these: {ideas}")
        child.login_name = login_name
    if body.activity_level is not None:
        level = _clean_level(body.activity_level)
        if level == "little" and child.activity_level != "little":
            # Becoming a Little Roots child: the login stops working straight away.
            child.login_name = None
            child.email = None
            child.hashed_password = hash_password(secrets.token_urlsafe(32))
            child.session_version = (child.session_version or 1) + 1
        elif level != "little" and child.activity_level == "little" and not child.login_name:
            # Growing out of Little Roots: give them a login name now; the grown-up sets a password next.
            child.login_name = suggest_login_names(db, child.username, current_user.username, count=1)[0]
        child.activity_level = level
    db.commit()
    db.refresh(child)
    return child


@router.delete("/{child_id}", status_code=204)
def remove_child(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child = db.query(User).filter(User.id == child_id, User.parent_id == current_user.id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    # Their own timetable, if they had one, goes with them.
    db.query(ChildTimetable).filter(ChildTimetable.child_id == child.id).delete(synchronize_session=False)
    db.delete(child)
    db.commit()


@router.post("/{child_id}/reset-password")
def reset_child_password(
    child_id: int,
    body: ChildPasswordReset,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    if len(body.new_password) < CHILD_MIN_PASSWORD:
        raise HTTPException(status_code=400, detail=f"Password must be at least {CHILD_MIN_PASSWORD} characters")

    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == current_user.id,
        User.role == "child",
    ).first()

    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    if child.activity_level == "little":
        raise HTTPException(status_code=400, detail="Little Roots children don't log in. Change them to Saplings first to give them a login.")

    child.hashed_password = hash_password(body.new_password)
    child.session_version = (child.session_version or 1) + 1
    db.commit()

    return {"message": f"Password reset for {child.username}. Existing sessions were signed out."}
