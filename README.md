# Bright Roots Home Learning

A home learning planner for UK families: parents plan the week, and each child gets their own space to learn,
earn stars and keep a record of what they've done.

- **Frontend:** Next.js (in `frontend/`)
- **Backend:** FastAPI with SQLite (in `backend/`)
- **Live site:** https://brightrootshomelearning.co.uk, with the API at https://api.brightrootshomelearning.co.uk

---

## Running it locally

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

Create `backend/.env` (it is not committed). The two required settings are:

```
DATABASE_URL=sqlite:///./homeschool.db
SECRET_KEY=<a long random string>
```

Optional settings (all in `backend/config.py`): `FRONTEND_URL`, `RESEND_API_KEY` and `RESEND_FROM_EMAIL` for email, `EMAIL_REPLY_TO` for where replies to those emails go (default help@brightrootshomelearning.co.uk),
`OAK_API_KEY` for Oak National Academy, `STRIPE_*` for billing, `ADMIN_EMAILS` for newsletter admins, and
`UPLOAD_ROOT` for where uploaded files are kept.

The database tables and any schema updates are created automatically when the server starts.

To create a first parent and child account, set the `BOOTSTRAP_*` environment variables described in
`backend/add_users.py`, then run `python add_users.py`. There are no built-in logins with known passwords.

### Demo family

Set `DEMO_ENABLED=true` on the backend to let anyone look round a made-up family without signing up.
The login page then shows "Try our demo family" buttons (link straight to them with `/login#demo`).
The family (a grown-up called Jo, and Ruby, 9, and Sam, 13) comes with a few weeks of lessons, scores,
books and stars, and is wiped and rebuilt every night at 4am UK time. Demo visitors can't change
passwords, add or remove people, pay, upload files or trigger any emails. See `backend/demo.py`.

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

The API runs at http://localhost:8000, and its interactive docs are at http://localhost:8000/docs. The docs are
only switched on when `FRONTEND_URL` is a localhost address, so they don't appear on the live site.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The site runs at http://localhost:3000. It talks to the API at `NEXT_PUBLIC_API_URL`, which defaults to
http://localhost:8000.

### Tests

The backend has automated tests for the things that matter most: signing up and logging in, children and
extra grown-ups, planning, stars and rewards, notes, languages, family badges and deleting an account.

```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest
```

They run against a brand-new temporary database each time, with email, Stripe and Oak switched off, so they
never touch real family data. Run them before pushing a change to the backend.

---

## Deploying

The live site runs in Coolify. To deploy, push to `main` on GitHub, then redeploy the frontend and/or backend in
Coolify. When the frontend depends on a new API change, redeploy the backend first.

On the live server the database is `/data/homeschool.db` and uploads go to `/data/uploads`. The `/data` folder
survives redeploys, but the app folder is replaced each time, so never save files relative to the app folder.

The live database holds real family data. Schema changes run as startup migrations in `backend/main.py`: keep
them additive, back up the database first (`backup_sqlite_database`), and test them on a copy.

`setup.sql` is from an older self-managed setup and is not used by the live site. The old `deploy/` scripts from that setup have been removed: they left settings out that the live site needs.
