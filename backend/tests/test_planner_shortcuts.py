"""Logging learning after it happened, repeating a lesson each week, and copying a week."""
from datetime import date, timedelta

from conftest import sign_up


def monday(weeks_ahead: int = 0) -> date:
    today = date.today()
    return today - timedelta(days=today.weekday()) + timedelta(weeks=weeks_ahead)


def week(family, start: date, child_id=None):
    params = {"start_date": start.isoformat()}
    if child_id:
        params["child_id"] = child_id
    return family.parent.get("/api/planner/week", params=params).json()


def plan(family, child_id, day: date, title="Swimming", subject="PE"):
    lesson = family.parent.post("/api/lessons/", json={"title": title, "subject": subject}).json()
    body = {"lesson_id": lesson["id"], "scheduled_date": day.isoformat()}
    if child_id is not None:
        body["assigned_to"] = child_id
    made = family.parent.post("/api/planner/", json=body)
    assert made.status_code == 201, made.text
    return made.json()


# ---------- what did you do today? ----------

def test_log_something_already_done(family):
    one, two = family.add_child("One"), family.add_child("Two")
    made = family.parent.post("/api/planner/log", json={
        "title": "  Pond dipping  at the park ", "subject": "Science", "child_ids": [one["id"], two["id"]], "note": "Found a newt",
    })
    assert made.status_code == 201, made.text
    assert made.json()["logged"] == 2
    assert made.json()["day"] == date.today().isoformat()

    # Each child has it on today, already done, with the note.
    for child in (one, two):
        mine = family.child_client(child).get("/api/planner/today").json()
        assert [(e["lesson"]["title"], e["lesson"]["subject"], e["is_complete"], e["completed_note"]) for e in mine] == [
            ("Pond dipping at the park", "Science", True, "Found a newt")
        ]

    # It counts in the council report as a lesson in that subject.
    today = date.today().isoformat()
    report = family.parent.get("/api/council-report/", params={"child_id": one["id"], "start_date": today, "end_date": today}).json()
    assert report["summary"]["lessons_completed"] == 1
    assert [(s["subject"], s["examples"]) for s in report["subjects"]] == [("Science", ["Pond dipping at the park"])]


def test_log_for_yesterday_but_not_tomorrow(family):
    child = family.add_child()
    yesterday = date.today() - timedelta(days=1)
    ok = family.parent.post("/api/planner/log", json={"title": "Baking", "subject": "Cooking", "child_ids": [child["id"]], "day": yesterday.isoformat()})
    assert ok.status_code == 201, ok.text
    assert ok.json()["day"] == yesterday.isoformat()
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    assert family.parent.post("/api/planner/log", json={"title": "Baking", "subject": "Cooking", "child_ids": [child["id"]], "day": tomorrow}).status_code == 400
    long_ago = (date.today() - timedelta(days=400)).isoformat()
    assert family.parent.post("/api/planner/log", json={"title": "Baking", "subject": "Cooking", "child_ids": [child["id"]], "day": long_ago}).status_code == 400


def test_log_is_checked(family):
    child = family.add_child()
    other_child = sign_up("Other").add_child()
    post = lambda body: family.parent.post("/api/planner/log", json=body).status_code  # noqa: E731
    assert post({"title": " ", "subject": "Art", "child_ids": [child["id"]]}) == 400
    assert post({"title": "Painting", "subject": "", "child_ids": [child["id"]]}) == 400
    assert post({"title": "Painting", "subject": "Art", "child_ids": []}) == 400
    assert post({"title": "Painting", "subject": "Art", "child_ids": [other_child["id"]]}) == 400
    assert post({"title": "Painting", "subject": "Art", "child_ids": [child["id"], other_child["id"]]}) == 400
    # Children can't log for themselves.
    kid = family.child_client(child)
    assert kid.post("/api/planner/log", json={"title": "Painting", "subject": "Art", "child_ids": [child["id"]]}).status_code == 403


# ---------- repeat a lesson every week ----------

def test_repeat_a_lesson_each_week(family):
    child = family.add_child()
    first = plan(family, child["id"], monday(1) + timedelta(days=1))  # Tuesday of next week
    # A day off on the third Tuesday is skipped.
    family.parent.post("/api/days-off/", json={"date": (monday(3) + timedelta(days=1)).isoformat(), "reason": "Holiday"})
    done = family.parent.post(f"/api/planner/{first['id']}/repeat", json={"weeks": 3})
    assert done.status_code == 201, done.text
    assert done.json() == {"added": 2, "skipped": 1, "last": (monday(4) + timedelta(days=1)).isoformat()}
    for weeks, expected in ((2, 1), (3, 0), (4, 1)):
        entries = week(family, monday(weeks), child["id"])
        assert len(entries) == expected
        for e in entries:
            assert (e["lesson"]["title"], e["scheduled_date"], e["is_complete"], e["assigned_to"]) == (
                "Swimming", (monday(weeks) + timedelta(days=1)).isoformat(), False, child["id"])
    # Asking again adds nothing new.
    again = family.parent.post(f"/api/planner/{first['id']}/repeat", json={"weeks": 3}).json()
    assert (again["added"], again["skipped"]) == (0, 3)
    assert family.parent.post(f"/api/planner/{first['id']}/repeat", json={"weeks": 0}).status_code == 400
    assert family.parent.post(f"/api/planner/{first['id']}/repeat", json={"weeks": 99}).status_code == 400
    assert sign_up("Other").parent.post(f"/api/planner/{first['id']}/repeat", json={"weeks": 2}).status_code == 404


# ---------- copy a week ----------

def test_copy_last_week_into_this_one(family):
    one, two = family.add_child("One"), family.add_child("Two")
    source, target = monday(1), monday(2)
    swim = plan(family, one["id"], source + timedelta(days=1), "Swimming", "PE")
    plan(family, two["id"], source + timedelta(days=2), "Choir", "Music")
    plan(family, None, source + timedelta(days=4), "Nature walk", "Science")
    # Done last week, but the copy starts fresh.
    family.child_client(one).patch(f"/api/planner/{swim['id']}/complete")

    copied = family.parent.post("/api/planner/copy-week", json={"from_start": source.isoformat(), "to_start": (target + timedelta(days=3)).isoformat()})
    assert copied.status_code == 201, copied.text
    assert copied.json() == {"copied": 3, "skipped": 0, "start_date": target.isoformat()}
    got = sorted((e["lesson"]["title"], e["scheduled_date"], e["assigned_to"], e["is_complete"]) for e in week(family, target))
    assert got == sorted([
        ("Swimming", (target + timedelta(days=1)).isoformat(), one["id"], False),
        ("Choir", (target + timedelta(days=2)).isoformat(), two["id"], False),
        ("Nature walk", (target + timedelta(days=4)).isoformat(), None, False),
    ])
    # Copying again doesn't double anything up.
    assert family.parent.post("/api/planner/copy-week", json={"from_start": source.isoformat(), "to_start": target.isoformat()}).json()["copied"] == 0
    assert len(week(family, target)) == 3


def test_copy_a_week_for_one_child_and_never_another_familys(family):
    one, two = family.add_child("One"), family.add_child("Two")
    source, target = monday(1), monday(2)
    plan(family, one["id"], source, "Swimming", "PE")
    plan(family, two["id"], source, "Choir", "Music")
    other = sign_up("Other")
    plan(other, other.add_child()["id"], source, "Not ours", "Art")

    copied = family.parent.post("/api/planner/copy-week", json={"from_start": source.isoformat(), "to_start": target.isoformat(), "child_id": one["id"]})
    assert copied.json()["copied"] == 1
    assert [e["lesson"]["title"] for e in week(family, target)] == ["Swimming"]
    assert week(other, target) == []
    assert family.parent.post("/api/planner/copy-week", json={"from_start": source.isoformat(), "to_start": source.isoformat()}).status_code == 400
