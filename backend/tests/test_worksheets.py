"""Bright Roots worksheets and comic quizzes: saving a half-done sheet, best scores, results and stars."""
from datetime import date

SHEET = {"kind": "worksheet", "slug": "number-bonds-to-10", "title": "Number bonds to 10", "subject": "Maths"}


def test_stop_half_way_and_come_back(family):
    kid = family.child_client(family.add_child())
    assert kid.get("/api/worksheets/mine/worksheet/number-bonds-to-10").json() is None
    saved = kid.put("/api/worksheets/progress", json={**SHEET, "answers": {"q1": 3, "q2": "7"}})
    assert saved.status_code == 200, saved.text
    assert saved.json()["in_progress"] is True
    back = kid.get("/api/worksheets/mine/worksheet/number-bonds-to-10").json()
    assert back["answers"] == {"q1": 3, "q2": "7"} and back["score"] is None

    # Finishing clears the half-done answers and keeps the score.
    done = kid.post("/api/worksheets/finish", json={**SHEET, "score": 7, "total": 10})
    assert done.status_code == 200, done.text
    assert (done.json()["score"], done.json()["first_time"], done.json()["in_progress"]) == (7, True, False)
    assert [(s["slug"], s["score"], s["tries"]) for s in kid.get("/api/worksheets/mine").json()] == [("number-bonds-to-10", 7, 1)]


def test_only_a_better_score_replaces_the_best(family):
    kid = family.child_client(family.add_child())
    kid.post("/api/worksheets/finish", json={**SHEET, "score": 7, "total": 10})
    worse = kid.post("/api/worksheets/finish", json={**SHEET, "score": 5, "total": 10}).json()
    assert (worse["score"], worse["new_best"], worse["tries"]) == (7, False, 2)
    better = kid.post("/api/worksheets/finish", json={**SHEET, "score": 10, "total": 10}).json()
    assert (better["score"], better["new_best"], better["tries"]) == (10, True, 3)


def test_scores_show_in_results_for_the_right_child(family):
    one, two = family.add_child("One"), family.add_child("Two")
    family.child_client(one).post("/api/worksheets/finish", json={**SHEET, "score": 9, "total": 10})
    family.child_client(one).post(
        "/api/worksheets/finish", json={"kind": "comic", "slug": "captain-ten", "title": "Captain Ten", "subject": "Maths", "score": 3, "total": 3}
    )
    overview = family.parent.get("/api/test-results/overview", params={"child_id": one["id"]}).json()
    assert sorted((s["kind"], s["title"], s["score"], s["total"]) for s in overview["sheets"]) == [
        ("comic", "Captain Ten", 3, 3),
        ("worksheet", "Number bonds to 10", 9, 10),
    ]
    assert family.parent.get("/api/test-results/overview", params={"child_id": two["id"]}).json()["sheets"] == []
    assert len(family.parent.get("/api/worksheets/summary", params={"child_id": one["id"]}).json()) == 2
    # Grown-ups look at sheets but don't fill them in.
    assert family.parent.post("/api/worksheets/finish", json={**SHEET, "score": 10, "total": 10}).status_code == 403


def test_a_sheet_earns_stars_once(family):
    child = family.add_child()
    kid = family.child_client(child)
    family.parent.get("/api/rewards/setup")  # sets up the family's example rules
    for rule in family.parent.get("/api/rewards/setup").json()["rules"]:
        family.parent.delete(f"/api/rewards/rules/{rule['id']}")
    made = family.parent.post("/api/rewards/rules", json={"kind": "score", "threshold_pct": 80, "stars": 2, "is_active": True})
    assert made.status_code == 201, made.text

    kid.post("/api/worksheets/finish", json={**SHEET, "score": 6, "total": 10})
    assert kid.get("/api/rewards/me").json()["balance"] == 0
    kid.post("/api/worksheets/finish", json={**SHEET, "score": 9, "total": 10})
    assert kid.get("/api/rewards/me").json()["balance"] == 2
    # Doing it again, however well, doesn't pay out a second time.
    kid.post("/api/worksheets/finish", json={**SHEET, "score": 10, "total": 10})
    mine = kid.get("/api/rewards/me").json()
    assert mine["balance"] == 2
    assert mine["history"][0]["reason"] == "Scored 100%: Number bonds to 10"


def test_nonsense_is_refused(family):
    kid = family.child_client(family.add_child())
    assert kid.post("/api/worksheets/finish", json={**SHEET, "score": 11, "total": 10}).status_code == 422
    assert kid.post("/api/worksheets/finish", json={**SHEET, "score": 1, "total": 0}).status_code == 422
    assert kid.post("/api/worksheets/finish", json={**SHEET, "slug": "../etc", "score": 1, "total": 1}).status_code == 422
    assert kid.post("/api/worksheets/finish", json={**SHEET, "kind": "game", "score": 1, "total": 1}).status_code == 422
    assert kid.put("/api/worksheets/progress", json={**SHEET, "answers": {"q": "x" * 30_000}}).status_code == 422


def test_a_planned_sheet_shows_in_today_and_ticks_itself_off(family):
    child = family.add_child()
    kid = family.child_client(child)
    today = date.today().isoformat()
    planned = family.parent.post(
        "/api/worksheets/plan", json={"sheets": [{**SHEET, "intro": "Find the partner."}], "scheduled_date": today, "child_ids": [child["id"]]}
    )
    assert planned.status_code == 201, planned.text
    assert planned.json() == {"planned": 1, "first_day": today, "last_day": today}
    entry = kid.get("/api/planner/today").json()[0]
    assert (entry["lesson"]["title"], entry["lesson"]["lesson_url"], entry["is_complete"]) == (
        "Number bonds to 10", "/worksheets/number-bonds-to-10", False
    )

    done = kid.post("/api/worksheets/finish", json={**SHEET, "score": 8, "total": 10}).json()
    assert done["ticked_off"] is True
    assert kid.get("/api/planner/today").json()[0]["is_complete"] is True
    # A second go has nothing left to tick off, and a sheet nobody planned never does.
    assert kid.post("/api/worksheets/finish", json={**SHEET, "score": 9, "total": 10}).json()["ticked_off"] is False
    other = {**SHEET, "slug": "tens-and-ones", "title": "Tens and ones"}
    assert kid.post("/api/worksheets/finish", json={**other, "score": 9, "total": 10}).json()["ticked_off"] is False


def test_a_sheet_planned_for_everyone_is_ticked_per_child(family):
    one, two = family.add_child("One"), family.add_child("Two")
    family.parent.post("/api/worksheets/plan", json={"sheets": [SHEET], "scheduled_date": date.today().isoformat(), "child_ids": []})
    assert family.child_client(one).post("/api/worksheets/finish", json={**SHEET, "score": 8, "total": 10}).json()["ticked_off"] is True
    kid_two = family.child_client(two)
    assert kid_two.get("/api/planner/today").json()[0]["is_complete"] is False
    assert kid_two.post("/api/worksheets/finish", json={**SHEET, "score": 8, "total": 10}).json()["ticked_off"] is True


def test_a_topic_set_is_spread_over_weekdays(family):
    child = family.add_child()
    friday = date(2026, 10, 9)
    sheets = [{**SHEET, "slug": f"sheet-{n}", "title": f"Sheet {n}"} for n in range(3)]
    planned = family.parent.post("/api/worksheets/plan", json={"sheets": sheets, "scheduled_date": friday.isoformat(), "child_ids": [child["id"]]})
    assert planned.json() == {"planned": 3, "first_day": "2026-10-09", "last_day": "2026-10-13"}
    # Children cannot plan, and an empty list is refused.
    kid = family.child_client(child)
    assert kid.post("/api/worksheets/plan", json={"sheets": [SHEET], "scheduled_date": friday.isoformat()}).status_code == 403
    assert family.parent.post("/api/worksheets/plan", json={"sheets": [], "scheduled_date": friday.isoformat()}).status_code == 422


def test_a_topic_set_skips_days_off(family):
    child = family.add_child()
    assert family.parent.post("/api/days-off/", json={"date": "2026-10-12", "reason": "Holiday"}).status_code == 200
    sheets = [{**SHEET, "slug": f"sheet-{n}", "title": f"Sheet {n}"} for n in range(2)]
    planned = family.parent.post("/api/worksheets/plan", json={"sheets": sheets, "scheduled_date": "2026-10-09", "child_ids": [child["id"]]})
    assert planned.json() == {"planned": 2, "first_day": "2026-10-09", "last_day": "2026-10-13"}
