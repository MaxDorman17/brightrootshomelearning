# Homeschool App — Local Setup

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

---

## 1. Database Setup

Open psql as a superuser and run:
```sql
CREATE USER homeschool_user WITH PASSWORD 'CHANGE_ME_TO_A_STRONG_PASSWORD';
CREATE DATABASE homeschool_db OWNER homeschool_user;
GRANT ALL PRIVILEGES ON DATABASE homeschool_db TO homeschool_user;
```

Or run the file:
```
psql -U postgres -f setup.sql
```

---

## 2. Backend Setup

```bash
cd homeschool-app/backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create backend/.env locally with your own DATABASE_URL and SECRET_KEY.
# Real environment files are intentionally not committed.

# Optional first-account bootstrap:
# set the BOOTSTRAP_* environment variables, then run:
python add_users.py

# Start the API server
uvicorn main:app --reload --port 8000
```

API runs at http://localhost:8000
Swagger docs at http://localhost:8000/docs

---

## 3. Frontend Setup

```bash
cd homeschool-app/frontend

npm install
npm run dev
```

App runs at http://localhost:3000

---

## Accounts

Bright Roots does not include default or demo login credentials.
Accounts should be created intentionally using the bootstrap environment variables
documented in `backend/add_users.py`.

---

## Usage Flow

1. Log in as **parent** → Add lessons → They appear in the weekly planner
2. Log in as **child** → See today's lessons → Click "Mark Done" to complete them

---

## Project Structure

```
homeschool-app/
├── backend/
│   ├── main.py          # FastAPI app entry point
│   ├── config.py        # Settings from .env
│   ├── database.py      # SQLAlchemy engine + session
│   ├── models.py        # User, Lesson, PlannerEntry ORM models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── auth.py          # JWT + bcrypt helpers + dependencies
│   ├── seed.py          # Demo data seeder
│   ├── requirements.txt
│   ├── .env
│   └── routers/
│       ├── auth.py      # /api/auth/register, /login, /me
│       ├── lessons.py   # /api/lessons CRUD
│       └── planner.py   # /api/planner week/today/complete
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx         # Root redirect
    │   │   ├── login/page.tsx   # Login + Register
    │   │   ├── parent/page.tsx  # Parent dashboard
    │   │   └── child/page.tsx   # Child dashboard
    │   ├── components/
    │   │   └── Navbar.tsx
    │   ├── lib/
    │   │   ├── api.ts           # Axios client + API calls
    │   │   └── auth.ts          # localStorage helpers
    │   └── types/
    │       └── index.ts         # TypeScript interfaces
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── next.config.js
```
