# NannyVent

A full-stack platform where nannies and parents can post profiles, connect, and get AI-powered compatibility matching — built with Flask, React, and Claude.

**Live demo:** [taki4616.github.io/nannyvent](https://taki4616.github.io/nannyvent)

---

## What it does

NannyVent lets nannies and parents create posts describing who they are and what they're looking for. Once logged in, users can click **Match** on any post from the opposite role to get an AI-generated compatibility report — including a score, a summary of fit, and suggestions for both profiles.

---

## Features

- JWT-based registration and login
- Role-based posts (nanny or parent)
- AI compatibility matching powered by the Claude API (Anthropic)
- Full CRUD on posts (create, edit, delete)
- React frontend deployed to GitHub Pages
- Flask backend deployed to Render with PostgreSQL

---

## Tech stack

**Backend**

- Python / Flask
- SQLAlchemy (ORM)
- PostgreSQL (production) / SQLite (local dev)
- JWT authentication via PyJWT
- Anthropic Python SDK

**Frontend**

- React
- Fetch API
- Deployed via GitHub Pages

**Infrastructure**

- Render (backend hosting)
- Docker / docker-compose (local dev)

---

## Project structure

```
nannyvent/
├── app/
│   ├── app.py           # Flask app factory, DB init
│   ├── models.py        # User and Post models
│   ├── routes.py        # Auth, post, and AI match endpoints
│   ├── config.py        # App configuration
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/
    └── src/
        ├── components/
        │   └── PostsApp.js
        └── context/
            └── AuthContext.js
```

---

## Running locally

### Prerequisites

- Python 3.9+
- Node.js
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### Backend

```bash
cd app
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `app/`:

```
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///app.db
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Start the server:

```bash
python app.py
```

Backend runs at `http://localhost:5001`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

---

## API endpoints

| Method | Endpoint            | Auth | Description              |
| ------ | ------------------- | ---- | ------------------------ |
| POST   | `/api/register`     | No   | Create an account        |
| POST   | `/api/login`        | No   | Log in, receive JWT      |
| GET    | `/api/posts/<role>` | No   | Get all posts for a role |
| POST   | `/api/posts`        | Yes  | Create a post            |
| PUT    | `/api/posts/<id>`   | Yes  | Edit your post           |
| DELETE | `/api/posts/<id>`   | Yes  | Delete your post         |
| POST   | `/api/match`        | Yes  | AI compatibility report  |

### Match endpoint

**POST** `/api/match`

```json
{
  "nanny_post_id": 1,
  "parent_post_id": 2
}
```

Returns:

```json
{
  "score": 82,
  "summary": "Strong compatibility — the nanny's experience with toddlers aligns well with what this family needs.",
  "suggestions": [
    "The nanny could add her hourly rate and availability.",
    "The parent could specify the children's ages.",
    "Both could share their preferred communication style."
  ]
}
```

---

## Deployment

The backend is deployed as a Web Service on Render:

- Root directory: `app`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`
- Environment variables: `SECRET_KEY`, `ANTHROPIC_API_KEY`, `DATABASE_URL`

The frontend is deployed to GitHub Pages via `npm run deploy`.

---

## Author

Built by [@taki4616](https://github.com/taki4616) as a full-stack portfolio project, with a focus on backend development and AI integration.
