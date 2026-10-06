"""Shared set-up for the backend tests.

Every run uses a brand-new SQLite database and uploads folder in a temporary directory, so the tests
never touch real family data. Email, Stripe and Oak are switched off, so nothing is sent or charged.

Run from the backend folder:

    pip install -r requirements-dev.txt
    python -m pytest
"""
import itertools
import os
import secrets
import shutil
import sys
import tempfile

import pytest

BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND)

_TMP = tempfile.mkdtemp(prefix="brightroots-tests-").replace("\\", "/")
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP}/test.db"
os.environ["UPLOAD_ROOT"] = f"{_TMP}/uploads"
os.environ["SECRET_KEY"] = secrets.token_hex(32)
os.environ["FRONTEND_URL"] = "http://localhost:3000"
# Make sure nothing in a local .env can send email, take payment or call another service.
for name in ("RESEND_API_KEY", "RESEND_FROM_EMAIL", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "OAK_API_KEY", "ADMIN_EMAILS"):
    os.environ[name] = ""

from fastapi.testclient import TestClient  # noqa: E402

import email_validator  # noqa: E402

import main  # noqa: E402
import routers.auth as auth_routes  # noqa: E402
from database import SessionLocal  # noqa: E402
from models import User  # noqa: E402

# The made-up families here use @example.test addresses and all sign up from one place.
email_validator.TEST_ENVIRONMENT = True
auth_routes.MAX_SIGNUPS_PER_IP = 10**6

PASSWORD = "test-" + secrets.token_urlsafe(9)
_counter = itertools.count(1)


def pytest_sessionfinish(session, exitstatus):
    main.engine.dispose()
    shutil.rmtree(_TMP, ignore_errors=True)


def new_client() -> TestClient:
    return TestClient(main.app)


def login(identifier: str, password: str = PASSWORD) -> TestClient:
    """A client logged in as this person. Fails the test if the login is refused."""
    client = new_client()
    response = client.post("/api/auth/login", data={"username": identifier, "password": password})
    assert response.status_code == 200, response.text
    # The cookie is HTTPS-only and the test client talks plain HTTP, so its value is sent as a header instead.
    token = response.cookies.get("brightroots_session")
    assert token, "the login should set the session cookie"
    assert "access_token" not in response.json()
    client.cookies.clear()
    client.headers["Authorization"] = "Bearer " + token
    return client


def try_login(identifier: str, password: str = PASSWORD):
    return new_client().post("/api/auth/login", data={"username": identifier, "password": password})


class Family:
    """A signed-up, verified parent with handy helpers for adding children."""

    def __init__(self, email: str, name: str):
        self.email = email
        self.name = name
        self.parent = login(email)

    def add_child(self, name: str = "Kid", **extra) -> dict:
        response = self.parent.post("/api/children/", json={"username": name, "password": PASSWORD, **extra})
        assert response.status_code == 201, response.text
        return response.json()

    def child_client(self, child: dict) -> TestClient:
        return login(child["login_name"])


def sign_up(name: str = "Parent", verified: bool = True) -> Family:
    """Register a new family through the real sign-up route."""
    n = next(_counter)
    email = f"parent{n}@example.test"
    response = new_client().post("/api/auth/register", json={"email": email, "username": name, "password": PASSWORD})
    assert response.status_code == 201, response.text
    if verified:
        with SessionLocal() as db:
            user = db.query(User).filter(User.email == email).one()
            user.email_verified_at = user.created_at
            user.onboarding_completed_at = user.created_at
            db.commit()
    return Family(email, name)


@pytest.fixture
def family() -> Family:
    return sign_up()


@pytest.fixture
def db():
    with SessionLocal() as session:
        yield session
