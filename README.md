# nannyvent

Nannyvent
Nannyvent is a blog platform built with Flask for nannies to share their experiences and connect with others. The project is designed to handle user accounts and posts, leveraging PostgreSQL as the database and Docker to containerize the application. This project is part of a larger effort to hone backend development skills, with a focus on building robust and maintainable web applications.

Table of Contents
Features
Project Structure
Setup Instructions
Running the Application
Testing the API
Database Backup and Restore
Technologies Used
Features
User management (create, read, update, delete)
Blog post creation and management
PostgreSQL for database management
Dockerized environment for easy deployment and development
Database persistence using Docker volumes
pgAdmin setup for database management
Project Structure
bash
Copy code
nannyvent/
│
├── app/
│ ├── Dockerfile
│ ├── docker-compose.yml
│ ├── manage.py # Entry point to run the application
│ ├── app.py # Initializes the Flask app and database
│ ├── models.py # Database models (User and Post)
│ ├── routes.py # API routes (user and post management)
│ ├── config.py # App configurations
│ └── requirements.txt # Python dependencies
└── data/ # Folder for persistent PostgreSQL data
└── backup/ # Folder for database backups
Setup Instructions

1. Clone the Repository
   bash
   Copy code
   git clone https://github.com/taki4616/nannyvent.git
   cd nannyvent
2. Set Up Environment Variables
   For security, ensure you load environment variables from a .env file. Here's an example of what your .env file should contain:

makefile
Copy code
DATABASE_URL=postgresql://postgres:yourpassword@pg_container:5432/nannyvent
SECRET_KEY=your_secret_key
FLASK_ENV=development
DEBUG=True 3. Docker Setup
To get the application running using Docker, you can use the docker-compose.yml file to set up the Flask app, PostgreSQL, and pgAdmin services.

bash
Copy code
docker-compose up --build
This will build the containers and start the services.

4. Setting Up the Database
   If you need to create the tables manually, use the following SQL queries:

sql
Copy code
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(80) UNIQUE NOT NULL,
email VARCHAR(120) UNIQUE NOT NULL,
password VARCHAR(200) NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
id SERIAL PRIMARY KEY,
title VARCHAR(200) NOT NULL,
content TEXT NOT NULL,
user_id INTEGER REFERENCES users(id),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
Alternatively, load the SQL dump from the backup/ folder.

5. Loading Database Backups
   To restore a database backup:

Place your .sql dump in the backup/ directory.
Use pgAdmin or pg_restore to load the backup into the PostgreSQL database.
bash
Copy code
docker exec -it pg_container pg_restore -U postgres -d nannyvent /var/lib/postgresql/backup/your_backup.sql
Running the Application
To start the Flask application, you can either:

Run the application locally:

bash
Copy code
flask run
Run it via Docker:

bash
Copy code
docker-compose up
By default, the app should be available at http://localhost:5000.

Testing the API
You can use Insomnia or Postman to test the API endpoints.

Example Endpoints:
GET /users - Fetch all users
POST /users - Create a new user
GET /posts - Fetch all posts
POST /posts - Create a new post
For example, to create a new user via Insomnia:

Method: POST

URL: http://localhost:5000/users

Body (JSON):

json
Copy code
{
"username": "testuser",
"email": "testuser@example.com",
"password": "password123"
}
Database Backup and Restore
Backing up the Database
To create a backup of your PostgreSQL database:

bash
Copy code
docker exec -t pg_container pg_dump -U postgres nannyvent > ./backup/nannyvent_backup.sql
This will create a .sql file in the backup/ directory.

Restoring the Database
If you ever need to restore from the backup:

bash
Copy code
docker exec -i pg_container psql -U postgres -d nannyvent < ./backup/nannyvent_backup.sql
Technologies Used
Python (Flask)
PostgreSQL
pgAdmin for database management
Docker for containerization
SQLAlchemy for ORM
Insomnia for API testing
