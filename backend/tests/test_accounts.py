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


# ---------- emails ----------

def _capture_emails():
    """Collect emails instead of sending them; returns the list and a function that puts things back."""
    import emails

    sent, real_send, real_configured = [], emails.send, emails.configured
    emails.send = lambda to, subject, body, unsubscribe_url=None: sent.append((to, subject, body))
    emails.configured = lambda: True
    return sent, lambda: (setattr(emails, "send", real_send), setattr(emails, "configured", real_configured))


def test_sign_up_sends_a_welcome_then_a_getting_started_email(db):
    import re
    sent, undo = _capture_emails()
    try:
        response = new_client().post("/api/auth/register", json={"email": "welcome@example.test", "username": "Wendy", "password": PASSWORD})
        assert response.status_code == 201
        assert len(sent) == 1
        to, subject, body = sent[0]
        assert to == "welcome@example.test" and subject.startswith("Welcome to Bright Roots")
        assert "Hi Wendy" in body and "14-day free trial" in body and "Confirm my email" in body
        token = re.search(r"/verify-email#token=([^\"]+)", body).group(1)
        assert new_client().post("/api/auth/verify-email", json={"token": token}).status_code == 200
        assert len(sent) == 2 and sent[1][1].startswith("You're in")
        # Clicking the link a second time doesn't send it again.
        assert new_client().post("/api/auth/verify-email", json={"token": token}).status_code == 200
        assert len(sent) == 2
    finally:
        undo()


def test_daily_summary_is_skipped_when_there_is_nothing_to_say(family, db):
    from datetime import date
    from routers.reminders import _summary

    child = family.add_child("Quiet")
    parent = db.query(User).filter(User.email == family.email).one()
    page, worth_sending = _summary(db, parent, date.today())
    assert not worth_sending  # nothing planned and nothing done, like a weekend
    lesson = family.parent.post("/api/lessons/", json={"title": "Fractions", "subject": "Maths"}).json()
    family.parent.post("/api/planner/", json={"lesson_id": lesson["id"], "scheduled_date": date.today().isoformat(), "assigned_to": child["id"]})
    page, worth_sending = _summary(db, parent, date.today())
    assert worth_sending and "Quiet" in page and "0 of 1" in page
    # A day off with nothing done is skipped too.
    family.parent.post("/api/days-off/", json={"date": date.today().isoformat(), "reason": "Holiday"})
    db.expire_all()
    assert not _summary(db, parent, date.today())[1]


def test_owner_can_see_who_is_on_the_newsletter_list(db):
    import os
    from config import settings

    new_client().post("/api/auth/register", json={"email": "owner@example.test", "username": "Owner", "password": PASSWORD, "newsletter": True})
    new_client().post("/api/auth/register", json={"email": "reader@example.test", "username": "Reader", "password": PASSWORD, "newsletter": True})
    for user in db.query(User).filter(User.email.in_(["owner@example.test", "reader@example.test"])):
        user.email_verified_at = user.created_at if user.email == "reader@example.test" else None
        user.onboarding_completed_at = user.created_at
    db.query(User).filter(User.email == "owner@example.test").one().email_verified_at = datetime.utcnow()
    reader = db.query(User).filter(User.email == "reader@example.test").one()
    reader.email_verified_at = None
    db.commit()
    real = settings.ADMIN_EMAILS
    settings.ADMIN_EMAILS = "owner@example.test"
    try:
        overview = login("owner@example.test").get("/api/newsletter/admin")
        assert overview.status_code == 200, overview.text
        people = {s["email"]: s for s in overview.json()["subscribers"]}
        assert people["owner@example.test"]["status"] == "subscribed" and people["owner@example.test"]["name"] == "Owner"
        assert people["reader@example.test"]["status"] == "unverified"  # ticked the box, but email not confirmed
        assert login("reader@example.test").get("/api/newsletter/admin").status_code == 403
        # The owner can take someone off the list; their account stays.
        owner = login("owner@example.test")
        reader_row = people["reader@example.test"]["id"]
        assert login("reader@example.test").delete(f"/api/newsletter/admin/subscribers/{reader_row}").status_code == 403
        assert owner.delete(f"/api/newsletter/admin/subscribers/{reader_row}").status_code == 204
        assert "reader@example.test" not in {s["email"] for s in owner.get("/api/newsletter/admin").json()["subscribers"]}
        assert owner.delete(f"/api/newsletter/admin/subscribers/{reader_row}").status_code == 404
        assert try_login("reader@example.test").status_code == 200
    finally:
        settings.ADMIN_EMAILS = real


def test_emails_carry_the_logo_and_newsletters_do_not_repeat_their_title():
    import emails
    from routers.newsletter import _newsletter_html

    page = _newsletter_html("A little update", "# A little update\n\nHello families,\n\n## What's new\n\n- One thing", "https://example.test/unsub")
    assert page.count("A little update") == 2  # the page title and the heading, not a third copy from the body
    assert "Hello families" in page and "What&#x27;s new" in page
    assert f"cid:{emails.LOGO_CID}" in page
    assert "data:image/png;base64," in emails.for_browser(page) and "cid:" not in emails.for_browser(page)

    posted = {}
    real_post = emails.httpx.post

    class Ok:
        def raise_for_status(self):
            pass

    emails.httpx.post = lambda url, **kw: posted.update(kw["json"]) or Ok()
    try:
        emails.send("someone@example.test", "Hello", page)
    finally:
        emails.httpx.post = real_post
    attachment = posted["attachments"][0]
    assert attachment["content_id"] == emails.LOGO_CID and len(attachment["content"]) > 1000


def test_newsletter_subject_drops_a_heading_mark():
    from routers.newsletter import DraftIn

    assert DraftIn(subject="# A little update", body="Hello").subject == "A little update"
    assert DraftIn(subject="## Autumn news ", body="Hello").subject == "Autumn news"


def test_every_email_has_a_plain_text_copy():
    import emails

    subject, page = emails.welcome_email("Wendy", "https://example.test/verify-email#token=abc", 14)
    text = emails.plain_text(page)
    assert "<" not in text and "Hi Wendy," in text
    assert "Confirm my email (https://example.test/verify-email#token=abc)" in text
    assert "Add your children" in text and "One click to confirm" not in text  # the hidden preview line is left out


# ---------- help and feedback ----------

def test_parent_can_send_a_message_and_a_review(family, db):
    from config import settings

    sent = []
    import emails
    real_send, real_configured = emails.send, emails.configured
    emails.send = lambda to, subject, body, unsubscribe_url=None, reply_to=None: sent.append((to, subject, body, reply_to))
    emails.configured = lambda: True
    try:
        problem = family.parent.post("/api/support/messages", json={"kind": "problem", "message": "The planner won't load on my phone", "page": "/parent"})
        assert problem.status_code == 201 and problem.json()["emailed"] is True
        review = family.parent.post("/api/support/messages", json={"kind": "review", "message": "We love it, thank you!", "rating": 5, "can_publish": True, "display_name": "Sam, mum of two"})
        assert review.status_code == 201
    finally:
        emails.send, emails.configured = real_send, real_configured
    assert sent[0][0] == settings.SUPPORT_EMAIL and sent[0][3] == family.email  # replying goes straight to the parent
    assert "A problem from" in sent[0][1] and "planner won" in sent[0][2]
    assert "Sam, mum of two" in sent[1][2]

    assert family.parent.post("/api/support/messages", json={"kind": "moan", "message": "Hello there"}).status_code == 422
    assert family.parent.post("/api/support/messages", json={"kind": "review", "message": "Great site", "rating": 9}).status_code == 422
    assert family.parent.post("/api/support/messages", json={"kind": "problem", "message": "Hi"}).status_code == 422
    child = family.add_child()
    assert family.child_client(child).post("/api/support/messages", json={"kind": "problem", "message": "Something broke"}).status_code == 403
    # Only the owner can read what families sent.
    assert family.parent.get("/api/support/messages").status_code == 403
    real_admins = settings.ADMIN_EMAILS
    settings.ADMIN_EMAILS = family.email
    try:
        listed = family.parent.get("/api/support/messages").json()
        assert [m["kind"] for m in listed[:2]] == ["review", "problem"] and listed[0]["rating"] == 5 and listed[0]["can_publish"] is True
        assert listed[1]["from_email"] == family.email
        assert family.parent.delete(f"/api/support/messages/{listed[1]['id']}").status_code == 204
        assert len(family.parent.get("/api/support/messages").json()) == len(listed) - 1
    finally:
        settings.ADMIN_EMAILS = real_admins


def test_messages_are_kept_even_when_email_is_off(family):
    sent = family.parent.post("/api/support/messages", json={"kind": "suggestion", "message": "A dark mode would be lovely"})
    assert sent.status_code == 201 and sent.json()["emailed"] is False


def test_a_family_can_have_up_to_ten_children(family):
    for n in range(10):
        family.add_child(f"Child{n}")
    eleventh = family.parent.post("/api/children/", json={"username": "Eleven", "password": PASSWORD})
    assert eleventh.status_code == 400 and "up to 10 children" in eleventh.json()["detail"]
    # Removing one makes room again.
    first = family.parent.get("/api/children/").json()[0]
    assert family.parent.delete(f"/api/children/{first['id']}").status_code in (200, 204)
    assert family.parent.post("/api/children/", json={"username": "Eleven", "password": PASSWORD}).status_code == 201


def test_newsletter_confirmation_carries_an_unsubscribe_link():
    import emails
    from routers import newsletter

    sent = []
    real_send, real_configured = emails.send, newsletter._email_configured
    emails.send = lambda to, subject, body, unsubscribe_url=None, reply_to=None: sent.append((to, unsubscribe_url))
    newsletter._email_configured = lambda: True
    try:
        assert new_client().post("/api/newsletter/subscribe", json={"email": "curious@example.test"}).status_code == 200
    finally:
        emails.send, newsletter._email_configured = real_send, real_configured
    assert sent and sent[0][0] == "curious@example.test" and "/newsletter/unsubscribe#token=" in sent[0][1]
