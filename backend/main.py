from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect as sa_inspect
from database import engine, Base
from routers import auth, lessons, planner, units, reading, feedback, coding_progress, days_off, journal, goals, children, timetable

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
        if "parent_id" not in existing_cols:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN parent_id INTEGER REFERENCES users(id)"))
                conn.commit()
    if "reading_log" in tables:
        existing_cols = [c["name"] for c in insp.get_columns("reading_log")]
        if "child_id" not in existing_cols:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE reading_log ADD COLUMN child_id INTEGER REFERENCES users(id)"))
                conn.commit()

run_migrations()
Base.metadata.create_all(bind=engine)

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


@app.get("/health")
def health():
    return {"status": "ok"}
