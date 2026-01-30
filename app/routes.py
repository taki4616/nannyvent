import jwt
import datetime
from functools import wraps
from flask import Blueprint, request, jsonify, current_app
from models import db, User, Post

routes = Blueprint('routes', __name__)

VALID_ROLES = ('nanny', 'parent')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# --- Auth endpoints ---

@routes.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON payload"}), 400

    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    role = data.get('role', '').lower()

    if not username or not email or not password or not role:
        return jsonify({"error": "All fields are required"}), 400

    if role not in VALID_ROLES:
        return jsonify({"error": "Role must be 'nanny' or 'parent'"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    try:
        user = User(username=username, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Registration failed"}), 500

@routes.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON payload"}), 400

    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }), 200

# --- Post endpoints ---

@routes.route('/api/posts', methods=['POST'])
@token_required
def create_post(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON payload"}), 400

    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    role = data.get('role', '').lower()

    if not title or not content or not role:
        return jsonify({"error": "Title, content, and role are required"}), 400

    if role not in VALID_ROLES:
        return jsonify({"error": "Role must be 'nanny' or 'parent'"}), 400

    try:
        new_post = Post(title=title, content=content, role=role, user_id=current_user.id)
        db.session.add(new_post)
        db.session.commit()
        return jsonify({"message": "Post created successfully", "post_id": new_post.id}), 201
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create post"}), 500

@routes.route('/api/posts/<role>', methods=['GET'])
def get_posts(role):
    if role not in VALID_ROLES:
        return jsonify({"error": "Invalid role. Must be 'nanny' or 'parent'"}), 400

    posts = Post.query.filter_by(role=role).order_by(Post.created_at.desc()).all()
    return jsonify([
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "role": post.role,
            "author": post.author.username if post.author else "Anonymous",
            "created_at": post.created_at.isoformat()
        } for post in posts
    ])

@routes.route('/api/posts/<int:post_id>', methods=['PUT'])
@token_required
def update_post(current_user, post_id):
    post = Post.query.get_or_404(post_id)
    if post.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if data.get('title'):
        post.title = data['title'].strip()
    if data.get('content'):
        post.content = data['content'].strip()

    try:
        db.session.commit()
        return jsonify({"message": "Post updated successfully"})
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to update post"}), 500

@routes.route('/api/posts/<int:post_id>', methods=['DELETE'])
@token_required
def delete_post(current_user, post_id):
    post = Post.query.get_or_404(post_id)
    if post.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Post deleted successfully"})
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to delete post"}), 500

# --- Test endpoint ---

@routes.route('/test', methods=['GET'])
@routes.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({"message": "Backend is connected!"})
