from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import re
import secrets

from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
from models import User
from config import settings

SESSION_COOKIE_NAME = "brightroots_session"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def find_login(db: Session, typed: str) -> Optional[User]:
    """Who is logging in: by login name (older accounts: their username) or by email address."""
    typed = (typed or "").strip()
    if not typed:
        return None
    exact = db.query(User).filter(User.login_name == typed).first()
    if exact:
        return exact
    lowered = typed.lower()
    matches = db.query(User).filter(func.lower(User.login_name) == lowered).limit(2).all()
    if len(matches) == 1:
        return matches[0]
    if "@" in typed:
        return db.query(User).filter(func.lower(User.email) == lowered).first()
    return None


def login_name_taken(db: Session, name: str) -> bool:
    lowered = (name or "").strip().lower()
    if not lowered:
        return True
    return (
        db.query(User.id)
        .filter((func.lower(User.login_name) == lowered) | (func.lower(User.email) == lowered))
        .first()
        is not None
    )


def clean_login_name(name: str) -> str:
    """Login names are simple to type: letters, numbers, dots, dashes and underscores."""
    return re.sub(r"[^A-Za-z0-9._-]", "", (name or "").strip())[:50]


def suggest_login_names(db: Session, name: str, family_name: str = "", count: int = 3) -> list[str]:
    """Free login names based on someone's name, best first: Oscar, Oscar.Max, Oscar27..."""
    base = clean_login_name(name) or "learner"
    extra = clean_login_name(family_name)
    candidates = [base]
    if extra and extra.lower() != base.lower():
        candidates.append(f"{base}.{extra}")
    found: list[str] = []
    for candidate in candidates:
        if len(candidate) >= 2 and not login_name_taken(db, candidate):
            found.append(candidate)
    tries = 0
    while len(found) < count and tries < 200:
        tries += 1
        candidate = f"{base}{secrets.randbelow(900) + 10}"
        if candidate not in found and not login_name_taken(db, candidate):
            found.append(candidate)
    return found[:count]


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


COPARENT_ROLE = "coparent"


def get_login_user(
    token: Optional[str] = Depends(oauth2_scheme),
    session_token: Optional[str] = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    auth_token = session_token or token
    if not auth_token:
        raise credentials_exception
    try:
        payload = jwt.decode(auth_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    token_version = payload.get("ver", 1)
    if token_version != user.session_version:
        raise credentials_exception

    return user


def get_authenticated_user(
    login_user: User = Depends(get_login_user),
    db: Session = Depends(get_db),
) -> User:
    """The account this request acts for.

    A second grown-up (role "coparent") has their own login but works on the family's main parent account,
    so everything that belongs to the family keeps a single owner. The person actually logged in is kept on
    `acting_user`; use `actor(user)` to get them, and `get_login_user` for things that are personal to a
    login, such as changing a password.
    """
    if login_user.role != COPARENT_ROLE:
        login_user.acting_user = login_user
        return login_user
    owner = db.query(User).filter(User.id == login_user.family_owner_id, User.role == "parent").first()
    if owner is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    owner.acting_user = login_user
    return owner


def actor(user: User) -> User:
    """The person actually logged in (differs from `user` for a second grown-up)."""
    return getattr(user, "acting_user", None) or user


def is_family_owner(user: User) -> bool:
    return actor(user).id == user.id


def user_has_membership_access(user: User, db: Session) -> bool:
    if user.role == "child":
        if not user.parent_id:
            return False
        user = db.query(User).filter(
            User.id == user.parent_id,
            User.role == "parent",
        ).first()
        if user is None:
            return False

    if user.role != "parent":
        return False

    if user.subscription_status in {"active", "grandfathered"}:
        return True

    now = datetime.utcnow()

    if user.subscription_status == "trialing":
        return bool(user.trial_ends_at and user.trial_ends_at > now)

    if user.subscription_status == "canceling":
        return bool(
            user.subscription_cancel_at
            and user.subscription_cancel_at > now
        )

    return False


def get_current_user(
    current_user: User = Depends(get_authenticated_user),
    db: Session = Depends(get_db),
) -> User:
    if not user_has_membership_access(current_user, db):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Membership required",
        )
    return current_user


def require_parent(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parent access required")
    if current_user.email_verified_at is None:
        raise HTTPException(status_code=403, detail="Please verify your email address")
    return current_user


def require_owner(current_user: User = Depends(require_parent)) -> User:
    """Things only the main account holder can do: billing, deleting the account, managing grown-ups."""
    if not is_family_owner(current_user):
        raise HTTPException(status_code=403, detail="Only the main account holder can do this")
    return current_user


def require_child(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "child":
        raise HTTPException(status_code=403, detail="Child access required")
    return current_user
