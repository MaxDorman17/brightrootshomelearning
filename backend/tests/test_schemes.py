"""The scheme a lesson or unit comes from (Twinkl, White Rose Maths, Oak...)."""
from datetime import date


def planned(family, child, lesson):
    entry = family.parent.post(
        "/api/planner/",
        json={"lesson_id": lesson["id"], "scheduled_date": date.today().isoformat(), "assigned_to": child["id"]},
    )
    assert entry.status_code == 201, entry.text
    return entry.json()


def test_a_lesson_keeps_its_scheme(family):
    made = family.parent.post(
        "/api/lessons/",
        json={"title": "Fractions", "subject": "Maths", "lesson_url": "https://example.test/fractions", "scheme": "  White Rose Maths  "},
    )
    assert made.status_code == 201, made.text
    assert made.json()["scheme"] == "White Rose Maths"

    # The planner hands the scheme to the child along with the lesson.
    child = family.add_child()
    planned(family, child, made.json())
    today = family.child_client(child).get("/api/planner/today").json()
    assert [e["lesson"]["scheme"] for e in today] == ["White Rose Maths"]

    # It can be changed, and cleared again.
    lesson_id = made.json()["id"]
    assert family.parent.put(f"/api/lessons/{lesson_id}", json={"scheme": "Twinkl"}).json()["scheme"] == "Twinkl"
    assert family.parent.put(f"/api/lessons/{lesson_id}", json={"scheme": ""}).json()["scheme"] is None
    # Leaving it out of an edit doesn't touch it.
    family.parent.put(f"/api/lessons/{lesson_id}", json={"scheme": "Twinkl"})
    assert family.parent.put(f"/api/lessons/{lesson_id}", json={"title": "Adding fractions"}).json()["scheme"] == "Twinkl"


def test_a_lesson_needs_no_scheme(family):
    made = family.parent.post("/api/lessons/", json={"title": "Nature walk", "subject": "Science"})
    assert made.status_code == 201, made.text
    assert made.json()["scheme"] is None


def test_units_keep_their_scheme(family):
    current = family.parent.post("/api/units/", json={"subject": "Maths", "title": "Place value", "scheme": "White Rose Maths"})
    assert current.status_code == 200, current.text
    assert current.json()["scheme"] == "White Rose Maths"

    queued = family.parent.post("/api/units/queue", json={"subject": "Maths", "title": "Addition", "scheme": "Twinkl"})
    assert queued.status_code == 200, queued.text
    assert queued.json()["scheme"] == "Twinkl"

    # Making the next unit the current one carries its scheme across.
    promoted = family.parent.post(f"/api/units/queue/{queued.json()['id']}/promote")
    assert promoted.status_code == 200, promoted.text
    assert promoted.json()["title"] == "Addition"
    assert promoted.json()["scheme"] == "Twinkl"
    assert [u["scheme"] for u in family.parent.get("/api/units/").json()] == ["Twinkl"]


def test_council_report_names_the_schemes_used(family):
    child = family.add_child()
    kid = family.child_client(child)
    lessons = [
        {"title": "Fractions", "subject": "Maths", "scheme": "White Rose Maths"},
        {"title": "Story writing", "subject": "English", "scheme": "Twinkl"},
        # An Oak link is recognised without the parent naming the scheme.
        {"title": "Plants", "subject": "Science", "lesson_url": "https://www.thenational.academy/pupils/programmes/science-primary-ks2/units/plants/lessons/roots"},
        {"title": "Den building", "subject": "Outdoors"},
    ]
    for body in lessons:
        lesson = family.parent.post("/api/lessons/", json=body).json()
        entry = planned(family, child, lesson)
        assert kid.patch(f"/api/planner/{entry['id']}/complete").status_code == 200

    today = date.today().isoformat()
    report = family.parent.get("/api/council-report/", params={"child_id": child["id"], "start_date": today, "end_date": today}).json()
    schemes = {s["subject"]: s["schemes"] for s in report["subjects"]}
    assert schemes == {
        "Maths": ["White Rose Maths"],
        "English": ["Twinkl"],
        "Science": ["Oak National Academy"],
        "Outdoors": [],
    }
    assert report["results"]["oak_quizzes"] == 0
