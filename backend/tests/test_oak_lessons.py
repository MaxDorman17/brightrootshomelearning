"""Oak lessons done inside Bright Roots: the quizzes are marked here, scores feed results and stars, and
anything Oak won't hand over is left out. Oak itself is never called: each test supplies the lesson."""
from datetime import date

import pytest

import routers.oak_lessons as oak_lessons
from conftest import sign_up
from database import SessionLocal
from models import OakLesson

OAK_URL = "https://www.thenational.academy/pupils/programmes/maths-primary-ks1/units/counting/lessons/ordering-numbers-to-10"


def raw(question_type, answers, question="Q?"):
    return {"question": question, "questionType": question_type, "answers": answers}


def text(content, **extra):
    return {"type": "text", "content": content, **extra}


STARTER = [
    raw("multiple-choice", [text("5", distractor=True), text("7", distractor=False)], "What comes after 6?"),
    raw("short-answer", [text("decimal")]),
    raw("multiple-choice", [text("a", distractor=False), text("b", distractor=True), text("c", distractor=False)]),
    raw("match", [{"matchOption": text("one"), "correctChoice": text("1")}, {"matchOption": text("two"), "correctChoice": text("2")}]),
    raw("order", [{"order": 2, **text("second")}, {"order": 1, **text("first")}]),
    raw("drag-and-drop", [text("something new")]),  # a kind we don't know is left out, not shown broken
]
RIGHT = {"0": 1, "1": " Decimal ", "2": [2, 0], "3": {"one": "1", "two": "2"}, "4": ["first", "second"]}


def lesson(**changes):
    quiz = [q for q in (oak_lessons._question(r) for r in STARTER) if q]
    return {
        "slug": "ordering-numbers-to-10", "found": True, "title": "Ordering numbers to 10", "outcome": "I can order numbers.",
        "keywords": [], "starter": quiz, "exit": quiz, "video_url": "https://stream.video.thenational.academy/x/high.mp4",
        "captions": "WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\nHello", "has_worksheet": True, "credits": [],
        "oak_url": "https://www.thenational.academy/teachers/lessons/ordering-numbers-to-10", **changes,
    }


def _forget_lessons():
    with SessionLocal() as db:
        db.query(OakLesson).delete()
        db.commit()


@pytest.fixture
def oak(monkeypatch):
    """Stands in for Oak. Set oak["lesson"] to change what it gives; None means Oak can't be reached."""
    state = {"lesson": lesson(), "calls": 0}

    def fetch(slug):
        state["calls"] += 1
        return state["lesson"]

    monkeypatch.setattr(oak_lessons, "_fetch", fetch)
    monkeypatch.setattr(oak_lessons.settings, "OAK_API_KEY", "test-key")
    _forget_lessons()
    yield state
    _forget_lessons()


def planned(family, child_id, url=OAK_URL, title="Ordering numbers to 10"):
    made = family.parent.post("/api/lessons/", json={"title": title, "subject": "Maths", "lesson_url": url}).json()
    body = {"lesson_id": made["id"], "scheduled_date": date.today().isoformat()}
    if child_id is not None:
        body["assigned_to"] = child_id
    return family.parent.post("/api/planner/", json=body).json()


def test_lesson_links_are_recognised():
    slug = oak_lessons.lesson_slug
    assert slug(OAK_URL) == "ordering-numbers-to-10"
    assert slug("https://www.thenational.academy/teachers/lessons/simplifying-fractions?x=1") == "simplifying-fractions"
    assert slug("https://www.thenational.academy/pupils/lessons/the-romans/results/abc/share") == "the-romans"
    assert slug("https://example.com/pupils/lessons/the-romans") is None
    assert slug("https://www.thenational.academy.evil.test/pupils/lessons/the-romans") is None
    assert slug(None) is None


def test_answer_box_marks_are_dropped():
    q = oak_lessons._question(raw("short-answer", [text("2")], "What number goes in the box? {{ }}"))
    assert q["q"] == "What number goes in the box?"


def test_a_child_does_the_whole_lesson_here(family, oak):
    child = family.add_child()
    kid = family.child_client(child)
    entry = planned(family, child["id"])
    family.parent.get("/api/rewards/setup")  # the family's example rules: 3 stars for an Oak exit quiz of 80%+, 1 for a lesson

    page = kid.get(f"/api/oak-lessons/entry/{entry['id']}").json()
    assert page["available"] is True
    assert [q["type"] for q in page["starter"]] == ["choice", "type", "pick", "match", "order"]
    assert page["video_url"].startswith("https://stream.video.thenational.academy/") and page["has_captions"] and page["has_worksheet"]
    assert page["oak_url"].endswith("/ordering-numbers-to-10") and "open-government-licence" in page["licence_url"]
    assert kid.get(f"/api/oak-lessons/entry/{entry['id']}/captions").text.startswith("WEBVTT")

    # The starter quiz is marked here, and doesn't finish the lesson.
    starter = kid.post(f"/api/oak-lessons/entry/{entry['id']}/quiz/starter", json={"answers": {**RIGHT, "0": 0}})
    assert starter.status_code == 200, starter.text
    assert (starter.json()["score"], starter.json()["total"], starter.json()["right"]) == (4, 5, [False, True, True, True, True])
    assert kid.get("/api/planner/today").json()[0]["is_complete"] is False

    # The exit quiz finishes it, and the scores reach results and stars.
    done = kid.post(f"/api/oak-lessons/entry/{entry['id']}/quiz/exit", json={"answers": RIGHT}).json()
    assert (done["score"], done["lesson_complete"]) == (5, True)
    assert kid.get("/api/planner/today").json()[0]["is_complete"] is True
    overview = family.parent.get("/api/test-results/overview", params={"child_id": child["id"]}).json()
    assert [(q["entry_id"], q["starter_score"], q["starter_total"], q["exit_score"], q["exit_total"]) for q in overview["oak"]] == [
        (entry["id"], 4, 5, 5, 5)
    ]
    reasons = [h["reason"] for h in kid.get("/api/rewards/me").json()["history"]]
    assert "Oak exit quiz 100%: Ordering numbers to 10" in reasons and "Completed: Ordering numbers to 10" in reasons
    today = family.parent.get("/api/oak/today-quiz-results").json()
    assert [(r["exit_score"], r["exit_total"], r["completed"]) for r in today] == [(5, 5, True)]

    # A worse second go keeps the best score. Oak was only asked for the lesson once.
    again = kid.post(f"/api/oak-lessons/entry/{entry['id']}/quiz/exit", json={"answers": {}}).json()
    assert (again["score"], again["attempt"]["exit_score"], again["new_best"]) == (0, 5, False)
    assert oak["calls"] == 1


def test_what_oak_withholds_is_left_out(family, oak):
    child = family.add_child()
    kid = family.child_client(child)
    entry = planned(family, child["id"])

    # No quizzes (blocked for copyright), but the video is there: the lesson still opens, without them.
    oak["lesson"] = lesson(starter=[], exit=[])
    page = kid.get(f"/api/oak-lessons/entry/{entry['id']}").json()
    assert page["available"] is True and page["starter"] == [] and page["exit"] == []
    assert kid.post(f"/api/oak-lessons/entry/{entry['id']}/quiz/exit", json={"answers": {}}).status_code == 404


def test_borrowed_material_is_not_shown_here(family, oak):
    child = family.add_child()
    kid = family.child_client(child)
    # A lesson that credits someone other than Oak opens on Oak, not here.
    oak["lesson"] = lesson(credits=["Photo: A. N. Other, all rights reserved"])
    entry = planned(family, child["id"])
    assert kid.get(f"/api/oak-lessons/entry/{entry['id']}").json() == {"available": False}
    # And a question built round a borrowed picture is left out of the quiz.
    borrowed = {"url": "https://example.test/p.png", "alt": "", "attribution": "Someone else"}
    assert oak_lessons._question({**raw("short-answer", [text("2")]), "questionImage": borrowed}) is None
    assert oak_lessons._question(raw("multiple-choice", [{"type": "image", "content": borrowed, "distractor": False}, text("b", distractor=True)])) is None


def test_a_lesson_with_nothing_to_show_is_unavailable(family, oak):
    child = family.add_child()
    kid = family.child_client(child)
    oak["lesson"] = lesson(starter=[], exit=[], video_url=None, has_worksheet=False)
    entry = planned(family, child["id"])
    assert kid.get(f"/api/oak-lessons/entry/{entry['id']}").json() == {"available": False}
    # And so is one Oak can't be reached for.
    oak["lesson"] = None
    other = planned(family, child["id"], OAK_URL.replace("ordering-numbers-to-10", "another-lesson"), "Another lesson")
    assert kid.get(f"/api/oak-lessons/entry/{other['id']}").json() == {"available": False}


def test_only_the_right_people_and_lessons(family, oak):
    child = family.add_child()
    kid = family.child_client(child)
    entry = planned(family, child["id"])
    not_oak = planned(family, child["id"], "https://example.com/lesson", "Somewhere else")
    assert kid.get(f"/api/oak-lessons/entry/{not_oak['id']}").status_code == 404
    # Grown-ups can look, but only a child's quiz is saved.
    seen = family.parent.get(f"/api/oak-lessons/entry/{entry['id']}")
    assert seen.status_code == 200 and seen.json()["available"] is True, seen.text
    assert family.parent.post(f"/api/oak-lessons/entry/{entry['id']}/quiz/exit", json={"answers": RIGHT}).status_code == 403
    # Another family can't open this family's lesson.
    stranger = sign_up("Other")
    assert stranger.parent.get(f"/api/oak-lessons/entry/{entry['id']}").status_code == 404
    assert kid.post(f"/api/oak-lessons/entry/{entry['id']}/quiz/middle", json={"answers": {}}).status_code == 404


def test_a_lesson_for_everyone_is_finished_per_child(family, oak):
    one, two = family.add_child("One"), family.add_child("Two")
    entry = planned(family, None)
    family.child_client(one).post(f"/api/oak-lessons/entry/{entry['id']}/quiz/exit", json={"answers": RIGHT})
    kid_two = family.child_client(two)
    assert kid_two.get("/api/planner/today").json()[0]["is_complete"] is False
    assert kid_two.get(f"/api/oak-lessons/entry/{entry['id']}").json()["attempt"]["exit_score"] is None


def _pdf(pages):
    from io import BytesIO
    from pypdf import PdfWriter
    writer, out = PdfWriter(), BytesIO()
    for _ in range(pages):
        writer.add_blank_page(width=200, height=200)
    writer.write(out)
    return out.getvalue()


@pytest.fixture
def worksheets(monkeypatch):
    """Stands in for Oak's worksheet files: slug -> number of pages."""
    files = {"ordering-numbers-to-10": 2, "another-lesson": 1}
    monkeypatch.setattr(oak_lessons, "_worksheet_link", lambda slug: f"https://oak.test/{slug}.pdf" if slug in files else None)
    monkeypatch.setattr(oak_lessons, "_download_pdf", lambda url: _pdf(files[url.rsplit("/", 1)[1][:-4]]))
    return files


def test_a_days_worksheets_print_in_one_go(family, oak, worksheets):
    one, two = family.add_child("One"), family.add_child("Two")
    first = planned(family, one["id"])
    planned(family, two["id"], OAK_URL.replace("ordering-numbers-to-10", "another-lesson"), "Another lesson")
    planned(family, one["id"], "https://example.com/lesson", "Not from Oak")
    today = date.today().isoformat()

    listed = family.parent.get("/api/oak-lessons/day-worksheets", params={"day": today}).json()
    assert [(w["title"], w["child"]) for w in listed] == [("Ordering numbers to 10", "One"), ("Another lesson", "Two")]
    assert listed[0]["entry_id"] == first["id"]
    just_one = family.parent.get("/api/oak-lessons/day-worksheets", params={"day": today, "child_id": one["id"]}).json()
    assert [w["child"] for w in just_one] == ["One"]

    pdf = family.parent.get("/api/oak-lessons/day-worksheets.pdf", params={"day": today})
    assert pdf.status_code == 200 and pdf.headers["content-type"] == "application/pdf"
    from io import BytesIO
    from pypdf import PdfReader
    assert len(PdfReader(BytesIO(pdf.content)).pages) == 3


def test_day_worksheets_are_only_for_the_familys_grown_ups(family, oak, worksheets):
    child = family.add_child()
    planned(family, child["id"])
    today = date.today().isoformat()
    assert family.child_client(child).get("/api/oak-lessons/day-worksheets", params={"day": today}).status_code == 403
    stranger = sign_up("Other")
    assert stranger.parent.get("/api/oak-lessons/day-worksheets", params={"day": today}).json() == []
    assert stranger.parent.get("/api/oak-lessons/day-worksheets", params={"day": today, "child_id": child["id"]}).status_code == 404
    assert stranger.parent.get("/api/oak-lessons/day-worksheets.pdf", params={"day": today}).status_code == 404
    # A day with no Oak worksheets says so rather than sending an empty file.
    oak["lesson"] = lesson(has_worksheet=False)
    _forget_lessons()
    assert family.parent.get("/api/oak-lessons/day-worksheets.pdf", params={"day": today}).status_code == 404


def test_scores_from_lessons_done_here_show_in_the_planner(family, oak):
    one, two = family.add_child("One"), family.add_child("Two")
    own = planned(family, one["id"])
    shared = planned(family, None)
    family.child_client(one).post(f"/api/oak-lessons/entry/{own['id']}/quiz/starter", json={"answers": {"0": 1}})
    family.child_client(one).post(f"/api/oak-lessons/entry/{own['id']}/quiz/exit", json={"answers": RIGHT})
    family.child_client(two).post(f"/api/oak-lessons/entry/{shared['id']}/quiz/exit", json={"answers": RIGHT})
    today = date.today().isoformat()

    week = family.parent.get("/api/oak/week-scores", params={"start_date": today, "end_date": today}).json()
    rows = {(r["entry_id"], r["child_id"]): r for r in week["days"][0]["entries"]}
    mine = rows[(own["id"], one["id"])]
    assert (mine["starter_score"], mine["starter_total"], mine["exit_score"], mine["exit_total"]) == (1, 5, 5, 5)
    assert mine["is_complete"] is True
    theirs = rows[(shared["id"], two["id"])]
    assert (theirs["exit_score"], theirs["starter_score"], theirs["is_complete"]) == (5, None, True)
    # Only the child who did the shared lesson is listed for it.
    assert (shared["id"], one["id"]) not in rows


def test_a_lesson_saved_by_another_request_at_the_same_time_is_not_an_error(family, oak, monkeypatch):
    # Both requests find no kept copy and fetch from Oak; the other one saves first.
    def fetch_while_another_request_saves(slug):
        with SessionLocal() as other:
            other.add(OakLesson(slug=slug, data='{"slug": "old"}', fetched_at=oak_lessons.datetime.utcnow()))
            other.commit()
        return lesson()

    monkeypatch.setattr(oak_lessons, "_fetch", fetch_while_another_request_saves)
    with SessionLocal() as db:
        assert oak_lessons.get_lesson(db, "ordering-numbers-to-10")["title"] == "Ordering numbers to 10"
    with SessionLocal() as db:
        kept = db.query(OakLesson).filter(OakLesson.slug == "ordering-numbers-to-10").all()
        assert len(kept) == 1 and '"Ordering numbers to 10"' in kept[0].data
