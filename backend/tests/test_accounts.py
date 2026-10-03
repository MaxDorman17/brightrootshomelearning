"""Signing up, logging in, children, extra grown-ups and deleting an account."""
from datetime import datetime

from conftest import PASSWORD, login, new_client, sign_up, try_login
from models import User


# ---------- signing up and logging in ----------

def test_sign_up_and_log_in_with_email(family):
    me = family.parent.get("/api/auth/me").json()
    assert me["role"] == "parent"
    assert me["username"] == "Parent"
    assert me["login_name"] == family.email
    assert me["is_owner"] is True


def test_login_is_not_case_sensitive(family):
    assert try_login(family.email.upper()).status_code == 200


def test_wrong_password_is_refused(family):
    assert try_login(family.email, "not-the-password").status_code == 401


def test_two_families_can_share_a_name_but_not_an_email(family):
    other = sign_up(name=family.name)
    assert other.parent.get("/api/auth/me").json()["username"] == family.name
    again = new_client().post("/api/auth/register", json={"email": family.email, "username": "Someone", "password": PASSWORD})
    assert again.status_code == 400


def test_logged_out_visitors_are_refused():
    assert new_client().get("/api/children/").status_code == 401
    assert new_client().get("/api/planner/today").status_code == 401


def test_api_docs_are_only_for_local_runs():
    # The tests run with a localhost FRONTEND_URL, where the docs are switched on.
    assert new_client().get("/docs").status_code == 200


# ---------- children ----------

def test_add_child_gets_a_login_name(family):
    child = family.add_child("Oscar")
    assert child["username"] == "Oscar"
    assert child["login_name"]
    assert family.child_client(child).get("/api/auth/me").json()["role"] == "child"


def test_same_child_name_in_two_families_gets_different_logins(family):
    first = family.add_child("Rosalind")
    second = sign_up().add_child("Rosalind")
    assert first["username"] == second["username"] == "Rosalind"
    assert first["login_name"].lower() != second["login_name"].lower()
    assert try_login(first["login_name"]).status_code == 200
    assert try_login(second["login_name"]).status_code == 200


def test_taken_login_name_is_refused_with_suggestions(family):
    family.add_child("Wilfred", login_name="wilfred.test")
    check = family.parent.get("/api/children/login-name", params={"name": "Wilfred", "login_name": "WILFRED.test"}).json()
    assert check["available"] is False
    assert check["suggestions"]
    refused = family.parent.post("/api/children/", json={"username": "Wilfred", "password": PASSWORD, "login_name": "wilfred.test"})
    assert refused.status_code == 400
    assert "Try one of these" in refused.json()["detail"]


def test_edit_child_name_login_and_activities(family):
    child = family.add_child("Tomas")
    updated = family.parent.put(
        f"/api/children/{child['id']}",
        json={"username": "Thomas", "login_name": "thomas.edited", "activity_level": "teen"},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["username"] == "Thomas"
    assert updated.json()["login_name"] == "thomas.edited"
    assert updated.json()["activity_level"] == "teen"
    assert try_login(child["login_name"]).status_code == 401  # the old login name no longer works
    assert login("thomas.edited").get("/api/auth/me").json()["activity_levels"] == ["teen"]


def test_edit_child_rejects_taken_login_and_bad_level(family):
    first = family.add_child("Ada", login_name="ada.first")
    second = family.add_child("Bea", login_name="bea.second")
    assert family.parent.put(f"/api/children/{second['id']}", json={"login_name": "ada.first"}).status_code == 400
    assert family.parent.put(f"/api/children/{first['id']}", json={"activity_level": "toddler"}).status_code == 400
    # Saving a child's own login name back unchanged is fine.
    assert family.parent.put(f"/api/children/{first['id']}", json={"login_name": "ada.first"}).status_code == 200


def test_parent_sees_the_mix_of_their_childrens_activity_levels(family):
    assert family.parent.get("/api/auth/me").json()["activity_levels"] == ["both"]
    family.add_child("Little", activity_level="young")
    assert family.parent.get("/api/auth/me").json()["activity_levels"] == ["young"]
    family.add_child("Big", activity_level="teen")
    assert family.parent.get("/api/auth/me").json()["activity_levels"] == ["teen", "young"]


def test_a_parent_cannot_edit_another_familys_child(family):
    child = sign_up().add_child("NotYours")
    assert family.parent.put(f"/api/children/{child['id']}", json={"username": "Mine"}).status_code == 404
    assert family.parent.delete(f"/api/children/{child['id']}").status_code == 404


def test_children_cannot_use_parent_pages(family):
    kid = family.child_client(family.add_child())
    assert kid.get("/api/children/").status_code == 403
    assert kid.post("/api/children/", json={"username": "Sneaky", "password": PASSWORD}).status_code == 403


# ---------- more than one grown-up ----------

def add_grown_up(family, name="Charlotte", relationship="Mum"):
    email = f"{name.lower()}.{family.email}"
    response = family.parent.post(
        "/api/family/adults", json={"name": name, "email": email, "password": PASSWORD, "relationship": relationship}
    )
    assert response.status_code == 201, response.text
    return email, response.json()


def test_second_grown_up_shares_the_family(family):
    child = family.add_child("Shared")
    email, adult = add_grown_up(family)
    assert adult["login_name"] == email
    mum = login(email)
    me = mum.get("/api/auth/me").json()
    assert me["username"] == "Charlotte" and me["role"] == "parent" and me["is_owner"] is False
    assert [c["id"] for c in mum.get("/api/children/").json()] == [child["id"]]
    # A lesson she adds belongs to the family.
    assert mum.post("/api/lessons/", json={"title": "Mum's lesson", "subject": "Art"}).status_code == 201
    assert any(l["title"] == "Mum's lesson" for l in family.parent.get("/api/lessons/").json())


def test_second_grown_up_cannot_do_owner_only_things(family):
    email, adult = add_grown_up(family)
    mum = login(email)
    assert mum.post("/api/family/adults", json={"name": "Nan", "email": "nan." + family.email, "password": PASSWORD}).status_code == 403
    assert mum.delete(f"/api/family/adults/{adult['id']}").status_code == 403
    assert mum.post("/api/billing/checkout", json={"plan": "monthly"}).status_code == 403
    assert mum.post("/api/account/delete", json={"password": PASSWORD, "confirm": "DELETE"}).status_code == 403


def test_grown_ups_have_their_own_password(family):
    email, _ = add_grown_up(family)
    mum = login(email)
    changed = mum.post("/api/auth/change-password", json={"current_password": PASSWORD, "new_password": PASSWORD + "-new"})
    assert changed.status_code == 200, changed.text
    assert try_login(email, PASSWORD + "-new").status_code == 200
    assert try_login(family.email).status_code == 200  # the main parent's password is untouched


def test_an_email_can_only_be_used_once(family):
    email, _ = add_grown_up(family)
    other = sign_up()
    assert other.parent.post("/api/family/adults", json={"name": "Copy", "email": email, "password": PASSWORD}).status_code == 400
    assert other.parent.post("/api/family/adults", json={"name": "Copy", "email": family.email, "password": PASSWORD}).status_code == 400


def test_removing_a_grown_up_stops_their_login(family):
    email, adult = add_grown_up(family)
    session = login(email)
    assert family.parent.delete(f"/api/family/adults/{adult['id']}").status_code == 204
    assert try_login(email).status_code == 401
    assert session.get("/api/auth/me").status_code == 401


def test_newsletter_tick_only_invites(family, db):
    email = "invited." + family.email
    family.parent.post("/api/family/adults", json={"name": "Invited", "email": email, "password": PASSWORD, "newsletter": True})
    from models import NewsletterSubscriber

    row = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email).one()
    assert row.status == "pending"  # not subscribed until they confirm by email themselves


# ---------- memberships and deleting ----------

def _end_trial(db, email):
    user = db.query(User).filter(User.email == email).one()
    user.trial_ends_at = datetime(2020, 1, 1)
    db.commit()


def test_expired_trial_blocks_the_app_but_not_data_rights(family, db):
    family.add_child()
    _end_trial(db, family.email)
    parent = login(family.email)
    assert parent.get("/api/children/").status_code == 402
    assert parent.get("/api/account/export").status_code == 200


def test_delete_account_removes_the_whole_family_and_nobody_else(family, db):
    keep = sign_up()
    keep_child = keep.add_child("Stays")
    child = family.add_child("Goes")
    email, _ = add_grown_up(family)
    _end_trial(db, family.email)  # deleting must work even without a membership
    parent = login(family.email)
    assert parent.post("/api/account/delete", json={"password": "wrong-password", "confirm": "DELETE"}).status_code == 400
    assert parent.post("/api/account/delete", json={"password": PASSWORD, "confirm": "nope"}).status_code == 400
    assert parent.post("/api/account/delete", json={"password": PASSWORD, "confirm": "DELETE"}).status_code == 204
    for gone in (family.email, email, child["login_name"]):
        assert try_login(gone).status_code == 401
    assert try_login(keep.email).status_code == 200
    assert try_login(keep_child["login_name"]).status_code == 200


def test_unverified_parent_can_still_delete():
    unverified = sign_up(verified=False)
    assert unverified.parent.post("/api/account/delete", json={"password": PASSWORD, "confirm": "DELETE"}).status_code == 204


def test_new_families_get_a_fourteen_day_trial(db):
    family = sign_up()
    user = db.query(User).filter(User.email == family.email).one()
    days = (user.trial_ends_at - user.created_at).total_seconds() / 86400
    assert 13.9 < days < 14.1
