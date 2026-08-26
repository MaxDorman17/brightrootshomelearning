from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
import os
import uuid
from database import get_db
from models import ReadingLog, ReadingWorksheet, User
from schemas import ReadingLogCreate, ReadingLogUpdate, ReadingLogOut, ReadingWorksheetCreate, ReadingWorksheetOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/reading", tags=["reading"])

UPLOAD_DIR = "./uploads/worksheets"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def _family_book_filter(current_user: User):
    """SQLAlchemy filter: true for ReadingLog rows belonging to this user's
    family. ReadingLog.added_by is always the owning parent's own id (only
    require_parent-gated routes ever set it), so — unlike planner, which has
    to go via Lesson.created_by — ownership here is a single direct column."""
    if current_user.role == "child":
        return and_(
            ReadingLog.added_by == current_user.parent_id,
            or_(ReadingLog.child_id == current_user.id, ReadingLog.child_id.is_(None)),
        )
    return ReadingLog.added_by == current_user.id


@router.get("/", response_model=List[ReadingLogOut])
def list_books(
    child_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(ReadingLog).filter(_family_book_filter(current_user))
    if current_user.role == "parent" and child_id:
        child = db.query(User).filter(User.id == child_id, User.parent_id == current_user.id).first()
        if not child:
            raise HTTPException(status_code=403, detail="Not your child")
        query = query.filter(or_(ReadingLog.child_id == child_id, ReadingLog.child_id.is_(None)))
    return query.order_by(ReadingLog.created_at.desc()).all()


@router.post("/", response_model=ReadingLogOut)
def add_book(
    book_in: ReadingLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    if book_in.child_id is not None:
        child = db.query(User).filter(User.id == book_in.child_id, User.parent_id == current_user.id).first()
        if not child:
            raise HTTPException(status_code=403, detail="Not your child")
    book = ReadingLog(
        title=book_in.title,
        author=book_in.author,
        pages=book_in.pages,
        status=book_in.status,
        start_date=book_in.start_date,
        finish_date=book_in.finish_date,
        notes=book_in.notes,
        added_by=current_user.id,
        child_id=book_in.child_id,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.patch("/{book_id}", response_model=ReadingLogOut)
def update_book(
    book_id: int,
    body: ReadingLogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(ReadingLog).filter(ReadingLog.id == book_id, _family_book_filter(current_user)).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Parent can edit everything; child can only update status, rating, notes
    if current_user.role == "parent":
        if body.title is not None:
            book.title = body.title
        if body.author is not None:
            book.author = body.author
        if body.pages is not None:
            book.pages = body.pages
        if body.start_date is not None:
            book.start_date = body.start_date
        if body.finish_date is not None:
            book.finish_date = body.finish_date
        if body.finish_date_clear:
            book.finish_date = None

    if body.status is not None:
        book.status = body.status
    if body.rating is not None:
        book.rating = body.rating
    if body.notes is not None:
        book.notes = body.notes

    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=204)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    book = db.query(ReadingLog).filter(ReadingLog.id == book_id, _family_book_filter(current_user)).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()


# --- Worksheets ---

@router.get("/worksheets", response_model=List[ReadingWorksheetOut])
def list_worksheets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(ReadingWorksheet)
        .join(ReadingLog, ReadingWorksheet.book_id == ReadingLog.id)
        .filter(_family_book_filter(current_user))
        .order_by(ReadingWorksheet.book_id, ReadingWorksheet.created_at)
        .all()
    )


@router.post("/{book_id}/worksheets/upload", response_model=ReadingWorksheetOut, status_code=201)
async def upload_worksheet_file(
    book_id: int,
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    book = db.query(ReadingLog).filter(ReadingLog.id == book_id, _family_book_filter(current_user)).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed. Use PDF, Word, or image files.")
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")
    raw_name = file.filename or ""
    ext = raw_name.rsplit(".", 1)[-1].lower() if "." in raw_name else "pdf"
    if ext not in {"pdf", "doc", "docx", "jpg", "jpeg", "png", "gif", "webp"}:
        ext = "pdf"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)
    ws = ReadingWorksheet(book_id=book_id, title=title.strip(), url=f"/api/reading/files/{filename}")
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws


@router.get("/files/{filename}")
def serve_worksheet_file(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # os.path.basename strips any directory components, so a value like
    # "../../etc/passwd" collapses to just "passwd" before it's ever used
    # to build a filesystem path.
    safe_name = os.path.basename(filename)

    ws = (
        db.query(ReadingWorksheet)
        .join(ReadingLog, ReadingWorksheet.book_id == ReadingLog.id)
        .filter(
            ReadingWorksheet.url == f"/api/reading/files/{safe_name}",
            _family_book_filter(current_user),
        )
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404, detail="File not found")

    # Defense-in-depth: confirm the resolved path is still inside UPLOAD_DIR
    # before serving it, regardless of how safe_name was constructed above.
    upload_root = os.path.realpath(UPLOAD_DIR)
    filepath = os.path.realpath(os.path.join(UPLOAD_DIR, safe_name))
    if os.path.commonpath([filepath, upload_root]) != upload_root or not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(filepath)


@router.post("/{book_id}/worksheets", response_model=ReadingWorksheetOut, status_code=201)
def add_worksheet(
    book_id: int,
    body: ReadingWorksheetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    book = db.query(ReadingLog).filter(ReadingLog.id == book_id, _family_book_filter(current_user)).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    ws = ReadingWorksheet(book_id=book_id, title=body.title.strip(), url=body.url.strip())
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws


@router.delete("/worksheets/{worksheet_id}", status_code=204)
def delete_worksheet(
    worksheet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    ws = (
        db.query(ReadingWorksheet)
        .join(ReadingLog, ReadingWorksheet.book_id == ReadingLog.id)
        .filter(ReadingWorksheet.id == worksheet_id, _family_book_filter(current_user))
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404, detail="Worksheet not found")
    db.delete(ws)
    db.commit()
