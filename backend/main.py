import os
import sqlite3
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect as sa_inspect
from sqlalchemy.schema import CreateTable
from config import settings
from database import engine, Base
from models import User
from storage import move_legacy_uploads
from routers import auth, billing, lessons, planner, units, reading, feedback, coding_progress, days_off, journal, goals, children, timetable, polish, oak, spellings, oak_week_scores, test_results, council_report, rewards, challenges, study, profile, resources, lesson_plans, moments, reminders, newsletter, games, account, push, make, notifications, activities, languages, notes, family, badges

# Auto-migrate: add new columns to existing tables without wiping data
def run_migrations():
    insp = sa_inspect(engine)
    tables = insp.get_table_names()
    if "planner_entries" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("planner_entries")]
        if "completed_note" not in existing_cols:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE planner_entries ADD COLUMN completed_note TEXT"))
                conn.commit()
    if "users" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("users")]
        with engine.connect() as conn:
            if "parent_id" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN parent_id INTEGER REFERENCES users(id)"))
            if "session_version" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 1"))
            if "email_verified_at" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN email_verified_at DATETIME"))
                conn.execute(text("UPDATE users SET email_verified_at = CURRENT_TIMESTAMP WHERE role = 'parent'"))
            if "onboarding_completed_at" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN onboarding_completed_at DATETIME"))
                conn.execute(text("UPDATE users SET onboarding_completed_at = CURRENT_TIMESTAMP WHERE role = 'parent'"))
            if "subscription_status" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN subscription_status VARCHAR(20)"))
                conn.execute(text("UPDATE users SET subscription_status = 'grandfathered' WHERE role = 'parent'"))
            if "trial_ends_at" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN trial_ends_at DATETIME"))
            if "billing_plan" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN billing_plan VARCHAR(20)"))
            if "stripe_customer_id" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255)"))
            if "stripe_subscription_id" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR(255)"))
            if "subscription_cancel_at_period_end" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN subscription_cancel_at_period_end BOOLEAN NOT NULL DEFAULT 0"))
            if "subscription_cancel_at" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN subscription_cancel_at DATETIME"))
            if "theme" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN theme VARCHAR(20)"))
            if "ehe_approach" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN ehe_approach TEXT"))
            if "rewards_set_up_at" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN rewards_set_up_at DATETIME"))
            if "avatar" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN avatar TEXT"))
            if "avatar_photo" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN avatar_photo VARCHAR(255)"))
            if "child_theme" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN child_theme VARCHAR(20)"))
            if "subject_colors" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN subject_colors TEXT"))
            if "summary_email_time" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN summary_email_time VARCHAR(5)"))
            if "summary_last_sent" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN summary_last_sent DATE"))
            if "family_owner_id" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN family_owner_id INTEGER REFERENCES users(id)"))
            if "relationship_label" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN relationship_label VARCHAR(30)"))
            if "login_name" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN login_name VARCHAR(255)"))
            if "activity_level" not in existing_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN activity_level VARCHAR(10)"))
            conn.commit()
    if "lessons" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("lessons")]
        lesson_columns = {
            "objectives": "ALTER TABLE lessons ADD COLUMN objectives TEXT",
            "steps": "ALTER TABLE lessons ADD COLUMN steps TEXT",
            "duration_minutes": "ALTER TABLE lessons ADD COLUMN duration_minutes INTEGER",
            "resource_ids": "ALTER TABLE lessons ADD COLUMN resource_ids TEXT",
        }
        with engine.connect() as conn:
            for column_name, statement in lesson_columns.items():
                if column_name not in existing_cols:
                    conn.execute(text(statement))
            conn.commit()
    if "reading_log" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("reading_log")]
        reading_columns = {
            "child_id": "ALTER TABLE reading_log ADD COLUMN child_id INTEGER REFERENCES users(id)",
            "total_chapters": "ALTER TABLE reading_log ADD COLUMN total_chapters INTEGER",
            "completed_chapters": "ALTER TABLE reading_log ADD COLUMN completed_chapters INTEGER NOT NULL DEFAULT 0",
            "reading_journal": "ALTER TABLE reading_log ADD COLUMN reading_journal TEXT",
            "question_1_answer": "ALTER TABLE reading_log ADD COLUMN question_1_answer TEXT",
            "question_2_answer": "ALTER TABLE reading_log ADD COLUMN question_2_answer TEXT",
            "question_3_answer": "ALTER TABLE reading_log ADD COLUMN question_3_answer TEXT",
        }
        with engine.connect() as conn:
            for column_name, statement in reading_columns.items():
                if column_name not in existing_cols:
                    conn.execute(text(statement))
            conn.commit()
    if "planner_entries" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("planner_entries")]
        if "is_extra" not in existing_cols:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE planner_entries ADD COLUMN is_extra BOOLEAN DEFAULT 0"))
                conn.commit()
    if "spelling_results" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("spelling_results")]
        if "is_practice_round" not in existing_cols:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE spelling_results ADD COLUMN is_practice_round BOOLEAN DEFAULT 0"))
                conn.commit()

    if "days_off" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("days_off")]
        if "parent_id" not in existing_cols:
            if engine.dialect.name != "sqlite":
                raise RuntimeError("days_off parent migration currently requires SQLite")

            with engine.begin() as conn:
                parent_count = conn.execute(
                    text("SELECT COUNT(*) FROM users WHERE role = 'parent'")
                ).scalar()

                if not parent_count:
                    raise RuntimeError("Cannot migrate days_off without at least one parent account")

                conn.execute(text("""
                    CREATE TABLE days_off_new (
                        id INTEGER PRIMARY KEY,
                        parent_id INTEGER NOT NULL REFERENCES users(id),
                        date DATE NOT NULL,
                        reason VARCHAR(100),
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT uq_day_off_parent_date UNIQUE (parent_id, date)
                    )
                """))

                conn.execute(text("""
                    INSERT INTO days_off_new (parent_id, date, reason, created_at)
                    SELECT users.id, days_off.date, days_off.reason, days_off.created_at
                    FROM days_off
                    CROSS JOIN users
                    WHERE users.role = 'parent'
                """))

                conn.execute(text("DROP TABLE days_off"))
                conn.execute(text("ALTER TABLE days_off_new RENAME TO days_off"))

    if "units" in tables:
        unit_cols = [c["name"] for c in insp.get_columns("units")]
        if "parent_id" not in unit_cols:
            if engine.dialect.name != "sqlite":
                raise RuntimeError("units parent migration currently requires SQLite")

            with engine.begin() as conn:
                parent_count = conn.execute(
                    text("SELECT COUNT(*) FROM users WHERE role = 'parent'")
                ).scalar()
                if not parent_count:
                    raise RuntimeError("Cannot migrate units without at least one parent account")

                conn.execute(text("""
                    CREATE TABLE units_new (
                        id INTEGER PRIMARY KEY,
                        parent_id INTEGER NOT NULL REFERENCES users(id),
                        subject VARCHAR(100) NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        unit_url VARCHAR(512),
                        notes TEXT,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT uq_unit_parent_subject UNIQUE (parent_id, subject)
                    )
                """))

                conn.execute(text("""
                    INSERT INTO units_new (parent_id, subject, title, unit_url, notes, updated_at)
                    SELECT users.id, units.subject, units.title, units.unit_url, units.notes, units.updated_at
                    FROM units
                    CROSS JOIN users
                    WHERE users.role = 'parent'
                """))

                conn.execute(text("DROP TABLE units"))
                conn.execute(text("ALTER TABLE units_new RENAME TO units"))

    if "unit_queue" in tables:
        queue_cols = [c["name"] for c in insp.get_columns("unit_queue")]
        if "parent_id" not in queue_cols:
            if engine.dialect.name != "sqlite":
                raise RuntimeError("unit_queue parent migration currently requires SQLite")

            with engine.begin() as conn:
                parent_count = conn.execute(
                    text("SELECT COUNT(*) FROM users WHERE role = 'parent'")
                ).scalar()
                if not parent_count:
                    raise RuntimeError("Cannot migrate unit queue without at least one parent account")

                conn.execute(text("""
                    CREATE TABLE unit_queue_new (
                        id INTEGER PRIMARY KEY,
                        parent_id INTEGER NOT NULL REFERENCES users(id),
                        subject VARCHAR(100) NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        unit_url VARCHAR(512),
                        notes TEXT,
                        position INTEGER NOT NULL DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT uq_unit_queue_parent_subject_position UNIQUE (parent_id, subject, position)
                    )
                """))

                conn.execute(text("""
                    INSERT INTO unit_queue_new (
                        parent_id, subject, title, unit_url, notes, position, created_at, updated_at
                    )
                    SELECT users.id, unit_queue.subject, unit_queue.title, unit_queue.unit_url,
                           unit_queue.notes, unit_queue.position, unit_queue.created_at, unit_queue.updated_at
                    FROM unit_queue
                    CROSS JOIN users
                    WHERE users.role = 'parent'
                """))

                conn.execute(text("DROP TABLE unit_queue"))
                conn.execute(text("ALTER TABLE unit_queue_new RENAME TO unit_queue"))

run_migrations()
Base.metadata.create_all(bind=engine)
move_legacy_uploads()


def _seed_make_starters():
    from database import SessionLocal
    from make_starters import seed_starters

    db = SessionLocal()
    try:
        seed_starters(db)
    except Exception:
        db.rollback()  # another worker seeded at the same moment; it'll be right next start
    finally:
        db.close()


_seed_make_starters()


def backup_sqlite_database(label: str) -> None:
    """Copy the SQLite database file next to itself before a risky migration."""
    db_path = engine.url.database
    if not db_path or db_path == ":memory:" or not os.path.exists(db_path):
        return
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_path = f"{db_path}.backup-{label}-{stamp}"
    source = sqlite3.connect(db_path)
    try:
        target = sqlite3.connect(backup_path)
        try:
            source.backup(target)
        finally:
            target.close()
    finally:
        source.close()


def make_user_email_optional():
    """One-time: allow users.email to be empty so child accounts don't need an email."""
    insp = sa_inspect(engine)
    if "users" not in insp.get_table_names():
        return
    email_col = next((c for c in insp.get_columns("users") if c["name"] == "email"), None)
    if email_col is None or email_col["nullable"]:
        return

    if engine.dialect.name != "sqlite":
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ALTER COLUMN email DROP NOT NULL"))
        return

    # SQLite can't drop NOT NULL in place, so rebuild the table from the model.
    backup_sqlite_database("users-email-optional")
    users_table = User.__table__
    old_cols = {c["name"] for c in insp.get_columns("users")}
    copy_cols = ", ".join(c.name for c in users_table.columns if c.name in old_cols)
    create_sql = str(CreateTable(users_table).compile(engine)).replace(
        "CREATE TABLE users", "CREATE TABLE users_new", 1
    )

    with engine.begin() as conn:
        conn.execute(text(create_sql))
        conn.execute(text(f"INSERT INTO users_new ({copy_cols}) SELECT {copy_cols} FROM users"))
        conn.execute(text("DROP TABLE users"))
        conn.execute(text("ALTER TABLE users_new RENAME TO users"))
        for index in users_table.indexes:
            index.create(conn)


make_user_email_optional()


def migrate_coding_progress():
    """One-time: copy old shared coding_progress rows to user_coding_progress for all children."""
    insp = sa_inspect(engine)
    tables = insp.get_table_names()
    if "coding_progress" not in tables or "user_coding_progress" not in tables:
        return
    with engine.connect() as conn:
        old_rows = conn.execute(text("SELECT lesson_id FROM coding_progress")).fetchall()
        if not old_rows:
            return
        child_ids = [r[0] for r in conn.execute(text("SELECT id FROM users WHERE role = 'child'")).fetchall()]
        for lesson_row in old_rows:
            for child_id in child_ids:
                conn.execute(
                    text("INSERT OR IGNORE INTO user_coding_progress (user_id, lesson_id) VALUES (:uid, :lid)"),
                    {"uid": child_id, "lid": lesson_row[0]},
                )
        conn.commit()


migrate_coding_progress()


# The exact, closed list of `subject` values the Extra Work creation form has ever
# written (see CATEGORIES in frontend/src/app/parent/extra-work/page.tsx). Used only
# to identify pre-existing Extra Work rows now that is_extra exists — deliberately an
# allow-list, not "anything not in the normal timetable", so an unrelated/unknown
# subject can never be mis-flagged as extra work.
HISTORICAL_EXTRA_WORK_SUBJECTS = ["Reading", "Project", "Research", "Practice", "Creative Writing", "Other"]


def backfill_extra_work_flag():
    """One-time, idempotent: flag pre-existing planner entries created through the
    Extra Work form as is_extra=1, based on their Lesson.subject. Only ever sets
    is_extra to 1 (never back to 0) and only ever touches the is_extra column —
    safe to run on every startup."""
    insp = sa_inspect(engine)
    tables = insp.get_table_names()
    if "planner_entries" not in tables or "lessons" not in tables:
        return
    existing_cols = [c["name"] for c in insp.get_columns("planner_entries")]
    if "is_extra" not in existing_cols:
        return
    params = {f"subj{i}": s for i, s in enumerate(HISTORICAL_EXTRA_WORK_SUBJECTS)}
    placeholders = ", ".join(f":{k}" for k in params)
    with engine.connect() as conn:
        conn.execute(
            text(f"""
                UPDATE planner_entries
                SET is_extra = 1
                WHERE (is_extra = 0 OR is_extra IS NULL)
                  AND lesson_id IN (
                      SELECT id FROM lessons WHERE subject IN ({placeholders})
                  )
            """),
            params,
        )
        conn.commit()


backfill_extra_work_flag()


def copy_polish_sessions_to_languages():
    """Idempotent: copy practice from the old Polish-only log into the Languages diary.

    Each copied row remembers its polish_session id, so nothing is copied twice. A session logged by a child
    belongs to that child. One logged by a parent goes to their child when they have exactly one; with more
    than one child there's no way to tell whose it was, so it's left in the old table.
    """
    insp = sa_inspect(engine)
    tables = insp.get_table_names()
    if "polish_sessions" not in tables or "language_logs" not in tables:
        return
    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT p.id, p.user_id, p.date, p.xp, p.notes, u.role, u.parent_id
            FROM polish_sessions p JOIN users u ON u.id = p.user_id
            WHERE p.id NOT IN (SELECT polish_session_id FROM language_logs WHERE polish_session_id IS NOT NULL)
        """)).fetchall()
        to_copy = []
        for pid, user_id, day, xp, notes, role, parent_id in rows:
            if role == "child":
                family, child = parent_id, user_id
            else:
                kids = conn.execute(text("SELECT id FROM users WHERE parent_id = :p AND role = 'child'"), {"p": user_id}).fetchall()
                if len(kids) != 1:
                    continue
                family, child = user_id, kids[0][0]
            if family:
                to_copy.append({"family": family, "child": child, "day": day, "xp": xp, "note": notes, "user": user_id, "pid": pid})
        if not to_copy:
            return
        backup_sqlite_database("languages")
        for row in to_copy:
            conn.execute(
                text("""
                    INSERT INTO language_logs (parent_id, child_id, language, done_on, xp, how, note, created_by, polish_session_id)
                    VALUES (:family, :child, 'Polish', :day, :xp, 'Duolingo', :note, :user, :pid)
                """),
                row,
            )
        conn.commit()


copy_polish_sessions_to_languages()


def split_names_from_logins():
    """Idempotent: let two people share a name by moving "what you type to log in" into users.login_name.

    Everyone keeps logging in exactly as before, because their login name starts out as their old username.
    The username column then stops being unique (it's just the name shown on the site).
    """
    if "users" not in sa_inspect(engine).get_table_names():
        return
    with engine.connect() as conn:
        missing = conn.execute(text("SELECT COUNT(*) FROM users WHERE login_name IS NULL")).scalar()
        indexes = {i["name"]: i for i in sa_inspect(engine).get_indexes("users")}
        username_unique = [n for n, i in indexes.items() if i.get("unique") and i["column_names"] == ["username"]]
        if not missing and not username_unique and "ix_users_login_name" in indexes:
            return
        backup_sqlite_database("login-names")
        if missing:
            conn.execute(text("UPDATE users SET login_name = username WHERE login_name IS NULL"))
        if "ix_users_login_name" not in indexes:
            conn.execute(text("CREATE UNIQUE INDEX ix_users_login_name ON users (login_name)"))
        for name in username_unique:
            if name.startswith("sqlite_autoindex"):
                continue  # built into the table itself; names stay unique there until the table is rebuilt
            conn.execute(text(f'DROP INDEX "{name}"'))
        if username_unique or "ix_users_username" not in indexes:
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_users_username ON users (username)"))
        conn.commit()


split_names_from_logins()

# The interactive API docs are handy when running locally, but on the live site they'd list every server address publicly.
_local = settings.FRONTEND_URL.startswith("http://localhost")
app = FastAPI(
    title="Homeschool API",
    version="1.0.0",
    docs_url="/docs" if _local else None,
    redoc_url="/redoc" if _local else None,
    openapi_url="/openapi.json" if _local else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        settings.FRONTEND_URL.rstrip("/"),
        "https://brightrootshomelearning.co.uk",
        "https://www.brightrootshomelearning.co.uk",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(billing.router)
app.include_router(lessons.router)
app.include_router(planner.router)
app.include_router(units.router)
app.include_router(reading.router)
app.include_router(feedback.router)
app.include_router(coding_progress.router)
app.include_router(days_off.router)
app.include_router(journal.router)
app.include_router(goals.router)
app.include_router(children.router)
app.include_router(timetable.router)
app.include_router(polish.router)
app.include_router(oak.router)
app.include_router(spellings.router)
app.include_router(oak_week_scores.router)
app.include_router(test_results.router)
app.include_router(council_report.router)
app.include_router(rewards.router)
app.include_router(challenges.router)
app.include_router(study.router)
app.include_router(profile.router)
app.include_router(resources.router)
app.include_router(lesson_plans.router)
app.include_router(moments.router)
app.include_router(reminders.router)
app.include_router(newsletter.router)
app.include_router(games.router)
app.include_router(account.router)
app.include_router(push.router)
app.include_router(make.router)
app.include_router(notifications.router)
app.include_router(activities.router)
app.include_router(languages.router)
app.include_router(notes.router)
app.include_router(family.router)
app.include_router(badges.router)


@app.on_event("startup")
def start_reminder_emails():
    reminders.start_email_scheduler()


@app.get("/health")
def health():
    return {"status": "ok"}
