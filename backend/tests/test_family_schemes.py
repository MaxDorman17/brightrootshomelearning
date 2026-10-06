"""The schemes a family says it uses, asked at sign-up and changed on the Timetable page."""
from conftest import sign_up


def test_a_family_saves_the_schemes_it_uses(family):
    assert family.parent.get("/api/auth/me").json()["family_schemes"] == []
    saved = family.parent.put("/api/auth/schemes", json={"schemes": ["  White Rose  Maths ", "Twinkl", "twinkl", "", "Our tutor"]})
    assert saved.status_code == 200, saved.text
    # Tidied, with repeats and blanks dropped.
    assert saved.json()["schemes"] == ["White Rose Maths", "Twinkl", "Our tutor"]
    assert family.parent.get("/api/auth/me").json()["family_schemes"] == ["White Rose Maths", "Twinkl", "Our tutor"]

    # Children see the family's list but can't change it.
    kid = family.child_client(family.add_child())
    assert kid.get("/api/auth/me").json()["family_schemes"] == ["White Rose Maths", "Twinkl", "Our tutor"]
    assert kid.put("/api/auth/schemes", json={"schemes": ["Oops"]}).status_code == 403

    # Another family has its own list.
    assert sign_up("Other").parent.get("/api/auth/me").json()["family_schemes"] == []

    # And it can be emptied again.
    assert family.parent.put("/api/auth/schemes", json={"schemes": []}).json()["schemes"] == []
    assert family.parent.get("/api/auth/me").json()["family_schemes"] == []


def test_the_list_of_schemes_is_kept_short(family):
    saved = family.parent.put("/api/auth/schemes", json={"schemes": [f"Scheme {n}" for n in range(30)] + ["x" * 300]})
    assert len(saved.json()["schemes"]) == 12
