import os

from database import SessionLocal
from models import User
from auth import hash_password


def required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


parent_email = required_env("BOOTSTRAP_PARENT_EMAIL")
parent_username = os.getenv("BOOTSTRAP_PARENT_USERNAME", "Max")
parent_password = required_env("BOOTSTRAP_PARENT_PASSWORD")

child_email = required_env("BOOTSTRAP_CHILD_EMAIL")
child_username = os.getenv("BOOTSTRAP_CHILD_USERNAME", "Oscar")
child_password = required_env("BOOTSTRAP_CHILD_PASSWORD")


db = SessionLocal()

try:
    parent = db.query(User).filter(User.username == parent_username).first()

    if not parent:
        parent = User(
            email=parent_email,
            username=parent_username,
            hashed_password=hash_password(parent_password),
            role="parent",
        )
        db.add(parent)
        db.flush()
        print(f"Added parent: {parent_username}")
    else:
        print(f"Parent already exists: {parent_username}")

    child = db.query(User).filter(User.username == child_username).first()

    if not child:
        child = User(
            email=child_email,
            username=child_username,
            hashed_password=hash_password(child_password),
            role="child",
            parent_id=parent.id,
        )
        db.add(child)
        print(f"Added child: {child_username}")
    else:
        if child.parent_id != parent.id:
            child.parent_id = parent.id
            print(f"Linked child {child_username} to parent {parent_username}")
        else:
            print(f"Child already exists: {child_username}")

    db.commit()
finally:
    db.close()
