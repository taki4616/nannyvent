# pylint: disable=unused-import
# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config  # Adjust the import based on your file structure
from models import User, Post

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    # Register your routes
    from routes import main  # Import your routes
    app.register_blueprint(main)

    return app
