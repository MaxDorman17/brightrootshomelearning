from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import Token, UserOut
from auth import SESSION_COOKIE_NAME, verify_password, create_access_token, get_current_user
from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


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
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = create_access_token({"sub": str(user.id)})
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
