"""The everyday features: planning, rewards, notes, languages, family badges and the activity library."""
from datetime import date, timedelta

from conftest import PASSWORD, login, new_client, sign_up

# The smallest valid PNG: a single transparent pixel.
PNG = bytes.fromhex(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c6360000200000500017a5eab3f"
    "0000000049454e44ae426082"
)


# ---------- planning and rewards ----------

def test_plan_a_lesson_and_child_marks_it_done(family):
    child = family.add_child()
    kid = family.child_client(child)
    lesson = family.parent.post("/api/lessons/", json={"title": "Fractions", "subject": "Maths"})
    assert lesson.status_code == 201, lesson.text
    entry = family.parent.post(
        "/api/planner/", json={"lesson_id": lesson.json()["id"], "scheduled_date": date.today().isoformat(), "assigned_to": child["id"]}
    )
    assert entry.status_code == 201, entry.text
    today = kid.get("/api/planner/today").json()
    assert [e["id"] for e in today] == [entry.json()["id"]]
    assert kid.patch(f"/api/planner/{entry.json()['id']}/complete").status_code == 200


def test_stars_and_reward_requests(family):
    child = family.add_child()
    kid = family.child_client(child)
    assert family.parent.post("/api/rewards/items", json={"title": "Film night", "emoji": "🍿", "cost": 5, "is_active": True}).status_code == 201
    assert family.parent.post("/api/rewards/award", json={"child_id": child["id"], "stars": 8, "reason": "test"}).status_code == 201
    mine = kid.get("/api/rewards/me").json()
    assert mine["available"] == 8
    reward = next(r for r in mine["rewards"] if r["title"] == "Film night")
    claim = kid.post("/api/rewards/claims", json={"reward_id": reward["id"], "quantity": 1})
    assert claim.status_code == 201, claim.text
    assert family.parent.post(f"/api/rewards/claims/{claim.json()['id']}/approve").status_code == 200
    assert kid.get("/api/rewards/me").json()["available"] == 3
    # Children can't hand out stars.
    assert kid.post("/api/rewards/award", json={"child_id": child["id"], "stars": 99, "reason": "cheeky"}).status_code == 403


# ---------- notes from home ----------

def test_notes_reach_only_the_right_child(family):
    one, two = family.add_child("One"), family.add_child("Two")
    sent = family.parent.post("/api/notes/", json={"body": "Good luck today!", "child_ids": [one["id"]]})
    assert sent.status_code == 201, sent.text
    kid_one, kid_two = family.child_client(one), family.child_client(two)
    notes = kid_one.get("/api/notes/").json()
    assert [n["body"] for n in notes] == ["Good luck today!"]
    assert notes[0]["author"]["username"] == family.name
    assert kid_two.get("/api/notes/").json() == []
    reacted = kid_one.post(f"/api/notes/{notes[0]['id']}/read", json={"reaction": "❤️"})
    assert reacted.json()["reaction"] == "❤️" and reacted.json()["read_at"]
    assert kid_two.post(f"/api/notes/{notes[0]['id']}/read", json={"reaction": "❤️"}).status_code == 404
    assert kid_one.post("/api/notes/", json={"body": "hi", "child_ids": [one["id"]]}).status_code == 403


def test_empty_notes_are_refused(family):
    child = family.add_child()
    assert family.parent.post("/api/notes/", json={"body": "   ", "child_ids": [child["id"]]}).status_code == 422
    assert family.parent.post("/api/notes/", json={"body": "hello", "child_ids": []}).status_code == 400


# ---------- languages ----------

def test_language_practice_and_streaks(family):
    child = family.add_child()
    kid = family.child_client(child)
    today = date.today()
    for back in (0, 1, 2):
        logged = family.parent.post(
            "/api/languages/",
            json={"language": "french", "done_on": (today - timedelta(days=back)).isoformat(), "minutes": 10, "child_ids": [child["id"]]},
        )
        assert logged.status_code == 200, logged.text
    # Logging the same day again updates it instead of adding a second entry.
    kid.post("/api/languages/", json={"language": "French", "done_on": today.isoformat(), "minutes": 25, "child_ids": []})
    kid.post("/api/languages/", json={"language": "Welsh", "done_on": today.isoformat(), "child_ids": []})
    totals = kid.get("/api/languages/summary").json()["totals"]
    assert totals["sessions"] == 4
    assert totals["days"] == 3
    assert totals["languages"] == 2
    assert totals["minutes"] == 45
    assert totals["current_streak"] == 3 and totals["best_streak"] == 3


def test_language_practice_cannot_be_in_the_future(family):
    child = family.add_child()
    future = (date.today() + timedelta(days=7)).isoformat()
    assert family.parent.post("/api/languages/", json={"language": "Polish", "done_on": future, "child_ids": [child["id"]]}).status_code == 422


# ---------- family badges ----------

def test_family_badges_with_a_picture(family):
    child = family.add_child()
    kid = family.child_client(child)
    made = family.parent.post("/api/badges/", data={"title": "Kind Friend", "description": "Helping"}, files={"file": ("badge.png", PNG, "image/png")})
    assert made.status_code == 201, made.text
    badge = made.json()
    assert badge["has_image"] is True
    assert kid.get(f"/api/badges/{badge['id']}/image").content == PNG
    assert kid.get("/api/badges/").json()[0]["earned"] is False
    awarded = family.parent.put(f"/api/badges/{badge['id']}/awards", json={"child_ids": [child["id"]]})
    assert awarded.json()["awarded_to"] == [child["id"]]
    assert kid.get("/api/badges/").json()[0]["earned"] is True
    # Children can't make, award or delete badges; other families can't see them.
    assert kid.post("/api/badges/", data={"title": "Mine"}).status_code == 403
    assert kid.delete(f"/api/badges/{badge['id']}").status_code == 403
    assert sign_up().parent.get(f"/api/badges/{badge['id']}/image").status_code == 404
    assert family.parent.delete(f"/api/badges/{badge['id']}").status_code == 204
    assert kid.get("/api/badges/").json() == []


def test_badge_picture_must_be_a_real_image(family):
    refused = family.parent.post("/api/badges/", data={"title": "Fake"}, files={"file": ("x.png", b"not a picture", "image/png")})
    assert refused.status_code == 400


# ---------- the activity library ----------

def test_starter_activities_cover_every_page(family):
    items = family.parent.get("/api/make/items").json()
    by_kind = {}
    for item in items:
        by_kind.setdefault(item["kind"], []).append(item)
    assert set(by_kind) == {"recipe", "craft", "pe", "outdoor", "life", "little"}
    for kind, things in by_kind.items():
        young = [i for i in things if (i["age_from"] or 3) <= 10]
        teen = [i for i in things if (i["age_from"] or 3) >= 10]
        assert young, f"no younger {kind} activities"
        if kind != "little":  # Little Roots is only for 3 and 4 year olds
            assert teen, f"no teen {kind} activities"
    # Every starter has steps to follow.
    slugs = [i["slug"] for i in items if i.get("slug")]
    assert len(slugs) == len(set(slugs))


def test_wire_a_plug_keeps_its_grown_up_checks(family):
    items = family.parent.get("/api/make/items", params={"kind": "life"}).json()
    plug = next(i for i in items if i["slug"] == "life-wire-a-plug")
    detail = family.parent.get(f"/api/make/items/{plug['id']}").json()
    grown_up_steps = [s for s in detail["steps"] if s["grown_up"]]
    assert len(grown_up_steps) >= 2
    assert detail["steps"][0]["grown_up"] and detail["steps"][-1]["grown_up"]


def test_plan_a_life_skill_as_a_lesson(family):
    child = family.add_child()
    skill = family.parent.get("/api/make/items", params={"kind": "life"}).json()[0]
    planned = family.parent.post(
        f"/api/make/items/{skill['id']}/plan",
        json={"scheduled_date": date.today().isoformat(), "subject": "", "child_ids": [child["id"]]},
    )
    assert planned.status_code == 201, planned.text
    today = family.child_client(child).get("/api/planner/today").json()
    assert today and today[0]["lesson"]["subject"] == "Life Skills"


def test_little_roots_cards_carry_talk_and_next_steps(family):
    child = family.add_child()
    items = family.parent.get("/api/make/items", params={"kind": "little"}).json()
    assert len(items) >= 3 and all(i["age_from"] == 3 for i in items)
    detail = family.parent.get(f"/api/make/items/{items[0]['id']}").json()
    assert detail["talk"] and detail["more"] and detail["easier"] and detail["tips"]
    # The story book has an opening, a line for each step and an ending.
    assert len(detail["story"]) == len(detail["steps"]) + 2

    # A family's own copy keeps the extra parts and can change them.
    copy = family.parent.post(f"/api/make/items/{detail['id']}/copy").json()
    assert copy["talk"] == detail["talk"] and copy["more"] == detail["more"] and copy["story"] == detail["story"]
    body = {k: copy[k] for k in ("kind", "title", "materials", "steps", "tips", "more", "easier")}
    body["talk"] = ["  What colour is it?  ", ""]
    changed = family.parent.put(f"/api/make/items/{copy['id']}", json=body).json()
    assert changed["talk"] == ["What colour is it?"]

    planned = family.parent.post(
        f"/api/make/items/{detail['id']}/plan",
        json={"scheduled_date": date.today().isoformat(), "subject": "", "child_ids": [child["id"]]},
    )
    assert planned.status_code == 201, planned.text
    today = family.child_client(child).get("/api/planner/today").json()
    assert today and today[0]["lesson"]["subject"] == "Little Roots"


def test_a_reading_worksheet_can_be_ticked_done_by_the_child_or_parent(family):
    child = family.add_child("Reader")
    other = sign_up("Other Family")
    book = family.parent.post("/api/reading/", json={"title": "The Iron Man", "status": "reading", "child_id": child["id"]})
    assert book.status_code in (200, 201), book.text
    ws = family.parent.post(f"/api/reading/{book.json()['id']}/worksheets", json={"title": "Chapter 1 questions", "url": "https://example.test/ws"}).json()
    assert ws["completed_at"] is None

    kid = family.child_client(child)
    done = kid.put(f"/api/reading/worksheets/{ws['id']}/done", json={"done": True})
    assert done.status_code == 200 and done.json()["completed_at"]
    first = done.json()["completed_at"]
    # Ticking again keeps the day it was first done; it shows for the parent too.
    assert kid.put(f"/api/reading/worksheets/{ws['id']}/done", json={"done": True}).json()["completed_at"] == first
    assert [w["completed_at"] for w in family.parent.get("/api/reading/worksheets").json() if w["id"] == ws["id"]] == [first]

    # A grown-up can untick it, and another family can't touch it.
    assert family.parent.put(f"/api/reading/worksheets/{ws['id']}/done", json={"done": False}).json()["completed_at"] is None
    assert other.parent.put(f"/api/reading/worksheets/{ws['id']}/done", json={"done": True}).status_code == 404
    assert new_client().put(f"/api/reading/worksheets/{ws['id']}/done", json={"done": True}).status_code == 401
