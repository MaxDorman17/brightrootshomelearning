"""The demo family: anyone can look round it, nobody can use it to reach real people, and it rebuilds itself."""
import pytest

import demo
import emails
from config import settings
from conftest import PASSWORD, new_client, try_login
from models import PlannerEntry, ReadingLog, User


@pytest.fixture
def demo_on(monkeypatch, db):
    monkeypatch.setattr(settings, "DEMO_ENABLED", True)
    demo.reset(db)
    yield
    demo._remove(db)
    db.commit()


def demo_client(child_id=None):
    client = new_client()
    response = client.post("/api/auth/demo", json={"child_id": child_id} if child_id else {})
    assert response.status_code == 200, response.text
    token = response.cookies.get("brightroots_session")
    client.cookies.clear()
    client.headers["Authorization"] = "Bearer " + token
    return client


def test_the_demo_is_hidden_unless_switched_on(monkeypatch):
    monkeypatch.setattr(settings, "DEMO_ENABLED", False)
    assert new_client().get("/api/auth/demo").json() == {"enabled": False, "children": []}
    assert new_client().post("/api/auth/demo", json={}).status_code == 404


def test_visitors_log_in_as_the_grown_up_or_a_child_without_a_password(demo_on):
    info = new_client().get("/api/auth/demo").json()
    assert info["enabled"] is True
    assert [c["name"] for c in info["children"]] == ["Ruby", "Sam"]

    parent = demo_client()
    me = parent.get("/api/auth/me").json()
    assert me["role"] == "parent" and me["is_demo"] is True
    assert len(parent.get("/api/children/").json()) == 2
    assert parent.get("/api/planner/all").status_code == 200

    ruby = demo_client(info["children"][0]["id"])
    assert ruby.get("/api/auth/me").json()["username"] == "Ruby"


def test_the_family_has_progress_to_show(demo_on, db):
    parent = demo.demo_parent(db)
    kids = db.query(User).filter(User.parent_id == parent.id).all()
    entries = db.query(PlannerEntry).filter(PlannerEntry.assigned_to.in_([k.id for k in kids])).all()
    assert any(e.is_complete for e in entries) and any(not e.is_complete for e in entries)
    assert db.query(ReadingLog).filter(ReadingLog.added_by == parent.id).count() == 5


def test_nobody_can_log_in_to_the_demo_with_a_password(demo_on):
    assert try_login(demo.PARENT_EMAIL, PASSWORD).status_code == 401


def test_demo_visitors_cannot_reach_real_people_or_change_logins(demo_on):
    parent = demo_client()
    refused = [
        parent.post("/api/auth/change-password", json={"current_password": "x", "new_password": "y" * 12}),
        parent.post("/api/account/delete", json={"password": "x", "confirm": "DELETE"}),
        parent.post("/api/billing/checkout", json={"plan": "monthly"}),
        parent.post("/api/children/", json={"username": "New", "password": PASSWORD}),
        parent.post("/api/family/adults", json={"username": "Gran", "email": "gran@example.test"}),
        parent.put("/api/reminders/summary", json={"time": "18:00"}),
        parent.post("/api/support/messages", json={"message": "hi"}),
        parent.post("/api/profile/photo", files={"file": ("a.png", b"\x89PNG\r\n\x1a\n", "image/png")}),
    ]
    for response in refused:
        assert response.status_code == 403, response.text
        assert "demo family" in response.json()["detail"]


def test_demo_visitors_can_still_use_the_site(demo_on):
    parent = demo_client()
    lesson = parent.post("/api/lessons/", json={"title": "Volcanoes", "subject": "Geography"})
    assert lesson.status_code == 201, lesson.text


def test_real_families_are_not_affected(family):
    response = family.parent.post("/api/children/", json={"username": "Kid", "password": PASSWORD})
    assert response.status_code == 201


def test_rebuilding_wipes_what_visitors_changed(demo_on, db):
    parent = demo_client()
    parent.post("/api/lessons/", json={"title": "Visitor lesson", "subject": "Maths"})
    demo.reset(db)
    assert demo_client().get("/api/lessons/").status_code == 200
    from models import Lesson
    assert db.query(Lesson).filter(Lesson.title == "Visitor lesson").count() == 0
    assert db.query(User).filter(User.is_demo.is_(True)).count() == 3


def test_made_up_addresses_are_never_emailed(monkeypatch):
    sent = []
    monkeypatch.setattr(emails.httpx, "post", lambda *a, **k: sent.append(a))
    emails.send(demo.PARENT_EMAIL, "Hello", "<p>Hi</p>")
    assert sent == []
