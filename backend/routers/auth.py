from collections import defaultdict, deque
from threading import Lock
from time import monotonic

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import Token, UserOut
from auth import SESSION_COOKIE_NAME, verify_password, hash_password, create_access_token, get_current_user
from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


LOGIN_WINDOW_SECONDS = 10 * 60
MAX_FAILURES_PER_ACCOUNT_IP = 5
MAX_FAILURES_PER_IP = 25

_failed_by_account_ip = defaultdict(deque)
_failed_by_ip = defaultdict(deque)
_rate_limit_lock = Lock()


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
    return Token(access_token=token, token_type="bearer", role=user.role, username=user.username)


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
