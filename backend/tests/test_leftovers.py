"""The owner can find and clear data left behind by children removed in the past."""
from datetime import date

from conftest import sign_up

from config import settings
from models import PlannerCompletion, PlannerEntry, TestResult, User


def planned(family, child_id, title):
    lesson = family.parent.post("/api/lessons/", json={"title": title, "subject": "Maths"}).json()
    body = {"lesson_id": lesson["id"], "scheduled_date": date.today().isoformat()}
    if child_id is not None:
        body["assigned_to"] = child_id
    return family.parent.post("/api/planner/", json=body).json()


def test_leftovers_from_a_child_removed_the_old_way_are_found_and_cleared(db):
    owner = sign_up("Owner")
    family = sign_up("Family")
    gone = family.add_child("Gone")
    here = family.add_child("Here")
    theirs = planned(family, gone["id"], "Theirs")
    shared = planned(family, None, "Shared")
    kept = planned(family, here["id"], "Kept")
    family.child_client(gone).patch(f"/api/planner/{theirs['id']}/complete")
    family.child_client(gone).patch(f"/api/planner/{shared['id']}/complete")
    family.child_client(here).patch(f"/api/planner/{shared['id']}/complete")
    family.parent.put(f"/api/test-results/lesson/{theirs['id']}", json={"child_id": gone["id"], "score": 5, "total": 10})
    family.parent.put(f"/api/test-results/lesson/{kept['id']}", json={"child_id": here["id"], "score": 7, "total": 10})

    real_admins = settings.ADMIN_EMAILS
    settings.ADMIN_EMAILS = owner.email
    try:
        assert family.parent.get("/api/backup/leftovers").status_code == 403
        assert owner.parent.get("/api/backup/leftovers").json() == {"total": 0, "tables": {}, "files": 0}

        # How removing a child used to work: only the child's own row went.
        db.query(User).filter(User.id == gone["id"]).delete()
        db.commit()

        found = owner.parent.get("/api/backup/leftovers").json()
        assert found["tables"]["planner_entries"] == 1
        assert found["tables"]["planner_completions"] == 1  # their tick on the shared lesson
        assert found["tables"]["test_results"] == 1
        # Looking changes nothing.
        assert db.query(PlannerEntry).filter(PlannerEntry.assigned_to == gone["id"]).count() == 1

        removed = owner.parent.post("/api/backup/leftovers/remove").json()
        assert removed == found
        assert owner.parent.get("/api/backup/leftovers").json()["total"] == 0
    finally:
        settings.ADMIN_EMAILS = real_admins

    db.expire_all()
    assert db.query(PlannerEntry).filter(PlannerEntry.assigned_to == gone["id"]).count() == 0
    assert db.query(PlannerCompletion).filter(PlannerCompletion.user_id == gone["id"]).count() == 0
    assert db.query(TestResult).filter(TestResult.child_id == gone["id"]).count() == 0
    # The rest of the family is exactly as it was.
    assert sorted(e["id"] for e in family.parent.get("/api/planner/all").json()) == sorted([shared["id"], kept["id"]])
    assert db.query(PlannerCompletion).filter(PlannerCompletion.user_id == here["id"]).count() == 1
    assert db.query(TestResult).filter(TestResult.child_id == here["id"]).one().score == 7
    assert len(family.parent.get("/api/lessons/").json()) == 3
    assert [c["id"] for c in family.parent.get("/api/children/").json()] == [here["id"]]
    assert owner.parent.get("/api/auth/me").status_code == 200
