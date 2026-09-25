from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect as sa_inspect
from database import engine, Base
from routers import auth, lessons, planner, units, reading, feedback, coding_progress, days_off, journal, goals, children, timetable, polish, oak, spellings, oak_week_scores

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

app = FastAPI(title="Homeschool API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://brightrootshomelearning.co.uk",
        "https://www.brightrootshomelearning.co.uk",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
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


@app.get("/health")
def health():
    return {"status": "ok"}
