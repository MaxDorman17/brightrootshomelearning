from database import SessionLocal
from models import User
from auth import hash_password

db = SessionLocal()

if not db.query(User).filter(User.username == "Max").first():
    db.add(User(
        email="maxdorman17@outlook.com",
        username="Max",
        hashed_password=hash_password("1973"),
        role="parent",
    ))
    print("Added: Max (parent)")
else:
    print("Max already exists")

if not db.query(User).filter(User.username == "Oscar").first():
    db.add(User(
        email="oscardorman17@outlook.com",
        username="Oscar",
        hashed_password=hash_password("1973"),
        role="child",
    ))
    print("Added: Oscar (child)")
else:
    print("Oscar already exists")

db.commit()
db.close()
