<div align="center">

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ██████╗ ██╗      █████╗ ███████╗ ██████╗ ██╗      │
│   ██╔══██╗██║     ██╔══██╗██╔════╝██╔═══██╗██║      │
│   ██████╔╝██║     ███████║███████╗██║   ██║██║      │
│   ██╔═══╝ ██║     ██╔══██║╚════██║██║▄▄ ██║██║      │
│   ██║     ███████╗██║  ██║███████║╚██████╔╝███████╗ │
│   ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝ ╚══════╝ │
│                                                     │
│              espri-plsql-3A                         │
│                                                     │
└─────────────────────────────────────────────────────┘
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



## Quick Start

### Local development

```bash
pip install -r server/requirements.txt
python server/app.py          # → http://localhost:5000
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
