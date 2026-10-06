"""A timetable for each child, with the family timetable as the default."""
from datetime import date, timedelta

from conftest import sign_up

FAMILY = {"Monday": ["Maths", "English"], "Tuesday": ["Maths"], "Wednesday": ["Maths"], "Thursday": ["Maths"], "Friday": ["Maths"]}
ROSE = {"Monday": ["Art"], "Tuesday": [], "Wednesday": ["Maths", "Art"], "Thursday": [], "Friday": ["Forest School"]}


def test_a_child_follows_the_family_timetable_until_given_their_own(family):
    family.parent.put("/api/timetable/", json={"config": FAMILY})
    rose, oscar = family.add_child("Rose"), family.add_child("Oscar")

    seen = family.parent.get("/api/timetable/", params={"child_id": rose["id"]}).json()
    assert seen["config"] == FAMILY and seen["own"] is False
    assert family.parent.get("/api/timetable/children").json() == {}

    saved = family.parent.put("/api/timetable/", params={"child_id": rose["id"]}, json={"config": ROSE})
    assert saved.status_code == 200, saved.text
    assert saved.json()["config"] == ROSE and saved.json()["own"] is True

    # Rose sees hers when she logs in; Oscar and the family timetable are untouched.
    assert family.child_client(rose).get("/api/timetable/").json()["config"] == ROSE
    assert family.child_client(oscar).get("/api/timetable/").json()["config"] == FAMILY
    assert family.parent.get("/api/timetable/").json()["config"] == FAMILY
    assert family.parent.get("/api/timetable/children").json() == {str(rose["id"]): ROSE}

    # Changing the family one later doesn't change hers.
    family.parent.put("/api/timetable/", json={"config": {**FAMILY, "Friday": []}})
    assert family.parent.get("/api/timetable/", params={"child_id": rose["id"]}).json()["config"] == ROSE
    assert family.parent.get("/api/timetable/", params={"child_id": oscar["id"]}).json()["config"]["Friday"] == []

    # Going back to the family timetable.
    assert family.parent.delete("/api/timetable/", params={"child_id": rose["id"]}).status_code == 204
    back = family.parent.get("/api/timetable/", params={"child_id": rose["id"]}).json()
    assert back["own"] is False and back["config"]["Monday"] == ["Maths", "English"]


def test_only_the_family_can_touch_a_childs_timetable(family):
    rose = family.add_child("Rose")
    other = sign_up("Other")
    assert other.parent.put("/api/timetable/", params={"child_id": rose["id"]}, json={"config": ROSE}).status_code == 404
    assert other.parent.get("/api/timetable/", params={"child_id": rose["id"]}).status_code == 404
    assert other.parent.delete("/api/timetable/", params={"child_id": rose["id"]}).status_code == 404
    # Children can't change timetables.
    assert family.child_client(rose).put("/api/timetable/", json={"config": ROSE}).status_code == 403
    assert family.parent.get("/api/timetable/children").json() == {}


def test_the_starter_week_follows_each_childs_own_timetable(family):
    family.parent.put("/api/timetable/", json={"config": FAMILY})
    rose, oscar = family.add_child("Rose"), family.add_child("Oscar")
    family.parent.put("/api/timetable/", params={"child_id": rose["id"]}, json={"config": ROSE})
    monday = date.today() - timedelta(days=date.today().weekday())
    made = family.parent.post("/api/planner/starter-week", json={"child_ids": [rose["id"], oscar["id"]], "start_date": monday.isoformat()})
    assert made.status_code == 201, made.text

    def subjects_by_day(child):
        entries = family.parent.get("/api/planner/week", params={"child_id": child["id"], "start_date": monday.isoformat()}).json()
        out = {}
        for e in entries:
            if e["assigned_to"] == child["id"]:
                out.setdefault(e["scheduled_date"], []).append(e["lesson"]["subject"])
        return {day: sorted(subjects) for day, subjects in out.items()}

    names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    days = {name: (monday + timedelta(days=i)).isoformat() for i, name in enumerate(names)}
    # Each child's week is built from their own timetable. (A day with nothing on it gets a few lessons of ours.)
    rose_week, oscar_week = subjects_by_day(rose), subjects_by_day(oscar)
    for name in names:
        if ROSE[name]:
            assert rose_week[days[name]] == sorted(ROSE[name]), name
        assert oscar_week[days[name]] == sorted(FAMILY[name]), name
    assert "Forest School" not in sum(oscar_week.values(), [])


def test_a_lesson_plan_lands_on_the_childs_own_days(family):
    family.parent.put("/api/timetable/", json={"config": FAMILY})
    rose = family.add_child("Rose")
    family.parent.put("/api/timetable/", params={"child_id": rose["id"]}, json={"config": ROSE})
    lessons = [family.parent.post("/api/lessons/", json={"title": f"Maths {n}", "subject": "Maths"}).json() for n in range(2)]
    plan = family.parent.post("/api/lesson-plans/", json={"title": "Maths plan", "subject": "Maths", "lesson_ids": [l["id"] for l in lessons]}).json()
    monday = date.today() - timedelta(days=date.today().weekday()) + timedelta(weeks=1)
    done = family.parent.post(f"/api/lesson-plans/{plan['id']}/schedule", json={"start_date": monday.isoformat(), "assigned_to": rose["id"], "mode": "timetable"})
    assert done.status_code == 200, done.text
    # Rose only has Maths on Wednesdays, so the two lessons go on two Wednesdays, not Monday and Tuesday.
    assert [d["date"] for d in done.json()["dates"]] == [(monday + timedelta(days=2)).isoformat(), (monday + timedelta(days=9)).isoformat()]


def test_removing_a_child_removes_their_timetable(family):
    rose = family.add_child("Rose")
    family.parent.put("/api/timetable/", params={"child_id": rose["id"]}, json={"config": ROSE})
    assert family.parent.delete(f"/api/children/{rose['id']}").status_code == 204
    assert family.parent.get("/api/timetable/children").json() == {}


def test_subject_suggestions_include_each_childs_own_subjects(family):
    family.parent.put("/api/timetable/", json={"config": FAMILY})
    rose = family.add_child("Rose")
    family.parent.put("/api/timetable/", params={"child_id": rose["id"]}, json={"config": ROSE})
    subjects = family.parent.get("/api/timetable/subjects").json()["subjects"]
    assert subjects == ["Maths", "English", "Art", "Forest School"]
    assert family.child_client(rose).get("/api/timetable/subjects").json()["subjects"] == subjects
    assert "Forest School" not in sign_up("Other").parent.get("/api/timetable/subjects").json()["subjects"]
