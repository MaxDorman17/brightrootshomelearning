"""Run once to create demo accounts: parent/parent123 and child/child123"""
from database import SessionLocal, engine, Base
from models import User
from auth import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if not db.query(User).filter(User.username == "parent").first():
    db.add(User(
        email="parent@example.com",
        username="parent",
        hashed_password=hash_password("parent123"),
        role="parent",
    ))

if not db.query(User).filter(User.username == "child").first():
    db.add(User(
        email="child@example.com",
        username="child",
        hashed_password=hash_password("child123"),
        role="child",
    ))

db.commit()
db.close()
print("Seed complete: parent/parent123  |  child/child123")
