from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User
from schemas import ChildCreate, ChildOut
from auth import require_parent, hash_password

router = APIRouter(prefix="/api/children", tags=["children"])


@router.get("/", response_model=List[ChildOut])
def list_children(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    return db.query(User).filter(User.parent_id == current_user.id, User.role == "child").all()


@router.post("/", response_model=ChildOut, status_code=201)
def add_child(
    body: ChildCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    if db.query(User).filter(User.username == body.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already taken")
    child = User(
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password),
        role="child",
        parent_id=current_user.id,
    )
    db.add(child)
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
    db.delete(child)
    db.commit()
