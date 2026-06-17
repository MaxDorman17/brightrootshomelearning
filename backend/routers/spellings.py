from typing import Optional, List
from datetime import date
import json

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user, require_parent
from models import User, SpellingWord, SpellingResult

router = APIRouter(prefix="/api/spellings", tags=["spellings"])


class AddWordRequest(BaseModel):
    week_start: date
    word: str


class SaveResultRequest(BaseModel):
    week_start: date
    score: int
    total: int
    wrong_words: List[str] = []
    child_id: Optional[int] = None


@router.get("/words")
def get_words(
    week_start: date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "parent":
        parent_id = current_user.id
    else:
        parent_id = current_user.parent_id
        if not parent_id:
            return []
    words = (
        db.query(SpellingWord)
        .filter(SpellingWord.parent_id == parent_id, SpellingWord.week_start == week_start)
        .order_by(SpellingWord.position, SpellingWord.id)
        .all()
    )
    return [{"id": w.id, "word": w.word, "position": w.position, "week_start": str(w.week_start)} for w in words]


@router.post("/words")
def add_word(
    body: AddWordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    existing_count = (
        db.query(SpellingWord)
        .filter(SpellingWord.parent_id == current_user.id, SpellingWord.week_start == body.week_start)
        .count()
    )
    if existing_count >= 10:
        raise HTTPException(status_code=400, detail="Maximum 10 words per week")
    word = body.word.strip()
    if not word:
        raise HTTPException(status_code=400, detail="Word cannot be empty")
    sw = SpellingWord(
        parent_id=current_user.id,
        week_start=body.week_start,
        word=word,
        position=existing_count,
    )
    db.add(sw)
    db.commit()
    db.refresh(sw)
    return {"id": sw.id, "word": sw.word, "position": sw.position, "week_start": str(sw.week_start)}


@router.delete("/words/{word_id}")
def delete_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    sw = (
        db.query(SpellingWord)
        .filter(SpellingWord.id == word_id, SpellingWord.parent_id == current_user.id)
        .first()
    )
    if not sw:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(sw)
    db.commit()
    return {"ok": True}


@router.post("/results")
def save_result(
    body: SaveResultRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "parent":
        if not body.child_id:
            raise HTTPException(status_code=400, detail="Parent must specify child_id")
        child = (
            db.query(User)
            .filter(User.id == body.child_id, User.parent_id == current_user.id)
            .first()
        )
        if not child:
            raise HTTPException(status_code=403, detail="Child not found")
        child_id = body.child_id
        parent_id = current_user.id
    else:
        parent_id = current_user.parent_id
        if not parent_id:
            raise HTTPException(status_code=400, detail="No parent linked to this account")
        child_id = current_user.id

    result = SpellingResult(
        child_id=child_id,
        parent_id=parent_id,
        week_start=body.week_start,
        score=body.score,
        total=body.total,
        wrong_words=json.dumps(body.wrong_words),
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return {
        "id": result.id,
        "child_id": result.child_id,
        "week_start": str(result.week_start),
        "score": result.score,
        "total": result.total,
        "wrong_words": body.wrong_words,
        "taken_at": result.taken_at.isoformat() if result.taken_at else None,
    }


@router.get("/results")
def get_results(
    week_start: Optional[date] = None,
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    q = db.query(SpellingResult).filter(SpellingResult.parent_id == current_user.id)
    if week_start:
        q = q.filter(SpellingResult.week_start == week_start)
    if child_id:
        q = q.filter(SpellingResult.child_id == child_id)
    results = q.order_by(SpellingResult.week_start.desc(), SpellingResult.taken_at.desc()).all()
    return [
        {
            "id": r.id,
            "child_id": r.child_id,
            "week_start": str(r.week_start),
            "score": r.score,
            "total": r.total,
            "wrong_words": json.loads(r.wrong_words or "[]"),
            "taken_at": r.taken_at.isoformat() if r.taken_at else None,
        }
        for r in results
    ]
