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

# Safety ceiling, not a meaningful weekly target — prevents unbounded growth
# from a runaway client loop while removing the old hard 10-word limit.
MAX_WORDS_PER_WEEK = 50


class AddWordRequest(BaseModel):
    week_start: date
    word: str


class SaveResultRequest(BaseModel):
    week_start: date
    score: int
    total: int
    wrong_words: List[str] = []
    child_id: Optional[int] = None
    is_practice_round: bool = False


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
    if existing_count >= MAX_WORDS_PER_WEEK:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_WORDS_PER_WEEK} words per week")
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
        is_practice_round=body.is_practice_round,
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
        "is_practice_round": bool(result.is_practice_round),
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
            "is_practice_round": bool(r.is_practice_round),
            "taken_at": r.taken_at.isoformat() if r.taken_at else None,
        }
        for r in results
    ]


@router.get("/weak-words")
def get_weak_words(
    child_id: int,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Words this child has most often gotten wrong recently, ranked by frequency.
    Derived entirely from existing SpellingResult.wrong_words history — no new
    table. Family-scoped: 403s if child_id isn't one of this parent's own children."""
    child = db.query(User).filter(User.id == child_id, User.parent_id == current_user.id).first()
    if not child:
        raise HTTPException(status_code=403, detail="Not your child")

    recent = (
        db.query(SpellingResult)
        .filter(SpellingResult.child_id == child_id, SpellingResult.parent_id == current_user.id)
        .order_by(SpellingResult.taken_at.desc())
        .limit(50)
        .all()
    )
    counts: dict = {}
    for r in recent:
        for w in json.loads(r.wrong_words or "[]"):
            key = w.strip()
            if key:
                counts[key] = counts.get(key, 0) + 1

    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0].lower()))
    return [{"word": w, "times_wrong": c} for w, c in ranked[:limit]]
