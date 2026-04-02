import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Render provides postgres:// but SQLAlchemy 2.x requires postgresql://
    uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if uri.startswith('postgres://'):
        app.config['SQLALCHEMY_DATABASE_URI'] = uri.replace('postgres://', 'postgresql://', 1)

    CORS(app, origins=[
        "https://taki4616.github.io",
        "http://localhost:3000"
    ])

    db.init_app(app)
    Migrate(app, db)

    from routes import routes as main
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
