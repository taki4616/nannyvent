# pylint: disable=missing-module-docstring
# pylint: disable=import-error
from dotenv import load_dotenv
from flask_migrate import Migrate
from app import db, create_app

load_dotenv()

# Create the Flask app
app = create_app()

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Create the tables
@app.cli.command('create_tables')
def create_tables():
    """Create database tables."""
    with app.app_context():
        # Create all tables defined in the models
        db.create_all()
    print("Tables created")

if __name__ == '__main__':
    # Run the Flask application
    app.run(host='0.0.0.0', port=5000, debug=True)
