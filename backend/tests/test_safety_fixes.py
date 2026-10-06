"""Deleting tidies up after itself, and sign-up and log-in refuse what they should."""
from datetime import date

from conftest import PASSWORD, login, new_client, sign_up, try_login

import routers.auth as auth_routes
from config import settings
from models import PlannerCompletion, PlannerEntry, StarAward, TestResult, User


def planned(family, child_id=None, title="Fractions"):
    lesson = family.parent.post("/api/lessons/", json={"title": title, "subject": "Maths"}).json()
    body = {"lesson_id": lesson["id"], "scheduled_date": date.today().isoformat()}
    if child_id is not None:
        body["assigned_to"] = child_id
    entry = family.parent.post("/api/planner/", json=body)
    assert entry.status_code == 201, entry.text
    return entry.json()


def test_deleting_a_lesson_takes_it_out_of_the_planner_but_keeps_its_score(family, db):
    child = family.add_child()
    entry = planned(family, child["id"])
    assert family.child_client(child).patch(f"/api/planner/{entry['id']}/complete").status_code == 200
    family.parent.put(f"/api/test-results/lesson/{entry['id']}", json={"child_id": child["id"], "score": 8, "total": 10})

    assert family.parent.delete(f"/api/lessons/{entry['lesson_id']}").status_code == 204

    assert family.parent.get("/api/planner/all").json() == []
    assert db.query(PlannerEntry).filter(PlannerEntry.id == entry["id"]).count() == 0
    assert db.query(PlannerCompletion).filter(PlannerCompletion.entry_id == entry["id"]).count() == 0
    # The score stays in Results, no longer tied to a planner slot.
    kept = db.query(TestResult).filter(TestResult.child_id == child["id"]).one()
    assert kept.entry_id is None and kept.score == 8


def test_deleting_a_planner_slot_takes_its_tick_with_it(family, db):
    child = family.add_child()
    entry = planned(family, child["id"])
    family.child_client(child).patch(f"/api/planner/{entry['id']}/complete")
    assert family.parent.delete(f"/api/planner/{entry['id']}").status_code == 204
    assert db.query(PlannerCompletion).filter(PlannerCompletion.entry_id == entry["id"]).count() == 0
    # The lesson itself stays in the family's library.
    assert [l["id"] for l in family.parent.get("/api/lessons/").json()] == [entry["lesson_id"]]


def test_removing_a_child_removes_everything_of_theirs(family, db):
    going = family.add_child("Going")
    staying = family.add_child("Staying")
    theirs = planned(family, going["id"], "Theirs")
    shared = planned(family, None, "Shared")
    siblings = planned(family, staying["id"], "Sibling's")
    family.child_client(going).patch(f"/api/planner/{theirs['id']}/complete")
    family.child_client(going).patch(f"/api/planner/{shared['id']}/complete")
    family.child_client(staying).patch(f"/api/planner/{shared['id']}/complete")
    family.parent.put(f"/api/test-results/lesson/{theirs['id']}", json={"child_id": going["id"], "score": 5, "total": 10})
    family.parent.put(f"/api/test-results/lesson/{siblings['id']}", json={"child_id": staying["id"], "score": 7, "total": 10})
    family.parent.put("/api/timetable/", params={"child_id": going["id"]}, json={"config": {"Monday": ["Art"]}})

    assert family.parent.delete(f"/api/children/{going['id']}").status_code == 204

    assert db.query(User).filter(User.id == going["id"]).count() == 0
    assert db.query(PlannerEntry).filter(PlannerEntry.assigned_to == going["id"]).count() == 0
    assert db.query(PlannerCompletion).filter(PlannerCompletion.user_id == going["id"]).count() == 0
    assert db.query(TestResult).filter(TestResult.child_id == going["id"]).count() == 0
    assert db.query(StarAward).filter(StarAward.child_id == going["id"]).count() == 0
    assert family.parent.get("/api/timetable/children").json() == {}
    assert try_login(going["login_name"]).status_code == 401

    # Nothing of the other child's, or the family's, has gone.
    assert [c["id"] for c in family.parent.get("/api/children/").json()] == [staying["id"]]
    assert sorted(e["id"] for e in family.parent.get("/api/planner/all").json()) == sorted([shared["id"], siblings["id"]])
    assert db.query(PlannerCompletion).filter(PlannerCompletion.user_id == staying["id"]).count() == 1
    assert db.query(TestResult).filter(TestResult.child_id == staying["id"]).one().score == 7
    assert len(family.parent.get("/api/lessons/").json()) == 3
    assert family.parent.get("/api/auth/me").status_code == 200


def test_another_familys_child_cannot_be_removed(family):
    other = sign_up("Other")
    child = other.add_child()
    assert family.parent.delete(f"/api/children/{child['id']}").status_code == 404
    assert [c["id"] for c in other.parent.get("/api/children/").json()] == [child["id"]]


def test_the_site_owner_must_have_confirmed_their_email(db):
    real_admins = settings.ADMIN_EMAILS
    stranger = sign_up("Stranger", verified=False)
    settings.ADMIN_EMAILS = stranger.email
    try:
        assert stranger.parent.get("/api/auth/me").json().get("is_admin") in (False, None)
        assert stranger.parent.get("/api/support/messages").status_code in (401, 403)
        user = db.query(User).filter(User.email == stranger.email).one()
        user.email_verified_at = user.created_at
        user.onboarding_completed_at = user.created_at
        db.commit()
        assert stranger.parent.get("/api/support/messages").status_code == 200
    finally:
        settings.ADMIN_EMAILS = real_admins


def test_a_very_long_password_works():
    long_password = "correct horse battery staple " * 5  # well over 72 characters
    email = "longpass@example.test"
    made = new_client().post("/api/auth/register", json={"email": email, "username": "Long", "password": long_password})
    assert made.status_code == 201, made.text
    assert try_login(email, long_password).status_code == 200
    assert try_login(email, "wrong " + long_password).status_code == 401
    assert try_login(email, "x" * 500).status_code == 401


def test_sign_up_needs_a_real_looking_email():
    for bad in ["not an email", "a@b", "@example.test", "two@@example.test", "x" * 300 + "@example.test"]:
        response = new_client().post("/api/auth/register", json={"email": bad, "username": "Parent", "password": PASSWORD})
        assert response.status_code == 400, bad
        assert "email address" in response.json()["detail"]


def test_sign_ups_from_one_place_are_limited():
    real_limit = auth_routes.MAX_SIGNUPS_PER_IP
    auth_routes.MAX_SIGNUPS_PER_IP = 2
    auth_routes._signups_by_ip.clear()
    try:
        codes = [
            new_client().post("/api/auth/register", json={"email": f"flood{n}@example.test", "username": "Flood", "password": PASSWORD}).status_code
            for n in range(3)
        ]
        assert codes == [201, 201, 429]
    finally:
        auth_routes.MAX_SIGNUPS_PER_IP = real_limit
        auth_routes._signups_by_ip.clear()


def test_an_emailed_link_is_not_a_login(family, db):
    user = db.query(User).filter(User.email == family.email).one()
    for token in (auth_routes._create_email_verification_token(user), auth_routes._create_password_reset_token(user)):
        client = new_client()
        client.headers["Authorization"] = "Bearer " + token
        assert client.get("/api/auth/me").status_code == 401


def test_login_does_not_hand_the_pass_to_the_page(family):
    response = try_login(family.email)
    assert response.status_code == 200
    assert "access_token" not in response.json() and "token" not in response.text.lower()
    assert "httponly" in response.headers["set-cookie"].lower()
    assert login(family.email).get("/api/auth/me").status_code == 200
