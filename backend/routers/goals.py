from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import date, datetime
from database import get_db
from models import WeeklyGoal, User
from schemas import WeeklyGoalCreate, WeeklyGoalOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/goals", tags=["goals"])


def _owned_goal(db: Session, current_user: User, goal_id: int) -> Optional[WeeklyGoal]:
    """Return the WeeklyGoal only if it belongs to current_user's own family
    (mirrors list_goals' scoping): a parent must have created it themselves;
    a child must be its target (or it must be a shared goal) created by
    their own linked parent. Returns None otherwise — callers 404 rather
    than reveal whether a goal exists for a different family."""
    q = db.query(WeeklyGoal).filter(WeeklyGoal.id == goal_id)
    if current_user.role == "child":
        q = q.filter(
            or_(WeeklyGoal.assigned_to == current_user.id, WeeklyGoal.assigned_to.is_(None)),
            WeeklyGoal.created_by == current_user.parent_id,
        )
    else:
        q = q.filter(WeeklyGoal.created_by == current_user.id)
    return q.first()


@router.get("/", response_model=List[WeeklyGoalOut])
def list_goals(
    week_start: Optional[date] = None,
    assigned_to: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(WeeklyGoal)
    if current_user.role == "child":
        query = query.filter(
            or_(WeeklyGoal.assigned_to == current_user.id, WeeklyGoal.assigned_to.is_(None)),
            # Unconditional (unlike before): if this child has no linked
            # parent, created_by == None can never match a real goal, so
            # this safely returns nothing instead of leaking every family's
            # shared goals.
            WeeklyGoal.created_by == current_user.parent_id,
        )
    else:
        query = query.filter(WeeklyGoal.created_by == current_user.id)
        if assigned_to:
            child = db.query(User).filter(User.id == assigned_to, User.parent_id == current_user.id).first()
            if not child:
                raise HTTPException(status_code=403, detail="Not your child")
            query = query.filter(
                or_(WeeklyGoal.assigned_to == assigned_to, WeeklyGoal.assigned_to.is_(None))
            )
    if week_start:
        query = query.filter(WeeklyGoal.week_start == week_start)
    return query.order_by(WeeklyGoal.week_start.desc(), WeeklyGoal.id).all()


@router.post("/", response_model=WeeklyGoalOut, status_code=201)
def create_goal(
    body: WeeklyGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    if body.assigned_to is not None:
        child = db.query(User).filter(User.id == body.assigned_to, User.parent_id == current_user.id).first()
        if not child:
            raise HTTPException(status_code=403, detail="Not your child")
    goal = WeeklyGoal(
        week_start=body.week_start,
        title=body.title,
        assigned_to=body.assigned_to,
        created_by=current_user.id,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.patch("/{goal_id}/toggle", response_model=WeeklyGoalOut)
def toggle_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = _owned_goal(db, current_user, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.is_complete = not goal.is_complete
    goal.completed_at = datetime.utcnow() if goal.is_complete else None
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=204)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    goal = _owned_goal(db, current_user, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
