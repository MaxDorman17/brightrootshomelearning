"""Exams, the starter week, the calendar feed and trips."""
from datetime import date, timedelta

from conftest import PASSWORD, new_client, sign_up


def exam_body(child_id, **extra):
    body = {
        "child_id": child_id,
        "subject": "Maths",
        "qualification": "GCSE",
        "board": "AQA",
        "paper": "Paper 1",
        "exam_date": (date.today() + timedelta(days=30)).isoformat(),
        "exam_time": "9:00am",
        "centre": "Example Exam Centre",
        "entry_deadline": (date.today() + timedelta(days=5)).isoformat(),
        "status": "planning",
    }
    body.update(extra)
    return body


# ---------- exams ----------

def test_add_and_list_exams(family):
    child = family.add_child("Teen", activity_level="teen")
    made = family.parent.post("/api/exams/", json=exam_body(child["id"]))
    assert made.status_code == 201, made.text
    assert made.json()["days_to_go"] == 30
    assert made.json()["child"] == "Teen"
    kid = family.child_client(child)
    assert [e["subject"] for e in kid.get("/api/exams/").json()] == ["Maths"]
    # Children can see their exams but not change them.
    assert kid.post("/api/exams/", json=exam_body(child["id"])).status_code == 403
    assert kid.delete(f"/api/exams/{made.json()['id']}").status_code == 403


def test_exam_result_and_validation(family):
    child = family.add_child()
    exam = family.parent.post("/api/exams/", json=exam_body(child["id"])).json()
    updated = family.parent.put(f"/api/exams/{exam['id']}", json=exam_body(child["id"], status="result", result="7"))
    assert updated.json()["status"] == "result" and updated.json()["result"] == "7"
    assert family.parent.post("/api/exams/", json=exam_body(child["id"], qualification="Cycling proficiency")).status_code == 422
    assert family.parent.post("/api/exams/", json=exam_body(child["id"], subject="  ")).status_code == 422
    other_child = sign_up().add_child("NotYours")
    assert family.parent.post("/api/exams/", json=exam_body(other_child["id"])).status_code == 400


def test_revision_goes_into_the_planner(family):
    child = family.add_child()
    exam = family.parent.post("/api/exams/", json=exam_body(child["id"], exam_date=(date.today() + timedelta(days=15)).isoformat())).json()
    plan = family.parent.post(f"/api/exams/{exam['id']}/revision", json={"weekdays": [0, 2, 4], "minutes": 40})
    assert plan.status_code == 201, plan.text
    sessions = plan.json()["sessions"]
    assert 4 <= sessions <= 7  # three days a week for about two weeks
    assert plan.json()["last"] < exam["exam_date"]
    week = family.parent.get("/api/planner/week", params={"child_id": child["id"], "start_date": plan.json()["first"]}).json()
    assert any(e["lesson"]["title"].startswith("Revise Maths") for e in week)


def test_revision_needs_an_exam_date(family):
    child = family.add_child()
    exam = family.parent.post("/api/exams/", json=exam_body(child["id"], exam_date=None)).json()
    assert family.parent.post(f"/api/exams/{exam['id']}/revision", json={"weekdays": [1]}).status_code == 400


def test_exams_show_in_the_council_report(family):
    child = family.add_child()
    family.parent.post("/api/exams/", json=exam_body(child["id"]))
    today = date.today()
    report = family.parent.get(
        "/api/council-report/",
        params={"child_id": child["id"], "start_date": (today - timedelta(days=30)).isoformat(), "end_date": today.isoformat()},
    ).json()
    assert [e["subject"] for e in report["exams"]] == ["Maths"]


# ---------- starter week ----------

def test_starter_week_fills_a_week(family):
    young = family.add_child("Little", activity_level="young")
    monday = date.today() - timedelta(days=date.today().weekday())
    made = family.parent.post("/api/planner/starter-week", json={"child_ids": [young["id"]], "start_date": monday.isoformat()})
    assert made.status_code == 201, made.text
    assert made.json()["level"] == "young"
    assert made.json()["lessons"] == 24  # one for every slot on the default timetable
    week = family.parent.get("/api/planner/week", params={"child_id": young["id"], "start_date": monday.isoformat()}).json()
    assert len(week) == 24
    timetable = family.parent.get("/api/timetable/").json()["config"]
    for offset, day_name in enumerate(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]):
        day = (monday + timedelta(days=offset)).isoformat()
        assert sorted(e["lesson"]["subject"] for e in week if e["scheduled_date"] == day) == sorted(timetable[day_name])
    assert len({e["lesson"]["title"] for e in week}) == 24  # no lesson is used twice
    assert {e["scheduled_date"] for e in week} == {(monday + timedelta(days=i)).isoformat() for i in range(5)}


def test_starter_week_for_teens_and_two_children(family):
    a = family.add_child("Teen1", activity_level="teen")
    b = family.add_child("Teen2", activity_level="teen")
    made = family.parent.post("/api/planner/starter-week", json={"child_ids": [a["id"], b["id"]]})
    assert made.json()["level"] == "teen"
    assert made.json()["lessons"] == 48  # every slot, for each of two children
    assert family.parent.post("/api/planner/starter-week", json={"child_ids": []}).status_code == 400
    kid = family.child_client(a)
    assert kid.post("/api/planner/starter-week", json={"child_ids": [a["id"]]}).status_code == 403


# ---------- calendar feed ----------

def test_calendar_feed(family):
    child = family.add_child("Calendar")
    family.parent.post("/api/planner/starter-week", json={"child_ids": [child["id"]]})
    family.parent.post("/api/exams/", json=exam_body(child["id"]))
    assert family.parent.get("/api/calendar/link").json()["token"] is None
    token = family.parent.post("/api/calendar/link").json()["token"]
    assert token and len(token) >= 30
    feed = new_client().get(f"/api/calendar/{token}.ics")  # calendar apps don't log in
    assert feed.status_code == 200
    assert feed.headers["content-type"].startswith("text/calendar")
    text = feed.text
    assert text.startswith("BEGIN:VCALENDAR") and text.rstrip().endswith("END:VCALENDAR")
    assert "Exam: GCSE Maths Paper 1 (Calendar)" in text
    assert "Exam entry deadline" in text
    assert text.count("BEGIN:VEVENT") >= 17
    assert all(len(line.encode("utf-8")) <= 75 for line in text.split("\r\n"))


def test_calendar_link_can_be_replaced_and_switched_off(family):
    old = family.parent.post("/api/calendar/link").json()["token"]
    new = family.parent.post("/api/calendar/link").json()["token"]
    assert old != new
    assert new_client().get(f"/api/calendar/{old}.ics").status_code == 404
    assert new_client().get(f"/api/calendar/{new}.ics").status_code == 200
    assert family.parent.delete("/api/calendar/link").status_code == 204
    assert new_client().get(f"/api/calendar/{new}.ics").status_code == 404
    assert new_client().get("/api/calendar/short.ics").status_code == 404


def test_calendar_feed_only_shows_your_own_family(family):
    other = sign_up()
    other.add_child("Secret")
    other_child = other.parent.get("/api/children/").json()[0]
    other.parent.post("/api/planner/starter-week", json={"child_ids": [other_child["id"]]})
    family.add_child("Mine")
    token = family.parent.post("/api/calendar/link").json()["token"]
    assert "Secret" not in new_client().get(f"/api/calendar/{token}.ics").text


# ---------- trips and days out ----------

def test_trips_are_moments_with_a_place(family):
    child = family.add_child()
    trip = family.parent.post(
        "/api/moments/",
        data={"note": "Saw the dinosaurs", "moment_date": date.today().isoformat(), "subject": "Science",
              "child_ids": str(child["id"]), "trip_place": "Natural History Museum"},
    )
    assert trip.status_code == 201, trip.text
    assert trip.json()["trip_place"] == "Natural History Museum"
    family.parent.post("/api/moments/", data={"note": "Ordinary moment", "moment_date": date.today().isoformat()})
    trips = family.parent.get("/api/moments/", params={"trips": "true"}).json()
    assert [t["trip_place"] for t in trips] == ["Natural History Museum"]
    assert len(family.parent.get("/api/moments/").json()) == 2
    # A trip can be saved with just a place, and appears in the council report.
    assert family.parent.post("/api/moments/", data={"moment_date": date.today().isoformat(), "trip_place": "Local castle"}).status_code == 201
    today = date.today().isoformat()
    report = family.parent.get("/api/council-report/", params={"child_id": child["id"], "start_date": today, "end_date": today}).json()
    assert {m["trip_place"] for m in report["moments"] if m["trip_place"]} == {"Natural History Museum", "Local castle"}


def test_editing_a_moment_keeps_its_place(family):
    trip = family.parent.post("/api/moments/", data={"moment_date": date.today().isoformat(), "trip_place": "Zoo"}).json()
    kept = family.parent.put(f"/api/moments/{trip['id']}", json={"note": "Lions!", "moment_date": trip["moment_date"], "child_ids": []})
    assert kept.json()["trip_place"] == "Zoo"
    cleared = family.parent.put(f"/api/moments/{trip['id']}", json={"note": "", "moment_date": trip["moment_date"], "child_ids": [], "trip_place": ""})
    assert cleared.json()["trip_place"] is None


def test_starter_week_uses_the_family_timetable_names(family):
    child = family.add_child("Little", activity_level="young")
    monday = date.today() - timedelta(days=date.today().weekday())
    family.parent.post("/api/planner/starter-week", json={"child_ids": [child["id"]], "start_date": monday.isoformat()})
    week = family.parent.get("/api/planner/week", params={"child_id": child["id"], "start_date": monday.isoformat()}).json()
    wednesday = (monday + timedelta(days=2)).isoformat()
    # The default timetable calls it "Art & Design", so the art lesson lands in that row.
    assert "Art & Design" in {e["lesson"]["subject"] for e in week if e["scheduled_date"] == wednesday}


def test_starter_week_follows_a_familys_own_timetable(family):
    child = family.add_child("Little", activity_level="young")
    config = {"Monday": ["Numeracy", "Forest School", "Latin"], "Tuesday": [], "Wednesday": ["P.E."], "Thursday": ["Maths"], "Friday": ["Music"]}
    assert family.parent.put("/api/timetable/", json={"config": config}).status_code == 200
    monday = date.today() - timedelta(days=date.today().weekday())
    family.parent.post("/api/planner/starter-week", json={"child_ids": [child["id"]], "start_date": monday.isoformat()})
    week = family.parent.get("/api/planner/week", params={"child_id": child["id"], "start_date": monday.isoformat()}).json()
    on = lambda offset: {e["lesson"]["subject"]: e["lesson"]["title"] for e in week if e["scheduled_date"] == (monday + timedelta(days=offset)).isoformat()}
    assert on(0) == {"Numeracy": "Number bonds to 10", "Forest School": "Nature walk and bug hunt", "Latin": "Getting started with Latin"}
    assert len(on(1)) == 3  # nothing on the timetable for Tuesday, so the ready-made day is used
    assert on(2) == {"P.E.": "Garden obstacle course"}
    assert on(3) == {"Maths": "Shape hunt"}
    assert list(on(4)) == ["Music"]
