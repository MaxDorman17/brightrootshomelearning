"""Nobody can fill the database with junk, or point the server somewhere it shouldn't go."""
from datetime import date, timedelta

from routers.push import is_push_service


def planned(family, child_id, day=None, title="Fractions"):
    lesson = family.parent.post("/api/lessons/", json={"title": title, "subject": "Maths"}).json()
    body = {"lesson_id": lesson["id"], "scheduled_date": (day or date.today()).isoformat(), "assigned_to": child_id}
    entry = family.parent.post("/api/planner/", json=body)
    assert entry.status_code == 201, entry.text
    return entry.json()


def test_a_title_that_is_far_too_long_is_refused(family):
    refused = family.parent.post("/api/lessons/", json={"title": "x" * 5000, "subject": "Maths"})
    assert refused.status_code == 400
    assert "too long" in refused.json()["detail"] and "255" in refused.json()["detail"]
    assert family.parent.get("/api/lessons/").json() == []
    # An ordinary lesson still saves, and so does one with a long web link and long notes.
    fine = family.parent.post("/api/lessons/", json={
        "title": "Fractions", "subject": "Maths",
        "lesson_url": "https://example.test/" + "a" * 900, "description": "word " * 2000,
    })
    assert fine.status_code in (200, 201), fine.text


def test_changing_something_to_be_too_long_is_refused(family):
    lesson = family.parent.post("/api/lessons/", json={"title": "Fractions", "subject": "Maths"}).json()
    assert family.parent.put(f"/api/lessons/{lesson['id']}", json={"title": "y" * 5000}).status_code == 400
    assert family.parent.get("/api/lessons/").json()[0]["title"] == "Fractions"


def test_a_huge_request_is_turned_away(family):
    huge = family.parent.post("/api/lessons/", json={"title": "Fractions", "subject": "Maths", "description": "x" * 1_200_000})
    assert huge.status_code == 413


def test_a_childs_work_link_must_be_a_web_link(family):
    child = family.add_child()
    entry = planned(family, child["id"])
    kid = family.child_client(child)
    url = f"/api/planner/{entry['id']}/submit-work"
    assert kid.patch(url, json={"completed_work_url": "javascript:alert(1)"}).status_code == 422
    assert kid.patch(url, json={"completed_work_url": "my work"}).status_code == 422
    good = kid.patch(url, json={"completed_work_url": " https://docs.example.test/my-work "})
    assert good.status_code == 200 and good.json()["completed_work_url"] == "https://docs.example.test/my-work"


def test_notifications_only_go_to_real_notification_services(family):
    keys = {"p256dh": "k", "auth": "a"}
    for bad in [
        "https://evil.example.test/hook",
        "https://169.254.169.254/latest/meta-data",
        "https://localhost/admin",
        "http://fcm.googleapis.com/fcm/send/abc",
        "https://fcm.googleapis.com.evil.example.test/x",
        "https://user@fcm.googleapis.com/x",
        "https://fcm.googleapis.com:8443/x",
    ]:
        assert not is_push_service(bad), bad
        assert family.parent.post("/api/push/subscribe", json={"endpoint": bad, "keys": keys}).status_code == 422, bad
    for good in [
        "https://fcm.googleapis.com/fcm/send/abc123",
        "https://updates.push.services.mozilla.com/wpush/v2/abc",
        "https://web.push.apple.com/abc",
        "https://db5p.notify.windows.com/w/?token=abc",
    ]:
        assert family.parent.post("/api/push/subscribe", json={"endpoint": good, "keys": keys}).status_code == 200, good


def test_pages_can_ask_for_only_recent_lessons(family):
    child = family.add_child()
    today = date.today()
    old = planned(family, child["id"], today - timedelta(days=400), "Old")
    recent = planned(family, child["id"], today - timedelta(days=3), "Recent")
    coming = planned(family, child["id"], today + timedelta(days=7), "Coming")
    ids = lambda **params: [e["id"] for e in family.parent.get("/api/planner/all", params=params).json()]
    assert ids() == [coming["id"], recent["id"], old["id"]]
    assert ids(since=(today - timedelta(days=60)).isoformat()) == [coming["id"], recent["id"]]
    assert ids(limit=1) == [coming["id"]]
