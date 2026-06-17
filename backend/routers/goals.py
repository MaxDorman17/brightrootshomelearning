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
            or_(WeeklyGoal.assigned_to == current_user.id, WeeklyGoal.assigned_to.is_(None))
        )
        # Only show goals set by this child's parent
        if current_user.parent_id:
            query = query.filter(WeeklyGoal.created_by == current_user.parent_id)
    else:
        query = query.filter(WeeklyGoal.created_by == current_user.id)
        if assigned_to:
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
    goal = db.query(WeeklyGoal).filter(WeeklyGoal.id == goal_id).first()
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
    goal = db.query(WeeklyGoal).filter(
        WeeklyGoal.id == goal_id,
        WeeklyGoal.created_by == current_user.id,
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
