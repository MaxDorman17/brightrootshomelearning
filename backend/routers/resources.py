import json
import os
import uuid
from typing import Optional
from urllib.parse import quote, urlparse

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, field_validator
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth import get_current_user, require_parent
from database import get_db
from models import LearningAidSeed, Resource, ResourceFolder, TimetableConfig, User
from routers.timetable import DEFAULT_TIMETABLE
from storage import upload_dir

router = APIRouter(prefix="/api/resources", tags=["resources"])

UPLOAD_DIR = upload_dir("resources")
MAX_FILE_SIZE = 20 * 1024 * 1024
GENERAL_FOLDER = "General"
LEARNING_AIDS_FOLDER = "Learning Aids"

# Printable charts every family gets in their Resources. Each opens at /learning-aids/<slug> on the site.
# A family can delete any of them, and it won't come back. Add new ones here and every family gets them.
LEARNING_AIDS = [
    ("hundred-square", "Hundred Square", "Find patterns, practise counting and discover number facts."),
    ("number-line-0-20", "Number Line 0 to 20", "Count forwards and backwards, add and take away."),
    ("times-tables-1-12", "Times Tables 1 to 12", "A grid of every times table up to 12 x 12."),
    ("periodic-table", "Periodic Table of Elements", "A clear reference chart for young scientists."),
]
ALLOWED_FILES = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".txt": "text/plain",
}


def _clean_folder(value: str) -> str:
    value = " ".join((value or "").replace("/", "-").split())
    if not value:
        raise HTTPException(status_code=400, detail="Choose a folder")
    return value[:100]


def _check_url(value: str) -> str:
    value = (value or "").strip()
    parsed = urlparse(value)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise HTTPException(status_code=400, detail="Enter a full web address starting with https://")
    return value[:1000]


class LinkIn(BaseModel):
    folder: str
    title: str
    url: str
    note: Optional[str] = None
    visible_to_children: bool = True

    @field_validator("title")
    @classmethod
    def valid_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Give it a title")
        return value[:255]


class ResourceUpdate(BaseModel):
    folder: str
    title: str
    note: Optional[str] = None
    visible_to_children: bool = True

    @field_validator("title")
    @classmethod
    def valid_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Give it a title")
        return value[:255]


class FolderIn(BaseModel):
    name: str


class FolderRename(BaseModel):
    old_name: str
    new_name: str


def _family_id(user: User) -> int:
    family = user.id if user.role == "parent" else user.parent_id
    if not family:
        raise HTTPException(status_code=400, detail="No parent linked to this account")
    return family


def _subject_folders(db: Session, parent_id: int) -> list[str]:
    row = db.query(TimetableConfig).filter(TimetableConfig.parent_id == parent_id).first()
    config = json.loads(row.config) if row else DEFAULT_TIMETABLE
    subjects: list[str] = []
    for day_subjects in config.values():
        for subject in day_subjects or []:
            if subject not in subjects:
                subjects.append(subject)
    return subjects


def _resource_out(r: Resource) -> dict:
    return {
        "id": r.id,
        "folder": r.folder,
        "title": r.title,
        "kind": r.kind,
        "url": r.url,
        "original_name": r.original_name,
        "content_type": r.content_type,
        "size": r.size,
        "note": r.note,
        "visible_to_children": bool(r.visible_to_children),
        "created_at": r.created_at.isoformat() if r.created_at else None,
    }


def _file_path(name: str) -> str:
    return os.path.join(UPLOAD_DIR, os.path.basename(name))


def _own_resource(db: Session, parent: User, resource_id: int) -> Resource:
    resource = db.query(Resource).filter(Resource.id == resource_id, Resource.parent_id == parent.id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Not found")
    return resource


def _add_learning_aids(db: Session, parent_id: int) -> None:
    """Give the family any learning aids they haven't had yet."""
    had = {s for (s,) in db.query(LearningAidSeed.slug).filter(LearningAidSeed.parent_id == parent_id)}
    new = [aid for aid in LEARNING_AIDS if aid[0] not in had]
    if not new:
        return
    for slug, title, note in new:
        db.add(Resource(
            parent_id=parent_id,
            folder=LEARNING_AIDS_FOLDER,
            title=title,
            kind="link",
            url=f"/learning-aids/{slug}",
            note=note,
            visible_to_children=True,
        ))
        db.add(LearningAidSeed(parent_id=parent_id, slug=slug))
    try:
        db.commit()
    except IntegrityError:
        # Two requests at once both tried to add them; the other one did.
        db.rollback()


@router.get("/")
def list_resources(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    parent_id = _family_id(current_user)
    is_child = current_user.role == "child"
    _add_learning_aids(db, parent_id)

    query = db.query(Resource).filter(Resource.parent_id == parent_id)
    if is_child:
        query = query.filter(Resource.visible_to_children.is_(True))
    items = query.order_by(Resource.folder, Resource.title).all()

    subjects = _subject_folders(db, parent_id)
    custom = [f.name for f in db.query(ResourceFolder).filter(ResourceFolder.parent_id == parent_id).order_by(ResourceFolder.name).all()]
    names: list[str] = []
    for name in [*subjects, GENERAL_FOLDER, *custom, *(r.folder for r in items)]:
        if name not in names:
            names.append(name)

    counts: dict = {}
    for r in items:
        counts[r.folder] = counts.get(r.folder, 0) + 1

    folders = [
        {"name": n, "count": counts.get(n, 0), "is_subject": n in subjects, "is_custom": n in custom}
        for n in names
    ]
    if is_child:
        # Children only see folders that have something in them.
        folders = [f for f in folders if f["count"] > 0]
    return {"folders": folders, "items": [_resource_out(r) for r in items]}


@router.post("/folders", status_code=201)
def add_folder(body: FolderIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    name = _clean_folder(body.name)
    exists = db.query(ResourceFolder).filter(ResourceFolder.parent_id == current_user.id, ResourceFolder.name == name).first()
    if not exists and name not in _subject_folders(db, current_user.id) and name != GENERAL_FOLDER:
        db.add(ResourceFolder(parent_id=current_user.id, name=name))
        db.commit()
    return {"name": name}


@router.put("/folders")
def rename_folder(body: FolderRename, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    old, new = _clean_folder(body.old_name), _clean_folder(body.new_name)
    folder = db.query(ResourceFolder).filter(ResourceFolder.parent_id == current_user.id, ResourceFolder.name == old).first()
    if not folder:
        raise HTTPException(status_code=400, detail="Only folders you added can be renamed")
    clash = db.query(ResourceFolder).filter(ResourceFolder.parent_id == current_user.id, ResourceFolder.name == new).first()
    if clash or new in _subject_folders(db, current_user.id) or new == GENERAL_FOLDER:
        raise HTTPException(status_code=400, detail="There's already a folder with that name")
    folder.name = new
    db.query(Resource).filter(Resource.parent_id == current_user.id, Resource.folder == old).update({"folder": new})
    db.commit()
    return {"name": new}


@router.delete("/folders/{name}", status_code=204)
def delete_folder(name: str, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    folder = db.query(ResourceFolder).filter(ResourceFolder.parent_id == current_user.id, ResourceFolder.name == name).first()
    if not folder:
        raise HTTPException(status_code=400, detail="Only folders you added can be removed")
    if db.query(Resource).filter(Resource.parent_id == current_user.id, Resource.folder == name).count():
        raise HTTPException(status_code=400, detail="Move or remove everything in this folder first")
    db.delete(folder)
    db.commit()


@router.post("/links", status_code=201)
def add_link(body: LinkIn, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    resource = Resource(
        parent_id=current_user.id,
        folder=_clean_folder(body.folder),
        title=body.title,
        kind="link",
        url=_check_url(body.url),
        note=(body.note or "").strip() or None,
        visible_to_children=body.visible_to_children,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return _resource_out(resource)


@router.post("/files", status_code=201)
async def upload_file(
    folder: str = Form(...),
    title: str = Form(""),
    note: str = Form(""),
    visible_to_children: bool = Form(True),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent),
):
    original = os.path.basename(file.filename or "file")
    ext = os.path.splitext(original)[1].lower()
    if ext not in ALLOWED_FILES:
        raise HTTPException(status_code=400, detail="Please upload a PDF, Word, PowerPoint, Excel, image or text file")
    data = await file.read(MAX_FILE_SIZE + 1)
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Files must be 20 MB or smaller")
    if not data:
        raise HTTPException(status_code=400, detail="That file is empty")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    stored = f"{uuid.uuid4().hex}{ext}"
    with open(_file_path(stored), "wb") as fh:
        fh.write(data)

    resource = Resource(
        parent_id=current_user.id,
        folder=_clean_folder(folder),
        title=(title.strip() or os.path.splitext(original)[0])[:255],
        kind="file",
        file_name=stored,
        original_name=original[:255],
        content_type=ALLOWED_FILES[ext],
        size=len(data),
        note=note.strip() or None,
        visible_to_children=visible_to_children,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return _resource_out(resource)


@router.put("/{resource_id}")
def update_resource(resource_id: int, body: ResourceUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    resource = _own_resource(db, current_user, resource_id)
    resource.folder = _clean_folder(body.folder)
    resource.title = body.title
    resource.note = (body.note or "").strip() or None
    resource.visible_to_children = body.visible_to_children
    db.commit()
    db.refresh(resource)
    return _resource_out(resource)


@router.delete("/{resource_id}", status_code=204)
def delete_resource(resource_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_parent)):
    resource = _own_resource(db, current_user, resource_id)
    if resource.file_name:
        try:
            os.remove(_file_path(resource.file_name))
        except OSError:
            pass
    db.delete(resource)
    db.commit()


@router.get("/{resource_id}/file")
def download_file(resource_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    parent_id = _family_id(current_user)
    query = db.query(Resource).filter(Resource.id == resource_id, Resource.parent_id == parent_id, Resource.kind == "file")
    if current_user.role == "child":
        query = query.filter(Resource.visible_to_children.is_(True))
    resource = query.first()
    if not resource or not resource.file_name or not os.path.exists(_file_path(resource.file_name)):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(
        _file_path(resource.file_name),
        media_type=resource.content_type or "application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename*=UTF-8''{quote(resource.original_name or 'file')}"},
    )
