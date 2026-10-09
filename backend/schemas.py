import json

from pydantic import BaseModel, EmailStr, field_validator, model_validator


def _parse_avatar(raw):
    try:
        value = json.loads(raw) if raw else None
        return value if isinstance(value, dict) else None
    except ValueError:
        return None
from typing import Optional
from datetime import date, datetime


class Token(BaseModel):
    """What the page is told after a login. The login pass itself travels only in the protected cookie."""
    role: str
    username: str
    email_verified: bool = True
    onboarding_completed: bool = True
    billing_required: bool = False


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: str


class UserOut(BaseModel):
    id: int
    email: Optional[str] = None
    username: str
    role: str
    parent_id: Optional[int]
    email_verified_at: Optional[datetime] = None
    onboarding_completed_at: Optional[datetime] = None
    subscription_status: Optional[str] = None
    trial_ends_at: Optional[datetime] = None
    billing_plan: Optional[str] = None
    subscription_cancel_at_period_end: bool = False
    subscription_cancel_at: Optional[datetime] = None
    theme: Optional[str] = None
    family_theme: Optional[str] = None  # the parent's theme, shared by the whole family
    display: dict = {"text_size": "normal", "easy_font": False, "calm": False, "focus": False}  # how this person likes their screens to read
    family_schemes: list[str] = []  # the schemes the family says it uses (Twinkl, White Rose Maths...)
    parent_name: Optional[str] = None  # for child accounts: what their parent is called
    avatar: Optional[dict] = None
    has_photo: bool = False
    child_theme: Optional[str] = None
    subject_colors: Optional[dict] = None
    is_admin: bool = False
    rewards_set_up: bool = False
    is_owner: bool = True  # False for a second grown-up on someone else's family account
    login_id: Optional[int] = None  # the person logged in (differs from id for a second grown-up)
    relationship: Optional[str] = None  # Mum, Dad, Guardian...
    login_name: Optional[str] = None  # what they type to log in
    # Which activity pages to show: a child's own choice, or every choice among a parent's children.
    activity_levels: list[str] = ["both"]
    is_demo: bool = False  # the made-up family anyone can try (see demo.py)

    @field_validator("avatar", "subject_colors", mode="before")
    @classmethod
    def parse_json(cls, value):
        return _parse_avatar(value) if isinstance(value, str) or value is None else value
    created_at: datetime

    class Config:
        from_attributes = True


class ChildCreate(BaseModel):
    username: str  # the child's name, as shown on the site
    login_name: Optional[str] = None  # what they type to log in; picked for them if left out
    email: Optional[EmailStr] = None
    password: str = ""  # not needed for a Little Roots child, who never logs in
    activity_level: Optional[str] = None  # little / young / teen / both

    @field_validator("email", mode="before")
    @classmethod
    def blank_email_is_none(cls, value):
        if isinstance(value, str) and not value.strip():
            return None
        return value


class ChildOut(BaseModel):
    id: int
    username: str
    login_name: Optional[str] = None
    activity_level: Optional[str] = None
    email: Optional[str] = None
    role: str
    created_at: datetime
    avatar: Optional[dict] = None
    has_photo: bool = False

    @model_validator(mode="before")
    @classmethod
    def from_user(cls, data):
        if hasattr(data, "avatar_photo"):
            return {
                "id": data.id,
                "username": data.username,
                "login_name": data.login_name,
                "activity_level": data.activity_level,
                "email": data.email,
                "role": data.role,
                "created_at": data.created_at,
                "avatar": _parse_avatar(data.avatar),
                "has_photo": bool(data.avatar_photo),
            }
        return data

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    title: str
    subject: str
    description: Optional[str] = None
    lesson_url: Optional[str] = None
    scheme: Optional[str] = None
    objectives: Optional[str] = None
    steps: Optional[list[str]] = None
    duration_minutes: Optional[int] = None
    resource_ids: Optional[list[int]] = None


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    description: Optional[str] = None
    lesson_url: Optional[str] = None
    scheme: Optional[str] = None
    objectives: Optional[str] = None
    steps: Optional[list[str]] = None
    duration_minutes: Optional[int] = None
    resource_ids: Optional[list[int]] = None


def _json_list(value):
    if value is None or isinstance(value, list):
        return value or []
    try:
        parsed = json.loads(value)
        return parsed if isinstance(parsed, list) else []
    except ValueError:
        return []


class LessonOut(BaseModel):
    id: int
    title: str
    subject: str
    description: Optional[str]
    lesson_url: Optional[str]
    scheme: Optional[str] = None
    objectives: Optional[str] = None
    steps: list[str] = []
    duration_minutes: Optional[int] = None
    resource_ids: list[int] = []
    created_by: int
    created_at: datetime

    @field_validator("steps", "resource_ids", mode="before")
    @classmethod
    def parse_lists(cls, value):
        return _json_list(value)

    class Config:
        from_attributes = True


class PlannerEntryCreate(BaseModel):
    lesson_id: int
    assigned_to: Optional[int] = None
    scheduled_date: date
    is_extra: bool = False


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
    is_extra: bool
    added_by_child: bool = False
    lesson: LessonOut

    class Config:
        from_attributes = True


class UnitCreate(BaseModel):
    subject: str
    title: str
    unit_url: Optional[str] = None
    scheme: Optional[str] = None
    notes: Optional[str] = None


class UnitOut(BaseModel):
    id: int
    subject: str
    title: str
    unit_url: Optional[str]
    scheme: Optional[str] = None
    notes: Optional[str]
    updated_at: datetime

    class Config:
        from_attributes = True


class UnitQueueCreate(BaseModel):
    subject: str
    title: str
    unit_url: Optional[str] = None
    scheme: Optional[str] = None
    notes: Optional[str] = None


class UnitQueueUpdate(BaseModel):
    title: Optional[str] = None
    unit_url: Optional[str] = None
    scheme: Optional[str] = None
    notes: Optional[str] = None


class UnitQueueOut(BaseModel):
    id: int
    subject: str
    title: str
    unit_url: Optional[str]
    scheme: Optional[str] = None
    notes: Optional[str]
    position: int
    created_at: datetime
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


class TimetableConfigSave(BaseModel):
    config: dict


class TimetableConfigOut(BaseModel):
    config: dict
    updated_at: Optional[datetime] = None
    # False when a child was asked for and they simply follow the family timetable.
    own: bool = True


class ReadingWorksheetCreate(BaseModel):
    title: str
    url: str


class ReadingWorksheetOut(BaseModel):
    id: int
    book_id: int
    title: str
    url: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReadingWorksheetDone(BaseModel):
    done: bool


class ReadingLogCreate(BaseModel):
    title: str
    author: Optional[str] = None
    pages: Optional[int] = None
    total_chapters: Optional[int] = None
    completed_chapters: Optional[int] = 0
    reading_journal: Optional[str] = None
    question_1_answer: Optional[str] = None
    question_2_answer: Optional[str] = None
    question_3_answer: Optional[str] = None
    status: str = "wishlist"
    start_date: Optional[date] = None
    finish_date: Optional[date] = None
    notes: Optional[str] = None
    child_id: Optional[int] = None


class ReadingLogUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    pages: Optional[int] = None
    total_chapters: Optional[int] = None
    completed_chapters: Optional[int] = None
    reading_journal: Optional[str] = None
    question_1_answer: Optional[str] = None
    question_2_answer: Optional[str] = None
    question_3_answer: Optional[str] = None
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
    total_chapters: Optional[int]
    completed_chapters: int
    reading_journal: Optional[str]
    question_1_answer: Optional[str]
    question_2_answer: Optional[str]
    question_3_answer: Optional[str]
    status: str
    start_date: Optional[date]
    finish_date: Optional[date]
    rating: Optional[int]
    notes: Optional[str]
    added_by: int
    child_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
