"""Asking a family how it is going, a couple of weeks after they joined."""
from datetime import datetime, timedelta

from models import User


def joined(db, family, days_ago: int) -> None:
    user = db.query(User).filter(User.email == family.email).one()
    user.email_verified_at = datetime.utcnow() - timedelta(days=days_ago)
    db.commit()


def test_new_families_are_not_asked(family, db):
    joined(db, family, 3)
    assert family.parent.get("/api/support/review-prompt").json() == {"show": False}


def test_asked_after_two_weeks_until_they_answer(family, db):
    joined(db, family, 15)
    assert family.parent.get("/api/support/review-prompt").json() == {"show": True}
    # A problem report isn't an answer.
    family.parent.post("/api/support/messages", json={"kind": "problem", "message": "The planner was slow today"})
    assert family.parent.get("/api/support/review-prompt").json() == {"show": True}
    sent = family.parent.post("/api/support/messages", json={"kind": "review", "message": "It keeps us organised", "rating": 5, "can_publish": False})
    assert sent.status_code == 201, sent.text
    assert family.parent.get("/api/support/review-prompt").json() == {"show": False}


def test_children_are_never_asked(family, db):
    joined(db, family, 30)
    kid = family.child_client(family.add_child())
    assert kid.get("/api/support/review-prompt").status_code == 403
