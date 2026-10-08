"""Oak National Academy lessons done inside Bright Roots: starter quiz, video, worksheet, exit quiz.

Everything comes from Oak's own API, with the key kept on the server. Oak blocks lessons that hold
other people's copyright material; whatever it won't hand over is simply left out, and a lesson with
nothing to show falls back to the link to Oak's own website. Lesson content is under the Open
Government Licence v3.0, so every page that shows it credits Oak and links to the licence.
"""
import io
import json
import logging
import re
from datetime import date, datetime, timedelta
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse, RedirectResponse, Response
from pypdf import PdfReader, PdfWriter
from pypdf.errors import PdfReadError
from pydantic import BaseModel, field_validator
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth import get_current_user, require_child, require_parent
from config import settings
from database import get_db
from models import Lesson, OakLesson, OakLessonAttempt, PlannerCompletion, PlannerEntry, User
from routers.planner import _child_ids_for_parent, _entry_for_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/oak-lessons", tags=["oak-lessons"])

# The last part of any Oak lesson link is the lesson's own name, e.g. .../lessons/ordering-numbers-to-10
LESSON_URL_RE = re.compile(r"^https://(?:www\.)?thenational\.academy/(?:pupils|teachers)/(?:[a-z0-9-]+/)*lessons/([a-z0-9-]+)(?:[/?#].*)?$")
KEEP_FOR = timedelta(days=7)
# A lesson Oak wouldn't give us is asked for again sooner, in case that was a passing fault.
RETRY_EMPTY_AFTER = timedelta(hours=6)
QUIZZES = {"starter": "starterQuiz", "exit": "exitQuiz"}
MAX_ANSWERS_CHARS = 20_000
OGL_URL = "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"


def lesson_slug(url: Optional[str]) -> Optional[str]:
    match = LESSON_URL_RE.match((url or "").strip())
    return match.group(1) if match else None


def _api_base() -> str:
    base = settings.OAK_BASE_URL.rstrip("/")
    return base if base.endswith("/api/v0") else f"{base}/api/v0"


def _headers() -> dict:
    return {"Authorization": f"Bearer {settings.OAK_API_KEY}", "Accept": "application/json"}


# ---------- turning Oak's quiz questions into ours ----------

def _piece(part) -> Optional[object]:
    """One answer or option: plain text, or a picture."""
    if not isinstance(part, dict):
        return None
    content = part.get("content")
    if part.get("type") == "image" and isinstance(content, dict) and str(content.get("url", "")).startswith("https://"):
        if content.get("attribution"):
            return None  # someone else owns this picture: the question is left out
        return {"image": _picture(content)}
    if isinstance(content, str) and content.strip():
        return content.strip()
    return None


def _picture(image: dict) -> dict:
    return {"url": image["url"], "alt": str(image.get("alt") or "")[:300], "width": image.get("width"), "height": image.get("height")}


def _question(raw: dict) -> Optional[dict]:
    """An Oak question in the shape the worksheet pages use, or None for one we can't show properly."""
    # Oak marks where an answer box goes with {{ }}; here the box is always underneath, so the mark is dropped.
    text = re.sub(r"\s*\{\{\s*\}\}", "", str(raw.get("question") or "")).strip()
    answers = raw.get("answers") or []
    if not text or not isinstance(answers, list) or not answers:
        return None
    out: dict = {"q": text}
    image = raw.get("questionImage")
    if isinstance(image, dict) and str(image.get("url", "")).startswith("https://"):
        if image.get("attribution"):
            return None
        out["image"] = _picture(image)

    kind = raw.get("questionType")
    if kind == "multiple-choice":
        options = [_piece(a) for a in answers]
        right = [i for i, a in enumerate(answers) if isinstance(a, dict) and a.get("distractor") is False]
        if None in options or not right or len(options) < 2:
            return None
        if len(right) == 1:
            return {**out, "type": "choice", "options": options, "answer": right[0]}
        return {**out, "type": "pick", "options": options, "answers": right}
    if kind == "short-answer":
        accepted = [a["content"].strip() for a in answers if isinstance(a, dict) and isinstance(a.get("content"), str) and a["content"].strip()]
        return {**out, "type": "type", "answer": accepted} if accepted else None
    if kind == "match":
        pairs = [[_piece(a.get("matchOption")), _piece(a.get("correctChoice"))] for a in answers if isinstance(a, dict)]
        texts = [p for p in pairs if isinstance(p[0], str) and isinstance(p[1], str)]
        # Matching is by the words themselves, so every side has to be different.
        if len(texts) != len(answers) or len(texts) < 2 or len({p[0] for p in texts}) != len(texts) or len({p[1] for p in texts}) != len(texts):
            return None
        return {**out, "type": "match", "pairs": texts}
    if kind == "order":
        items = sorted((a for a in answers if isinstance(a, dict) and isinstance(a.get("order"), int)), key=lambda a: a["order"])
        words = [a["content"].strip() for a in items if isinstance(a.get("content"), str) and a["content"].strip()]
        if len(words) != len(answers) or len(words) < 2 or len(set(words)) != len(words):
            return None
        return {**out, "type": "order", "items": words}
    return None


def _tidy(value: str) -> str:
    return " ".join(str(value).strip().lower().split())


def is_right(q: dict, answer) -> bool:
    """The same marking the worksheet pages do in the browser, done here so a saved score can be trusted."""
    kind = q["type"]
    if kind == "choice":
        return isinstance(answer, int) and not isinstance(answer, bool) and answer == q["answer"]
    if kind == "pick":
        return isinstance(answer, list) and all(isinstance(a, int) for a in answer) and sorted(answer) == sorted(q["answers"])
    if kind == "type":
        if not isinstance(answer, str) or not answer.strip():
            return False
        given = _tidy(answer)
        for wanted in q["answer"]:
            want = _tidy(wanted)
            if given == want:
                return True
            try:
                if float(given) == float(want):
                    return True
            except ValueError:
                pass
        return False
    if kind == "match":
        return isinstance(answer, dict) and all(answer.get(left) == right for left, right in q["pairs"])
    if kind == "order":
        return isinstance(answer, list) and answer == q["items"]
    return False


# ---------- fetching and keeping a lesson ----------

def _fetch(slug: str) -> Optional[dict]:
    """Everything Oak will give us for one lesson. None means Oak couldn't be reached, so nothing is kept."""
    base = _api_base()
    data: dict = {"slug": slug, "starter": [], "exit": [], "video_url": None, "captions": None, "has_worksheet": False, "credits": []}
    try:
        with httpx.Client(timeout=15, headers=_headers()) as client:
            summary = client.get(f"{base}/lessons/{slug}/summary")
            if summary.status_code in (401, 403, 429) or summary.status_code >= 500:
                logger.warning("Oak lesson %s: summary answered %s", slug, summary.status_code)
                return None
            if summary.status_code != 200:
                return {**data, "found": False}
            info = summary.json()
            data.update(
                found=True,
                title=str(info.get("lessonTitle") or "")[:255],
                subject=info.get("subjectTitle"),
                key_stage=info.get("keyStageTitle"),
                outcome=info.get("pupilLessonOutcome"),
                keywords=[
                    {"word": str(k.get("keyword") or ""), "meaning": str(k.get("description") or "")}
                    for k in (info.get("lessonKeywords") or []) if isinstance(k, dict) and k.get("keyword")
                ][:12],
                guidance=info.get("contentGuidance"),
                supervision=info.get("supervisionLevel"),
                oak_url=f"https://www.thenational.academy/teachers/lessons/{slug}",
            )

            quiz = client.get(f"{base}/lessons/{slug}/quiz")
            if quiz.status_code == 200:
                body = quiz.json()
                for name, field in QUIZZES.items():
                    data[name] = [q for q in (_question(raw) for raw in body.get(field) or [] if isinstance(raw, dict)) if q]

            assets = client.get(f"{base}/lessons/{slug}/assets")
            kinds = set()
            if assets.status_code == 200:
                body = assets.json()
                kinds = {a.get("type") for a in body.get("assets") or [] if isinstance(a, dict)}
                data["credits"] = [str(c)[:300] for c in (body.get("attribution") or []) if c][:20]
            data["has_worksheet"] = "worksheet" in kinds
            if "video" in kinds:
                video = client.get(f"{base}/lessons/{slug}/assets/video", follow_redirects=False)
                where = video.headers.get("location", "")
                # Only ever Oak's own video host, so the page can't be pointed anywhere else.
                if video.status_code in (301, 302, 303, 307) and re.match(r"^https://[a-z0-9.-]+\.thenational\.academy/", where):
                    data["video_url"] = where
                    transcript = client.get(f"{base}/lessons/{slug}/transcript")
                    if transcript.status_code == 200:
                        vtt = transcript.json().get("vtt")
                        data["captions"] = vtt if isinstance(vtt, str) and vtt.startswith("WEBVTT") else None
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("Oak lesson %s could not be fetched: %s", slug, exc)
        return None
    return data


def _usable(data: dict) -> bool:
    """Whether a lesson can be shown here. Oak's own material is under the Open Government Licence, which
    allows it inside a paid product. Material Oak borrowed from others is only cleared for free classroom
    use, so a lesson that credits anyone else is not shown here: it opens on Oak's own website instead."""
    if not data.get("found") or data.get("credits"):
        return False
    return bool(data["starter"] or data["exit"] or data["video_url"] or data["has_worksheet"])


def get_lesson(db: Session, slug: str) -> Optional[dict]:
    """The kept copy of a lesson, fetched from Oak when it is missing or old. None when Oak has no key set or can't be reached."""
    row = db.query(OakLesson).filter(OakLesson.slug == slug).first()
    now = datetime.utcnow()
    if row:
        data = json.loads(row.data)
        age = now - row.fetched_at.replace(tzinfo=None)
        if age < (KEEP_FOR if _usable(data) else RETRY_EMPTY_AFTER):
            return data
    if not settings.OAK_API_KEY:
        return json.loads(row.data) if row else None
    fresh = _fetch(slug)
    if fresh is None:
        return json.loads(row.data) if row else None
    if row:
        row.data, row.fetched_at = json.dumps(fresh), now
    else:
        db.add(OakLesson(slug=slug, data=json.dumps(fresh), fetched_at=now))
    try:
        db.commit()
    except IntegrityError:
        # Another request saved this lesson first (a page often asks for it twice at once), so update theirs.
        db.rollback()
        db.query(OakLesson).filter(OakLesson.slug == slug).update({"data": json.dumps(fresh), "fetched_at": now})
        db.commit()
    return fresh


# ---------- scores, for results and stars ----------

def _attempt_out(a: Optional[OakLessonAttempt]) -> dict:
    return {
        "starter_score": a.starter_score if a else None,
        "starter_total": a.starter_total if a else None,
        "exit_score": a.exit_score if a else None,
        "exit_total": a.exit_total if a else None,
    }


def attempts_for_child(db: Session, child: User, parent_id: int) -> list:
    """Oak quiz scores from lessons done inside Bright Roots, in the same shape as the older share-link results."""
    rows = (
        db.query(OakLessonAttempt, PlannerEntry, Lesson)
        .join(PlannerEntry, OakLessonAttempt.entry_id == PlannerEntry.id)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(OakLessonAttempt.child_id == child.id, OakLessonAttempt.parent_id == parent_id)
        .all()
    )
    out = []
    for attempt, entry, lesson in rows:
        when = attempt.exit_at or attempt.starter_at
        if not when:
            continue
        out.append({
            "entry_id": entry.id,
            "subject": lesson.subject,
            "lesson_title": lesson.title,
            "scheduled_date": entry.scheduled_date.isoformat(),
            "completed_at": when.isoformat(),
            **_attempt_out(attempt),
        })
    return out


# ---------- the pages' endpoints ----------

def _entry_and_slug(db: Session, entry_id: int, user: User) -> tuple[PlannerEntry, str]:
    entry = _entry_for_user(db, entry_id, user)
    slug = lesson_slug(entry.lesson.lesson_url) if entry else None
    if not entry or not slug:
        raise HTTPException(status_code=404, detail="That isn't an Oak lesson")
    return entry, slug


def _child_for(db: Session, entry: PlannerEntry, user: User) -> Optional[int]:
    return user.id if user.role == "child" else entry.assigned_to


@router.get("/entry/{entry_id}")
def oak_lesson(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """One planned Oak lesson, ready to do here. `available` is false when Oak has nothing we may show."""
    entry, slug = _entry_and_slug(db, entry_id, current_user)
    data = get_lesson(db, slug)
    if not data or not _usable(data):
        return {"available": False}
    child_id = _child_for(db, entry, current_user)
    attempt = (
        db.query(OakLessonAttempt).filter(OakLessonAttempt.entry_id == entry.id, OakLessonAttempt.child_id == child_id).first()
        if child_id else None
    )
    return {
        "available": True,
        "title": data.get("title") or entry.lesson.title,
        "subject": data.get("subject"),
        "outcome": data.get("outcome"),
        "keywords": data.get("keywords") or [],
        "guidance": data.get("guidance"),
        "starter": data["starter"],
        "exit": data["exit"],
        "video_url": data["video_url"],
        "has_captions": bool(data.get("captions")),
        "has_worksheet": data["has_worksheet"],
        "oak_url": data["oak_url"],
        "licence_url": OGL_URL,
        "attempt": _attempt_out(attempt),
    }


@router.get("/entry/{entry_id}/captions", response_class=PlainTextResponse)
def oak_captions(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _, slug = _entry_and_slug(db, entry_id, current_user)
    data = get_lesson(db, slug)
    if not data or not data.get("captions"):
        raise HTTPException(status_code=404, detail="No captions for this lesson")
    return PlainTextResponse(data["captions"], media_type="text/vtt")


def _worksheet_link(slug: str) -> Optional[str]:
    """Oak's link to a lesson's worksheet, or None when it has none. The link only lasts a few minutes.
    Raises httpx.HTTPError when Oak can't be reached."""
    if not settings.OAK_API_KEY:
        return None
    with httpx.Client(timeout=15, headers=_headers()) as client:
        r = client.get(f"{_api_base()}/lessons/{slug}/assets/worksheet", follow_redirects=False)
    where = r.headers.get("location", "")
    if r.status_code not in (301, 302, 303, 307) or not where.startswith("https://"):
        return None
    return where


@router.get("/entry/{entry_id}/worksheet")
def oak_worksheet(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Send the browser to Oak's worksheet. Oak's link only lasts a few minutes, so a fresh one is asked for each time."""
    _, slug = _entry_and_slug(db, entry_id, current_user)
    try:
        where = _worksheet_link(slug)
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="We couldn't reach Oak just now. Please try again.")
    if not where:
        raise HTTPException(status_code=404, detail="The worksheet isn't available")
    return RedirectResponse(where, status_code=302)


# ---------- a day's worksheets, for printing ----------

MAX_WORKSHEET_BYTES = 20 * 1024 * 1024


def _day_worksheets(db: Session, parent: User, day: date, child_id: Optional[int]) -> list:
    """The family's Oak lessons on a day that have a worksheet, as (entry, slug), in subject order.
    With child_id, only that child's lessons and the ones for everyone."""
    children = _child_ids_for_parent(db, parent)
    query = (
        db.query(PlannerEntry)
        .join(Lesson, PlannerEntry.lesson_id == Lesson.id)
        .filter(Lesson.created_by == parent.id, PlannerEntry.scheduled_date == day)
        .order_by(Lesson.subject, PlannerEntry.assigned_to, PlannerEntry.id)
    )
    if child_id is not None:
        if child_id not in children:
            raise HTTPException(status_code=404, detail="Child not found")
        query = query.filter((PlannerEntry.assigned_to == child_id) | PlannerEntry.assigned_to.is_(None))
    else:
        query = query.filter((PlannerEntry.assigned_to.is_(None)) | PlannerEntry.assigned_to.in_(children))
    found = []
    for entry in query.all():
        slug = lesson_slug(entry.lesson.lesson_url)
        data = get_lesson(db, slug) if slug else None
        if data and data.get("has_worksheet"):
            found.append((entry, slug))
    return found


@router.get("/day-worksheets")
def day_worksheets(
    day: date, child_id: Optional[int] = None,
    db: Session = Depends(get_db), current_user: User = Depends(require_parent),
):
    """The Oak worksheets for a day's lessons, so a grown-up can print them in one go."""
    names = {c.id: c.username for c in db.query(User).filter(User.id.in_(_child_ids_for_parent(db, current_user))).all()}
    return [
        {
            "entry_id": entry.id,
            "subject": entry.lesson.subject,
            "title": entry.lesson.title,
            "child": names.get(entry.assigned_to) if entry.assigned_to else None,
        }
        for entry, _ in _day_worksheets(db, current_user, day, child_id)
    ]


def _download_pdf(url: str) -> Optional[bytes]:
    """A worksheet file from Oak, or None when it isn't a PDF or is too big to print here."""
    with httpx.Client(timeout=30, follow_redirects=True, max_redirects=3) as client:
        with client.stream("GET", url) as r:
            if r.status_code != 200:
                return None
            body = bytearray()
            for chunk in r.iter_bytes():
                body += chunk
                if len(body) > MAX_WORKSHEET_BYTES:
                    return None
    return bytes(body) if body.startswith(b"%PDF") else None


@router.get("/day-worksheets.pdf")
def day_worksheets_pdf(
    day: date, child_id: Optional[int] = None,
    db: Session = Depends(get_db), current_user: User = Depends(require_parent),
):
    """A day's Oak worksheets joined into one PDF, ready to print. Nothing is kept: each is fetched from Oak as asked."""
    sheets = _day_worksheets(db, current_user, day, child_id)
    if not sheets:
        raise HTTPException(status_code=404, detail="There are no Oak worksheets for this day")
    writer = PdfWriter()
    try:
        for _, slug in sheets:
            link = _worksheet_link(slug)
            pdf = _download_pdf(link) if link else None
            if not pdf:
                continue
            try:
                writer.append(PdfReader(io.BytesIO(pdf)))
            except PdfReadError:
                logger.warning("Oak worksheet for %s couldn't be read", slug)
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="We couldn't reach Oak just now. Please try again.")
    if not writer.pages:
        raise HTTPException(status_code=404, detail="Oak couldn't give us these worksheets just now")
    out = io.BytesIO()
    writer.write(out)
    return Response(
        out.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="worksheets-{day.isoformat()}.pdf"'},
    )


class QuizIn(BaseModel):
    answers: dict

    @field_validator("answers")
    @classmethod
    def not_huge(cls, value: dict) -> dict:
        if len(json.dumps(value)) > MAX_ANSWERS_CHARS:
            raise ValueError("Too many answers")
        return value


def _mark_done(db: Session, entry: PlannerEntry, child: User) -> None:
    now = datetime.utcnow()
    if entry.assigned_to is None:
        mine = db.query(PlannerCompletion).filter(PlannerCompletion.entry_id == entry.id, PlannerCompletion.user_id == child.id).first()
        if not mine:
            db.add(PlannerCompletion(entry_id=entry.id, user_id=child.id))
        entry.is_complete, entry.completed_at = True, entry.completed_at or now
    elif not entry.is_complete:
        entry.is_complete, entry.completed_at = True, now


@router.post("/entry/{entry_id}/quiz/{which}")
def submit_quiz(which: str, entry_id: int, body: QuizIn, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    """Mark a child's starter or exit quiz and keep their best score. Finishing the exit quiz completes the lesson."""
    if which not in QUIZZES:
        raise HTTPException(status_code=404, detail="Unknown quiz")
    entry, slug = _entry_and_slug(db, entry_id, current_user)
    data = get_lesson(db, slug)
    questions = (data or {}).get(which) or []
    if not questions:
        raise HTTPException(status_code=404, detail="This lesson doesn't have that quiz")

    right = [is_right(q, body.answers.get(str(i))) for i, q in enumerate(questions)]
    score, total = sum(right), len(questions)

    attempt = db.query(OakLessonAttempt).filter(
        OakLessonAttempt.entry_id == entry.id, OakLessonAttempt.child_id == current_user.id
    ).first()
    if not attempt:
        attempt = OakLessonAttempt(entry_id=entry.id, child_id=current_user.id, parent_id=current_user.parent_id, lesson_slug=slug)
        db.add(attempt)
    best = getattr(attempt, f"{which}_score")
    best_total = getattr(attempt, f"{which}_total") or total
    first_time = best is None
    better = first_time or score * best_total > best * total
    if better:
        setattr(attempt, f"{which}_score", score)
        setattr(attempt, f"{which}_total", total)
        setattr(attempt, f"{which}_answers", json.dumps(body.answers))
        setattr(attempt, f"{which}_at", datetime.utcnow())
    if which == "exit":
        _mark_done(db, entry, current_user)
    db.commit()
    return {
        "score": score,
        "total": total,
        "right": right,
        "first_time": first_time,
        "new_best": better and not first_time,
        "lesson_complete": which == "exit",
        "attempt": _attempt_out(attempt),
    }
