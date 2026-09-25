import re
import io
import json
import asyncio
import httpx
import concurrent.futures
from datetime import date
from typing import Optional
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import BaseModel
from sqlalchemy import or_, and_, func
from sqlalchemy.orm import Session, joinedload
from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter
from auth import get_current_user, require_parent
from database import get_db, SessionLocal
from models import User, OakQuizResult, PlannerEntry, PlannerCompletion, Lesson
from config import settings

router = APIRouter(prefix="/api/oak", tags=["oak"])

OAK_HEADERS = {
    "Authorization": f"Bearer {settings.OAK_API_KEY}",
    "Accept": "application/json",
}

YEAR_TO_KS = {
    "Year 1": "key stage 1", "Year 2": "key stage 1",
    "Year 3": "key stage 2", "Year 4": "key stage 2",
    "Year 5": "key stage 2", "Year 6": "key stage 2",
    "Year 7": "key stage 3", "Year 8": "key stage 3", "Year 9": "key stage 3",
    "Year 10": "key stage 4", "Year 11": "key stage 4",
}

# Topic keywords per subject — each triggers a separate parallel search
SUBJECT_KEYWORDS = {
    "maths": ["number", "algebra", "geometry", "ratio", "statistics", "fractions", "decimals", "probability", "angles", "sequences"],
    "english": ["reading", "writing", "poetry", "grammar", "fiction", "non-fiction", "shakespeare", "narrative", "vocabulary", "punctuation"],
    "science": ["biology", "chemistry", "physics", "cells", "forces", "energy", "atoms", "ecology", "electricity", "waves"],
    "history": ["medieval", "empire", "revolution", "monarchy", "war", "ancient", "migration", "power", "society", "crime"],
    "geography": ["rivers", "climate", "urbanisation", "development", "coasts", "ecosystems", "population", "resources", "weather", "globalisation"],
    "art and design": ["drawing", "painting", "sculpture", "printmaking", "textiles", "colour", "composition", "design", "portrait", "abstract"],
    "design and technology": ["engineering", "product", "food", "textiles", "resistant materials", "structures", "mechanisms", "electronics", "cooking", "materials"],
    "computing": ["programming", "algorithms", "data", "networks", "cybersecurity", "python", "html", "binary", "database", "software"],
    "religious education": ["christianity", "islam", "buddhism", "hinduism", "ethics", "beliefs", "worship", "sacred", "morality", "philosophy"],
    "physical education": ["fitness", "athletics", "team", "skills", "health", "swimming", "gymnastics", "dance", "tactics", "movement"],
    "music": ["rhythm", "melody", "harmony", "composition", "notation", "instruments", "performance", "listening", "blues", "classical"],
    "french": ["vocabulary", "grammar", "reading", "listening", "speaking", "writing", "verbs", "nouns", "phrases", "culture"],
    "spanish": ["vocabulary", "grammar", "reading", "listening", "speaking", "writing", "verbs", "nouns", "phrases", "culture"],
    "german": ["vocabulary", "grammar", "reading", "listening", "speaking", "writing", "verbs", "nouns", "phrases", "culture"],
}


def _fetch_one(query: str) -> list:
    url = f"{settings.OAK_BASE_URL}/search/lessons"
    try:
        with httpx.Client(timeout=10) as client:
            r = client.get(url, headers=OAK_HEADERS, params={"q": query})
            r.raise_for_status()
            return r.json().get("hits", {}).get("hits", [])
    except Exception:
        return []


def build_oak_url(src: dict) -> str:
    subject_slug = src.get("subject_slug", "")
    phase = src.get("phase", "primary")
    ks_slug = src.get("key_stage_slug", "")
    ks_abbrev = ks_slug.replace("key-stage-", "ks")
    programme_slug = f"{subject_slug}-{phase}-{ks_abbrev}"
    unit_slug = src.get("topic_slug", "")
    lesson_slug = src.get("slug", "")
    return f"https://www.thenational.academy/pupils/programmes/{programme_slug}/units/{unit_slug}/lessons/{lesson_slug}"


@router.get("/search")
def search_lessons(
    q: str = Query(default="", min_length=0),
    subject: str = Query(default=""),
    year: str = Query(default=""),
    _: User = Depends(get_current_user),
):
    ks = YEAR_TO_KS.get(year, "")
    subject_lower = subject.lower()
    keywords = SUBJECT_KEYWORDS.get(subject_lower, [""])

    # Build one query per keyword — run all in parallel
    queries = [
        f"{subject} {year} {ks} {kw} {q}".strip()
        for kw in keywords
    ]

    seen_slugs: dict = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(_fetch_one, qry) for qry in queries]
        for future in concurrent.futures.as_completed(futures):
            for hit in future.result():
                src = hit.get("_source", {})
                slug = src.get("slug")
                if slug and slug not in seen_slugs:
                    seen_slugs[slug] = src

    results = []
    for src in seen_slugs.values():
        if year and src.get("year_title", "") != year:
            continue
        if subject and src.get("subject_title", "").lower() != subject_lower:
            continue

        results.append({
            "slug": src.get("slug"),
            "title": src.get("title", ""),
            "subject": src.get("subject_title", ""),
            "keyStage": src.get("key_stage_title", ""),
            "yearTitle": src.get("year_title", ""),
            "unitTitle": src.get("topic_title", ""),
            "description": src.get("lesson_description", ""),
            "oakUrl": build_oak_url(src),
        })

    results.sort(key=lambda r: (r["unitTitle"], r["title"]))
    return results


class ImportUnitRequest(BaseModel):
    unit_url: str


@router.post("/import-unit")
async def import_unit(
    body: ImportUnitRequest,
    current_user: User = Depends(require_parent),
):
    match = re.search(r"/programmes/([^/?#]+)/units/([^/?#]+)", body.unit_url)
    if not match:
        raise HTTPException(
            status_code=400,
            detail="Could not parse unit URL — paste a thenational.academy unit link",
        )
    programme_slug = match.group(1)
    unit_slug = match.group(2)

    # Fetch the public pupil unit page and extract __NEXT_DATA__
    lessons_url = (
        f"https://www.thenational.academy/pupils/programmes/"
        f"{programme_slug}/units/{unit_slug}/lessons"
    )
    async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
        try:
            resp = await client.get(
                lessons_url,
                headers={"User-Agent": "Mozilla/5.0 (compatible; HomeschoolApp/1.0)"},
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=502, detail=f"Could not reach Oak website: {exc}")

    if resp.status_code != 200:
        raise HTTPException(status_code=404, detail="Unit not found — check the URL")

    m = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        resp.text,
        re.DOTALL,
    )
    if not m:
        raise HTTPException(status_code=502, detail="Could not parse lesson data from Oak page")

    try:
        page_data = json.loads(m.group(1))
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Could not parse lesson data from Oak page")

    browse_data = page_data.get("props", {}).get("pageProps", {}).get("browseData", [])
    if not browse_data:
        raise HTTPException(status_code=404, detail="No lesson data found on this page")

    first = browse_data[0]
    lesson_list = first.get("supplementaryData", {}).get("staticLessonList", [])
    unit_title = first.get("unitData", {}).get("title", "")

    lessons = []
    for lesson in lesson_list:
        if lesson.get("_state") == "published":
            slug = lesson.get("slug", "")
            title = lesson.get("title", "")
            order = lesson.get("order", 0)
            if slug and title:
                pupil_url = (
                    f"https://www.thenational.academy/pupils/programmes/"
                    f"{programme_slug}/units/{unit_slug}/lessons/{slug}"
                )
                lessons.append({"title": title, "url": pupil_url, "order": order})

    lessons.sort(key=lambda x: x["order"])
    return {
        "lessons": lessons,
        "unit_slug": unit_slug,
        "unit_title": unit_title,
        "programme_slug": programme_slug,
    }


# ---------------------------------------------------------------------------
# Quiz results from Oak "share my results" links
# ---------------------------------------------------------------------------

OAK_SHARE_RE = re.compile(
    r"https?://(?:www\.)?thenational\.academy/pupils/lessons/[^/?#]+/results/[^/?#]+/share"
)

SHARE_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; HomeschoolApp/1.0)"}


def _extract_quiz_scores(html: str) -> dict | None:
    """Pull starter/exit quiz scores out of Oak's embedded sectionResults JSON.

    Oak serialises the results inside the page rather than exposing a separate
    results API. Parse the sectionResults object with JSONDecoder instead of
    relying on field order or a fixed-size text window.
    """
    anchor = html.find('"sectionResults"')
    if anchor == -1:
        return None

    colon = html.find(":", anchor)
    if colon == -1:
        return None

    start = colon + 1
    while start < len(html) and html[start].isspace():
        start += 1

    try:
        section_results, _ = json.JSONDecoder().raw_decode(html[start:])
    except (json.JSONDecodeError, TypeError):
        return None

    if not isinstance(section_results, dict):
        return None

    def find_section(node, name: str):
        if isinstance(node, dict):
            direct = node.get(name)
            if isinstance(direct, dict):
                return direct
            for value in node.values():
                found = find_section(value, name)
                if found is not None:
                    return found
        elif isinstance(node, list):
            for value in node:
                found = find_section(value, name)
                if found is not None:
                    return found
        return None

    def score_and_total(name: str):
        section = find_section(section_results, name)
        if not isinstance(section, dict):
            return None, None

        score = section.get("grade")
        total = section.get("numQuestions")

        def as_int(value):
            if isinstance(value, bool):
                return None
            if isinstance(value, int):
                return value
            if isinstance(value, float) and value.is_integer():
                return int(value)
            if isinstance(value, str) and value.isdigit():
                return int(value)
            return None

        return as_int(score), as_int(total)

    starter_score, starter_total = score_and_total("starter-quiz")
    exit_score, exit_total = score_and_total("exit-quiz")

    if starter_total is None and exit_total is None:
        return None

    return {
        "starter_score": starter_score,
        "starter_total": starter_total,
        "exit_score": exit_score,
        "exit_total": exit_total,
    }

async def _fetch_share_scores(client: httpx.AsyncClient, url: str) -> dict | None:
    try:
        resp = await client.get(url, headers=SHARE_HEADERS)
        if resp.status_code != 200:
            return None
        return _extract_quiz_scores(resp.text)
    except httpx.RequestError:
        return None


def _upsert_result(db: Session, url: str, scores: dict) -> None:
    row = db.query(OakQuizResult).filter(OakQuizResult.url == url).first()
    if row:
        for k, v in scores.items():
            setattr(row, k, v)
    else:
        db.add(OakQuizResult(url=url, **scores))
    db.commit()


async def fetch_and_store_share_result(url: str) -> None:
    """Background task: fetch one share link and cache its quiz scores."""
    async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
        scores = await _fetch_share_scores(client, url)
    if scores is None:
        return
    db = SessionLocal()
    try:
        _upsert_result(db, url, scores)
    finally:
        db.close()


def _family_child_ids(db: Session, parent_id: int) -> list[int]:
    return [
        row.id
        for row in db.query(User.id).filter(
            User.parent_id == parent_id,
            User.role == "child",
        ).all()
    ]


def _allowed_oak_result_urls(db: Session, user: User) -> set[str]:
    """Return only Oak result-share URLs visible to this user's family.

    Parents can see every child's submissions in their family. Children can
    only see their own direct/shared submissions. The OakQuizResult table is
    a global cache, but cached URLs are never exposed unless they are linked
    from planner data the current user is allowed to access.
    """
    if user.role == "parent":
        parent_id = user.id
        child_ids = _family_child_ids(db, parent_id)
        direct_entries = db.query(PlannerEntry.completed_work_url).join(
            Lesson, PlannerEntry.lesson_id == Lesson.id
        ).filter(
            Lesson.created_by == parent_id,
            PlannerEntry.assigned_to.in_(child_ids),
            PlannerEntry.completed_work_url.is_not(None),
        ).all()

        shared_entry_ids = [
            row.id
            for row in db.query(PlannerEntry.id).join(
                Lesson, PlannerEntry.lesson_id == Lesson.id
            ).filter(
                Lesson.created_by == parent_id,
                PlannerEntry.assigned_to.is_(None),
            ).all()
        ]
        shared_urls = []
        if shared_entry_ids and child_ids:
            shared_urls = db.query(PlannerCompletion.completed_work_url).filter(
                PlannerCompletion.entry_id.in_(shared_entry_ids),
                PlannerCompletion.user_id.in_(child_ids),
                PlannerCompletion.completed_work_url.is_not(None),
            ).all()
    elif user.role == "child":
        if user.parent_id is None:
            return set()
        parent_id = user.parent_id
        direct_entries = db.query(PlannerEntry.completed_work_url).join(
            Lesson, PlannerEntry.lesson_id == Lesson.id
        ).filter(
            Lesson.created_by == parent_id,
            PlannerEntry.assigned_to == user.id,
            PlannerEntry.completed_work_url.is_not(None),
        ).all()

        shared_entry_ids = [
            row.id
            for row in db.query(PlannerEntry.id).join(
                Lesson, PlannerEntry.lesson_id == Lesson.id
            ).filter(
                Lesson.created_by == parent_id,
                PlannerEntry.assigned_to.is_(None),
            ).all()
        ]
        shared_urls = []
        if shared_entry_ids:
            shared_urls = db.query(PlannerCompletion.completed_work_url).filter(
                PlannerCompletion.entry_id.in_(shared_entry_ids),
                PlannerCompletion.user_id == user.id,
                PlannerCompletion.completed_work_url.is_not(None),
            ).all()
    else:
        return set()

    urls: set[str] = set()
    for (raw_url,) in [*direct_entries, *shared_urls]:
        if not raw_url:
            continue
        match = OAK_SHARE_RE.search(raw_url)
        if match:
            urls.add(match.group(0))
    return urls


@router.get("/quiz-results")
def get_quiz_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allowed_urls = _allowed_oak_result_urls(db, current_user)
    if not allowed_urls:
        return []
    rows = db.query(OakQuizResult).filter(OakQuizResult.url.in_(allowed_urls)).all()
    return [
        {
            "url": r.url,
            "starter_score": r.starter_score,
            "starter_total": r.starter_total,
            "exit_score": r.exit_score,
            "exit_total": r.exit_total,
        }
        for r in rows
    ]


@router.post("/quiz-results/refresh")
async def refresh_quiz_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Re-fetch only this family's submitted Oak share links."""
    family_urls = _allowed_oak_result_urls(db, current_user)
    to_refresh = sorted(family_urls)

    updated = 0
    if to_refresh:
        sem = asyncio.Semaphore(6)
        async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
            async def fetch_one(u: str):
                async with sem:
                    return u, await _fetch_share_scores(client, u)

            results = await asyncio.gather(*(fetch_one(u) for u in to_refresh))
        for u, scores in results:
            if scores is not None:
                _upsert_result(db, u, scores)
                updated += 1

    return {
        "checked": len(to_refresh),
        "updated": updated,
        "total_cached": db.query(OakQuizResult).filter(
            OakQuizResult.url.in_(family_urls)
        ).count() if family_urls else 0,
    }

# ---------------------------------------------------------------------------
# Excel export of Oak quiz results — homeschool evidence record
# ---------------------------------------------------------------------------

EXPORT_HEADERS = [
    "Scheduled Date", "Completed Date", "Child", "Subject", "Lesson Title",
    "Assignment Type", "Starter Score", "Starter Total", "Starter %",
    "Exit Score", "Exit Total", "Exit %", "Oak Results URL", "Note",
]
EXPORT_COLUMN_WIDTHS = [14, 18, 14, 16, 34, 14, 12, 12, 10, 10, 10, 8, 48, 30]


@router.get("/export")
async def export_oak_results(
    child_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Export this parent's children's Oak quiz results as a formatted .xlsx.

    Directly-assigned entries are attributed via PlannerEntry.assigned_to.
    Shared (assigned_to=NULL) entries are attributed by enumerating every
    matching PlannerCompletion row individually — one export row per child
    completion — so a second child's submission is never silently dropped
    the way a single 'best' pick would. All queries are scoped to this
    parent's own children (direct) or their own lessons (shared), so one
    family's export can never include another family's data.
    """
    children = db.query(User).filter(User.parent_id == current_user.id).all()
    child_ids = [c.id for c in children]
    child_names = {c.id: c.username for c in children}

    if child_id is not None and child_id not in child_ids:
        raise HTTPException(status_code=403, detail="Not your child")
    target_child_ids = [child_id] if child_id is not None else child_ids

    query = db.query(PlannerEntry).join(Lesson, PlannerEntry.lesson_id == Lesson.id).options(
        joinedload(PlannerEntry.lesson)
    ).filter(
        or_(
            PlannerEntry.assigned_to.in_(target_child_ids),
            and_(PlannerEntry.assigned_to.is_(None), Lesson.created_by == current_user.id),
        )
    )
    if start_date:
        query = query.filter(PlannerEntry.scheduled_date >= start_date)
    if end_date:
        query = query.filter(PlannerEntry.scheduled_date <= end_date)
    entries = query.order_by(PlannerEntry.scheduled_date).all()

    # Bulk-fetch every PlannerCompletion for the shared entries in this set —
    # never just the 'best' one — scoped to this parent's own children.
    shared_ids = [e.id for e in entries if e.assigned_to is None]
    comps_by_entry: dict = {}
    if shared_ids and target_child_ids:
        for comp in db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id.in_(shared_ids),
            PlannerCompletion.user_id.in_(target_child_ids),
            PlannerCompletion.completed_work_url.is_not(None),
        ).all():
            comps_by_entry.setdefault(comp.entry_id, []).append(comp)

    # Build one candidate row per (entry, child) submission that has an Oak share link.
    candidates = []
    for e in entries:
        if e.assigned_to is not None:
            url = e.completed_work_url
            match = OAK_SHARE_RE.search(url) if url else None
            if match:
                candidates.append({
                    "child_id": e.assigned_to,
                    "url": match.group(0),
                    "note": e.completed_note,
                    "completed_at": e.completed_at,
                    "scheduled_date": e.scheduled_date,
                    "lesson": e.lesson,
                    "assignment_type": "Direct",
                })
        else:
            for comp in comps_by_entry.get(e.id, []):
                url = comp.completed_work_url
                match = OAK_SHARE_RE.search(url) if url else None
                if match:
                    candidates.append({
                        "child_id": comp.user_id,
                        "url": match.group(0),
                        "note": comp.completed_note,
                        "completed_at": comp.completed_at,
                        "scheduled_date": e.scheduled_date,
                        "lesson": e.lesson,
                        "assignment_type": "Shared",
                    })

    # Reuse the existing share-page fetch/cache logic (same as quiz-results/refresh)
    # rather than writing a second scraper — scoped to just this export's URLs.
    canonical_urls = {c["url"] for c in candidates}
    cached = {
        r.url: r for r in db.query(OakQuizResult).filter(OakQuizResult.url.in_(canonical_urls)).all()
    } if canonical_urls else {}
    missing = sorted(canonical_urls - cached.keys())
    if missing:
        sem = asyncio.Semaphore(6)
        async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
            async def fetch_one(u: str):
                async with sem:
                    return u, await _fetch_share_scores(client, u)

            results = await asyncio.gather(*(fetch_one(u) for u in missing))
        for u, scores in results:
            if scores is not None:
                _upsert_result(db, u, scores)
        cached = {
            r.url: r for r in db.query(OakQuizResult).filter(OakQuizResult.url.in_(canonical_urls)).all()
        }

    candidates.sort(key=lambda c: (c["scheduled_date"], child_names.get(c["child_id"], "")))

    wb = Workbook()
    ws = wb.active
    ws.title = "Oak Results"
    ws.append(EXPORT_HEADERS)
    for cell in ws[1]:
        cell.font = Font(bold=True)

    for c in candidates:
        result = cached.get(c["url"])
        starter_score = result.starter_score if result else None
        starter_total = result.starter_total if result else None
        exit_score = result.exit_score if result else None
        exit_total = result.exit_total if result else None
        starter_pct = (starter_score / starter_total) if (starter_score is not None and starter_total) else None
        exit_pct = (exit_score / exit_total) if (exit_score is not None and exit_total) else None
        completed_at = c["completed_at"]
        if completed_at is not None and completed_at.tzinfo is not None:
            completed_at = completed_at.replace(tzinfo=None)  # Excel doesn't support tz-aware datetimes

        ws.append([
            c["scheduled_date"],
            completed_at,
            child_names.get(c["child_id"], "Unknown"),
            c["lesson"].subject,
            c["lesson"].title,
            c["assignment_type"],
            starter_score,
            starter_total,
            starter_pct,
            exit_score,
            exit_total,
            exit_pct,
            c["url"],
            c["note"] or "",
        ])

    last_row = ws.max_row
    if last_row > 1:
        for row in ws.iter_rows(min_row=2, max_row=last_row, min_col=1, max_col=1):
            for cell in row:
                cell.number_format = "yyyy-mm-dd"
        for row in ws.iter_rows(min_row=2, max_row=last_row, min_col=2, max_col=2):
            for cell in row:
                cell.number_format = "yyyy-mm-dd hh:mm"
        for col_idx in (9, 12):  # Starter %, Exit %
            for row in ws.iter_rows(min_row=2, max_row=last_row, min_col=col_idx, max_col=col_idx):
                for cell in row:
                    cell.number_format = "0%"

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = ws.dimensions
    for i, width in enumerate(EXPORT_COLUMN_WIDTHS, start=1):
        ws.column_dimensions[get_column_letter(i)].width = width

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)

    filename = f"bright-roots-oak-results-{date.today().isoformat()}.xlsx"
    return Response(
        content=buf.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ---------------------------------------------------------------------------
# Today's Oak quiz results — compact parent dashboard summary
# ---------------------------------------------------------------------------

# Matches an assigned Oak pupil-lesson link (what a lesson is scheduled with),
# not the share-results link pattern (OAK_SHARE_RE) — those are different URL
# shapes, so this never collides with a submitted share link.
OAK_LESSON_URL_RE = re.compile(
    r"https?://(?:www\.)?thenational\.academy/pupils/programmes/[^/?#]+/units/[^/?#]+/lessons/[^/?#]+"
)


@router.get("/today-quiz-results")
def get_today_quiz_results(
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    """Today's Oak lesson quiz results for this parent's family.

    If child_id is supplied, only that child is returned. Without child_id,
    results for all children belonging to the current parent are returned.
    """
    today = date.today()

    children = db.query(User).filter(
        User.parent_id == current_user.id,
        User.role == "child",
    ).all()
    child_ids = [child.id for child in children]
    child_names = {child.id: child.username for child in children}

    if child_id is not None:
        if child_id not in child_ids:
            raise HTTPException(status_code=403, detail="Not your child")
        target_child_ids = [child_id]
    else:
        target_child_ids = child_ids

    if not target_child_ids:
        return []

    entries = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .options(joinedload(PlannerEntry.lesson))
        .filter(
            PlannerEntry.scheduled_date == today,
            Lesson.created_by == current_user.id,
            Lesson.lesson_url.is_not(None),
            or_(
                PlannerEntry.assigned_to.in_(target_child_ids),
                PlannerEntry.assigned_to.is_(None),
            ),
        )
        .all()
    )

    entries = [
        entry
        for entry in entries
        if OAK_LESSON_URL_RE.search(entry.lesson.lesson_url or "")
    ]

    shared_ids = [entry.id for entry in entries if entry.assigned_to is None]
    comps_lookup: dict = {}
    if shared_ids:
        for comp in db.query(PlannerCompletion).filter(
            PlannerCompletion.entry_id.in_(shared_ids),
            PlannerCompletion.user_id.in_(target_child_ids),
        ).all():
            comps_lookup[(comp.entry_id, comp.user_id)] = comp

    pending = []
    for entry in entries:
        targets = (
            [entry.assigned_to]
            if entry.assigned_to is not None
            else target_child_ids
        )

        for target_child_id in targets:
            if entry.assigned_to is not None:
                url = entry.completed_work_url
                is_complete = entry.is_complete
            else:
                comp = comps_lookup.get((entry.id, target_child_id))
                url = comp.completed_work_url if comp else None
                is_complete = comp is not None

            share_match = OAK_SHARE_RE.search(url) if url else None
            pending.append({
                "entry_id": entry.id,
                "child_id": target_child_id,
                "lesson": entry.lesson,
                "is_complete": is_complete,
                "share_url": share_match.group(0) if share_match else None,
            })

    canonical_urls = {p["share_url"] for p in pending if p["share_url"]}
    cached = {
        result.url: result
        for result in db.query(OakQuizResult).filter(
            OakQuizResult.url.in_(canonical_urls)
        ).all()
    } if canonical_urls else {}

    rows = []
    for item in pending:
        result = cached.get(item["share_url"]) if item["share_url"] else None
        rows.append({
            "entry_id": item["entry_id"],
            "child_id": item["child_id"],
            "child": child_names.get(item["child_id"], "Unknown"),
            "lesson_title": item["lesson"].title,
            "subject": item["lesson"].subject,
            "is_complete": item["is_complete"],
            "completed": result is not None,
            "starter_score": result.starter_score if result else None,
            "starter_total": result.starter_total if result else None,
            "exit_score": result.exit_score if result else None,
            "exit_total": result.exit_total if result else None,
        })

    rows.sort(key=lambda row: (row["child"], row["lesson_title"]))
    return rows


# ---------------------------------------------------------------------------
# Worksheet availability check — planner "Open Worksheet" button
# ---------------------------------------------------------------------------

_OAK_HOSTS = {"www.thenational.academy", "thenational.academy"}
_OAK_LESSON_PATH_RE = re.compile(r"^/pupils/programmes/[^/]+/units/[^/]+/lessons/[^/]+$")


def _validate_oak_lesson_url(url: str) -> Optional[str]:
    """Return a safe, canonical URL to fetch, or None if `url` isn't exactly
    an Oak pupil-lesson page. Rebuilds the URL from validated components
    (scheme/host/path only — query, fragment, userinfo, port all dropped)
    rather than ever trusting the raw client-supplied string, so this can
    never become a fetch of an arbitrary attacker-chosen URL/host."""
    try:
        parsed = urlparse(url)
    except ValueError:
        return None
    if parsed.scheme != "https":
        return None
    if parsed.hostname not in _OAK_HOSTS:
        return None
    if parsed.port is not None:
        return None
    if not _OAK_LESSON_PATH_RE.match(parsed.path):
        return None
    return f"https://{parsed.hostname}{parsed.path}"


@router.get("/has-worksheet")
async def has_worksheet(
    lesson_url: str = Query(...),
    _: User = Depends(get_current_user),
):
    """Check whether an Oak pupil lesson has a downloadable worksheet, by
    fetching the lesson's own public page server-side and reading
    __NEXT_DATA__.props.pageProps.hasWorksheet — the same technique
    import_unit already uses to read that page's embedded JSON. lesson_url
    is strictly validated first (see _validate_oak_lesson_url); anything
    that isn't exactly an Oak pupil-lesson URL is rejected before any
    network call, so this is never a generic fetch-any-URL endpoint. No DB
    reads or writes, and no worksheet content is stored or proxied — only
    a boolean plus the lesson's own /intro page URL is ever returned.

    Oak's base lesson URL (the shape we validate/store) permanently
    redirects (308) to its /overview sub-page — confirmed live: the base
    URL alone never returns real content, so redirects must be followed to
    reach the page that actually contains hasWorksheet. The redirect is
    same-origin/relative, but as a safety net for following it at all, the
    final resolved host is re-checked against the same allow-list used
    before the fetch, and the redirect chain is capped."""
    safe_url = _validate_oak_lesson_url(lesson_url)
    if not safe_url:
        raise HTTPException(status_code=400, detail="Not a valid Oak pupil lesson URL")

    try:
        async with httpx.AsyncClient(follow_redirects=True, max_redirects=5, timeout=10.0) as client:
            resp = await client.get(
                safe_url,
                headers={"User-Agent": "Mozilla/5.0 (compatible; HomeschoolApp/1.0)"},
            )
    except httpx.RequestError:
        return {"has_worksheet": False, "intro_url": None}

    if resp.status_code != 200 or resp.url.host not in _OAK_HOSTS:
        return {"has_worksheet": False, "intro_url": None}

    m = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        resp.text,
        re.DOTALL,
    )
    if not m:
        return {"has_worksheet": False, "intro_url": None}

    try:
        page_data = json.loads(m.group(1))
    except json.JSONDecodeError:
        return {"has_worksheet": False, "intro_url": None}

    has_ws = bool(page_data.get("props", {}).get("pageProps", {}).get("hasWorksheet"))
    return {
        "has_worksheet": has_ws,
        "intro_url": f"{safe_url}/intro" if has_ws else None,
    }
