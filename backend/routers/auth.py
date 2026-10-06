from collections import defaultdict, deque
from threading import Lock
from time import monotonic
from datetime import datetime, timedelta
import json
from typing import Optional
import logging

import httpx
from jose import JWTError, jwt

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import Token, UserOut, _parse_avatar
from auth import SESSION_COOKIE_NAME, verify_password, hash_password, create_access_token, get_authenticated_user, get_login_user, actor, is_family_owner, user_has_membership_access, COPARENT_ROLE, find_login, login_name_taken
from config import settings
import emails
from newsletter_access import is_admin, subscribe_member

router = APIRouter(prefix="/api/auth", tags=["auth"])

# How long a new family can use everything for free before choosing a membership.
TRIAL_DAYS = 14
logger = logging.getLogger(__name__)


class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    newsletter: bool = False


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ThemeRequest(BaseModel):
    theme: str


class SchemesRequest(BaseModel):
    schemes: list[str]


MAX_FAMILY_SCHEMES = 12


def _family_schemes(user: Optional[User]) -> list[str]:
    try:
        value = json.loads(user.schemes) if user and user.schemes else []
    except ValueError:
        return []
    return [s for s in value if isinstance(s, str)] if isinstance(value, list) else []


FAMILY_THEMES = {"sage", "ocean", "sunshine", "berry"}


LOGIN_WINDOW_SECONDS = 10 * 60
MAX_FAILURES_PER_ACCOUNT_IP = 5
MAX_FAILURES_PER_IP = 25
RESET_WINDOW_SECONDS = 15 * 60
MAX_RESET_REQUESTS_PER_IP = 5
VERIFY_WINDOW_SECONDS = 15 * 60
MAX_VERIFY_REQUESTS_PER_IP = 5

_failed_by_account_ip = defaultdict(deque)
_failed_by_ip = defaultdict(deque)
_rate_limit_lock = Lock()
_reset_requests_by_ip = defaultdict(deque)
_verify_requests_by_ip = defaultdict(deque)


def _client_ip(request: Request) -> str:
    cf_ip = request.headers.get("cf-connecting-ip")
    if cf_ip:
        return cf_ip.strip()

    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",", 1)[0].strip()

    return request.client.host if request.client else "unknown"


def _trim_attempts(attempts: deque, now: float) -> None:
    cutoff = now - LOGIN_WINDOW_SECONDS
    while attempts and attempts[0] <= cutoff:
        attempts.popleft()


def _check_login_rate_limit(client_ip: str, username: str) -> None:
    now = monotonic()
    account_key = (client_ip, username.lower())

    with _rate_limit_lock:
        account_attempts = _failed_by_account_ip[account_key]
        ip_attempts = _failed_by_ip[client_ip]

        _trim_attempts(account_attempts, now)
        _trim_attempts(ip_attempts, now)

        if len(account_attempts) >= MAX_FAILURES_PER_ACCOUNT_IP or len(ip_attempts) >= MAX_FAILURES_PER_IP:
            oldest = account_attempts[0] if len(account_attempts) >= MAX_FAILURES_PER_ACCOUNT_IP else ip_attempts[0]
            retry_after = max(1, int(LOGIN_WINDOW_SECONDS - (now - oldest)))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed login attempts. Please try again later.",
                headers={"Retry-After": str(retry_after)},
            )


def _record_login_failure(client_ip: str, username: str) -> None:
    now = monotonic()
    account_key = (client_ip, username.lower())

    with _rate_limit_lock:
        account_attempts = _failed_by_account_ip[account_key]
        ip_attempts = _failed_by_ip[client_ip]

        _trim_attempts(account_attempts, now)
        _trim_attempts(ip_attempts, now)

        account_attempts.append(now)
        ip_attempts.append(now)


def _clear_account_failures(client_ip: str, username: str) -> None:
    account_key = (client_ip, username.lower())
    with _rate_limit_lock:
        _failed_by_account_ip.pop(account_key, None)


def _check_reset_rate_limit(client_ip: str) -> None:
    now = monotonic()
    with _rate_limit_lock:
        attempts = _reset_requests_by_ip[client_ip]
        cutoff = now - RESET_WINDOW_SECONDS
        while attempts and attempts[0] <= cutoff:
            attempts.popleft()

        if len(attempts) >= MAX_RESET_REQUESTS_PER_IP:
            retry_after = max(1, int(RESET_WINDOW_SECONDS - (now - attempts[0])))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many password reset requests. Please try again later.",
                headers={"Retry-After": str(retry_after)},
            )

        attempts.append(now)


def _check_verify_rate_limit(client_ip: str) -> None:
    now = monotonic()
    with _rate_limit_lock:
        attempts = _verify_requests_by_ip[client_ip]
        cutoff = now - VERIFY_WINDOW_SECONDS
        while attempts and attempts[0] <= cutoff:
            attempts.popleft()

        if len(attempts) >= MAX_VERIFY_REQUESTS_PER_IP:
            retry_after = max(1, int(VERIFY_WINDOW_SECONDS - (now - attempts[0])))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many verification email requests. Please try again later.",
                headers={"Retry-After": str(retry_after)},
            )

        attempts.append(now)


def _create_email_verification_token(user: User) -> str:
    expires = datetime.utcnow() + timedelta(hours=24)
    payload = {
        "sub": str(user.id),
        "purpose": "email_verify",
        "email": user.email,
        "exp": expires,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def _verify_url(token: str) -> str:
    return f"{settings.FRONTEND_URL.rstrip('/')}/verify-email#token={token}"


def _send_email_verification(email: str, token: str) -> None:
    """A fresh confirmation link, for a parent who asks for one again."""
    if not emails.configured():
        raise RuntimeError("Email verification is not configured")
    subject, body = emails.verify_email(_verify_url(token))
    emails.send(email, subject, body)


def _send_welcome_email(user: User, token: str) -> None:
    """Sent at sign-up: a welcome, with the button that confirms the email address."""
    if not emails.configured():
        raise RuntimeError("Email verification is not configured")
    subject, body = emails.welcome_email(user.username, _verify_url(token), TRIAL_DAYS)
    emails.send(user.email, subject, body)


def _create_password_reset_token(user: User) -> str:
    expires = datetime.utcnow() + timedelta(minutes=30)
    payload = {
        "sub": str(user.id),
        "purpose": "password_reset",
        "ver": user.session_version,
        "exp": expires,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def _send_password_reset_email(email: str, token: str) -> None:
    if not emails.configured():
        raise RuntimeError("Password reset email is not configured")
    reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password#token={token}"
    subject, body = emails.password_reset_email(reset_url)
    emails.send(email, subject, body)


@router.post("/register", status_code=201)
def register(
    body: RegisterRequest,
    db: Session = Depends(get_db),
):
    email = body.email.strip().lower()
    username = body.username.strip()

    if len(username) < 2 or len(username) > 50:
        raise HTTPException(status_code=400, detail="Your name needs 2 to 50 characters")

    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    # Grown-ups log in with their email address, so their name doesn't have to be unique.
    if login_name_taken(db, email):
        raise HTTPException(status_code=400, detail="An account already exists for that email")

    user = User(
        email=email,
        username=username,
        login_name=email,
        hashed_password=hash_password(body.password),
        role="parent",
        subscription_status="trialing",
        trial_ends_at=datetime.utcnow() + timedelta(days=TRIAL_DAYS),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if body.newsletter:
        subscribe_member(db, user)

    token = _create_email_verification_token(user)
    try:
        _send_welcome_email(user, token)
    except Exception:
        logger.exception("Failed to send signup welcome email")

    return {
        "message": "Account created. Check your email to verify your account and start your 14-day trial.",
        "username": user.username,
    }


@router.post("/login", response_model=Token)
def login(
    response: Response,
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    client_ip = _client_ip(request)
    _check_login_rate_limit(client_ip, form_data.username)

    user = find_login(db, form_data.username)
    # Little Roots children (3 and 4) never log in; a grown-up does everything with them.
    if user and user.role == "child" and user.activity_level == "little":
        user = None
    if not user or not verify_password(form_data.password, user.hashed_password):
        _record_login_failure(client_ip, form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    _clear_account_failures(client_ip, form_data.username)
    token = create_access_token({"sub": str(user.id), "ver": user.session_version})
    secure_cookie = request.url.hostname not in {"localhost", "127.0.0.1"}
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    # A second grown-up uses the site as a parent of the family's main account.
    account = user
    if user.role == COPARENT_ROLE:
        account = db.query(User).filter(User.id == user.family_owner_id, User.role == "parent").first()
        if account is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    return Token(
        access_token=token,
        token_type="bearer",
        role=account.role,
        username=user.username,
        email_verified=(account.email_verified_at is not None),
        onboarding_completed=(account.onboarding_completed_at is not None),
        billing_required=not user_has_membership_access(account, db),
    )


@router.post("/logout", status_code=204)
def logout(response: Response, request: Request):
    secure_cookie = request.url.hostname not in {"localhost", "127.0.0.1"}
    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
    )


@router.get("/me", response_model=UserOut)
def me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    out = UserOut.model_validate(current_user)
    out.has_photo = bool(current_user.avatar_photo)
    out.is_admin = is_admin(current_user)
    out.rewards_set_up = current_user.rewards_set_up_at is not None
    me_user = actor(current_user)
    out.is_owner = is_family_owner(current_user)
    out.login_id = me_user.id
    out.relationship = me_user.relationship_label
    out.login_name = me_user.login_name
    if current_user.role == "child":
        out.activity_levels = [current_user.activity_level or "both"]
    else:
        kids = db.query(User.activity_level).filter(User.parent_id == current_user.id, User.role == "child").all()
        out.activity_levels = sorted({level or "both" for (level,) in kids}) or ["both"]
    if not out.is_owner:
        # A second grown-up sees the family's account, but under their own name and picture.
        out.username = me_user.username
        out.email = me_user.email
        out.avatar = _parse_avatar(me_user.avatar)
        out.is_admin = False
    if current_user.role == "parent":
        out.family_theme = current_user.theme
        out.family_schemes = _family_schemes(current_user)
    elif current_user.parent_id:
        parent = db.query(User).filter(User.id == current_user.parent_id).first()
        out.family_schemes = _family_schemes(parent)
        # A child's own choice of colours wins over the family theme.
        out.family_theme = current_user.child_theme or (parent.theme if parent else None)
        out.parent_name = parent.username if parent else None
    return out


@router.put("/theme")
def set_theme(
    body: ThemeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")
    theme = body.theme.strip().lower()
    if theme not in FAMILY_THEMES:
        raise HTTPException(status_code=400, detail="Unknown theme")
    current_user.theme = theme
    db.commit()
    return {"theme": theme}


@router.put("/schemes")
def set_schemes(
    body: SchemesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    """The schemes a family uses. They are offered first whenever a lesson or unit is given a scheme."""
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")
    schemes: list[str] = []
    for name in body.schemes:
        name = " ".join(name.split())[:100]
        if name and name.lower() not in {s.lower() for s in schemes}:
            schemes.append(name)
    schemes = schemes[:MAX_FAMILY_SCHEMES]
    current_user.schemes = json.dumps(schemes) if schemes else None
    db.commit()
    return {"schemes": schemes}


@router.post("/change-password")
def change_password(
    body: ChangePasswordRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_login_user),  # your own password, even as a second grown-up
):
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if len(body.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters",
        )

    if verify_password(body.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password",
        )

    current_user.hashed_password = hash_password(body.new_password)
    current_user.session_version = (current_user.session_version or 1) + 1
    db.commit()
    db.refresh(current_user)

    token = create_access_token(
        {"sub": str(current_user.id), "ver": current_user.session_version}
    )
    secure_cookie = request.url.hostname not in {"localhost", "127.0.0.1"}
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

    return {"message": "Password changed. Other sessions have been signed out."}


@router.post("/forgot-password")
def forgot_password(
    body: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = _client_ip(request)
    _check_reset_rate_limit(client_ip)

    # Any grown-up with an email on their login can reset their own password.
    user = db.query(User).filter(
        func.lower(User.email) == body.email.strip().lower(),
        User.role.in_(["parent", COPARENT_ROLE]),
    ).first()

    if user:
        token = _create_password_reset_token(user)
        try:
            _send_password_reset_email(user.email, token)
        except Exception:
            logger.exception("Failed to send password reset email")

    return {
        "message": "If a parent account exists for that email, a password reset link has been sent."
    }


@router.post("/reset-password")
def reset_password(
    body: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    if len(body.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters",
        )

    try:
        payload = jwt.decode(
            body.token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        if payload.get("purpose") != "password_reset":
            raise JWTError()

        user_id = int(payload.get("sub"))
        token_version = payload.get("ver", 1)
    except (JWTError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has expired.",
        )

    user = db.query(User).filter(
        User.id == user_id,
        User.role.in_(["parent", COPARENT_ROLE]),
    ).first()

    if not user or user.session_version != token_version:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This reset link is invalid or has already been used.",
        )

    user.hashed_password = hash_password(body.new_password)
    user.session_version = (user.session_version or 1) + 1
    db.commit()

    return {
        "message": "Password reset successfully. You can now sign in with your new password."
    }


@router.post("/request-email-verification")
def request_email_verification(
    request: Request,
    current_user: User = Depends(get_authenticated_user),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")

    if current_user.email_verified_at is not None:
        return {"message": "Your email address is already verified."}

    _check_verify_rate_limit(_client_ip(request))
    token = _create_email_verification_token(current_user)

    try:
        _send_email_verification(current_user.email, token)
    except Exception:
        logger.exception("Failed to send email verification")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Verification email is temporarily unavailable. Please try again later.",
        )

    return {"message": "Verification email sent. Check your inbox."}


class VerifyEmailRequest(BaseModel):
    token: str


@router.post("/verify-email")
def verify_email(
    body: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(
            body.token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        if payload.get("purpose") != "email_verify":
            raise JWTError()

        user_id = int(payload.get("sub"))
        token_email = str(payload.get("email"))
    except (JWTError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link is invalid or has expired.",
        )

    user = db.query(User).filter(
        User.id == user_id,
        User.role == "parent",
    ).first()

    if not user or user.email.lower() != token_email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification link is no longer valid.",
        )

    if user.email_verified_at is None:
        user.email_verified_at = datetime.utcnow()
        db.commit()
        # The first time only: a short email on how to get started.
        try:
            if emails.configured():
                subject, body = emails.getting_started_email(user.username)
                emails.send(user.email, subject, body)
        except Exception:
            logger.exception("Failed to send getting-started email")

    return {"message": "Email verified successfully."}


@router.post("/complete-onboarding")
def complete_onboarding(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_authenticated_user),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")

    if current_user.email_verified_at is None:
        raise HTTPException(status_code=403, detail="Please verify your email address first")

    if current_user.onboarding_completed_at is None:
        current_user.onboarding_completed_at = datetime.utcnow()
        db.commit()

    return {"message": "Onboarding complete."}
