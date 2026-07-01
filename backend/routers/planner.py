from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, exists as sa_exists, select
from typing import List, Optional
from datetime import date, timedelta, datetime
from database import get_db
from models import PlannerEntry, Lesson, User, WorkFeedback, PlannerCompletion
from schemas import PlannerEntryCreate, PlannerEntryUpdate, PlannerEntryOut, LessonOut
from auth import get_current_user, require_parent
from routers.oak import OAK_SHARE_RE, fetch_and_store_share_result
from pydantic import BaseModel

router = APIRouter(prefix="/api/planner", tags=["planner"])


class ShiftDayRequest(BaseModel):
    from_date: date
    to_date: date
    direction: str = "forward"


class SubmitWorkUrl(BaseModel):
    completed_work_url: str


class SubmitNote(BaseModel):
    completed_note: str


def load_entry(db: Session, entry_id: int) -> PlannerEntry:
    return db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).filter(
        PlannerEntry.id == entry_id
    ).first()


def _to_out(e: PlannerEntry) -> PlannerEntryOut:
    return PlannerEntryOut(
        id=e.id, lesson_id=e.lesson_id, assigned_to=e.assigned_to,
        scheduled_date=e.scheduled_date, is_complete=e.is_complete,
        completed_at=e.completed_at, completed_work_url=e.completed_work_url,
        completed_note=e.completed_note, lesson=LessonOut.model_validate(e.lesson),
    )


def _to_out_with_comp(e: PlannerEntry, comp) -> PlannerEntryOut:
    return PlannerEntryOut(
        id=e.id, lesson_id=e.lesson_id, assigned_to=e.assigned_to,
        scheduled_date=e.scheduled_date, is_complete=comp is not None,
        completed_at=comp.completed_at if comp else None,
        completed_work_url=comp.completed_work_url if comp else None,
        completed_note=comp.completed_note if comp else None,
        lesson=LessonOut.model_validate(e.lesson),
    )


def annotate_for_user(entries: list, user: User, db: Session) -> List[PlannerEntryOut]:
    """Return entries with per-user completion for null-assigned entries when user is a child."""
    if user.role != "child":
        return [_to_out(e) for e in entries]
    null_ids = [e.id for e in entries if e.assigned_to is None]
    comp_map: dict = {}
    if null_ids:
        comp_map = {
            c.entry_id: c
            for c in db.query(PlannerCompletion).filter(
                PlannerCompletion.entry_id.in_(null_ids),
                PlannerCompletion.user_id == user.id,
            ).all()
        }
    return [
        _to_out_with_comp(e, comp_map.get(e.id)) if e.assigned_to is None else _to_out(e)
        for e in entries
    ]


def annotate_single(entry: PlannerEntry, user: User, db: Session) -> PlannerEntryOut:
    if user.role != "child" or entry.assigned_to is not None:
        return _to_out(entry)
    comp = db.query(PlannerCompletion).filter(
        PlannerCompletion.entry_id == entry.id,
        PlannerCompletion.user_id == user.id,
    ).first()
    return _to_out_with_comp(entry, comp)


def _next_weekday(d: date) -> date:
    d = d + timedelta(days=1)
    while d.weekday() >= 5:
        d += timedelta(days=1)
    return d


def _prev_weekday(d: date) -> date:
    d = d - timedelta(days=1)
    while d.weekday() >= 5:
        d -= timedelta(days=1)
    return d


@router.post("/shift-day")
def shift_day(
    body: ShiftDayRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entries = db.query(PlannerEntry).filter(
        PlannerEntry.scheduled_date >= body.from_date
    ).all()
    for e in entries:
        e.scheduled_date = _prev_weekday(e.scheduled_date) if body.direction == "backward" else _next_weekday(e.scheduled_date)
    db.commit()
    return {"moved": len(entries)}


@router.post("/", response_model=PlannerEntryOut, status_code=201)
def create_entry(
    entry_in: PlannerEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    lesson = db.query(Lesson).filter(Lesson.id == entry_in.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    entry = PlannerEntry(
        lesson_id=entry_in.lesson_id,
        assigned_to=entry_in.assigned_to,
        scheduled_date=entry_in.scheduled_date,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return _to_out(load_entry(db, entry.id))


@router.get("/week", response_model=List[PlannerEntryOut])
def get_week(
    start_date: date = None,
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if start_date is None:
        today = date.today()
        start_date = today - timedelta(days=today.weekday())
    end_date = start_date + timedelta(days=6)

    query = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).filter(
        PlannerEntry.scheduled_date >= start_date,
        PlannerEntry.scheduled_date <= end_date,
    )
    if current_user.role == "child":
        query = query.filter(
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None))
        )
    elif child_id:
        query = query.filter(
            or_(PlannerEntry.assigned_to == child_id, PlannerEntry.assigned_to.is_(None))
        )
    entries = query.order_by(PlannerEntry.scheduled_date).all()
    return annotate_for_user(entries, current_user, db)


@router.get("/mine", response_model=List[PlannerEntryOut])
def get_mine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson))
    if current_user.role == "child":
        query = query.filter(
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None))
        )
    entries = query.order_by(PlannerEntry.scheduled_date.desc()).all()
    return annotate_for_user(entries, current_user, db)


@router.get("/today", response_model=List[PlannerEntryOut])
def get_today(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    query = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).filter(
        PlannerEntry.scheduled_date == today,
    )
    if current_user.role == "child":
        query = query.filter(
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None))
        )
    entries = query.order_by(PlannerEntry.id).all()
    return annotate_for_user(entries, current_user, db)


@router.get("/all", response_model=List[PlannerEntryOut])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entries = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson)).order_by(
        PlannerEntry.scheduled_date.desc()
    ).all()
    return [_to_out(e) for e in entries]


@router.get("/submission-count")
def get_submission_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child_ids = [c.id for c in db.query(User).filter(User.parent_id == current_user.id).all()]
    has_feedback = sa_exists(select(WorkFeedback.id).where(WorkFeedback.entry_id == PlannerEntry.id).correlate(PlannerEntry))
    count = db.query(PlannerEntry).filter(
        PlannerEntry.is_complete == True,
        PlannerEntry.completed_work_url.is_not(None),
        or_(PlannerEntry.assigned_to.in_(child_ids), PlannerEntry.assigned_to.is_(None)),
        ~has_feedback,
    ).count()
    return {"count": count}


@router.patch("/{entry_id}/complete", response_model=PlannerEntryOut)
def mark_complete(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = load_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    if current_user.role == "child" and entry.assigned_to is not None and entry.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not your lesson")

    if current_user.role == "child" and entry.assigned_to is None:
        comp = db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id == entry_id,
            PlannerCompletion.user_id == current_user.id,
        ).first()
        if comp:
            db.delete(comp)
            db.flush()
        else:
            db.add(PlannerCompletion(entry_id=entry_id, user_id=current_user.id))
            db.flush()
        any_done = db.query(PlannerCompletion).filter(PlannerCompletion.entry_id == entry_id).count() > 0
        entry.is_complete = any_done
        entry.completed_at = datetime.utcnow() if any_done else None
        db.commit()
        db.refresh(entry)
        return annotate_single(entry, current_user, db)

    entry.is_complete = not entry.is_complete
    entry.completed_at = datetime.utcnow() if entry.is_complete else None
    db.commit()
    return _to_out(load_entry(db, entry_id))


@router.patch("/{entry_id}/submit-work", response_model=PlannerEntryOut)
def submit_work(
    entry_id: int,
    body: SubmitWorkUrl,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = load_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    if current_user.role == "child" and entry.assigned_to is not None and entry.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not your lesson")

    # If this is an Oak "share my results" link, fetch quiz scores in the background
    share_match = OAK_SHARE_RE.search(body.completed_work_url or "")
    if share_match:
        background_tasks.add_task(fetch_and_store_share_result, share_match.group(0))

    if current_user.role == "child" and entry.assigned_to is None:
        comp = db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id == entry_id,
            PlannerCompletion.user_id == current_user.id,
        ).first()
        if not comp:
            comp = PlannerCompletion(entry_id=entry_id, user_id=current_user.id)
            db.add(comp)
        comp.completed_work_url = body.completed_work_url
        db.commit()
        db.refresh(entry)
        return annotate_single(entry, current_user, db)

    entry.completed_work_url = body.completed_work_url
    db.commit()
    return _to_out(load_entry(db, entry_id))


@router.patch("/{entry_id}/note", response_model=PlannerEntryOut)
def submit_note(
    entry_id: int,
    body: SubmitNote,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = load_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    if current_user.role == "child" and entry.assigned_to is None:
        comp = db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id == entry_id,
            PlannerCompletion.user_id == current_user.id,
        ).first()
        if not comp:
            comp = PlannerCompletion(entry_id=entry_id, user_id=current_user.id)
            db.add(comp)
        comp.completed_note = body.completed_note
        db.commit()
        db.refresh(entry)
        return annotate_single(entry, current_user, db)

    entry.completed_note = body.completed_note
    db.commit()
    return _to_out(load_entry(db, entry_id))


@router.put("/{entry_id}", response_model=PlannerEntryOut)
def update_entry(
    entry_id: int,
    entry_in: PlannerEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entry = db.query(PlannerEntry).filter(PlannerEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for field, value in entry_in.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    return _to_out(load_entry(db, entry_id))


@router.delete("/{entry_id}", status_code=204)
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entry = db.query(PlannerEntry).filter(PlannerEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
