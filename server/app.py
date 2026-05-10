import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
from flask import Flask, send_from_directory, jsonify, request, session
from server.models import init_db, get_progress, mark_progress, get_all_users, get_user_progress_per_chapter, get_total_lessons_count, get_user_by_id
from server.auth import auth_bp, login_required, admin_required

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, 'static')
LESSONS_FILE = os.path.join(BASE_DIR, 'data', 'lessons.json')
CHEATSHEETS_FILE = os.path.join(BASE_DIR, 'data', 'cheatsheets.json')

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-change-me')

app.register_blueprint(auth_bp)

with app.app_context():
    init_db()

@app.route('/')
def index():
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    if os.path.isfile(os.path.join(STATIC_DIR, path)):
        return send_from_directory(STATIC_DIR, path)
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/api/lessons')
def api_lessons():
    try:
        with open(LESSONS_FILE, 'r') as f:
            lessons = json.load(f)
        return jsonify(lessons)
    except Exception as e:
        return jsonify([])

@app.route('/api/progress/<lesson_id>', methods=['POST'])
@login_required
def api_mark_progress(lesson_id):
    user_id = session['user_id']
    mark_progress(user_id, lesson_id)
    return jsonify({'ok': True})

@app.route('/api/admin/students')
@admin_required
def api_admin_students():
    users = get_all_users()
    total = get_total_lessons_count()
    result = []
    for u in users:
        done = len(get_user_progress_per_chapter(u['id']))
        result.append({
            'id': u['id'],
            'username': u['username'],
            'done': done,
            'total': total,
            'percent': round(done / total * 100, 1) if total else 0
        })
    return jsonify(result)

@app.route('/api/admin/student/<int:user_id>')
@admin_required
def api_admin_student(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    done_lessons = set(get_user_progress_per_chapter(user_id))

    try:
        with open(LESSONS_FILE, 'r') as f:
            lessons = json.load(f)
    except Exception:
        lessons = []

    chapters = {}
    for l in lessons:
        ch = l.get('chapter', 'Unknown')
        if ch not in chapters:
            chapters[ch] = {'total': 0, 'done': 0}
        chapters[ch]['total'] += 1
        if l['id'] in done_lessons:
            chapters[ch]['done'] += 1

    chapter_progress = {}
    for ch, stats in chapters.items():
        chapter_progress[ch] = {
            'done': stats['done'],
            'total': stats['total'],
            'percent': round(stats['done'] / stats['total'] * 100, 1) if stats['total'] else 0
        }

    return jsonify({
        'username': user['username'],
        'progress_per_chapter': chapter_progress
    })

@app.route('/api/cheatsheets')
def api_cheatsheets():
    try:
        with open(CHEATSHEETS_FILE, 'r') as f:
            cheatsheets = json.load(f)
        return jsonify(cheatsheets)
    except Exception as e:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, port=5005)
