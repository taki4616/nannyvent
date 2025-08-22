from flask import Blueprint, request, jsonify
from models import db, Post  # Import db from models, not from app

routes = Blueprint('routes', __name__)

# Create a post
@routes.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON payload"}), 400

    title = data.get('title')
    content = data.get('content')
    role = data.get('role')

    if not title or not content or not role:
        return jsonify({"error": "Title, content, and role are required"}), 400

    new_post = Post(
        title=title,
        content=content,
        role=role
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify({"message": "Post created successfully"}), 201

# Fetch posts by role
@routes.route('/api/posts/<role>', methods=['GET'])
def get_posts(role):
    posts = Post.query.filter_by(role=role).order_by(Post.created_at.desc()).all()
    return jsonify([
        {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "role": post.role,
            "created_at": post.created_at.isoformat()
        } for post in posts
    ])