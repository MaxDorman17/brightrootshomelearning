"""Cookbook and Craft Corner: recipes and crafts, children's wish lists, and the family shopping list."""
import json
import os
import re
import uuid
from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, field_validator
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from clock import uk_today
from auth import get_current_user, require_child, require_parent
from database import get_db
from models import JournalEntry, Lesson, MakeItem, MakeWish, PlannerEntry, ShoppingItem, StarAward, User
from routers.moments import PHOTO_TYPES, MAX_PHOTO_SIZE, _clean_child_ids, _family_children, _family_id
from routers.profile import _looks_like_image
from storage import upload_dir

router = APIRouter(prefix="/api/make", tags=["make"])

PHOTO_DIR = upload_dir("make")
KINDS = {"recipe", "craft", "pe", "outdoor", "life", "little"}
DIFFICULTIES = {"easy", "medium", "tricky"}


# ---------- shapes ----------


class Material(BaseModel):
    name: str
    qty: str = ""


class Step(BaseModel):
    text: str
    grown_up: bool = False


class ItemIn(BaseModel):
    kind: str
    title: str
    emoji: Optional[str] = None
    summary: Optional[str] = None
    category: Optional[str] = None
    minutes: Optional[int] = None
    difficulty: Optional[str] = None
    age_from: Optional[int] = None
    serves: Optional[str] = None
    materials: list[Material] = []
    steps: list[Step] = []
    tips: Optional[str] = None
    talk: list[str] = []
    more: Optional[str] = None
    easier: Optional[str] = None
    story: list[str] = []

    @field_validator("kind")
    @classmethod
    def valid_kind(cls, v: str) -> str:
        if v not in KINDS:
            raise ValueError("Unknown kind")
        return v

    @field_validator("title")
    @classmethod
    def valid_title(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Please give it a name")
        return v[:150]

    @field_validator("difficulty")
    @classmethod
    def valid_difficulty(cls, v: Optional[str]) -> Optional[str]:
        return v if v in DIFFICULTIES else None

    @field_validator("minutes", "age_from")
    @classmethod
    def valid_number(cls, v: Optional[int]) -> Optional[int]:
        return v if v is not None and 0 < v < 1000 else None

    @field_validator("materials")
    @classmethod
    def valid_materials(cls, v: list[Material]) -> list[Material]:
        clean = [Material(name=m.name.strip()[:150], qty=m.qty.strip()[:80]) for m in v if m.name.strip()]
        return clean[:60]

    @field_validator("steps")
    @classmethod
    def valid_steps(cls, v: list[Step]) -> list[Step]:
        clean = [Step(text=s.text.strip()[:600], grown_up=s.grown_up) for s in v if s.text.strip()]
        return clean[:40]

    @field_validator("talk")
    @classmethod
    def valid_talk(cls, v: list[str]) -> list[str]:
        return [t.strip()[:300] for t in v if t.strip()][:12]

    @field_validator("story")
    @classmethod
    def valid_story(cls, v: list[str]) -> list[str]:
        return [t.strip()[:500] for t in v if t.strip()][:42]


class PlanIn(BaseModel):
    scheduled_date: date
    subject: str
    child_ids: list[int] = []


class ShoppingAddIn(BaseModel):
    name: str
    qty: str = ""


class ShoppingFromItemIn(BaseModel):
    names: Optional[list[str]] = None  # None adds everything


class ShoppingUpdateIn(BaseModel):
    done: Optional[bool] = None
    name: Optional[str] = None
    qty: Optional[str] = None


# ---------- helpers ----------


def _visible(db: Session, user: User):
    family = _family_id(user)
    return db.query(MakeItem).filter(or_(MakeItem.parent_id.is_(None), MakeItem.parent_id == family))


def _get_item(db: Session, user: User, item_id: int) -> MakeItem:
    item = _visible(db, user).filter(MakeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


def _own_item(db: Session, parent: User, item_id: int) -> MakeItem:
    item = db.query(MakeItem).filter(MakeItem.id == item_id, MakeItem.parent_id == parent.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="You can only change your own recipes and crafts")
    return item


def _loads(raw: Optional[str]) -> list:
    try:
        value = json.loads(raw or "[]")
        return value if isinstance(value, list) else []
    except ValueError:
        return []


def _wishes(db: Session, user: User, item_ids: list[int]) -> dict[int, list[str]]:
    """Which children wished for each item. Parents see every child; a child sees only themselves."""
    if not item_ids:
        return {}
    q = db.query(MakeWish.item_id, User.username).join(User, User.id == MakeWish.child_id).filter(MakeWish.item_id.in_(item_ids))
    if user.role == "child":
        q = q.filter(MakeWish.child_id == user.id)
    else:
        q = q.filter(User.parent_id == user.id)
    out: dict[int, list[str]] = {}
    for item_id, name in q.all():
        out.setdefault(item_id, []).append(name)
    return out


def _out(item: MakeItem, wished_by: list[str], full: bool = True) -> dict:
    data = {
        "id": item.id,
        "kind": item.kind,
        "title": item.title,
        "emoji": item.emoji,
        "summary": item.summary,
        "category": item.category,
        "minutes": item.minutes,
        "difficulty": item.difficulty,
        "age_from": item.age_from,
        "serves": item.serves,
        "has_photo": bool(item.photo),
        "slug": item.slug,  # starter items have a stock photo at /make-photos/<slug>.jpg
        "is_own": item.parent_id is not None,
        "wished_by": wished_by,
    }
    if full:
        data.update({
            "materials": _loads(item.materials),
            "steps": _loads(item.steps),
            "tips": item.tips,
            "talk": _loads(item.talk),
            "more": item.more,
            "easier": item.easier,
            "story": _loads(item.story),
        })
    else:
        data["material_count"] = len(_loads(item.materials))
    return data


def _fill(item: MakeItem, body: ItemIn) -> None:
    item.kind = body.kind
    item.title = body.title
    item.emoji = (body.emoji or "").strip()[:16] or None
    item.summary = (body.summary or "").strip()[:300] or None
    item.category = (body.category or "").strip()[:40] or None
    item.minutes = body.minutes
    item.difficulty = body.difficulty
    item.age_from = body.age_from
    item.serves = (body.serves or "").strip()[:40] or None
    item.materials = json.dumps([m.model_dump() for m in body.materials])
    item.steps = json.dumps([s.model_dump() for s in body.steps])
    item.tips = (body.tips or "").strip()[:2000] or None
    item.talk = json.dumps(body.talk) if body.talk else None
    item.more = (body.more or "").strip()[:1000] or None
    item.easier = (body.easier or "").strip()[:1000] or None
    item.story = json.dumps(body.story) if body.story else None


def _photo_path(name: str) -> str:
    return os.path.join(PHOTO_DIR, os.path.basename(name))


def _remove_photo(item: MakeItem) -> None:
    if item.photo:
        try:
            os.remove(_photo_path(item.photo))
        except OSError:
            pass
        item.photo = None


# ---------- recipes and crafts ----------


@router.get("/items")
def list_items(kind: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = _visible(db, current_user)
    if kind in KINDS:
        q = q.filter(MakeItem.kind == kind)
    items = q.order_by(MakeItem.parent_id.is_(None), MakeItem.title).all()
    wishes = _wishes(db, current_user, [i.id for i in items])
    return [_out(i, wishes.get(i.id, []), full=False) for i in items]


@router.get("/items/{item_id}")
def get_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = _get_item(db, current_user, item_id)
    return _out(item, _wishes(db, current_user, [item.id]).get(item.id, []))


@router.post("/items", status_code=201)
def add_item(body: ItemIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = MakeItem(parent_id=current_user.id)
    _fill(item, body)
    db.add(item)
    db.commit()
    db.refresh(item)
    return _out(item, [])


@router.put("/items/{item_id}")
def update_item(item_id: int, body: ItemIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = _own_item(db, current_user, item_id)
    _fill(item, body)
    db.commit()
    return _out(item, _wishes(db, current_user, [item.id]).get(item.id, []))


@router.post("/items/{item_id}/copy", status_code=201)
def copy_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Make an editable family copy of any recipe or craft, e.g. to tweak a starter one."""
    src = _get_item(db, current_user, item_id)
    item = MakeItem(
        parent_id=current_user.id, kind=src.kind, title=src.title, emoji=src.emoji, summary=src.summary,
        category=src.category, minutes=src.minutes, difficulty=src.difficulty, age_from=src.age_from,
        serves=src.serves, materials=src.materials, steps=src.steps, tips=src.tips,
        talk=src.talk, more=src.more, easier=src.easier, story=src.story,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _out(item, [])


@router.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = _own_item(db, current_user, item_id)
    _remove_photo(item)
    db.query(MakeWish).filter(MakeWish.item_id == item.id).delete()
    db.delete(item)
    db.commit()


@router.post("/items/{item_id}/photo")
async def upload_photo(item_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = _own_item(db, current_user, item_id)
    ext = PHOTO_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=400, detail="Photos must be JPG, PNG, WebP or GIF")
    data = await file.read(MAX_PHOTO_SIZE + 1)
    if len(data) > MAX_PHOTO_SIZE:
        raise HTTPException(status_code=400, detail="The photo must be 10 MB or smaller")
    if not _looks_like_image(data):
        raise HTTPException(status_code=400, detail="That file doesn't look like a photo")
    _remove_photo(item)
    name = f"{uuid.uuid4().hex}{ext}"
    with open(_photo_path(name), "wb") as f:
        f.write(data)
    item.photo = name
    db.commit()
    return {"has_photo": True}


@router.delete("/items/{item_id}/photo", status_code=204)
def delete_photo(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = _own_item(db, current_user, item_id)
    _remove_photo(item)
    db.commit()


@router.get("/items/{item_id}/photo")
def get_photo(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = _get_item(db, current_user, item_id)
    if not item.photo or not os.path.isfile(_photo_path(item.photo)):
        raise HTTPException(status_code=404, detail="No photo")
    return FileResponse(_photo_path(item.photo), headers={"Cache-Control": "private, max-age=86400"})


# ---------- wishes ----------


@router.post("/items/{item_id}/wish")
def toggle_wish(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_child)):
    item = _get_item(db, current_user, item_id)
    existing = db.query(MakeWish).filter(MakeWish.item_id == item.id, MakeWish.child_id == current_user.id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"wished": False}
    db.add(MakeWish(item_id=item.id, child_id=current_user.id))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
    try:
        from push import notify_in_background

        notify_in_background(
            current_user.parent_id,
            f"{current_user.username} would love to make this",
            f"{item.emoji or ''} {item.title}".strip(),
            f"/make/{item.id}",
            "make-wish",
        )
    except Exception:
        pass
    return {"wished": True}


@router.delete("/wishes/{item_id}", status_code=204)
def clear_wishes(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """Parent marks a wish as done (e.g. after making it together)."""
    child_ids = [c.id for c in db.query(User.id).filter(User.parent_id == current_user.id)]
    db.query(MakeWish).filter(MakeWish.item_id == item_id, MakeWish.child_id.in_(child_ids)).delete(synchronize_session=False)
    db.commit()


# ---------- plan it ----------


@router.post("/items/{item_id}/plan", status_code=201)
def plan_item(item_id: int, body: PlanIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = _get_item(db, current_user, item_id)
    subject = body.subject.strip()[:100] or {"recipe": "Cooking", "pe": "PE", "outdoor": "Outdoor Learning", "life": "Life Skills", "little": "Little Roots"}.get(item.kind, "Art")
    materials = _loads(item.materials)
    need = ", ".join(f"{m.get('qty')} {m.get('name')}".strip() for m in materials)
    label = "Ingredients" if item.kind == "recipe" else "You'll need"
    lesson = Lesson(
        title=item.title,
        subject=subject,
        description=(item.summary or "") + (f"\n\n{label}: {need}" if need else ""),
        lesson_url=f"/make/{item.id}",
        steps=json.dumps([s.get("text", "")[:500] for s in _loads(item.steps)][:30]) or None,
        duration_minutes=item.minutes,
        created_by=current_user.id,
    )
    db.add(lesson)
    db.flush()
    children = _clean_child_ids(db, current_user.id, body.child_ids)
    for child_id in children or [None]:
        db.add(PlannerEntry(lesson_id=lesson.id, assigned_to=child_id, scheduled_date=body.scheduled_date))
    db.commit()
    return {"lesson_id": lesson.id, "entries": len(children) or 1}


# ---------- shopping list ----------

_QTY = re.compile(r"^\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]*)\s*$")


def _merge_qty(a: Optional[str], b: Optional[str]) -> Optional[str]:
    """Add "200 g" + "100g" = "300 g" when the units match; otherwise keep both."""
    a, b = (a or "").strip(), (b or "").strip()
    if not a or not b:
        return a or b or None
    ma, mb = _QTY.match(a), _QTY.match(b)
    if ma and mb and ma.group(2).lower() == mb.group(2).lower():
        total = float(ma.group(1)) + float(mb.group(1))
        num = int(total) if total.is_integer() else round(total, 2)
        unit = ma.group(2)
        return f"{num} {unit}".strip() if unit else str(num)
    return f"{a} + {b}"[:80]


def _key(name: str) -> str:
    """So "Egg" and "eggs" land on the same line."""
    k = " ".join(name.lower().split())
    if k.endswith("oes") or k.endswith("ches") or k.endswith("shes"):
        return k[:-2]
    return k[:-1] if k.endswith("s") and not k.endswith("ss") else k


def _add_line(db: Session, parent_id: int, name: str, qty: str, source: Optional[str]) -> None:
    name = name.strip()[:150]
    if not name:
        return
    existing = (
        db.query(ShoppingItem)
        .filter(ShoppingItem.parent_id == parent_id, ShoppingItem.done.is_(False))
        .all()
    )
    match = next((s for s in existing if _key(s.name) == _key(name)), None)
    if match:
        match.qty = _merge_qty(match.qty, qty)
        if source:
            names = [s for s in (match.sources or "").split(" · ") if s]
            if source not in names:
                names.append(source)
            match.sources = " · ".join(names)[:300]
    else:
        db.add(ShoppingItem(parent_id=parent_id, name=name, qty=(qty or "").strip()[:80] or None, sources=source))


def _shopping_out(s: ShoppingItem) -> dict:
    return {"id": s.id, "name": s.name, "qty": s.qty, "sources": s.sources, "done": s.done}


@router.get("/shopping")
def shopping_list(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    rows = db.query(ShoppingItem).filter(ShoppingItem.parent_id == current_user.id).order_by(ShoppingItem.done, ShoppingItem.id).all()
    return [_shopping_out(s) for s in rows]


@router.get("/shopping/count")
def shopping_count(db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    return {"count": db.query(ShoppingItem).filter(ShoppingItem.parent_id == current_user.id, ShoppingItem.done.is_(False)).count()}


@router.post("/shopping", status_code=201)
def shopping_add(body: ShoppingAddIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="Type something to add")
    _add_line(db, current_user.id, body.name, body.qty, None)
    db.commit()
    return shopping_list(db, current_user)


@router.post("/items/{item_id}/shopping")
def shopping_from_item(item_id: int, body: ShoppingFromItemIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    item = _get_item(db, current_user, item_id)
    wanted = {n.lower() for n in body.names} if body.names is not None else None
    added = 0
    for m in _loads(item.materials):
        name = (m.get("name") or "").strip()
        if not name or (wanted is not None and name.lower() not in wanted):
            continue
        _add_line(db, current_user.id, name, m.get("qty") or "", item.title)
        added += 1
    db.commit()
    return {"added": added}


@router.patch("/shopping/{line_id}")
def shopping_update(line_id: int, body: ShoppingUpdateIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    line = db.query(ShoppingItem).filter(ShoppingItem.id == line_id, ShoppingItem.parent_id == current_user.id).first()
    if not line:
        raise HTTPException(status_code=404, detail="Not found")
    if body.done is not None:
        line.done = body.done
    if body.name is not None and body.name.strip():
        line.name = body.name.strip()[:150]
    if body.qty is not None:
        line.qty = body.qty.strip()[:80] or None
    db.commit()
    return _shopping_out(line)


@router.delete("/shopping/{line_id}", status_code=204)
def shopping_delete(line_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    db.query(ShoppingItem).filter(ShoppingItem.id == line_id, ShoppingItem.parent_id == current_user.id).delete()
    db.commit()


@router.post("/shopping/clear")
def shopping_clear(done_only: bool = True, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    q = db.query(ShoppingItem).filter(ShoppingItem.parent_id == current_user.id)
    if done_only:
        q = q.filter(ShoppingItem.done.is_(True))
    q.delete()
    db.commit()
    return shopping_list(db, current_user)


# ---------- Little Roots: "We did it!" and the week's set ----------


class DidItIn(BaseModel):
    child_ids: list[int]
    stars: int
    said: Optional[str] = None  # what the child said, saved to the learning journal
    day: Optional[date] = None  # the family's own today, so a late-evening book lands on the right day

    @field_validator("stars")
    @classmethod
    def valid_stars(cls, v: int) -> int:
        if not 1 <= v <= 5:
            raise ValueError("Choose 1 to 5 stars")
        return v

    @field_validator("said")
    @classmethod
    def clean_said(cls, v: Optional[str]) -> Optional[str]:
        v = " ".join((v or "").split())[:500]
        return v or None


@router.post("/items/{item_id}/did-it", status_code=201)
def did_it(item_id: int, body: DidItIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    """The end of a Little Roots story book: stars for each child, the planner ticked, and their words in the journal."""
    item = _get_item(db, current_user, item_id)
    family = _family_children(db, current_user.id)
    children = _clean_child_ids(db, current_user.id, body.child_ids)
    if not children:
        raise HTTPException(status_code=400, detail="Choose who did it")
    day = body.day or uk_today()
    if abs((day - uk_today()).days) > 1:
        day = uk_today()
    ticked = 0
    for child_id in children:
        db.add(StarAward(parent_id=current_user.id, child_id=child_id, stars=body.stars, reason=f"Little Roots: {item.title}"[:200]))
        # Tick off this card in the planner if it was planned for them (today's, or the latest one still to do).
        entry = (
            db.query(PlannerEntry)
            .join(Lesson, Lesson.id == PlannerEntry.lesson_id)
            .filter(
                Lesson.created_by == current_user.id,
                Lesson.lesson_url == f"/make/{item.id}",
                PlannerEntry.assigned_to == child_id,
                PlannerEntry.is_complete.is_not(True),
                PlannerEntry.scheduled_date <= day + timedelta(days=6),
            )
            .order_by(PlannerEntry.scheduled_date.desc())
            .first()
        )
        if entry:
            entry.is_complete = True
            entry.completed_at = datetime.utcnow()
            ticked += 1
    if body.said:
        names = " and ".join(family[c].username for c in children)
        line = f"Little Roots, {item.title} ({names}): \u201c{body.said}\u201d"
        journal = db.query(JournalEntry).filter(JournalEntry.created_by == current_user.id, JournalEntry.entry_date == day).first()
        if journal:
            journal.content = f"{journal.content.rstrip()}\n\n{line}"
        else:
            db.add(JournalEntry(entry_date=day, content=line, created_by=current_user.id))
    db.commit()
    return {"stars": body.stars, "children": children, "ticked": ticked, "journal": bool(body.said)}


def _week_number(day: date) -> int:
    from make_starters_little import LITTLE_WEEKS
    return (day.isocalendar()[1] - 1) % len(LITTLE_WEEKS)


def _week_items(db: Session, user: User, index: int) -> list[MakeItem]:
    from make_starters_little import LITTLE_WEEKS
    slugs = LITTLE_WEEKS[index % len(LITTLE_WEEKS)]
    found = {i.slug: i for i in db.query(MakeItem).filter(MakeItem.parent_id.is_(None), MakeItem.slug.in_(slugs))}
    return [found[s] for s in slugs if s in found]


@router.get("/little/week")
def little_week(offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """This week's Little Roots set (offset 1 = next week). The weeks go round in order, one per calendar week."""
    from make_starters_little import LITTLE_WEEKS
    monday = uk_today() - timedelta(days=uk_today().weekday()) + timedelta(weeks=max(-4, min(offset, 8)))
    index = _week_number(monday)
    items = _week_items(db, current_user, index)
    return {"week": index + 1, "weeks": len(LITTLE_WEEKS), "monday": monday, "items": [_out(i, [], full=False) for i in items]}


class PlanWeekIn(BaseModel):
    monday: date
    child_ids: list[int] = []


# Activities on Monday, Wednesday and Friday; the rhyme goes on Monday too, as it's quick.
_WEEK_DAYS = [0, 2, 4, 0]


@router.post("/little/week/plan", status_code=201)
def plan_little_week(body: PlanWeekIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    monday = body.monday - timedelta(days=body.monday.weekday())
    items = _week_items(db, current_user, _week_number(monday))
    planned = 0
    for item, offset in zip(items, _WEEK_DAYS):
        plan_item(item.id, PlanIn(scheduled_date=monday + timedelta(days=offset), subject="", child_ids=body.child_ids), db, current_user)
        planned += 1
    return {"planned": planned, "monday": monday}

