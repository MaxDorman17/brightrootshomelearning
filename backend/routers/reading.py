from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import ReadingLog, ReadingWorksheet, User
from schemas import ReadingLogCreate, ReadingLogUpdate, ReadingLogOut, ReadingWorksheetCreate, ReadingWorksheetOut
from auth import get_current_user, require_parent

router = APIRouter(prefix="/api/reading", tags=["reading"])


@router.get("/", response_model=List[ReadingLogOut])
def list_books(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(ReadingLog).order_by(ReadingLog.created_at.desc()).all()


@router.post("/", response_model=ReadingLogOut)
def add_book(
    book_in: ReadingLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    book = ReadingLog(
        title=book_in.title,
        author=book_in.author,
        pages=book_in.pages,
        status=book_in.status,
        start_date=book_in.start_date,
        finish_date=book_in.finish_date,
        notes=book_in.notes,
        added_by=current_user.id,
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
    book = db.query(ReadingLog).filter(ReadingLog.id == book_id).first()
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
    book = db.query(ReadingLog).filter(ReadingLog.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()


# --- Worksheets ---

@router.get("/worksheets", response_model=List[ReadingWorksheetOut])
def list_all_worksheets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(ReadingWorksheet).order_by(ReadingWorksheet.book_id, ReadingWorksheet.created_at).all()


@router.post("/{book_id}/worksheets", response_model=ReadingWorksheetOut, status_code=201)
def add_worksheet(
    book_id: int,
    body: ReadingWorksheetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    book = db.query(ReadingLog).filter(ReadingLog.id == book_id).first()
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
    ws = db.query(ReadingWorksheet).filter(ReadingWorksheet.id == worksheet_id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Worksheet not found")
    db.delete(ws)
    db.commit()
