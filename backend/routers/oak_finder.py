"""The Oak lesson finder: a grown-up picks a subject and school year, sees Oak's units and lessons in
Oak's own order, and adds a lesson or a whole unit to the planner. No web addresses to copy.

The lists come from Oak's API and are kept for a week, as they rarely change. They are kept in the same
table as the lessons themselves, under names starting "list:", which no lesson can have.
"""
import json
import logging
import re
from datetime import date, datetime, timedelta
from typing import Callable, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import require_parent
from config import settings
from database import get_db
from models import Lesson, OakLesson, PlannerEntry, User
from routers.moments import _clean_child_ids
from routers.oak_lessons import KEEP_FOR, _api_base, _headers
from routers.planner import teaching_days

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/oak-finder", tags=["oak-finder"])

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
MAX_PLANNED_AT_ONCE = 40
OAK_SCHEME = "Oak National Academy"
# The exam boards and courses that appear at the end of Oak's names for its secondary courses.
BOARDS = {"aqa": "AQA", "edexcel": "Edexcel", "ocr": "OCR", "eduqas": "Eduqas", "wjec": "WJEC", "core": "Core", "gcse": "GCSE"}


def lesson_link(slug: str) -> str:
    """Oak's own short address for a lesson, which works for every year and exam board."""
    return f"https://www.thenational.academy/pupils/lessons/{slug}"


def _get(client: httpx.Client, path: str):
    r = client.get(f"{_api_base()}{path}")
    if r.status_code != 200:
        raise httpx.HTTPError(f"{path} answered {r.status_code}")
    return r.json()


def _kept(db: Session, name: str, fetch: Callable[[httpx.Client], object]):
    """A list from Oak, from our kept copy when it is fresh enough. An old copy is better than none if Oak can't be reached."""
    row = db.query(OakLesson).filter(OakLesson.slug == name).first()
    now = datetime.utcnow()
    if row and now - row.fetched_at.replace(tzinfo=None) < KEEP_FOR:
        return json.loads(row.data)
    try:
        if not settings.OAK_API_KEY:
            raise httpx.HTTPError("no Oak key set")
        with httpx.Client(timeout=20, headers=_headers()) as client:
            fresh = fetch(client)
    except (httpx.HTTPError, ValueError, KeyError, TypeError) as exc:
        logger.warning("Oak finder %s could not be fetched: %s", name, exc)
        if row:
            return json.loads(row.data)
        raise HTTPException(status_code=502, detail="We couldn't reach Oak just now. Please try again in a moment.")
    if row:
        row.data, row.fetched_at = json.dumps(fresh), now
    else:
        db.add(OakLesson(slug=name, data=json.dumps(fresh), fetched_at=now))
    db.commit()
    return fresh


def _course_label(sequence: str, subject: str) -> str:
    """ "science-secondary-aqa" -> "AQA". Empty when a subject has only one course for that age."""
    end = sequence.removeprefix(f"{subject}-").removeprefix("primary").removeprefix("secondary").strip("-")
    return " ".join(BOARDS.get(part, part.capitalize()) for part in end.split("-") if part)


def _fetch_subjects(client: httpx.Client) -> list:
    out = []
    for slug in _get(client, "/subjects"):
        info = _get(client, f"/subjects/{slug}")
        courses = [
            {"slug": s["sequenceSlug"], "years": sorted(int(y) for y in s.get("years") or [] if str(y).isdigit()), "label": _course_label(s["sequenceSlug"], slug)}
            for s in info.get("sequenceSlugs") or []
        ]
        years = sorted({y for c in courses for y in c["years"]})
        if years:
            out.append({"slug": slug, "title": info.get("subjectTitle") or slug.replace("-", " ").capitalize(), "years": years, "courses": courses})
    return sorted(out, key=lambda s: s["title"])


def _unit_groups(node, label: str = "") -> list:
    """Oak nests older years by exam subject and tier. This flattens whatever it sends into labelled groups of units."""
    groups = []
    if isinstance(node, list):
        for item in node:
            groups += _unit_groups(item, label)
    elif isinstance(node, dict):
        titles = [str(v) for k, v in node.items() if k.endswith("Title") and k != "unitTitle" and isinstance(v, str)]
        here = " · ".join(part for part in [label, *[t.capitalize() if t.islower() else t for t in titles]] if part)
        units = node.get("units")
        if isinstance(units, list):
            flat = []
            for unit in units:
                # A unit with a choice of versions lists them as options; each is offered.
                for one in (unit.get("unitOptions") or [unit]) if isinstance(unit, dict) else []:
                    if isinstance(one, dict) and one.get("unitSlug") and one.get("unitTitle"):
                        flat.append({"slug": one["unitSlug"], "title": one["unitTitle"]})
            if flat:
                groups.append({"label": here, "units": flat})
        for key, value in node.items():
            if key != "units" and isinstance(value, list):
                groups += _unit_groups(value, here)
    return groups


def _fetch_unit(slug: str) -> Callable[[httpx.Client], dict]:
    def fetch(client: httpx.Client) -> dict:
        info = _get(client, f"/units/{slug}/summary")
        lessons = sorted(
            (l for l in info.get("unitLessons") or [] if isinstance(l, dict) and l.get("state", "published") == "published" and l.get("lessonSlug")),
            key=lambda l: l.get("lessonOrder") or 0,
        )
        return {
            "slug": slug,
            "title": info.get("unitTitle") or "",
            "description": info.get("description") or "",
            "year": info.get("year"),
            "lessons": [{"slug": l["lessonSlug"], "title": l.get("lessonTitle") or ""} for l in lessons],
        }

    return fetch


@router.get("/subjects")
def finder_subjects(db: Session = Depends(get_db), _: User = Depends(require_parent)):
    """Every subject Oak teaches, with the school years it covers."""
    return _kept(db, "list:subjects", _fetch_subjects)


@router.get("/units")
def finder_units(
    course: str = Query(..., max_length=80),
    year: int = Query(..., ge=1, le=11),
    db: Session = Depends(get_db),
    _: User = Depends(require_parent),
):
    """The units for one course and school year, in Oak's teaching order."""
    if not SLUG_RE.match(course):
        raise HTTPException(status_code=400, detail="Unknown course")
    groups = _kept(db, f"list:units:{course}:{year}", lambda client: _unit_groups(_get(client, f"/sequences/{course}/units?year={year}")))
    return {"groups": groups}


@router.get("/unit/{slug}")
def finder_unit(slug: str, db: Session = Depends(get_db), _: User = Depends(require_parent)):
    """One unit: what it covers and its lessons in order."""
    if len(slug) > 180 or not SLUG_RE.match(slug):
        raise HTTPException(status_code=400, detail="Unknown unit")
    return _kept(db, f"list:unit:{slug}", _fetch_unit(slug))


class PlanLesson(BaseModel):
    slug: str
    title: str

    @field_validator("slug")
    @classmethod
    def valid_slug(cls, value: str) -> str:
        if len(value) > 200 or not SLUG_RE.match(value):
            raise ValueError("Unknown lesson")
        return value

    @field_validator("title")
    @classmethod
    def not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Required")
        return value[:255]


class PlanIn(BaseModel):
    """One lesson, or a unit's lessons in order. Several go one a day from the starting day, skipping weekends and days off."""
    lessons: list[PlanLesson]
    subject: str
    unit_title: str = ""
    scheduled_date: date
    child_ids: list[int] = []

    @field_validator("lessons")
    @classmethod
    def some_lessons(cls, value: list) -> list:
        if not 1 <= len(value) <= MAX_PLANNED_AT_ONCE:
            raise ValueError(f"Choose between 1 and {MAX_PLANNED_AT_ONCE} lessons")
        return value

    @field_validator("subject")
    @classmethod
    def subject_given(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Required")
        return value[:100]


@router.post("/plan", status_code=201)
def plan_lessons(body: PlanIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Put Oak lessons in the planner. They open inside Bright Roots where Oak's licence allows."""
    children = _clean_child_ids(db, current_user.id, body.child_ids)
    unit = body.unit_title.strip()[:200]
    days = teaching_days(db, current_user, body.scheduled_date, len(body.lessons))
    for item, day in zip(body.lessons, days):
        lesson = Lesson(
            title=item.title,
            subject=body.subject,
            description=f"Oak National Academy lesson from the unit “{unit}”." if unit else "Oak National Academy lesson.",
            lesson_url=lesson_link(item.slug),
            scheme=OAK_SCHEME,
            created_by=current_user.id,
        )
        db.add(lesson)
        db.flush()
        for child_id in children or [None]:
            db.add(PlannerEntry(lesson_id=lesson.id, assigned_to=child_id, scheduled_date=day))
    db.commit()
    return {"planned": len(days), "first_day": days[0], "last_day": days[-1]}
