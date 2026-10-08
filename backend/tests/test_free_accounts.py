"""The owner can give a family a free account, and take it away again."""
import pytest

from config import settings
from conftest import sign_up
from models import User


@pytest.fixture
def owner(monkeypatch):
    family = sign_up("Owner")
    monkeypatch.setattr(settings, "ADMIN_EMAILS", family.email)
    return family


def status(db, email):
    db.expire_all()
    return db.query(User).filter(User.email == email).one().subscription_status


def test_the_owner_gives_and_takes_away_a_free_account(owner, db):
    friend = sign_up("Friend")
    response = owner.parent.post("/api/admin/free-accounts", json={"email": friend.email.upper()})
    assert response.status_code == 200, response.text
    assert status(db, friend.email) == "grandfathered"
    assert friend.parent.get("/api/auth/me").json()["subscription_status"] == "grandfathered"
    assert [f["email"] for f in owner.parent.get("/api/admin/free-accounts").json()] == [friend.email]

    assert owner.parent.delete(f"/api/admin/free-accounts/{response.json()['id']}").status_code == 200
    assert status(db, friend.email) == "trialing"
    assert owner.parent.get("/api/admin/free-accounts").json() == []


def test_an_unknown_email_gets_a_helpful_message(owner):
    response = owner.parent.post("/api/admin/free-accounts", json={"email": "nobody@example.test"})
    assert response.status_code == 404
    assert "sign up first" in response.json()["detail"]


def test_a_paying_family_must_be_cancelled_in_stripe_first(owner, db):
    friend = sign_up("Payer")
    user = db.query(User).filter(User.email == friend.email).one()
    user.subscription_status, user.stripe_subscription_id = "active", "sub_123"
    db.commit()
    response = owner.parent.post("/api/admin/free-accounts", json={"email": friend.email})
    assert response.status_code == 400 and "Stripe" in response.json()["detail"]
    assert status(db, friend.email) == "active"


def test_only_the_owner_can_do_it(family):
    other = sign_up("Other")
    assert family.parent.post("/api/admin/free-accounts", json={"email": other.email}).status_code == 403
    assert family.parent.get("/api/admin/free-accounts").status_code == 403
