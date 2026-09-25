from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, exists as sa_exists, select
from typing import List, Optional
from datetime import date, timedelta, datetime
import json
from database import get_db
from models import PlannerEntry, Lesson, User, WorkFeedback, WorkReview, PlannerCompletion, DayOff, TimetableConfig
from schemas import PlannerEntryCreate, PlannerEntryUpdate, PlannerEntryOut, LessonOut
from auth import get_current_user, require_parent
from routers.oak import OAK_SHARE_RE, fetch_and_store_share_result
from pydantic import BaseModel

router = APIRouter(prefix="/api/planner", tags=["planner"])


class ShiftDayRequest(BaseModel):
    from_date: date
    to_date: date
    direction: str = "forward"


class MoveEntryRequest(BaseModel):
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
        completed_note=e.completed_note, is_extra=bool(e.is_extra),
        lesson=LessonOut.model_validate(e.lesson),
    )


def _to_out_with_comp(e: PlannerEntry, comp) -> PlannerEntryOut:
    return PlannerEntryOut(
        id=e.id, lesson_id=e.lesson_id, assigned_to=e.assigned_to,
        scheduled_date=e.scheduled_date, is_complete=comp is not None,
        completed_at=comp.completed_at if comp else None,
        completed_work_url=comp.completed_work_url if comp else None,
        completed_note=comp.completed_note if comp else None,
        is_extra=bool(e.is_extra),
        lesson=LessonOut.model_validate(e.lesson),
    )


def _to_out_with_shared_completion(e: PlannerEntry, comp) -> PlannerEntryOut:
    """For a shared (assigned_to=NULL) entry, is_complete/completed_at are already
    kept correct on PlannerEntry itself (mark_complete writes the any-child-done
    aggregate there). completed_work_url/completed_note, however, are only ever
    written to PlannerCompletion for these entries, so backfill them from the
    best matching completion (picked by the caller)."""
    return PlannerEntryOut(
        id=e.id, lesson_id=e.lesson_id, assigned_to=e.assigned_to,
        scheduled_date=e.scheduled_date, is_complete=e.is_complete,
        completed_at=e.completed_at,
        completed_work_url=comp.completed_work_url if comp else e.completed_work_url,
        completed_note=comp.completed_note if comp else e.completed_note,
        is_extra=bool(e.is_extra),
        lesson=LessonOut.model_validate(e.lesson),
    )


def _child_ids_for_parent(db: Session, parent: User) -> List[int]:
    return [c.id for c in db.query(User).filter(User.parent_id == parent.id).all()]


def _validate_parent_child(db: Session, parent: User, child_id: Optional[int]) -> None:
    if child_id is None:
        return
    exists = db.query(User.id).filter(
        User.id == child_id,
        User.parent_id == parent.id,
        User.role == "child",
    ).first()
    if not exists:
        raise HTTPException(status_code=403, detail="Not your child")


def _entry_for_parent(db: Session, entry_id: int, parent: User) -> Optional[PlannerEntry]:
    return (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .options(joinedload(PlannerEntry.lesson))
        .filter(
            PlannerEntry.id == entry_id,
            Lesson.created_by == parent.id,
            or_(
                PlannerEntry.assigned_to.is_(None),
                PlannerEntry.assigned_to.in_(_child_ids_for_parent(db, parent)),
            ),
        )
        .first()
    )


def _entry_for_user(db: Session, entry_id: int, user: User) -> Optional[PlannerEntry]:
    query = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .options(joinedload(PlannerEntry.lesson))
        .filter(PlannerEntry.id == entry_id)
    )

    if user.role == "parent":
        return query.filter(
            Lesson.created_by == user.id,
            or_(
                PlannerEntry.assigned_to.is_(None),
                PlannerEntry.assigned_to.in_(_child_ids_for_parent(db, user)),
            ),
        ).first()

    if user.role == "child":
        if user.parent_id is None:
            return None
        return query.filter(
            Lesson.created_by == user.parent_id,
            or_(
                PlannerEntry.assigned_to == user.id,
                PlannerEntry.assigned_to.is_(None),
            ),
        ).first()

    return None


def _best_shared_completions(db: Session, entry_ids: List[int], child_ids: List[int]) -> dict:
    """For each shared entry, pick the one PlannerCompletion (among this parent's
    own children) that best represents 'the' submitted work: prefer a completion
    with a URL, tie-broken by most recently completed."""
    best: dict = {}
    if not entry_ids or not child_ids:
        return best
    completions = db.query(PlannerCompletion).filter(
        PlannerCompletion.entry_id.in_(entry_ids),
        PlannerCompletion.user_id.in_(child_ids),
    ).all()
    for comp in completions:
        current = best.get(comp.entry_id)
        if current is None:
            best[comp.entry_id] = comp
            continue
        current_has_url = current.completed_work_url is not None
        comp_has_url = comp.completed_work_url is not None
        if comp_has_url and not current_has_url:
            best[comp.entry_id] = comp
        elif comp_has_url == current_has_url and (comp.completed_at or datetime.min) > (current.completed_at or datetime.min):
            best[comp.entry_id] = comp
    return best


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


@router.post("/{entry_id}/move")
def move_single_entry(
    entry_id: int,
    body: MoveEntryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Move one planner lesson by one available school day.

    This is intentionally independent of the timetable subject pattern: it
    simply moves the selected lesson to the next/previous weekday that is not
    marked as a day off. Other planner entries are left untouched.
    """
    if body.direction not in {"forward", "backward"}:
        raise HTTPException(status_code=400, detail="Direction must be forward or backward")

    entry = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .options(joinedload(PlannerEntry.lesson))
        .filter(
            PlannerEntry.id == entry_id,
            Lesson.created_by == current_user.id,
            or_(
                PlannerEntry.assigned_to.is_(None),
                PlannerEntry.assigned_to.in_(_child_ids_for_parent(db, current_user)),
            ),
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    days_off = {
        row.date
        for row in db.query(DayOff).filter(DayOff.parent_id == current_user.id).all()
    }

    step = 1 if body.direction == "forward" else -1
    target = entry.scheduled_date + timedelta(days=step)

    def has_subject_collision(candidate: date) -> bool:
        q = (
            db.query(PlannerEntry)
            .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
            .filter(
                PlannerEntry.id != entry.id,
                PlannerEntry.scheduled_date == candidate,
                Lesson.subject == entry.lesson.subject,
                Lesson.created_by == current_user.id,
            )
        )

        if entry.assigned_to is not None:
            q = q.filter(
                or_(
                    PlannerEntry.assigned_to == entry.assigned_to,
                    PlannerEntry.assigned_to.is_(None),
                )
            )

        return q.first() is not None

    for _ in range(730):
        if (
            target.weekday() < 5
            and target not in days_off
            and not has_subject_collision(target)
        ):
            break
        target += timedelta(days=step)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Could not find another school day without a {entry.lesson.subject} collision",
        )

    entry.scheduled_date = target
    db.commit()
    db.refresh(entry)

    return {
        "entry_id": entry.id,
        "scheduled_date": entry.scheduled_date.isoformat(),
        "direction": body.direction,
    }


@router.post("/shift-day")
def shift_day(
    body: ShiftDayRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    timetable_row = db.query(TimetableConfig).filter(
        TimetableConfig.parent_id == current_user.id
    ).first()

    if timetable_row:
        timetable = json.loads(timetable_row.config)
    else:
        timetable = {
            "Monday": ["Maths", "English", "Science", "History", "Computing"],
            "Tuesday": ["Maths", "English", "Science", "Geography", "Cooking"],
            "Wednesday": ["Maths", "English", "Science", "Art & Design", "Design and Technology"],
            "Thursday": ["Maths", "English", "Science", "History", "Life Skills"],
            "Friday": ["Maths", "English", "Science", "Languages"],
        }

    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    days_off = {
        row.date
        for row in db.query(DayOff).filter(DayOff.parent_id == current_user.id).all()
    }

    entries = (
        db.query(PlannerEntry)
        .options(joinedload(PlannerEntry.lesson))
        .filter(
            PlannerEntry.scheduled_date >= body.from_date,
            PlannerEntry.is_extra.is_(False),
            PlannerEntry.lesson.has(Lesson.created_by == current_user.id),
            or_(
                PlannerEntry.assigned_to.is_(None),
                PlannerEntry.assigned_to.in_(_child_ids_for_parent(db, current_user)),
            ),
        )
        .order_by(
            PlannerEntry.scheduled_date.asc(),
            PlannerEntry.id.asc(),
        )
        .all()
    )

    if not entries:
        return {"moved": 0}

    occupied = {
        (
            row.scheduled_date,
            row.lesson.subject,
            row.assigned_to,
        )
        for row in (
            db.query(PlannerEntry)
            .options(joinedload(PlannerEntry.lesson))
            .filter(
                PlannerEntry.scheduled_date < body.from_date,
                PlannerEntry.is_extra.is_(False),
                PlannerEntry.lesson.has(Lesson.created_by == current_user.id),
                or_(
                    PlannerEntry.assigned_to.is_(None),
                    PlannerEntry.assigned_to.in_(_child_ids_for_parent(db, current_user)),
                ),
            )
            .all()
        )
    }

    def valid_for_subject(target: date, subject: str) -> bool:
        if target.weekday() >= 5:
            return False

        if target in days_off:
            return False

        day_name = day_names[target.weekday()]
        return subject in (timetable.get(day_name) or [])

    def find_slot(
        start: date,
        subject: str,
        assigned_to: Optional[int],
        direction: str,
    ) -> date:
        step = 1 if direction == "forward" else -1
        target = start + timedelta(days=step)

        for _ in range(730):
            key = (target, subject, assigned_to)

            if valid_for_subject(target, subject) and key not in occupied:
                return target

            target += timedelta(days=step)

        raise HTTPException(
            status_code=400,
            detail=f"Could not find another timetable slot for {subject}.",
        )

    if body.direction == "backward":
        entries = list(reversed(entries))

    moved = 0

    try:
        for entry in entries:
            old_key = (
                entry.scheduled_date,
                entry.lesson.subject,
                entry.assigned_to,
            )

            occupied.discard(old_key)

            new_date = find_slot(
                entry.scheduled_date,
                entry.lesson.subject,
                entry.assigned_to,
                body.direction,
            )

            entry.scheduled_date = new_date

            occupied.add(
                (
                    new_date,
                    entry.lesson.subject,
                    entry.assigned_to,
                )
            )

            moved += 1

        db.commit()

    except Exception:
        db.rollback()
        raise

    return {"moved": moved}

@router.post("/", response_model=PlannerEntryOut, status_code=201)
def create_entry(
    entry_in: PlannerEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    lesson = db.query(Lesson).filter(
        Lesson.id == entry_in.lesson_id,
        Lesson.created_by == current_user.id,
    ).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    _validate_parent_child(db, current_user, entry_in.assigned_to)

    entry = PlannerEntry(
        lesson_id=entry_in.lesson_id,
        assigned_to=entry_in.assigned_to,
        scheduled_date=entry_in.scheduled_date,
        is_extra=entry_in.is_extra,
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
        if current_user.parent_id is None:
            return []
        query = query.filter(
            PlannerEntry.lesson.has(Lesson.created_by == current_user.parent_id),
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None)),
        )
        entries = query.order_by(PlannerEntry.scheduled_date).all()
        return annotate_for_user(entries, current_user, db)

    if child_id is not None:
        allowed_child_ids = _child_ids_for_parent(db, current_user)
        if child_id not in allowed_child_ids:
            raise HTTPException(status_code=403, detail="Not your child")

        query = query.filter(
            PlannerEntry.lesson.has(Lesson.created_by == current_user.id),
            or_(PlannerEntry.assigned_to == child_id, PlannerEntry.assigned_to.is_(None)),
        )
        entries = query.order_by(PlannerEntry.scheduled_date).all()

        shared_ids = [e.id for e in entries if e.assigned_to is None]
        comp_map = {}
        if shared_ids:
            comp_map = {
                c.entry_id: c
                for c in db.query(PlannerCompletion).filter(
                    PlannerCompletion.entry_id.in_(shared_ids),
                    PlannerCompletion.user_id == child_id,
                ).all()
            }

        return [
            _to_out_with_comp(e, comp_map.get(e.id)) if e.assigned_to is None else _to_out(e)
            for e in entries
        ]

    query = query.filter(PlannerEntry.lesson.has(Lesson.created_by == current_user.id))
    entries = query.order_by(PlannerEntry.scheduled_date).all()
    return [_to_out(e) for e in entries]


@router.get("/mine", response_model=List[PlannerEntryOut])
def get_mine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(PlannerEntry).options(joinedload(PlannerEntry.lesson))
    if current_user.role == "child":
        if current_user.parent_id is None:
            return []
        query = query.filter(
            PlannerEntry.lesson.has(Lesson.created_by == current_user.parent_id),
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None)),
        )
    else:
        query = query.filter(PlannerEntry.lesson.has(Lesson.created_by == current_user.id))
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
        if current_user.parent_id is None:
            return []
        query = query.filter(
            PlannerEntry.lesson.has(Lesson.created_by == current_user.parent_id),
            or_(PlannerEntry.assigned_to == current_user.id, PlannerEntry.assigned_to.is_(None)),
        )
    else:
        query = query.filter(PlannerEntry.lesson.has(Lesson.created_by == current_user.id))
    entries = query.order_by(PlannerEntry.id).all()
    return annotate_for_user(entries, current_user, db)


@router.get("/all", response_model=List[PlannerEntryOut])
def get_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child_ids = _child_ids_for_parent(db, current_user)
    entries = db.query(PlannerEntry).join(Lesson, PlannerEntry.lesson_id == Lesson.id).options(
        joinedload(PlannerEntry.lesson)
    ).filter(
        Lesson.created_by == current_user.id,
        or_(
            PlannerEntry.assigned_to.in_(child_ids),
            PlannerEntry.assigned_to.is_(None),
        ),
    ).order_by(
        PlannerEntry.scheduled_date.desc()
    ).all()

    shared_ids = [e.id for e in entries if e.assigned_to is None]
    best_completion = _best_shared_completions(db, shared_ids, child_ids)

    return [
        _to_out_with_shared_completion(e, best_completion.get(e.id)) if e.assigned_to is None else _to_out(e)
        for e in entries
    ]


@router.get("/submission-count")
def get_submission_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    child_ids = _child_ids_for_parent(db, current_user)
    has_feedback = sa_exists(select(WorkFeedback.id).where(WorkFeedback.entry_id == PlannerEntry.id).correlate(PlannerEntry))
    has_review = sa_exists(
        select(WorkReview.id).where(
            WorkReview.entry_id == PlannerEntry.id,
            WorkReview.parent_id == current_user.id,
        ).correlate(PlannerEntry)
    )
    has_shared_submission = sa_exists(
        select(PlannerCompletion.id).where(
            PlannerCompletion.entry_id == PlannerEntry.id,
            PlannerCompletion.user_id.in_(child_ids),
            PlannerCompletion.completed_work_url.is_not(None),
        ).correlate(PlannerEntry)
    )
    count = db.query(PlannerEntry).join(Lesson, PlannerEntry.lesson_id == Lesson.id).filter(
        PlannerEntry.is_complete == True,
        or_(PlannerEntry.completed_work_url.is_not(None), has_shared_submission),
        Lesson.created_by == current_user.id,
        or_(
            PlannerEntry.assigned_to.in_(child_ids),
            PlannerEntry.assigned_to.is_(None),
        ),
        ~has_feedback,
        ~has_review,
    ).count()
    return {"count": count}


@router.get("/pending-feedback")
def get_pending_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Submitted work that has no feedback yet - powers the notification bell."""
    children = db.query(User).filter(User.parent_id == current_user.id).all()
    child_ids = [c.id for c in children]
    child_names = {c.id: c.username for c in children}
    has_feedback = sa_exists(select(WorkFeedback.id).where(WorkFeedback.entry_id == PlannerEntry.id).correlate(PlannerEntry))
    has_review = sa_exists(
        select(WorkReview.id).where(
            WorkReview.entry_id == PlannerEntry.id,
            WorkReview.parent_id == current_user.id,
        ).correlate(PlannerEntry)
    )
    has_shared_submission = sa_exists(
        select(PlannerCompletion.id).where(
            PlannerCompletion.entry_id == PlannerEntry.id,
            PlannerCompletion.user_id.in_(child_ids),
            PlannerCompletion.completed_work_url.is_not(None),
        ).correlate(PlannerEntry)
    )
    entries = db.query(PlannerEntry).join(Lesson, PlannerEntry.lesson_id == Lesson.id).options(
        joinedload(PlannerEntry.lesson)
    ).filter(
        PlannerEntry.is_complete == True,
        or_(PlannerEntry.completed_work_url.is_not(None), has_shared_submission),
        Lesson.created_by == current_user.id,
        or_(
            PlannerEntry.assigned_to.in_(child_ids),
            PlannerEntry.assigned_to.is_(None),
        ),
        ~has_feedback,
        ~has_review,
    ).order_by(PlannerEntry.scheduled_date.desc()).all()

    # For shared entries, resolve which of this parent's children actually submitted.
    shared_ids = [e.id for e in entries if e.assigned_to is None]
    submitters: dict = {}
    if shared_ids and child_ids:
        completions = db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id.in_(shared_ids),
            PlannerCompletion.user_id.in_(child_ids),
            PlannerCompletion.completed_work_url.is_not(None),
        ).all()
        for comp in completions:
            submitters.setdefault(comp.entry_id, []).append(child_names.get(comp.user_id))

    def child_label(e: PlannerEntry) -> Optional[str]:
        if e.assigned_to:
            return child_names.get(e.assigned_to)
        names = submitters.get(e.id)
        return ", ".join(n for n in names if n) if names else None

    return [
        {
            "entry_id": e.id,
            "title": e.lesson.title,
            "subject": e.lesson.subject,
            "date": e.scheduled_date.isoformat(),
            "child": child_label(e),
        }
        for e in entries
    ]


@router.patch("/{entry_id}/complete", response_model=PlannerEntryOut)
def mark_complete(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = _entry_for_user(db, entry_id, current_user)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

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
    entry = _entry_for_user(db, entry_id, current_user)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

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
    entry = _entry_for_user(db, entry_id, current_user)
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
    entry = _entry_for_parent(db, entry_id, current_user)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    changes = entry_in.model_dump(exclude_unset=True)
    if "assigned_to" in changes:
        _validate_parent_child(db, current_user, changes["assigned_to"])

    for field, value in changes.items():
        setattr(entry, field, value)
    db.commit()
    return _to_out(load_entry(db, entry_id))


@router.delete("/{entry_id}", status_code=204)
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    entry = _entry_for_parent(db, entry_id, current_user)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
