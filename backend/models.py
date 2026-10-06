from sqlalchemy import Column, Integer, String, Text, Boolean, Date, DateTime, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)  # optional for child accounts
    # The name shown on the site. Two people can share one ("Charlotte", "Oscar"), so it isn't used to log in.
    username = Column(String(100), index=True, nullable=False)
    # What they type to log in: unique across the site. An email address for grown-ups who signed up with one,
    # otherwise a login name (older accounts log in with the name they've always used).
    login_name = Column(String(255), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_version = Column(Integer, nullable=False, default=1, server_default="1")
    email_verified_at = Column(DateTime(timezone=True), nullable=True)
    onboarding_completed_at = Column(DateTime(timezone=True), nullable=True)
    subscription_status = Column(String(20), nullable=True)
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    billing_plan = Column(String(20), nullable=True)
    stripe_customer_id = Column(String(255), nullable=True)
    stripe_subscription_id = Column(String(255), nullable=True)
    subscription_cancel_at_period_end = Column(Boolean, nullable=False, default=False, server_default="0")
    subscription_cancel_at = Column(DateTime(timezone=True), nullable=True)
    theme = Column(String(20), nullable=True)  # family colour theme, set on the parent account
    ehe_approach = Column(Text, nullable=True)  # parent's "our approach to home education" for council reports
    rewards_set_up_at = Column(DateTime(timezone=True), nullable=True)  # when example star rules/rewards were added
    avatar = Column(Text, nullable=True)  # JSON {"emoji", "bg", "frame"} from the avatar builder
    avatar_photo = Column(String(255), nullable=True)  # file name of a parent-uploaded photo
    child_theme = Column(String(20), nullable=True)  # a child's own colour theme, overriding the family one
    subject_colors = Column(Text, nullable=True)  # JSON {subject: colour name} chosen by the child
    summary_email_time = Column(String(5), nullable=True)  # "HH:MM" for the parent's daily summary email, None = off
    summary_last_sent = Column(Date, nullable=True)
    # A second grown-up on a family account has role "coparent" and points at the family's main parent here.
    # They log in with their own username and password, then act for the main parent's family.
    family_owner_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    relationship_label = Column(String(30), nullable=True)  # what a grown-up is to the children: Mum, Dad, Guardian...
    # Which activity pages a child sees: "young" (Make and Active), "teen" (the Teens menu) or "both".
    # Chosen by their grown-up. Empty means both. A choice of pages, not a date of birth.
    activity_level = Column(String(10), nullable=True)
    # Secret part of the family's private calendar feed address. Empty until they turn calendar sync on.
    calendar_token = Column(String(64), nullable=True, unique=True, index=True)
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
    scheme = Column(String(100), nullable=True)  # where the lesson comes from, e.g. "Twinkl" or "White Rose Maths"
    objectives = Column(Text, nullable=True)  # "What we'll learn"
    steps = Column(Text, nullable=True)  # JSON list of activity steps
    duration_minutes = Column(Integer, nullable=True)
    resource_ids = Column(Text, nullable=True)  # JSON list of attached Resources ids
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
    is_extra = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson", back_populates="planner_entries")
    assigned_to_user = relationship("User", back_populates="planner_entries")
    feedback = relationship("WorkFeedback", back_populates="entry", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    unit_url = Column(String(512), nullable=True)
    scheme = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    __table_args__ = (UniqueConstraint("parent_id", "subject", name="uq_unit_parent_subject"),)


class UnitQueue(Base):
    __tablename__ = "unit_queue"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    unit_url = Column(String(512), nullable=True)
    scheme = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    position = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    __table_args__ = (
        UniqueConstraint("parent_id", "subject", "position", name="uq_unit_queue_parent_subject_position"),
    )


class WorkReview(Base):
    __tablename__ = "work_reviews"

    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("planner_entries.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reviewed_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("entry_id", "parent_id", name="uq_work_review_entry_parent"),)


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
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    reason = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("parent_id", "date", name="uq_day_off_parent_date"),)


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
    # When the worksheet was ticked as done, by the child or a grown-up. Empty means not done yet.
    completed_at = Column(DateTime(timezone=True), nullable=True)


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
    total_chapters = Column(Integer, nullable=True)
    completed_chapters = Column(Integer, nullable=False, default=0)
    reading_journal = Column(Text, nullable=True)
    question_1_answer = Column(Text, nullable=True)
    question_2_answer = Column(Text, nullable=True)
    question_3_answer = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="wishlist")  # wishlist / reading / completed
    start_date = Column(Date, nullable=True)
    finish_date = Column(Date, nullable=True)
    rating = Column(Integer, nullable=True)  # 1–5
    notes = Column(Text, nullable=True)
    added_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ReadingChapterProgress(Base):
    __tablename__ = "reading_chapter_progress"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("reading_log.id", ondelete="CASCADE"), nullable=False)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    delta = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SpellingWord(Base):
    __tablename__ = "spelling_words"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_start = Column(Date, nullable=False)
    word = Column(String(200), nullable=False)
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OakQuizResult(Base):
    """Cached quiz scores scraped from an Oak National Academy results share link."""
    __tablename__ = "oak_quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(512), nullable=False, unique=True, index=True)
    starter_score = Column(Integer, nullable=True)
    starter_total = Column(Integer, nullable=True)
    exit_score = Column(Integer, nullable=True)
    exit_total = Column(Integer, nullable=True)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())


class SpellingResult(Base):
    __tablename__ = "spelling_results"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_start = Column(Date, nullable=False)
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    wrong_words = Column(Text, nullable=True)  # JSON array
    is_practice_round = Column(Boolean, default=False)
    taken_at = Column(DateTime(timezone=True), server_default=func.now())


class TestResult(Base):
    """A test result the parent records themselves (e.g. a maths paper), alongside spelling and Oak results."""
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    # Set when this is the score for a planned lesson, rather than a separate test.
    entry_id = Column(Integer, nullable=True, index=True)
    subject = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    taken_on = Column(Date, nullable=False)
    score = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True)


class RewardRule(Base):
    """A way for children to earn stars, set by the parent (e.g. 3 stars for an Oak exit quiz of 80%+)."""
    __tablename__ = "reward_rules"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    kind = Column(String(20), nullable=False)  # lesson / oak (exit quiz) / oak_starter / spelling / book / game
    threshold_pct = Column(Integer, nullable=True)  # minimum score for oak and spelling rules
    stars = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    # Stars count for work done between counts_from and ended_at. Editing, turning off or deleting a
    # rule ends it (and hides it if replaced), so stars already earned under the old settings stay put.
    counts_from = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    is_hidden = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RewardItem(Base):
    """Something a child can spend stars on, created by the parent."""
    __tablename__ = "reward_items"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(120), nullable=False)
    emoji = Column(String(16), nullable=True)
    cost = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StarAward(Base):
    """Bonus stars given (or taken away, if negative) by a parent by hand."""
    __tablename__ = "star_awards"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    stars = Column(Integer, nullable=False)
    reason = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RewardClaim(Base):
    """A child asking to spend stars on a reward; stars only come off once the parent approves."""
    __tablename__ = "reward_claims"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    reward_id = Column(Integer, ForeignKey("reward_items.id"), nullable=True)
    title = Column(String(120), nullable=False)  # copied so history survives edits and deletes
    emoji = Column(String(16), nullable=True)
    cost = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default="pending")  # pending / approved / declined / cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    decided_at = Column(DateTime(timezone=True), nullable=True)


class Challenge(Base):
    """A family challenge set by the parent, e.g. "Complete 15 lessons this week" for bonus stars."""
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(120), nullable=False)
    kind = Column(String(20), nullable=False)  # lessons / spelling / oak / books / stars / custom
    target = Column(Integer, nullable=False)
    threshold_pct = Column(Integer, nullable=True)  # minimum score for spelling and oak challenges
    mode = Column(String(10), nullable=False, default="each")  # each child on their own, or the whole family as a team
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    bonus_stars = Column(Integer, nullable=False, default=0)
    is_archived = Column(Boolean, nullable=False, default=False)  # hidden, but bonus stars already won are kept
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChallengeTick(Base):
    """One tick towards a custom challenge, marked by the parent."""
    __tablename__ = "challenge_ticks"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StudySession(Base):
    """Time a child spent studying with the study timer."""
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    entry_id = Column(Integer, ForeignKey("planner_entries.id", ondelete="SET NULL"), nullable=True)
    subject = Column(String(100), nullable=True)
    label = Column(String(255), nullable=True)
    planned_minutes = Column(Integer, nullable=False)
    minutes = Column(Integer, nullable=False)
    completed = Column(Boolean, nullable=False, default=False)  # ran to the end rather than stopped early
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ResourceFolder(Base):
    """An extra folder a parent added to their Resources, beyond one per subject."""
    __tablename__ = "resource_folders"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("parent_id", "name", name="uq_resource_folder_parent_name"),)


class Resource(Base):
    """A study material in a family's Resources: a link (e.g. Twinkl) or an uploaded file."""
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    folder = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    kind = Column(String(10), nullable=False)  # link / file
    url = Column(String(1000), nullable=True)
    file_name = Column(String(255), nullable=True)  # stored name in uploads/resources
    original_name = Column(String(255), nullable=True)
    content_type = Column(String(100), nullable=True)
    size = Column(Integer, nullable=True)
    note = Column(Text, nullable=True)
    visible_to_children = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LessonPlan(Base):
    """A reusable, ordered series of lessons, e.g. "Fractions - 2 weeks"."""
    __tablename__ = "lesson_plans"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LessonPlanItem(Base):
    __tablename__ = "lesson_plan_items"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("lesson_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    position = Column(Integer, nullable=False, default=0)


class Moment(Base):
    """A learning moment: a note and photos shared in the family feed."""
    __tablename__ = "moments"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=True)
    moment_date = Column(Date, nullable=False)
    subject = Column(String(100), nullable=True)
    child_ids = Column(Text, nullable=True)  # JSON list of the children it's about
    trip_place = Column(String(200), nullable=True)  # set when the moment is a trip or day out: where they went
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=True)


class MomentPhoto(Base):
    __tablename__ = "moment_photos"

    id = Column(Integer, primary_key=True, index=True)
    moment_id = Column(Integer, ForeignKey("moments.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    content_type = Column(String(50), nullable=False)
    position = Column(Integer, nullable=False, default=0)


class MomentReaction(Base):
    __tablename__ = "moment_reactions"

    id = Column(Integer, primary_key=True, index=True)
    moment_id = Column(Integer, ForeignKey("moments.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emoji = Column(String(8), nullable=False)
    __table_args__ = (UniqueConstraint("moment_id", "user_id", "emoji", name="uq_moment_reaction"),)


class MomentComment(Base):
    __tablename__ = "moment_comments"

    id = Column(Integer, primary_key=True, index=True)
    moment_id = Column(Integer, ForeignKey("moments.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Reminder(Base):
    """A daily reminder a parent sets, e.g. "Practise spellings" at 9:00 on weekdays."""
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    kind = Column(String(20), nullable=False)  # spellings / extra_work / custom
    text = Column(String(200), nullable=True)  # wording for custom reminders
    child_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # None means every child
    time = Column(String(5), nullable=False)  # "HH:MM", UK time
    days = Column(Text, nullable=False)  # JSON list of weekday names
    email_child = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ReminderEvent(Base):
    """Per child, per day: a custom reminder marked done, or a reminder email sent."""
    __tablename__ = "reminder_events"

    id = Column(Integer, primary_key=True, index=True)
    reminder_id = Column(Integer, ForeignKey("reminders.id", ondelete="CASCADE"), nullable=False, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day = Column(Date, nullable=False)
    kind = Column(String(10), nullable=False)  # done / emailed / pushed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("reminder_id", "child_id", "day", "kind", name="uq_reminder_event"),)


class NewsletterSubscriber(Base):
    """Someone who asked for the Bright Roots newsletter: a website visitor or a parent member."""
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    status = Column(String(20), nullable=False, default="pending")  # pending / subscribed / unsubscribed
    token = Column(String(64), nullable=False, unique=True, index=True)  # for confirm and unsubscribe links
    source = Column(String(20), nullable=False, default="visitor")  # visitor / member
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    unsubscribed_at = Column(DateTime(timezone=True), nullable=True)


class Newsletter(Base):
    """A newsletter the site owner sent."""
    __tablename__ = "newsletters"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)  # simple markdown
    status = Column(String(20), nullable=False, default="sending")  # sending / sent
    recipients = Column(Integer, nullable=False, default=0)
    sent_count = Column(Integer, nullable=False, default=0)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)


class GameScore(Base):
    """One finished round of a learning game."""
    __tablename__ = "game_scores"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    game = Column(String(30), nullable=False)
    score = Column(Integer, nullable=False)
    detail = Column(String(100), nullable=True)  # e.g. which tables or level
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PushSubscription(Base):
    """A phone, tablet or computer that has allowed Bright Roots notifications."""
    __tablename__ = "push_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    endpoint = Column(Text, nullable=False)
    endpoint_hash = Column(String(64), nullable=False, unique=True, index=True)
    p256dh = Column(String(255), nullable=False)
    auth = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AppSetting(Base):
    """Small values the app generates for itself, e.g. the notification signing keys."""
    __tablename__ = "app_settings"

    name = Column(String(50), primary_key=True)
    value = Column(Text, nullable=False)


class MakeItem(Base):
    """A recipe or craft. Starter ones (parent_id None) ship with Bright Roots; families add their own."""
    __tablename__ = "make_items"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String(10), nullable=False, index=True)  # recipe / craft / pe / outdoor / life
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    slug = Column(String(80), nullable=True, unique=True)  # starter items only, so updates can be re-seeded
    title = Column(String(150), nullable=False)
    emoji = Column(String(16), nullable=True)
    summary = Column(String(300), nullable=True)
    category = Column(String(40), nullable=True)  # e.g. Baking, Snacks / Paper, Nature
    minutes = Column(Integer, nullable=True)
    difficulty = Column(String(10), nullable=True)  # easy / medium / tricky
    age_from = Column(Integer, nullable=True)
    serves = Column(String(40), nullable=True)
    materials = Column(Text, nullable=False, default="[]")  # JSON [{"name", "qty"}]
    steps = Column(Text, nullable=False, default="[]")  # JSON [{"text", "grown_up"}]
    tips = Column(Text, nullable=True)
    # Little Roots activities (kind "little"), done by a grown-up with a 3 or 4 year old.
    talk = Column(Text, nullable=True)  # JSON ["What can you feel?", ...]: things to say or ask
    more = Column(Text, nullable=True)  # "If they're ready for more"
    easier = Column(Text, nullable=True)  # "If it's not a good day"
    story = Column(Text, nullable=True)  # JSON [opening, one line per step..., ending] for the story book
    photo = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class MakeWish(Base):
    """A child saying "I'd love to make this!"."""
    __tablename__ = "make_wishes"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("make_items.id", ondelete="CASCADE"), nullable=False, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("item_id", "child_id", name="uq_make_wish"),)


class ShoppingItem(Base):
    """One line on the family's shopping list."""
    __tablename__ = "shopping_items"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    qty = Column(String(80), nullable=True)
    sources = Column(String(300), nullable=True)  # which recipes or crafts it's for
    done = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Club(Base):
    """A club or class a child goes to outside home learning, e.g. chess or football."""
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family
    name = Column(String(150), nullable=False)          # e.g. "Kirkcaldy Chess Club"
    activity = Column(String(100), nullable=False)      # e.g. "Chess"
    emoji = Column(String(16), nullable=True)
    schedule = Column(String(150), nullable=True)       # e.g. "Tuesdays 4 to 5pm"
    place = Column(String(150), nullable=True)
    minutes = Column(Integer, nullable=True)            # usual session length
    child_ids = Column(Text, nullable=True)             # JSON list of the children who go
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ActivityLog(Base):
    """One thing a child did to keep active: a club session, a P.E. activity or an outdoor adventure."""
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    kind = Column(String(10), nullable=False)  # club / pe / outdoor
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=True, index=True)
    make_item_id = Column(Integer, nullable=True)  # the P.E. or Outdoors activity, if it came from one
    title = Column(String(200), nullable=False)
    done_on = Column(Date, nullable=False, index=True)
    minutes = Column(Integer, nullable=True)
    note = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LearningAidSeed(Base):
    """Which Bright Roots learning aids (hundred square, times tables...) a family has been given, so
    one they delete from their Resources isn't added back."""
    __tablename__ = "learning_aid_seeds"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    slug = Column(String(60), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("parent_id", "slug", name="uq_learning_aid_seed"),)


class LanguageLog(Base):
    """One day of practice in one language for one child, e.g. 15 minutes of French on Duolingo."""
    __tablename__ = "language_logs"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    language = Column(String(60), nullable=False)   # e.g. "French"
    done_on = Column(Date, nullable=False, index=True)
    minutes = Column(Integer, nullable=True)
    xp = Column(Integer, nullable=True)             # points from an app such as Duolingo
    how = Column(String(100), nullable=True)        # e.g. "Duolingo", "Lesson with Gran"
    note = Column(Text, nullable=True)              # what they practised
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    polish_session_id = Column(Integer, nullable=True, index=True)  # set on rows copied from the old Polish log
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FamilyNote(Base):
    """A short message from a grown-up, shown on a child's Today page like a note on the fridge."""
    __tablename__ = "family_notes"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    body = Column(Text, nullable=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    reaction = Column(String(16), nullable=True)  # the child's reply, e.g. a heart
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CustomBadge(Base):
    """A badge a family made themselves, e.g. "Kind Friend", with their own picture."""
    __tablename__ = "custom_badges"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family
    title = Column(String(80), nullable=False)
    description = Column(String(300), nullable=True)  # what it's for
    emoji = Column(String(16), nullable=True)         # shown when there's no picture
    image = Column(String(255), nullable=True)        # file name of the uploaded illustration
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CustomBadgeAward(Base):
    """A family badge given to one child."""
    __tablename__ = "custom_badge_awards"

    id = Column(Integer, primary_key=True, index=True)
    badge_id = Column(Integer, ForeignKey("custom_badges.id"), nullable=False, index=True)
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    awarded_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("badge_id", "child_id", name="uq_custom_badge_child"),)


class ExamEntry(Base):
    """One exam a teenager plans to sit, e.g. GCSE Maths Paper 1, usually as a private candidate."""
    __tablename__ = "exam_entries"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family
    child_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    subject = Column(String(100), nullable=False)          # e.g. "Maths"
    qualification = Column(String(30), nullable=False)     # GCSE / IGCSE / A level / Functional Skills / Other
    board = Column(String(50), nullable=True)              # e.g. AQA, Pearson Edexcel, Cambridge
    paper = Column(String(100), nullable=True)             # e.g. "Paper 1 (Non-calculator)"
    exam_date = Column(Date, nullable=True, index=True)
    exam_time = Column(String(20), nullable=True)          # e.g. "9:00am" or "Afternoon"
    centre = Column(String(150), nullable=True)            # where they sit it
    entry_deadline = Column(Date, nullable=True)
    fee = Column(String(30), nullable=True)                # free text, e.g. "£180"
    status = Column(String(15), nullable=False, default="planning")  # planning / entered / sat / result
    result = Column(String(30), nullable=True)             # e.g. "7" or "B"
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SupportMessage(Base):
    """A problem, suggestion, question or review a parent sent to the site owner."""
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)  # the family's main account
    kind = Column(String(20), nullable=False)  # problem / suggestion / question / review
    message = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)  # 1 to 5 stars, reviews only
    can_publish = Column(Boolean, nullable=False, default=False)  # the family agreed their review may be shown
    display_name = Column(String(60), nullable=True)
    page = Column(String(200), nullable=True)
    reply_email = Column(String(255), nullable=True)  # the grown-up who wrote it
    emailed = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False)


class BackupRun(Base):
    """One run of the off-site backup, so the owner can see it is working."""
    __tablename__ = "backup_runs"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String(20), nullable=False)  # nightly / manual
    claim = Column(String(40), nullable=True, unique=True)  # "nightly-2026-10-05": only one process runs it
    status = Column(String(20), nullable=False, default="running")  # running / ok / failed
    detail = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=False)
    finished_at = Column(DateTime, nullable=True)
