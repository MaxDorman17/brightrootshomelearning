from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user, require_child
from database import get_db
from models import GameScore, User
from routers.test_results import _resolve_child

router = APIRouter(prefix="/api/games", tags=["games"])

GAMES = {"spelling_bee", "word_scramble", "times_tables", "maths_sprint", "memory_match"}
MAX_SCORE = 10000


class ScoreIn(BaseModel):
    game: str
    score: int
    detail: Optional[str] = None

    @field_validator("game")
    @classmethod
    def valid_game(cls, value: str) -> str:
        if value not in GAMES:
            raise ValueError("Unknown game")
        return value

    @field_validator("score")
    @classmethod
    def valid_score(cls, value: int) -> int:
        if not 0 <= value <= MAX_SCORE:
            raise ValueError("Score out of range")
        return value


def _summary(db: Session, child: User, parent_id: int) -> dict:
    rows = db.query(GameScore).filter(GameScore.child_id == child.id, GameScore.parent_id == parent_id).all()
    week_ago = datetime.utcnow() - timedelta(days=7)
    games = {}
    for game in sorted(GAMES):
        mine = [r for r in rows if r.game == game]
        best = max(mine, key=lambda r: r.score, default=None)
        games[game] = {
            "best": best.score if best else None,
            "best_detail": best.detail if best else None,
            "played": len(mine),
            "played_this_week": sum(1 for r in mine if r.created_at and r.created_at.replace(tzinfo=None) >= week_ago),
        }
    return {"child": {"id": child.id, "username": child.username}, "games": games}


@router.post("/scores", status_code=201)
def save_score(body: ScoreIn, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    if not current_user.parent_id:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    previous_best = (
        db.query(GameScore.score)
        .filter(GameScore.child_id == current_user.id, GameScore.game == body.game)
        .order_by(GameScore.score.desc())
        .first()
    )
    db.add(GameScore(
        child_id=current_user.id,
        parent_id=current_user.parent_id,
        game=body.game,
        score=body.score,
        detail=(body.detail or "").strip()[:100] or None,
    ))
    db.commit()
    return {"new_best": previous_best is None or body.score > previous_best[0], "previous_best": previous_best[0] if previous_best else None}


@router.get("/summary")
def games_summary(
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    child, parent_id = _resolve_child(db, current_user, child_id)
    return _summary(db, child, parent_id)
