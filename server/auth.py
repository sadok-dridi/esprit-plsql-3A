import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import bcrypt
from flask import Blueprint, request, session, jsonify
from server.models import create_user, get_user_by_username, get_user_by_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'ok': False, 'error': 'No data provided'}), 400

    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'ok': False, 'error': 'Username and password required'}), 400

    if len(password) < 4:
        return jsonify({'ok': False, 'error': 'Password must be at least 4 characters'}), 400

    if get_user_by_username(username):
        return jsonify({'ok': False, 'error': 'Username already exists'}), 409

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_id = create_user(username, password_hash)

    if not user_id:
        return jsonify({'ok': False, 'error': 'Registration failed'}), 500

    session['user_id'] = user_id
    return jsonify({'ok': True, 'user': {'id': user_id, 'username': username}})

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'ok': False, 'error': 'No data provided'}), 400

    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'ok': False, 'error': 'Username and password required'}), 400

    user = get_user_by_username(username)
    if not user:
        return jsonify({'ok': False, 'error': 'Invalid username or password'}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
        return jsonify({'ok': False, 'error': 'Invalid username or password'}), 401

    session['user_id'] = user['id']
    return jsonify({'ok': True, 'user': {'id': user['id'], 'username': user['username']}})

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'ok': True})

@auth_bp.route('/api/me', methods=['GET'])
def me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'user': None, 'progress': {}})

    user = get_user_by_id(user_id)
    if not user:
        session.pop('user_id', None)
        return jsonify({'user': None, 'progress': {}})

    from server.models import get_progress
    progress = get_progress(user_id)

    return jsonify({
        'user': {'id': user['id'], 'username': user['username']},
        'progress': progress
    })

def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({'ok': False, 'error': 'Login required'}), 401
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    import os
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'ok': False, 'error': 'Login required'}), 401
        admin_user = os.environ.get('ADMIN_USERNAME')
        if admin_user:
            user = get_user_by_id(user_id)
            if not user or user['username'] != admin_user:
                return jsonify({'ok': False, 'error': 'Forbidden'}), 403
        elif user_id != 1:
            return jsonify({'ok': False, 'error': 'Forbidden'}), 403
        return f(*args, **kwargs)
    return decorated
