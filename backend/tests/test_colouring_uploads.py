"""The owner uploads colouring sheets on /admin/colouring; everyone can list and open them."""
import io
import os

import pytest

from config import settings
from conftest import new_client, sign_up


def _pdf(pages: int = 1) -> bytes:
    import pypdfium2 as pdfium

    pdf = pdfium.PdfDocument.new()
    for _ in range(pages):
        pdf.new_page(595, 842)  # A4 in points
    out = io.BytesIO()
    pdf.save(out)
    pdf.close()
    return out.getvalue()


def _png() -> bytes:
    from PIL import Image

    out = io.BytesIO()
    Image.new("RGB", (1200, 900), (200, 100, 50)).save(out, "PNG")
    return out.getvalue()


def _folder() -> str:
    from storage import upload_dir

    return upload_dir("colouring")


@pytest.fixture
def owner(monkeypatch):
    family = sign_up("Owner")
    monkeypatch.setattr(settings, "ADMIN_EMAILS", family.email)
    return family


def _upload(client, theme="woodland-friends", files=None, titles=None):
    files = files or [("files", ("forest-friends_picnic.pdf", _pdf(), "application/pdf"))]
    data = {"theme": theme}
    if titles is not None:
        data["titles"] = titles
    return client.post("/api/colouring/admin/sheets", data=data, files=files)


def test_only_the_owner_can_upload_or_see_the_admin_list(family):
    assert _upload(family.parent).status_code == 403
    assert family.parent.get("/api/colouring/admin/sheets").status_code == 403
    assert family.parent.post("/api/colouring/admin/themes", json={"name": "Pirates"}).status_code == 403
    assert family.parent.delete("/api/colouring/admin/sheets/1").status_code == 403
    assert new_client().get("/api/colouring/admin/sheets").status_code == 401


def test_owner_uploads_sheets_with_previews_and_everyone_can_open_them(owner):
    from PIL import Image

    response = _upload(
        owner.parent,
        files=[
            ("files", ("forest-friends_picnic.pdf", _pdf(), "application/pdf")),
            ("files", ("second.pdf", _pdf(2), "application/pdf")),
        ],
        titles=["", "Badger's Birthday"],
    )
    assert response.status_code == 201, response.text
    first, second = response.json()
    assert first["title"] == "Forest Friends Picnic" and first["slug"] == "forest-friends-picnic"
    assert second["title"] == "Badger's Birthday" and second["slug"] == "badgers-birthday"
    assert second["position"] == first["position"] + 1

    public = new_client()
    listed = public.get("/api/colouring")
    assert listed.status_code == 200 and listed.headers["cache-control"] == "no-cache"
    ids = [s["id"] for s in listed.json()["sheets"]]
    assert first["id"] in ids and second["id"] in ids
    assert all(s["created_at"].endswith("Z") for s in listed.json()["sheets"])

    pdf = public.get(first["pdf_url"])
    assert pdf.status_code == 200 and pdf.content.startswith(b"%PDF")
    assert pdf.headers["content-type"] == "application/pdf"
    assert 'filename="forest-friends-picnic.pdf"' in pdf.headers["content-disposition"]
    assert pdf.headers["content-disposition"].startswith("inline")

    preview = public.get(first["preview_url"])
    assert preview.status_code == 200 and preview.headers["content-type"] == "image/jpeg"
    assert "public" in preview.headers["cache-control"]
    width, height = Image.open(io.BytesIO(preview.content)).size
    assert width == 600 and 840 <= height <= 860

    # Same title in the same theme gets its own slug.
    again = _upload(owner.parent, files=[("files", ("Forest Friends Picnic.pdf", _pdf(), "application/pdf"))]).json()[0]
    assert again["slug"] == "forest-friends-picnic-2"

    newest_first = owner.parent.get("/api/colouring/admin/sheets").json()
    assert newest_first[0]["id"] == again["id"] and newest_first[0]["theme_name"] == "Woodland Friends"


def test_files_that_arent_pdfs_are_turned_away(owner):
    before = set(os.listdir(_folder()))
    response = _upload(owner.parent, files=[("files", ("picture.pdf", b"\x89PNG not a pdf", "application/pdf"))])
    assert response.status_code == 400 and "isn't a PDF" in response.json()["detail"]
    broken = _upload(owner.parent, files=[("files", ("broken.pdf", b"%PDF-1.7 nothing else", "application/pdf"))])
    assert broken.status_code == 400 and "broken.pdf" in broken.json()["detail"]
    # One bad file in a batch: nothing is added.
    mixed = _upload(
        owner.parent,
        files=[("files", ("good.pdf", _pdf(), "application/pdf")), ("files", ("bad.pdf", b"hello", "application/pdf"))],
    )
    assert mixed.status_code == 400
    assert set(os.listdir(_folder())) == before
    assert _upload(owner.parent, theme="no-such-theme").status_code == 400


def test_files_over_25_mb_are_turned_away(owner):
    big = b"%PDF-1.7\n" + b"0" * (25 * 1024 * 1024)
    response = _upload(owner.parent, files=[("files", ("huge.pdf", big, "application/pdf"))])
    assert response.status_code == 400 and "25 MB" in response.json()["detail"]


def test_rename_move_and_delete_a_sheet(owner):
    sheet = _upload(owner.parent).json()[0]
    from database import SessionLocal
    from models import ColouringSheet

    with SessionLocal() as db:
        row = db.get(ColouringSheet, sheet["id"])
        sheet_files = [row.pdf_file, row.preview_file]
    assert all(os.path.isfile(os.path.join(_folder(), f)) for f in sheet_files)

    renamed = owner.parent.patch(f"/api/colouring/admin/sheets/{sheet['id']}", json={"title": "Owl Night", "theme": "romans"})
    assert renamed.status_code == 200
    assert renamed.json()["title"] == "Owl Night" and renamed.json()["slug"] == "owl-night" and renamed.json()["theme"] == "romans"
    assert owner.parent.patch(f"/api/colouring/admin/sheets/{sheet['id']}", json={"title": "  "}).status_code == 400

    assert owner.parent.delete(f"/api/colouring/admin/sheets/{sheet['id']}").status_code == 200
    assert not any(os.path.isfile(os.path.join(_folder(), f)) for f in sheet_files)
    assert sheet["id"] not in [s["id"] for s in new_client().get("/api/colouring").json()["sheets"]]
    assert new_client().get(sheet["pdf_url"]).status_code == 404


def test_owner_makes_a_theme_with_a_cover_and_uploads_into_it(owner, family):
    from PIL import Image

    made = owner.parent.post("/api/colouring/admin/themes", json={"name": "Pirate Island"})
    assert made.status_code == 201 and made.json()["slug"] == "pirate-island" and made.json()["cover_url"] is None
    assert owner.parent.post("/api/colouring/admin/themes", json={"name": "pirate island"}).status_code == 400
    assert owner.parent.post("/api/colouring/admin/themes", json={"name": "Farmyard Fun"}).status_code == 400

    assert family.parent.post("/api/colouring/admin/themes/pirate-island/cover", files={"file": ("c.png", _png(), "image/png")}).status_code == 403
    assert owner.parent.post("/api/colouring/admin/themes/pirate-island/cover", files={"file": ("c.txt", b"nope", "image/png")}).status_code == 400
    covered = owner.parent.post("/api/colouring/admin/themes/pirate-island/cover", files={"file": ("c.png", _png(), "image/png")})
    assert covered.status_code == 200
    cover = new_client().get(covered.json()["cover_url"])
    assert cover.status_code == 200 and Image.open(io.BytesIO(cover.content)).size == (800, 800)

    assert _upload(owner.parent, theme="pirate-island").status_code == 201
    themes = new_client().get("/api/colouring").json()["themes"]
    assert [t["name"] for t in themes if t["slug"] == "pirate-island"] == ["Pirate Island"]
    # A theme with sheets in it can't be removed by mistake.
    assert owner.parent.delete("/api/colouring/admin/themes/pirate-island").status_code == 400


def test_title_from_filename():
    from routers.colouring import title_from_filename

    assert title_from_filename("woodland_owl-NIGHT.pdf") == "Woodland Owl Night"
    assert title_from_filename(".pdf") == "Colouring Sheet"


def _add_grown_up(family, email):
    from conftest import PASSWORD
    response = family.parent.post("/api/family/adults", json={"name": "Charlotte", "email": email, "password": PASSWORD})
    assert response.status_code == 201, response.text


def test_a_second_grown_up_on_the_owners_family_can_upload_when_listed(owner, monkeypatch):
    from conftest import login
    email = "charlotte." + owner.email
    _add_grown_up(owner, email)
    charlotte = login(email)
    # Not listed yet: no owner pages.
    assert charlotte.get("/api/auth/me").json()["is_admin"] is False
    assert _upload(charlotte).status_code == 403
    monkeypatch.setattr(settings, "ADMIN_EMAILS", f"{owner.email},{email}")
    assert charlotte.get("/api/auth/me").json()["is_admin"] is True
    assert _upload(charlotte).status_code == 201
    assert charlotte.get("/api/colouring/admin/sheets").status_code == 200


def test_a_listed_email_added_to_someone_elses_family_gets_nothing(owner, monkeypatch):
    from conftest import login
    stranger = sign_up("Stranger")
    email = "charlotte." + owner.email
    _add_grown_up(stranger, email)
    monkeypatch.setattr(settings, "ADMIN_EMAILS", f"{owner.email},{email}")
    impostor = login(email)
    assert impostor.get("/api/auth/me").json()["is_admin"] is False
    assert _upload(impostor).status_code == 403
