"""Totals for the owner's own dashboard: counts only, and only with the secret key."""
import json

from conftest import new_client


def _with_key(key="board-key-for-tests"):
    from config import settings

    real = settings.OWNER_NUMBERS_KEY
    settings.OWNER_NUMBERS_KEY = key

    def restore():
        settings.OWNER_NUMBERS_KEY = real

    return key, restore


def test_the_address_does_not_exist_until_a_key_is_set(family):
    assert new_client().get("/api/owner/numbers").status_code == 404
    assert family.parent.get("/api/owner/numbers").status_code == 404


def test_the_wrong_key_or_no_key_is_refused(family):
    key, restore = _with_key()
    try:
        client = new_client()
        assert client.get("/api/owner/numbers").status_code == 401
        assert client.get("/api/owner/numbers", headers={"Authorization": "Bearer nope"}).status_code == 401
        assert client.get("/api/owner/numbers", headers={"Authorization": key}).status_code == 401
        # Being signed in as a parent is not enough either.
        assert family.parent.get("/api/owner/numbers").status_code == 401
    finally:
        restore()


def test_the_right_key_gets_counts_and_nothing_personal(family):
    child = family.add_child("Counted Child")
    key, restore = _with_key()
    try:
        client = new_client()
        before = client.get("/api/owner/numbers", headers={"Authorization": f"Bearer {key}"})
        assert before.status_code == 200
        data = before.json()
        assert set(data) == {
            "families", "members", "on_trial", "free_accounts", "trial_ended", "cancelled",
            "new_families_7_days", "children", "newsletter_subscribers", "as_of",
        }
        assert all(isinstance(v, int) for k, v in data.items() if k != "as_of")
        assert data["families"] >= 1 and data["children"] >= 1 and data["on_trial"] >= 1 and data["new_families_7_days"] >= 1
        text = json.dumps(data)
        for private in (family.email, child["username"], "Counted Child"):
            assert private not in text

        from conftest import sign_up

        sign_up("Another")
        after = client.get("/api/owner/numbers", headers={"Authorization": f"Bearer {key}"}).json()
        assert after["families"] == data["families"] + 1 and after["on_trial"] == data["on_trial"] + 1
    finally:
        restore()
