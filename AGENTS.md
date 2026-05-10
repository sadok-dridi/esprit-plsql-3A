# AGENTS.md

## Project: ESPRIT PL/SQL Learning Platform

A self-hosted web app where ESPRIT university students create accounts and learn PL/SQL step-by-step through 133 structured lessons. Deployed via Docker on a VPS behind nginx.

## Course Scope

PL/SQL only, based on the five PDFs:
- CH1: anonymous blocks
- CH2: cursors
- CH3: procedures and functions
- CH4: triggers
- CH5: exceptions

Avoid: ER diagrams, normalization, indexing theory, DBA tasks, migrations, packages, advanced tuning.

## Architecture

```
nginx (plsql.example.com → 127.0.0.1:8083)
  └── Docker container: plsql-learning
        ├── gunicorn → Flask app (internal port 8000)
        │     ├── /api/*        JSON API (auth, progress, lessons)
        │     └── /             static SPA (index.html)
        ├── SQLite: data/app.db
        │     ├── users (id, username, password_hash, created_at)
        │     └── progress (user_id, lesson_id, done, completed_at)
        └── data/lessons.json   (133 structured lessons)
```

### Ports
- Container internal: `8000`
- Host mapping: `127.0.0.1:8083:8000` (avoids conflict with `pidev-api` on 8000)
- nginx: `proxy_pass http://127.0.0.1:8083;`

## File Structure

```
database/
├── server/
│   ├── app.py              # Flask entry, config, route registration
│   ├── auth.py             # /api/register, /api/login, /api/logout, session
│   ├── models.py           # SQLite init, user queries, progress queries
│   └── requirements.txt    # flask, bcrypt, gunicorn
├── data/
│   ├── lessons.json        # 133 lessons (id, chapter, title, schema, run, memorize, practice[], drill)
│   └── app.db              # SQLite database (auto-created on first run)
├── static/
│   ├── index.html          # SPA shell
│   ├── app.js              # Hash router + API client + 7 views
│   └── styles.css          # Dark theme (skills.sh-inspired)
├── Dockerfile              # python:3.12-slim, gunicorn
├── docker-compose.yml      # Port 8083:8000, volume for data/
├── .env.example            # SECRET_KEY template
├── ROADMAP.md              # Reference: 137 checklist items
└── PROGRESS_MEMORY.md      # Original revision notes (CH1 only, no longer the app source)
```

Deleted files (merged into SPA): `roadmap.html`, `roadmap.js`.

## SPA Views (Hash Router)

| Route | View | Auth? |
|---|---|---|
| `#/login` | Login + Register tabs | No |
| `#/onboarding` | Oracle XE requirement notice (first visit) | Yes |
| `#/dashboard` | Stats + chapter cards | Yes |
| `#/learn/:chapter` | Chapter overview, lesson list | Yes |
| `#/learn/:chapter/:id` | Full lesson: Task → Run → Memorize → Practice → Drill → Mark Done | Yes |
| `#/roadmap` | Checklist with progress bars | Yes |
| `#/memory` | Accumulated memorization items from done lessons | Yes |
| `#/admin` | All students list with progress stats | No |

### Admin View (`#/admin`)
- No login required (or simple shared admin access)
- Lists all registered students
- Per student: username, total items completed, completion percentage
- Detail: expand to see per-chapter progress

## API Endpoints

| Method | Path | Body | Returns | Auth? |
|---|---|---|---|---|
| POST | `/api/register` | `{username, password}` | `{ok, user}` | No |
| POST | `/api/login` | `{username, password}` | `{ok, user}` | No |
| POST | `/api/logout` | — | `{ok}` | Yes |
| GET | `/api/me` | — | `{user, progress{} }` | Yes |
| GET | `/api/lessons` | — | `[{lesson}, ...]` 133 items | Yes |
| POST | `/api/progress/:lesson_id` | — | `{ok}` | Yes |
| GET | `/api/admin/students` | — | `[{username, done, total, percent}, ...]` | No* |
| GET | `/api/admin/student/:id` | — | `{username, progress_per_chapter}` | No* |

*No auth for admin endpoints (or simple query-param key).

## Auth
- Flask signed session cookies (server-side)
- bcrypt password hashing
- Password: minimum 4 characters, no other policy
- Session stored in Flask's default signed cookie

## Lesson Format (data/lessons.json)

```json
{
  "id": "ch1-for-loop",
  "chapter": "CH1: Anonymous Blocks",
  "title": "Practice FOR i IN 1..10 LOOP",
  "schema": "hr",
  "run": "SET SERVEROUTPUT ON;\nBEGIN\n  FOR i IN 1..10 LOOP\n    DBMS_OUTPUT.PUT_LINE(i);\n  END LOOP;\nEND;\n/",
  "memorize": {
    "syntax": "FOR counter IN lower..upper LOOP ... END LOOP;",
    "points": ["point 1", "point 2", ...]
  },
  "practice": [
    { "label": "Variant A", "code": "..." },
    { "label": "Variant B", "code": "..." }
  ],
  "drill": "Write a FOR loop from memory that prints squares from 1 to 10."
}
```

- `schema`: `"hr"` (query HR tables), `"user"` (own tables/CREATE), or `"mixed"` (combo)
- 133 total lessons: CH1(24) + CH2(17) + CH3(19) + CH4(22) + CH5(20) + Mini(14) + Exam(17)

## Local Development

```bash
cd database
pip install -r server/requirements.txt
python server/app.py        # Flask dev → http://localhost:5000
```

## VPS Deployment

```bash
git pull
docker compose up -d --build
# nginx: proxy_pass http://127.0.0.1:8083;
```

## Oracle PL/SQL Syntax Reference

- anonymous block: `DECLARE`, `BEGIN`, optional `EXCEPTION`, `END;`, `/`
- variables: `:=`, `DEFAULT`, `CONSTANT`, `NOT NULL`, `%TYPE`, `%ROWTYPE`, `RECORD`
- control flow: `IF THEN ELSE ELSIF`, `CASE WHEN THEN END CASE`, `WHILE LOOP`, `LOOP EXIT WHEN`, `FOR`
- `SELECT ... INTO` returning exactly one row
- explicit cursors: `DECLARE CURSOR`, `OPEN`, `FETCH`, `EXIT WHEN %NOTFOUND`, `CLOSE`
- cursor attributes: `%ISOPEN`, `%FOUND`, `%NOTFOUND`, `%ROWCOUNT`
- cursor `FOR` loops, implicit `FOR rec IN (SELECT ...)`, parameterized cursors
- stored procedures/functions: `CREATE OR REPLACE`, `IN/OUT/IN OUT`, `RETURN`
- local procedures/functions inside `DECLARE`
- triggers: `BEFORE/AFTER INSERT/UPDATE/DELETE`, `FOR EACH ROW`, `:NEW`, `:OLD`
- trigger events: `IF INSERTING/UPDATING/DELETING THEN`, `WHEN` condition
- trigger management: `ALTER TRIGGER ENABLE/DISABLE`, `DROP TRIGGER`
- exceptions: `NO_DATA_FOUND`, `TOO_MANY_ROWS`, `ZERO_DIVIDE`, `DUP_VAL_ON_INDEX`, `INVALID_CURSOR`, `CURSOR_ALREADY_OPEN`, `INVALID_NUMBER`, `ROWTYPE_MISMATCH`
- `WHEN OTHERS THEN`, `SQLCODE`, `SQLERRM`
- user-defined: `exception_name EXCEPTION;`, `RAISE`, `PRAGMA EXCEPTION_INIT`, `RAISE_APPLICATION_ERROR(-20000, 'msg')`

## Build Commands

```bash
# Validate lessons.json
python3 -c "import json; d=json.load(open('data/lessons.json')); print(f'{len(d)} lessons, valid JSON')"

# Run Flask dev server
python server/app.py

# Docker build and run
docker compose up -d --build
```
