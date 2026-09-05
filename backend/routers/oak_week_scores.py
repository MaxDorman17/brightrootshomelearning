# ---------------------------------------------------------------------------
# Week quiz scores — aggregated starter/exit scores for the dashboard week summary
# ---------------------------------------------------------------------------
from datetime import date, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import PlannerEntry, Lesson, User, OakQuizResult, PlannerCompletion
from auth import get_current_user, require_parent
from routers.oak import OAK_SHARE_RE

router = APIRouter(prefix="/api/oak", tags=["oak"])


def _child_ids_for_parent(db: Session, parent: User) -> List[int]:
    return [c.id for c in db.query(User).filter(User.parent_id == parent.id).all()]


def _build_day_buckets(start_date: date, end_date: date) -> list:
    days: list = []
    d = start_date
    while d <= end_date:
        days.append({
            "date": d.isoformat(),
            "day_name": d.strftime("%A"),
            "is_today": d == date.today(),
            "entries": [],
        })
        d += timedelta(days=1)
    return days


@router.get("/week-scores")
def get_week_quiz_scores(
    start_date: date = Query(..., description="Start of week yyyy-MM-dd"),
    end_date: date = Query(..., description="End of week yyyy-MM-dd"),
    child_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child_ids = _child_ids_for_parent(db, current_user)
    if child_id is not None and child_id not in child_ids:
        raise HTTPException(status_code=403, detail="Not your child")
    target_child_ids = [child_id] if child_id is not None else child_ids

    entries = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .options(joinedload(PlannerEntry.lesson))
        .filter(
            PlannerEntry.scheduled_date >= start_date,
            PlannerEntry.scheduled_date <= end_date,
            or_(
                PlannerEntry.assigned_to.in_(target_child_ids),
                and_(PlannerEntry.assigned_to.is_(None), Lesson.created_by == current_user.id),
            ),
        )
        .order_by(PlannerEntry.scheduled_date, Lesson.subject)
        .all()
    )

    shared_ids = [e.id for e in entries if e.assigned_to is None]
    comps_by_entry: dict = {}
    if shared_ids and target_child_ids:
        for comp in db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id.in_(shared_ids),
            PlannerCompletion.user_id.in_(target_child_ids),
            PlannerCompletion.completed_work_url.is_not(None),
        ).all():
            comps_by_entry.setdefault(comp.entry_id, []).append(comp)

    days = _build_day_buckets(start_date, end_date)

    grand = {"starter": 0, "starter_total": 0, "exit": 0, "exit_total": 0, "completed": 0, "total": 0}

    for e in entries:
        lesson = e.lesson
        entry_url = e.completed_work_url or ""
        entry_share_m = OAK_SHARE_RE.search(entry_url) if entry_url else None
        direct_share_url = entry_share_m.group(0) if entry_share_m else None

        if e.assigned_to is not None:
            children_for_entry = [e.assigned_to]
            direct_completed = e.is_complete and bool(direct_share_url)
        else:
            children_for_entry = [
                c.user_id for c in comps_by_entry.get(e.id, [])
                if c.completed_work_url is not None
            ] or target_child_ids
            direct_completed = False

        for cid in children_for_entry:
            if e.assigned_to is not None:
                url = direct_share_url
                done = direct_completed
            else:
                comp = next((c for c in comps_by_entry.get(e.id, []) if c.user_id == cid), None)
                url = comp.completed_work_url if comp else None
                share_m = OAK_SHARE_RE.search(url or "") if url else None
                url = share_m.group(0) if share_m else None
                done = comp is not None

            result = db.query(OakQuizResult).filter(OakQuizResult.url == url).first() if url else None
            ss = result.starter_score if result else None
            st = result.starter_total if result else None
            es = result.exit_score if result else None
            et = result.exit_total if result else None

            day = next((d for d in days if d["date"] == e.scheduled_date.isoformat()), None)
            if day is None:
                continue

            day["entries"].append({
                "entry_id": e.id,
                "child_id": cid,
                "lesson_title": lesson.title,
                "subject": lesson.subject,
                "scheduled_date": e.scheduled_date.isoformat(),
                "is_complete": done,
                "has_share_url": bool(url),
                "starter_score": ss,
                "starter_total": st,
                "exit_score": es,
                "exit_total": et,
            })

            day["total"] = day.get("total", 0) + 1
            if done:
                day["completed"] = day.get("completed", 0) + 1
                grand["completed"] += 1
            grand["total"] += 1

            if ss is not None and st:
                day["starter_score"] = day.get("starter_score", 0) + ss
                day["starter_total"] = day.get("starter_total", 0) + st
                grand["starter"] += ss
                grand["starter_total"] += st
            if es is not None and et:
                day["exit_score"] = day.get("exit_score", 0) + es
                day["exit_total"] = day.get("exit_total", 0) + et
                grand["exit"] += es
                grand["exit_total"] += et

    day_list = []
    for day in days:
        ts = day.get("starter_score", 0) or 0
        tt = day.get("starter_total", 0) or 0
        es = day.get("exit_score", 0) or 0
        et = day.get("exit_total", 0) or 0
        day_list.append({
            "date": day["date"],
            "day_name": day["day_name"],
            "is_today": day["is_today"],
            "entries": day["entries"],
            "total": day.get("total", 0),
            "completed": day.get("completed", 0),
            "starter_score": ts if tt else None,
            "starter_total": tt if tt else None,
            "exit_score": es if et else None,
            "exit_total": et if et else None,
            "total_score": ts + es if (tt or et) else None,
            "total_possible": tt + et,
        })

    return {
        "days": day_list,
        "grand_total": grand["total"],
        "grand_completed": grand["completed"],
        "grand_starter_score": grand["starter"],
        "grand_starter_total": grand["starter_total"],
        "grand_exit_score": grand["exit"],
        "grand_exit_total": grand["exit_total"],
        "grand_total_score": grand["starter"] + grand["exit"],
        "grand_total_possible": grand["starter_total"] + grand["exit_total"],
    }
