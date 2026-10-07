"""The Oak lesson finder: subjects, units and lessons from Oak's lists, and adding them to the planner.
Oak itself is never called: each test supplies what Oak would send."""
from datetime import date

import httpx
import pytest

import routers.oak_finder as finder
from database import SessionLocal
from models import OakLesson

OAK = {
    "/subjects": ["maths", "science"],
    "/subjects/maths": {
        "subjectTitle": "Maths",
        "sequenceSlugs": [{"sequenceSlug": "maths-primary", "years": [1, 2]}, {"sequenceSlug": "maths-secondary", "years": [7, 10]}],
    },
    "/subjects/science": {
        "subjectTitle": "Science",
        "sequenceSlugs": [{"sequenceSlug": "science-secondary-aqa", "years": [10]}, {"sequenceSlug": "science-secondary-ocr", "years": [10]}],
    },
    "/sequences/maths-primary/units?year=1": [
        {"year": 1, "units": [{"unitTitle": "Counting to 10", "unitOrder": 1, "unitSlug": "counting-to-10"}, {"unitTitle": "Shapes", "unitSlug": "shapes"}]}
    ],
    # Older years come nested by tier, and a unit can come in several versions.
    "/sequences/maths-secondary/units?year=10": [
        {"year": 10, "tiers": [
            {"tierTitle": "foundation", "tierSlug": "foundation", "units": [{"unitTitle": "Algebra", "unitSlug": "algebra-f"}]},
            {"tierTitle": "higher", "tierSlug": "higher", "units": [{"unitTitle": "Surds", "unitOptions": [{"unitTitle": "Surds A", "unitSlug": "surds-a"}, {"unitTitle": "Surds B", "unitSlug": "surds-b"}]}]},
        ]}
    ],
    "/units/counting-to-10/summary": {
        "unitTitle": "Counting to 10", "description": "Counting forwards and back.", "year": 1,
        "unitLessons": [
            {"lessonSlug": "count-back", "lessonTitle": "Count back", "lessonOrder": 2, "state": "published"},
            {"lessonSlug": "count-on", "lessonTitle": "Count on", "lessonOrder": 1, "state": "published"},
            {"lessonSlug": "coming-soon", "lessonTitle": "Not ready", "lessonOrder": 3, "state": "new"},
        ],
    },
}


def _forget():
    with SessionLocal() as db:
        db.query(OakLesson).delete()
        db.commit()


@pytest.fixture
def oak(monkeypatch):
    """Stands in for Oak's lists. oak["down"] = True makes every call fail, as if Oak can't be reached."""
    state = {"calls": [], "down": False}

    def get(client, path):
        state["calls"].append(path)
        if state["down"] or path not in OAK:
            raise httpx.HTTPError(f"{path} unavailable")
        return OAK[path]

    monkeypatch.setattr(finder, "_get", get)
    monkeypatch.setattr(finder.settings, "OAK_API_KEY", "test-key")
    _forget()
    yield state
    _forget()


def test_subjects_years_and_courses(family, oak):
    subjects = family.parent.get("/api/oak-finder/subjects").json()
    assert [(s["slug"], s["title"], s["years"]) for s in subjects] == [("maths", "Maths", [1, 2, 7, 10]), ("science", "Science", [10])]
    assert [(c["slug"], c["label"]) for c in subjects[1]["courses"]] == [("science-secondary-aqa", "AQA"), ("science-secondary-ocr", "OCR")]
    assert [c["label"] for c in subjects[0]["courses"]] == ["", ""]
    # Asked for again, it comes from our kept copy, even if Oak has gone away.
    calls = len(oak["calls"])
    oak["down"] = True
    assert len(family.parent.get("/api/oak-finder/subjects").json()) == 2
    assert len(oak["calls"]) == calls


def test_units_in_order_and_by_tier(family, oak):
    year1 = family.parent.get("/api/oak-finder/units", params={"course": "maths-primary", "year": 1}).json()
    assert year1 == {"groups": [{"label": "", "units": [{"slug": "counting-to-10", "title": "Counting to 10"}, {"slug": "shapes", "title": "Shapes"}]}]}
    year10 = family.parent.get("/api/oak-finder/units", params={"course": "maths-secondary", "year": 10}).json()["groups"]
    assert [(g["label"], [u["slug"] for u in g["units"]]) for g in year10] == [("Foundation", ["algebra-f"]), ("Higher", ["surds-a", "surds-b"])]
    assert family.parent.get("/api/oak-finder/units", params={"course": "../etc", "year": 1}).status_code == 400
    assert family.parent.get("/api/oak-finder/units", params={"course": "maths-primary", "year": 12}).status_code == 422


def test_a_unit_lists_its_published_lessons_in_order(family, oak):
    unit = family.parent.get("/api/oak-finder/unit/counting-to-10").json()
    assert (unit["title"], unit["description"]) == ("Counting to 10", "Counting forwards and back.")
    assert [l["slug"] for l in unit["lessons"]] == ["count-on", "count-back"]


def test_oak_being_unreachable_is_said_plainly(family, oak):
    oak["down"] = True
    r = family.parent.get("/api/oak-finder/subjects")
    assert r.status_code == 502 and "couldn't reach Oak" in r.json()["detail"]


def test_adding_a_unit_to_the_planner(family, oak):
    child = family.add_child()
    kid = family.child_client(child)
    lessons = [{"slug": "count-on", "title": "Count on"}, {"slug": "count-back", "title": "Count back"}]
    friday = date(2026, 10, 9)
    made = family.parent.post("/api/oak-finder/plan", json={
        "lessons": lessons, "subject": "Maths", "unit_title": "Counting to 10", "scheduled_date": friday.isoformat(), "child_ids": [child["id"]],
    })
    assert made.status_code == 201, made.text
    assert made.json() == {"planned": 2, "first_day": "2026-10-09", "last_day": "2026-10-12"}

    # One for today shows in the child's list as an Oak lesson that opens here.
    family.parent.post("/api/oak-finder/plan", json={"lessons": lessons[:1], "subject": "Maths", "scheduled_date": date.today().isoformat(), "child_ids": [child["id"]]})
    entry = kid.get("/api/planner/today").json()[0]
    assert (entry["lesson"]["title"], entry["lesson"]["scheme"], entry["lesson"]["lesson_url"]) == (
        "Count on", "Oak National Academy", "https://www.thenational.academy/pupils/lessons/count-on"
    )
    import routers.oak_lessons as oak_lessons

    assert oak_lessons.lesson_slug(entry["lesson"]["lesson_url"]) == "count-on"

    # Only grown-ups use the finder, and nonsense is refused.
    assert kid.get("/api/oak-finder/subjects").status_code == 403
    assert kid.post("/api/oak-finder/plan", json={"lessons": lessons, "subject": "Maths", "scheduled_date": friday.isoformat()}).status_code == 403
    bad = {"lessons": [{"slug": "../x", "title": "X"}], "subject": "Maths", "scheduled_date": friday.isoformat()}
    assert family.parent.post("/api/oak-finder/plan", json=bad).status_code == 422
    assert family.parent.post("/api/oak-finder/plan", json={**bad, "lessons": []}).status_code == 422


def test_a_unit_skips_weekends_and_days_off(family, oak):
    child = family.add_child()
    # Friday 9 October, then a week off (Monday 12 to Friday 16), so the next free day is Monday 19.
    for day in range(12, 17):
        assert family.parent.post("/api/days-off/", json={"date": f"2026-10-{day}", "reason": "October holiday"}).status_code == 200
    lessons = [{"slug": f"lesson-{n}", "title": f"Lesson {n}"} for n in range(3)]
    made = family.parent.post("/api/oak-finder/plan", json={
        "lessons": lessons, "subject": "Maths", "scheduled_date": "2026-10-09", "child_ids": [child["id"]],
    }).json()
    assert made == {"planned": 3, "first_day": "2026-10-09", "last_day": "2026-10-20"}

    # Starting on a day off moves the start to the next free day. A single lesson goes exactly where it is put.
    again = family.parent.post("/api/oak-finder/plan", json={"lessons": lessons[:2], "subject": "Maths", "scheduled_date": "2026-10-14"}).json()
    assert (again["first_day"], again["last_day"]) == ("2026-10-19", "2026-10-20")
    one = family.parent.post("/api/oak-finder/plan", json={"lessons": lessons[:1], "subject": "Maths", "scheduled_date": "2026-10-14"}).json()
    assert one["first_day"] == "2026-10-14"
