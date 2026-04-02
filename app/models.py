from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Profile fields
    bio = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100), nullable=True)
    profile_picture = db.Column(db.Text, nullable=True)  # base64 data URL

    # Nanny-specific
    experience_years = db.Column(db.Integer, nullable=True)
    availability = db.Column(db.String(200), nullable=True)
    certifications = db.Column(db.String(200), nullable=True)

    # Parent-specific
    children_info = db.Column(db.String(200), nullable=True)
    schedule_needed = db.Column(db.String(200), nullable=True)

    posts = db.relationship('Post', backref='author', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_profile_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "bio": self.bio,
            "location": self.location,
            "profile_picture": self.profile_picture,
            "experience_years": self.experience_years,
            "availability": self.availability,
            "certifications": self.certifications,
            "children_info": self.children_info,
            "schedule_needed": self.schedule_needed,
            "member_since": self.created_at.strftime("%B %Y") if self.created_at else None,
        }

    def __repr__(self):
        return f'<User {self.username}>'

class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Post {self.title}>'
