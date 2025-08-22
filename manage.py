# pylint: disable=unused-import
from flask.cli import with_appcontext
import click
from app import db, create_app
from models import Post
  # Import  models here so SQLAlchemy registers them

app = create_app()

@click.command(name='create_tables')
@with_appcontext
def create_tables():
    db.create_all()
    print("✅ Tables created successfully!")

app.cli.add_command(create_tables)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
