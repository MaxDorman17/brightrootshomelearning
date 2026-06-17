from sqlalchemy import Column, Integer, String, Text, Boolean, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lessons = relationship("Lesson", back_populates="creator")
    planner_entries = relationship("PlannerEntry", back_populates="assigned_to_user", foreign_keys="PlannerEntry.assigned_to")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    lesson_url = Column(String(512), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    creator = relationship("User", back_populates="lessons")
    planner_entries = relationship("PlannerEntry", back_populates="lesson")


class PlannerEntry(Base):
    __tablename__ = "planner_entries"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    scheduled_date = Column(Date, nullable=False)
    is_complete = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    completed_work_url = Column(String(512), nullable=True)
    completed_note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson", back_populates="planner_entries")
    assigned_to_user = relationship("User", back_populates="planner_entries")
    feedback = relationship("WorkFeedback", back_populates="entry", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False, unique=True)
    title = Column(String(255), nullable=False)
    unit_url = Column(String(512), nullable=True)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class WorkFeedback(Base):
    __tablename__ = "work_feedback"

    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("planner_entries.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    emoji = Column(String(10), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    entry = relationship("PlannerEntry", back_populates="feedback")


class CodingProgress(Base):
    __tablename__ = "coding_progress"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(String(20), nullable=False, unique=True)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())


class UserCodingProgress(Base):
    __tablename__ = "user_coding_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(String(20), nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson_progress"),)


class DayOff(Base):
    __tablename__ = "days_off"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, unique=True)
    reason = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    entry_date = Column(Date, nullable=False)
    content = Column(Text, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class WeeklyGoal(Base):
    __tablename__ = "weekly_goals"

    id = Column(Integer, primary_key=True, index=True)
    week_start = Column(Date, nullable=False)
    title = Column(String(255), nullable=False)
    is_complete = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ReadingWorksheet(Base):
    __tablename__ = "reading_worksheets"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("reading_log.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    url = Column(String(512), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PlannerCompletion(Base):
    """Per-user completion record for planner entries assigned to all children (assigned_to=NULL)."""
    __tablename__ = "planner_completions"

    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("planner_entries.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_work_url = Column(String(512), nullable=True)
    completed_note = Column(Text, nullable=True)
    __table_args__ = (UniqueConstraint("entry_id", "user_id", name="uq_entry_user_completion"),)


class TimetableConfig(Base):
    __tablename__ = "timetable_config"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    config = Column(Text, nullable=False)  # JSON string
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class PolishSession(Base):
    __tablename__ = "polish_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    xp = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("user_id", "date", name="uq_polish_user_date"),)


class ReadingLog(Base):
    __tablename__ = "reading_log"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=True)
    pages = Column(Integer, nullable=True)
    status = Column(String(50), nullable=False, default="wishlist")  # wishlist / reading / completed
    start_date = Column(Date, nullable=True)
    finish_date = Column(Date, nullable=True)
    rating = Column(Integer, nullable=True)  # 1–5
    notes = Column(Text, nullable=True)
    added_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SpellingWord(Base):
    __tablename__ = "spelling_words"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_start = Column(Date, nullable=False)
    word = Column(String(200), nullable=False)
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SpellingResult(Base):
    __tablename__ = "spelling_results"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_start = Column(Date, nullable=False)
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    wrong_words = Column(Text, nullable=True)  # JSON array
    taken_at = Column(DateTime(timezone=True), server_default=func.now())
