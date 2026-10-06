"""Things that make Bright Roots easier for children: a short password, easier reading, and "I did this"."""
from datetime import date

from conftest import PASSWORD, sign_up, try_login


# ---------- a short password a young child can manage ----------

def test_a_child_can_have_a_short_password_but_not_a_tiny_one(family):
    too_short = family.parent.post("/api/children/", json={"username": "Tiny", "password": "abc"})
    assert too_short.status_code == 400
    assert "at least 4" in too_short.json()["detail"]
    made = family.parent.post("/api/children/", json={"username": "Pip", "password": "frog"})
    assert made.status_code == 201, made.text
    assert try_login(made.json()["login_name"], "frog").status_code == 200

    # A grown-up can reset it to another short one, but not below four.
    child_id = made.json()["id"]
    assert family.parent.post(f"/api/children/{child_id}/reset-password", json={"new_password": "ab"}).status_code == 400
    assert family.parent.post(f"/api/children/{child_id}/reset-password", json={"new_password": "1234"}).status_code == 200
    assert try_login(made.json()["login_name"], "1234").status_code == 200


def test_grown_ups_still_need_a_long_password(family):
    short = family.parent.post("/api/auth/change-password", json={"current_password": PASSWORD, "new_password": "short1"})
    assert short.status_code == 400
    assert "at least 8" in short.json()["detail"]


def test_wrong_guesses_at_one_login_are_stopped_wherever_they_come_from(family):
    child = family.parent.post("/api/children/", json={"username": "Guessed", "password": "frog"}).json()
    name = child["login_name"]
    from conftest import new_client

    codes = []
    for attempt in range(12):
        client = new_client()
        # Each guess arrives from a different address, as if spread over many computers.
        codes.append(client.post("/api/auth/login", data={"username": name, "password": f"no{attempt}"}, headers={"cf-connecting-ip": f"203.0.113.{attempt + 1}"}).status_code)
    assert codes[:10] == [401] * 10
    assert codes[10:] == [429, 429]
    # Even the right password has to wait now.
    assert new_client().post("/api/auth/login", data={"username": name, "password": "frog"}, headers={"cf-connecting-ip": "203.0.113.99"}).status_code == 429


# ---------- bigger text and an easy-read font ----------

def test_a_child_sets_how_their_screens_read(family):
    child = family.add_child()
    kid = family.child_client(child)
    assert kid.get("/api/auth/me").json()["display"] == {"text_size": "normal", "easy_font": False}
    saved = kid.put("/api/profile/display", json={"text_size": "large", "easy_font": True})
    assert saved.status_code == 200, saved.text
    assert kid.get("/api/auth/me").json()["display"] == {"text_size": "large", "easy_font": True}
    # It is theirs alone: the parent's own screens are unchanged.
    assert family.parent.get("/api/auth/me").json()["display"] == {"text_size": "normal", "easy_font": False}
    assert kid.put("/api/profile/display", json={"text_size": "enormous"}).status_code == 422


def test_a_parent_sets_it_for_a_child_but_not_for_another_familys(family):
    child = family.add_child()
    assert family.parent.put("/api/profile/display", params={"child_id": child["id"]}, json={"text_size": "larger", "easy_font": False}).status_code == 200
    assert family.parent.get("/api/profile/display", params={"child_id": child["id"]}).json() == {"text_size": "larger", "easy_font": False}
    assert family.child_client(child).get("/api/auth/me").json()["display"]["text_size"] == "larger"
    other = sign_up("Other")
    assert other.parent.put("/api/profile/display", params={"child_id": child["id"]}, json={"text_size": "large"}).status_code == 404
    # A child can't change a brother's or sister's.
    sibling = family.add_child("Sib")
    assert family.child_client(sibling).put("/api/profile/display", params={"child_id": child["id"]}, json={"text_size": "large"}).status_code == 403


# ---------- "I did this" ----------

def test_a_child_adds_something_and_it_waits_for_a_grown_up(family):
    child = family.add_child()
    kid = family.child_client(child)
    family.parent.get("/api/rewards/setup")  # example rules: a star for each lesson completed
    made = kid.post("/api/planner/i-did", json={"title": "  Built a marble run ", "subject": "Design and Technology", "note": "It has three turns"})
    assert made.status_code == 201, made.text
    entry = made.json()
    assert (entry["lesson"]["title"], entry["added_by_child"], entry["is_complete"], entry["completed_note"]) == ("Built a marble run", True, False, "It has three turns")

    # The child can't tick it off themselves, so no stars yet.
    assert kid.patch(f"/api/planner/{entry['id']}/complete").status_code == 403
    assert kid.get("/api/rewards/me").json()["available"] == 0

    # The grown-up OKs it by ticking it done. Now it counts.
    ok = family.parent.patch(f"/api/planner/{entry['id']}/complete")
    assert ok.status_code == 200 and ok.json()["is_complete"] is True and ok.json()["added_by_child"] is True
    assert kid.get("/api/rewards/me").json()["available"] == 1
    today = date.today().isoformat()
    report = family.parent.get("/api/council-report/", params={"child_id": child["id"], "start_date": today, "end_date": today}).json()
    assert [s["subject"] for s in report["subjects"]] == ["Design and Technology"]


def test_i_did_this_is_for_children_and_has_a_limit(family):
    child = family.add_child()
    kid = family.child_client(child)
    assert family.parent.post("/api/planner/i-did", json={"title": "Parents use the log instead"}).status_code == 403
    assert kid.post("/api/planner/i-did", json={"title": " "}).status_code == 400
    plain = kid.post("/api/planner/i-did", json={"title": "Read under the duvet"}).json()
    assert plain["lesson"]["subject"] == "My own learning"
    for n in range(4):
        assert kid.post("/api/planner/i-did", json={"title": f"Thing {n}"}).status_code == 201
    assert kid.post("/api/planner/i-did", json={"title": "One too many"}).status_code == 400
    # Once a grown-up has dealt with one, there is room again.
    assert family.parent.delete(f"/api/planner/{plain['id']}").status_code == 204
    assert kid.post("/api/planner/i-did", json={"title": "Room for this"}).status_code == 201
