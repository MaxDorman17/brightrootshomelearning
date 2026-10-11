"""Colouring sheets the team uploads on /admin/colouring, so new sheets don't need a code change.

The original sheets are static files in the frontend (frontend/public/colouring, listed in
lib/colouring.ts). Uploaded ones are kept in uploads/colouring (backed up with every other upload)
and listed here. Anyone can list and open them, the same as the static files; only the site owner
can add, rename, move or remove them.
"""
import io
import os
import re
import threading
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import actor, get_authenticated_user
from database import get_db
from models import ColouringSheet, ColouringTheme, User
from newsletter_access import is_admin
from storage import upload_dir

router = APIRouter(prefix="/api/colouring", tags=["colouring"])

# The original themes in frontend/src/lib/colouring.ts (THEMES). Keep the two lists in step.
BUILT_IN_THEMES = {
    "woodland-friends": "Woodland Friends",
    "farmyard-fun": "Farmyard Fun",
    "under-the-sea": "Under the Sea",
    "dinosaur-world": "Dinosaur World",
    "space-adventure": "Space Adventure",
    "garden-and-growing": "Garden & Growing",
    "seasonal-fun": "Seasonal Fun",
    "fairy-tale-adventures": "Fairy-Tale Adventures",
    "vehicles-and-building": "Vehicles & Building",
    "romans": "The Romans",
}

MAX_PDF_SIZE = 25 * 1024 * 1024
MAX_COVER_SIZE = 10 * 1024 * 1024
MAX_FILES_PER_UPLOAD = 30
PREVIEW_WIDTH = 600
COVER_SIZE = 800
PUBLIC_CACHE = "public, max-age=86400"
# PDFium isn't safe to use from two threads at once.
_pdfium_lock = threading.Lock()


def _require_owner(user: User = Depends(get_authenticated_user)) -> User:
    if not is_admin(actor(user)):
        raise HTTPException(status_code=403, detail="Only the site owner can do this")
    return actor(user)


def _folder() -> str:
    return upload_dir("colouring")


def _path(name: str) -> str:
    return os.path.join(_folder(), os.path.basename(name))


def _remove(name: str | None) -> None:
    if not name:
        return
    try:
        if os.path.isfile(_path(name)):
            os.remove(_path(name))
    except OSError:
        pass


def slugify(text: str) -> str:
    text = text.lower().replace("&", " and ").replace("'", "").replace("’", "")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")[:100] or "sheet"


def title_from_filename(filename: str) -> str:
    """'forest-picnic_2.pdf' -> 'Forest Picnic 2'."""
    stem = re.sub(r"\.[A-Za-z0-9]{1,5}$", "", os.path.basename(filename or ""))
    words = re.sub(r"[-_.]+", " ", stem).split()
    return " ".join(w[:1].upper() + w[1:].lower() for w in words)[:120] or "Colouring Sheet"


def _theme_names(db: Session) -> dict[str, str]:
    names = dict(BUILT_IN_THEMES)
    names.update({t.slug: t.name for t in db.query(ColouringTheme).all()})
    return names


def _check_theme(db: Session, slug: str) -> str:
    slug = (slug or "").strip()
    if slug not in BUILT_IN_THEMES and not db.query(ColouringTheme).filter(ColouringTheme.slug == slug).first():
        raise HTTPException(status_code=400, detail="Please choose a theme first")
    return slug


def _free_slug(db: Session, theme: str, title: str, except_id: int | None = None) -> str:
    base = slugify(title)
    taken = {
        s for (s,) in db.query(ColouringSheet.slug).filter(ColouringSheet.theme == theme, ColouringSheet.id != (except_id or 0)).all()
    }
    slug, n = base, 2
    while slug in taken:
        slug, n = f"{base}-{n}", n + 1
    return slug


def render_preview(data: bytes) -> bytes:
    """A JPG of the PDF's first page, about 600 pixels wide. Raises ValueError if it can't be drawn."""
    import pypdfium2 as pdfium

    with _pdfium_lock:
        try:
            pdf = pdfium.PdfDocument(data)
        except pdfium.PdfiumError as exc:
            raise ValueError("it couldn't be opened (is it password protected or damaged?)") from exc
        try:
            if len(pdf) < 1:
                raise ValueError("it has no pages")
            page = pdf[0]
            width, height = page.get_width(), page.get_height()
            if width <= 0 or height <= 0:
                raise ValueError("its first page is empty")
            scale = min(PREVIEW_WIDTH / width, 2000 / height)
            image = page.render(scale=scale, fill_color=(255, 255, 255, 255)).to_pil()
        except pdfium.PdfiumError as exc:
            raise ValueError("its first page couldn't be drawn") from exc
        finally:
            pdf.close()
    out = io.BytesIO()
    image.convert("RGB").save(out, "JPEG", quality=85, optimize=True)
    return out.getvalue()


def _iso(dt: datetime | None) -> str | None:
    return dt.isoformat() + "Z" if dt else None


def _sheet_out(s: ColouringSheet, theme_names: dict[str, str] | None = None) -> dict:
    out = {
        "id": s.id,
        "theme": s.theme,
        "title": s.title,
        "slug": s.slug,
        "position": s.position,
        "created_at": _iso(s.created_at),
        "pdf_url": f"/api/colouring/sheets/{s.id}/{s.slug}.pdf",
        "preview_url": f"/api/colouring/sheets/{s.id}/preview.jpg?v={s.preview_file[:8]}",
    }
    if theme_names is not None:
        out["theme_name"] = theme_names.get(s.theme, s.theme)
    return out


def _theme_out(t: ColouringTheme) -> dict:
    return {
        "slug": t.slug,
        "name": t.name,
        "cover_url": f"/api/colouring/themes/{t.slug}/cover.jpg?v={t.cover_file[:8]}" if t.cover_file else None,
        "created_at": _iso(t.created_at),
    }


# ---------- for everyone ----------


@router.get("")
def list_uploaded(response: Response, db: Session = Depends(get_db)):
    """Themes made here and every uploaded sheet, in the order they're shown within each theme."""
    # Always checked afresh, so a sheet the team has just uploaded or removed shows straight away.
    response.headers["Cache-Control"] = "no-cache"
    themes = db.query(ColouringTheme).order_by(ColouringTheme.created_at, ColouringTheme.id).all()
    sheets = db.query(ColouringSheet).order_by(ColouringSheet.theme, ColouringSheet.position, ColouringSheet.id).all()
    return {"themes": [_theme_out(t) for t in themes], "sheets": [_sheet_out(s) for s in sheets]}


def _sheet_or_404(db: Session, sheet_id: int) -> ColouringSheet:
    sheet = db.get(ColouringSheet, sheet_id)
    if not sheet:
        raise HTTPException(status_code=404, detail="Sheet not found")
    return sheet


@router.get("/sheets/{sheet_id}/preview.jpg")
def sheet_preview(sheet_id: int, db: Session = Depends(get_db)):
    sheet = _sheet_or_404(db, sheet_id)
    if not os.path.isfile(_path(sheet.preview_file)):
        raise HTTPException(status_code=404, detail="Picture not found")
    return FileResponse(_path(sheet.preview_file), media_type="image/jpeg", headers={"Cache-Control": PUBLIC_CACHE})


@router.get("/sheets/{sheet_id}/{name}.pdf")
def sheet_pdf(sheet_id: int, name: str, db: Session = Depends(get_db)):
    """The PDF, opened in the browser to print. The name in the address is only for a friendly file name."""
    sheet = _sheet_or_404(db, sheet_id)
    if not os.path.isfile(_path(sheet.pdf_file)):
        raise HTTPException(status_code=404, detail="Sheet not found")
    return FileResponse(
        _path(sheet.pdf_file),
        media_type="application/pdf",
        filename=f"{sheet.slug}.pdf",
        content_disposition_type="inline",
        headers={"Cache-Control": "public, max-age=3600"},
    )


@router.get("/themes/{slug}/cover.jpg")
def theme_cover(slug: str, db: Session = Depends(get_db)):
    theme = db.query(ColouringTheme).filter(ColouringTheme.slug == slug).first()
    if not theme or not theme.cover_file or not os.path.isfile(_path(theme.cover_file)):
        raise HTTPException(status_code=404, detail="No cover")
    return FileResponse(_path(theme.cover_file), media_type="image/jpeg", headers={"Cache-Control": PUBLIC_CACHE})


# ---------- owner only ----------


@router.get("/admin/sheets")
def admin_sheets(db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    names = _theme_names(db)
    rows = db.query(ColouringSheet).order_by(ColouringSheet.created_at.desc(), ColouringSheet.id.desc()).all()
    return [_sheet_out(s, names) for s in rows]


@router.post("/admin/sheets", status_code=201)
async def upload_sheets(
    theme: str = Form(...),
    files: list[UploadFile] = File(...),
    titles: list[str] = Form(default=[]),
    db: Session = Depends(get_db),
    owner: User = Depends(_require_owner),
):
    """Add one or more PDFs to a theme. Titles are optional and match the files in order.
    If any file is no good, nothing is added and the message says which one."""
    theme = _check_theme(db, theme)
    if not files:
        raise HTTPException(status_code=400, detail="Please choose at least one PDF")
    if len(files) > MAX_FILES_PER_UPLOAD:
        raise HTTPException(status_code=400, detail=f"Please upload at most {MAX_FILES_PER_UPLOAD} sheets at a time")

    ready: list[tuple[str, bytes, bytes]] = []
    for i, upload in enumerate(files):
        name = upload.filename or f"File {i + 1}"
        data = await upload.read(MAX_PDF_SIZE + 1)
        if len(data) > MAX_PDF_SIZE:
            raise HTTPException(status_code=400, detail=f"{name} is too big. Each PDF must be 25 MB or smaller.")
        if not data.startswith(b"%PDF"):
            raise HTTPException(status_code=400, detail=f"{name} isn't a PDF. Please upload PDF files only.")
        try:
            preview = await run_in_threadpool(render_preview, data)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=f"We couldn't make a picture of {name}: {exc}.") from exc
        title = (titles[i] if i < len(titles) else "").strip()[:120] or title_from_filename(name)
        ready.append((title, data, preview))

    position = (db.query(func.max(ColouringSheet.position)).filter(ColouringSheet.theme == theme).scalar() or 0) + 1
    written: list[str] = []
    added: list[ColouringSheet] = []
    try:
        for title, data, preview in ready:
            pdf_name, preview_name = f"{uuid.uuid4().hex}.pdf", f"{uuid.uuid4().hex}.jpg"
            for file_name, content in ((pdf_name, data), (preview_name, preview)):
                with open(_path(file_name), "wb") as f:
                    f.write(content)
                written.append(file_name)
            sheet = ColouringSheet(
                theme=theme,
                title=title,
                slug=_free_slug(db, theme, title),
                pdf_file=pdf_name,
                preview_file=preview_name,
                position=position,
                created_at=datetime.utcnow(),
                uploaded_by=owner.id,
            )
            db.add(sheet)
            db.flush()
            added.append(sheet)
            position += 1
        db.commit()
    except Exception:
        db.rollback()
        for file_name in written:
            _remove(file_name)
        raise
    names = _theme_names(db)
    return [_sheet_out(s, names) for s in added]


class SheetChange(BaseModel):
    title: str | None = None
    theme: str | None = None
    position: int | None = None


@router.patch("/admin/sheets/{sheet_id}")
def change_sheet(sheet_id: int, body: SheetChange, db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    """Rename a sheet, move it to another theme, or change where it comes in its theme."""
    sheet = _sheet_or_404(db, sheet_id)
    if body.theme is not None and body.theme != sheet.theme:
        sheet.theme = _check_theme(db, body.theme)
        sheet.position = (db.query(func.max(ColouringSheet.position)).filter(ColouringSheet.theme == sheet.theme).scalar() or 0) + 1
        sheet.slug = _free_slug(db, sheet.theme, sheet.title, sheet.id)
    if body.title is not None:
        title = body.title.strip()[:120]
        if not title:
            raise HTTPException(status_code=400, detail="Please give the sheet a name")
        sheet.title = title
        sheet.slug = _free_slug(db, sheet.theme, title, sheet.id)
    if body.position is not None:
        sheet.position = body.position
    db.commit()
    return _sheet_out(sheet, _theme_names(db))


@router.delete("/admin/sheets/{sheet_id}")
def delete_sheet(sheet_id: int, db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    sheet = _sheet_or_404(db, sheet_id)
    files = (sheet.pdf_file, sheet.preview_file)
    db.delete(sheet)
    db.commit()
    for name in files:
        _remove(name)
    return {"deleted": True}


class NewTheme(BaseModel):
    name: str


@router.post("/admin/themes", status_code=201)
def create_theme(body: NewTheme, db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    name = body.name.strip()[:100]
    if not name:
        raise HTTPException(status_code=400, detail="Please give the theme a name")
    slug = slugify(name)[:80]
    taken = slug in BUILT_IN_THEMES or db.query(ColouringTheme).filter(ColouringTheme.slug == slug).first()
    if taken or any(n.lower() == name.lower() for n in _theme_names(db).values()):
        raise HTTPException(status_code=400, detail="There's already a theme with that name")
    theme = ColouringTheme(slug=slug, name=name, created_at=datetime.utcnow())
    db.add(theme)
    db.commit()
    return _theme_out(theme)


def _square_cover(data: bytes) -> bytes:
    from PIL import Image, ImageOps, UnidentifiedImageError

    try:
        with Image.open(io.BytesIO(data)) as image:
            image = ImageOps.exif_transpose(image)
            image = ImageOps.fit(image.convert("RGB"), (COVER_SIZE, COVER_SIZE), Image.Resampling.LANCZOS, centering=(0.5, 0.0))
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
        raise HTTPException(status_code=400, detail="That file doesn't look like a picture. Please use a JPG or PNG.") from exc
    out = io.BytesIO()
    image.save(out, "JPEG", quality=85, optimize=True)
    return out.getvalue()


@router.post("/admin/themes/{slug}/cover")
async def upload_cover(slug: str, file: UploadFile = File(...), db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    """A square cover for a theme made here, cropped from the top-middle of the picture."""
    theme = db.query(ColouringTheme).filter(ColouringTheme.slug == slug).first()
    if not theme:
        raise HTTPException(status_code=404, detail="Only themes made here can have a new cover")
    data = await file.read(MAX_COVER_SIZE + 1)
    if len(data) > MAX_COVER_SIZE:
        raise HTTPException(status_code=400, detail="The cover picture must be 10 MB or smaller")
    cover = _square_cover(data)
    name = f"{uuid.uuid4().hex}.jpg"
    with open(_path(name), "wb") as f:
        f.write(cover)
    old, theme.cover_file = theme.cover_file, name
    db.commit()
    _remove(old)
    return _theme_out(theme)


@router.delete("/admin/themes/{slug}")
def delete_theme(slug: str, db: Session = Depends(get_db), _: User = Depends(_require_owner)):
    """Remove a theme made here. Only once it has no sheets, so nothing is lost by mistake."""
    theme = db.query(ColouringTheme).filter(ColouringTheme.slug == slug).first()
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    if db.query(ColouringSheet).filter(ColouringSheet.theme == slug).first():
        raise HTTPException(status_code=400, detail="Move or delete this theme's sheets first")
    cover = theme.cover_file
    db.delete(theme)
    db.commit()
    _remove(cover)
    return {"deleted": True}
