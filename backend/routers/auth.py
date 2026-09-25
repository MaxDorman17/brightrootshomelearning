from collections import defaultdict, deque
from threading import Lock
from time import monotonic
from datetime import datetime, timedelta
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
from schemas import Token, UserOut
from auth import SESSION_COOKIE_NAME, verify_password, hash_password, create_access_token, get_current_user
from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger(__name__)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


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


def _send_email_verification(email: str, token: str) -> None:
    if not settings.RESEND_API_KEY or not settings.RESEND_FROM_EMAIL:
        raise RuntimeError("Email verification is not configured")

    verify_url = f"{settings.FRONTEND_URL.rstrip('/')}/verify-email#token={token}"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#2E342F">
      <h2>Verify your Bright Roots email</h2>
      <p>Please confirm that this email address belongs to your Bright Roots parent account.</p>
      <p>
        <a href="{verify_url}" style="display:inline-block;background:#3F5D46;color:white;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">
          Verify email
        </a>
      </p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not expect this email, you can ignore it.</p>
    </div>
    """

    response = httpx.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": settings.RESEND_FROM_EMAIL,
            "to": [email],
            "subject": "Verify your Bright Roots email",
            "html": html,
        },
        timeout=10.0,
    )
    response.raise_for_status()


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
    if not settings.RESEND_API_KEY or not settings.RESEND_FROM_EMAIL:
        raise RuntimeError("Password reset email is not configured")

    reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password#token={token}"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#2E342F">
      <h2>Reset your Bright Roots password</h2>
      <p>We received a request to reset your Bright Roots parent account password.</p>
      <p>
        <a href="{reset_url}" style="display:inline-block;background:#3F5D46;color:white;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">
          Reset password
        </a>
      </p>
      <p>This link expires in 30 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
    """

    response = httpx.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": settings.RESEND_FROM_EMAIL,
            "to": [email],
            "subject": "Reset your Bright Roots password",
            "html": html,
        },
        timeout=10.0,
    )
    response.raise_for_status()


@router.post("/register")
def register():
    """Public self-registration is permanently disabled. Accounts are created
    directly by the site owner (see backend/add_users.py), not through this
    API. The route is kept (rather than removed) in case anything internal
    ever references the path — it always rejects, before touching the
    database at all."""
    raise HTTPException(
        status_code=403,
        detail="Public registration is disabled. Contact the site owner to get an account created.",
    )


@router.post("/login", response_model=Token)
def login(
    response: Response,
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    client_ip = _client_ip(request)
    _check_login_rate_limit(client_ip, form_data.username)

    user = db.query(User).filter(User.username == form_data.username).first()
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
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        username=user.username,
        email_verified=(user.email_verified_at is not None),
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
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/change-password")
def change_password(
    body: ChangePasswordRequest,
    response: Response,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    user = db.query(User).filter(
        func.lower(User.email) == body.email.strip().lower(),
        User.role == "parent",
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
        User.role == "parent",
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
    current_user: User = Depends(get_current_user),
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

    return {"message": "Email verified successfully."}
