import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'app.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS progress (
        user_id INTEGER NOT NULL,
        lesson_id TEXT NOT NULL,
        done INTEGER DEFAULT 1,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, lesson_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )''')
    conn.commit()
    conn.close()

def create_user(username, password_hash):
    conn = get_db()
    try:
        cur = conn.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)',
                           (username, password_hash))
        conn.commit()
        return cur.lastrowid
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_username(username):
    conn = get_db()
    row = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    return row

def get_user_by_id(user_id):
    conn = get_db()
    row = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return row

def get_progress(user_id):
    conn = get_db()
    rows = conn.execute('SELECT lesson_id, done, completed_at FROM progress WHERE user_id = ?',
                        (user_id,)).fetchall()
    conn.close()
    return {row['lesson_id']: {'done': row['done'], 'completed_at': row['completed_at']} for row in rows}

def mark_progress(user_id, lesson_id):
    conn = get_db()
    conn.execute('INSERT OR REPLACE INTO progress (user_id, lesson_id, done, completed_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)',
                 (user_id, lesson_id))
    conn.commit()
    conn.close()

def get_all_users():
    conn = get_db()
    rows = conn.execute('SELECT id, username, created_at FROM users ORDER BY id').fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_user_progress_per_chapter(user_id):
    conn = get_db()
    rows = conn.execute('SELECT lesson_id FROM progress WHERE user_id = ? AND done = 1',
                        (user_id,)).fetchall()
    conn.close()
    return [row['lesson_id'] for row in rows]

def get_total_lessons_count():
    import json
    lessons_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'lessons.json')
    try:
        with open(lessons_path) as f:
            return len(json.load(f))
    except Exception:
        return 133
