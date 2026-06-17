from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: str


class UserOut(BaseModel):
    id: int
    email: str
    username: str
    role: str
    parent_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class ChildCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class ChildOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    title: str
    subject: str
    description: Optional[str] = None
    lesson_url: Optional[str] = None


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    description: Optional[str] = None
    lesson_url: Optional[str] = None


class LessonOut(BaseModel):
    id: int
    title: str
    subject: str
    description: Optional[str]
    lesson_url: Optional[str]
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


class PlannerEntryCreate(BaseModel):
    lesson_id: int
    assigned_to: Optional[int] = None
    scheduled_date: date


class PlannerEntryUpdate(BaseModel):
    scheduled_date: Optional[date] = None
    assigned_to: Optional[int] = None


class PlannerEntryOut(BaseModel):
    id: int
    lesson_id: int
    assigned_to: Optional[int]
    scheduled_date: date
    is_complete: bool
    completed_at: Optional[datetime]
    completed_work_url: Optional[str]
    completed_note: Optional[str]
    lesson: LessonOut

    class Config:
        from_attributes = True


class UnitCreate(BaseModel):
    subject: str
    title: str
    unit_url: Optional[str] = None
    notes: Optional[str] = None


class UnitOut(BaseModel):
    id: int
    subject: str
    title: str
    unit_url: Optional[str]
    notes: Optional[str]
    updated_at: datetime

    class Config:
        from_attributes = True


class FeedbackCreate(BaseModel):
    entry_id: int
    message: str
    emoji: Optional[str] = None


class FeedbackOut(BaseModel):
    id: int
    entry_id: int
    message: str
    emoji: Optional[str]
    read_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class CodingProgressOut(BaseModel):
    lesson_id: str
    completed_at: datetime

    class Config:
        from_attributes = True


class DayOffCreate(BaseModel):
    date: date
    reason: Optional[str] = None


class DayOffOut(BaseModel):
    id: int
    date: date
    reason: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class JournalEntryCreate(BaseModel):
    entry_date: date
    content: str


class JournalEntryUpdate(BaseModel):
    content: str


class JournalEntryOut(BaseModel):
    id: int
    entry_date: date
    content: str
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class WeeklyGoalCreate(BaseModel):
    week_start: date
    title: str
    assigned_to: Optional[int] = None


class WeeklyGoalOut(BaseModel):
    id: int
    week_start: date
    title: str
    is_complete: bool
    completed_at: Optional[datetime]
    assigned_to: Optional[int]
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True


class ReadingWorksheetCreate(BaseModel):
    title: str
    url: str


class ReadingWorksheetOut(BaseModel):
    id: int
    book_id: int
    title: str
    url: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReadingLogCreate(BaseModel):
    title: str
    author: Optional[str] = None
    pages: Optional[int] = None
    status: str = "wishlist"
    start_date: Optional[date] = None
    finish_date: Optional[date] = None
    notes: Optional[str] = None


class ReadingLogUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    pages: Optional[int] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    finish_date: Optional[date] = None
    finish_date_clear: Optional[bool] = None
    rating: Optional[int] = None
    notes: Optional[str] = None


class ReadingLogOut(BaseModel):
    id: int
    title: str
    author: Optional[str]
    pages: Optional[int]
    status: str
    start_date: Optional[date]
    finish_date: Optional[date]
    rating: Optional[int]
    notes: Optional[str]
    added_by: int
    created_at: datetime

    class Config:
        from_attributes = True
