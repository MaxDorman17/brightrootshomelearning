"""Bright Roots worksheets and comic quizzes: saving a half-done sheet, best scores, results and stars."""

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
