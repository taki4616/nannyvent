# routes.py
from flask import Blueprint, jsonify, request
from app import db
from models import User, Post

main = Blueprint('main', __name__)

@main.route('/')  # Use 'main' instead of 'app'
def home():
    return "Welcome to Nannyvent!"

@main.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@main.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([{'title': post.title, 'content': post.content} for post in posts]), 200
