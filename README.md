<div align="center">

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   ██████╗ ██╗      █████╗ ███████╗ ██████╗ ██╗  │
│   ██╔══██╗██║     ██╔══██╗██╔════╝██╔═══██╗██║  │
│   ██████╔╝██║     ███████║███████╗██║   ██║██║  │
│   ██╔═══╝ ██║     ██╔══██║╚════██║██║▄▄ ██║██║  │
│   ██║     ███████╗██║  ██║███████║╚██████╔╝███████╗
│   ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝ ╚══════╝
│                                                  │
│              espri-plsql-3A                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

</div>

<div align="center">

**A self-hosted platform where ESPRIT students learn PL/SQL step‑by‑step through 133 structured lessons.**

</div>

---

<div align="center">

![](https://img.shields.io/badge/python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![](https://img.shields.io/badge/flask-000000?style=flat-square&logo=flask&logoColor=white)
![](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![](https://img.shields.io/badge/docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![](https://img.shields.io/badge/gunicorn-499848?style=flat-square&logo=gunicorn&logoColor=white)
![](https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=white)

</div>

---

## Course Scope

| Chapter | Lessons | Topics |
| --- | :-: | --- |
| **CH1** | 24 | Anonymous Blocks — `DECLARE`, variables, `%TYPE`, `%ROWTYPE`, `IF`/`CASE`, `FOR`/`WHILE` loops |
| **CH2** | 17 | Cursors — explicit, implicit, `FOR` loops, parameterized, attributes |
| **CH3** | 19 | Procedures & Functions — `IN`/`OUT`/`IN OUT`, local subprograms, `RETURN` |
| **CH4** | 22 | Triggers — `BEFORE`/`AFTER`, `:NEW`/`:OLD`, `INSTEAD OF`, management |
| **CH5** | 20 | Exceptions — built-in, user-defined, `PRAGMA EXCEPTION_INIT`, `RAISE_APPLICATION_ERROR` |
| **Mini** | 14 | Mini Projects — combining all chapters |
| **Exam** | 17 | Full PL/SQL exam |
| **Total** | **133** | |

Each lesson follows: **Read** → **Run** → **Memorize** → **Practice** → **Drill** → **Mark Done**

---

## Architecture

```
nginx (plsql.example.com → 127.0.0.1:8083)
  └── Docker container: plsql-learning
        ├── gunicorn → Flask app (internal port 8000)
        │     ├── /api/*        JSON API (auth, progress, lessons)
        │     └── /             static SPA (index.html)
        ├── SQLite: data/app.db
        └── data/lessons.json   (133 structured lessons)
```

---

## Quick Start

### Local development

```bash
pip install -r server/requirements.txt
python server/app.py          # → http://localhost:5000
```

### VPS deployment

```bash
git clone git@github.com:sadok-dridi/esprit-plsql-3A.git
cd esprit-plsql-3A
cp .env.example .env          # set SECRET_KEY
docker compose up -d --build
```

nginx config:
```nginx
server {
    listen 80;
    server_name plsql.example.com;

    location / {
        proxy_pass http://127.0.0.1:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## API

| Method | Endpoint | Auth | Description |
| --- | :-: | :-: | --- |
| `POST` | `/api/register` | — | Create account |
| `POST` | `/api/login` | — | Sign in |
| `POST` | `/api/logout` | ✓ | Sign out |
| `GET` | `/api/me` | ✓ | Current user + progress |
| `GET` | `/api/lessons` | ✓ | All 133 lessons |
| `POST` | `/api/progress/:id` | ✓ | Mark lesson done |
| `GET` | `/api/admin/students` | — | All students & stats |
| `GET` | `/api/admin/student/:id` | — | Per-chapter detail |

---

## SPA Views

| Route | View | Auth |
| --- | --- | :-: |
| `#/login` | Login + Register | — |
| `#/onboarding` | Oracle XE requirement | ✓ |
| `#/dashboard` | Stats + chapter cards | ✓ |
| `#/learn/:chapter` | Chapter overview | ✓ |
| `#/learn/:chapter/:id` | Full lesson workflow | ✓ |
| `#/roadmap` | Checklist with progress | ✓ |
| `#/memory` | Memorization items | ✓ |
| `#/admin` | All students list | — |

---

## File Structure

```
esprit-plsql-3A/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── server/
│   ├── app.py              # Flask entry, routes, config
│   ├── auth.py             # Register, login, logout, sessions
│   ├── models.py           # SQLite init, user & progress queries
│   └── requirements.txt    # flask, bcrypt, gunicorn
├── static/
│   ├── index.html          # SPA shell
│   ├── app.js              # Hash router + API client
│   └── styles.css          # Dark theme
└── data/
    ├── lessons.json        # 133 lessons
    └── cheatsheets.json    # Syntax reference
```
