from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
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


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_authenticated_user(
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


def require_child(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "child":
        raise HTTPException(status_code=403, detail="Child access required")
    return current_user
