# Lumina

Lumina is a full-stack learning workspace for organizing study topics, storing reference materials, and asking AI-assisted questions against those materials.

This project is a portfolio example for backend/API design, relational data modeling, frontend/backend integration, authentication basics, external API integration, and Docker-based local development.

## What It Solves

When studying a topic, notes and reference material often become scattered. Lumina gives each topic a structured place for saved material and lets the user ask contextual questions using only the material attached to that topic.

If no OpenAI API key is configured, the backend returns a clear fallback response instead of failing silently.

## Features

- Create, list, and delete learning topics
- Add reference materials to a topic
- Ask questions against the saved topic materials
- Store question/answer history in the database layer
- Register users with hashed passwords
- Login with a cookie-based token flow
- Protect authenticated routes
- Run PostgreSQL, Redis, backend, and frontend with Docker Compose

## Architecture

```text
React / Vite frontend
        |
        | fetch-based REST calls
        v
FastAPI backend
   |        |        |
   |        |        +--> OpenAI API
   |        +-----------> Redis token storage
   +--------------------> SQLAlchemy -> PostgreSQL or SQLite
```

The backend owns the API, data models, authentication flow, and OpenAI prompt construction. The frontend provides the topic/material/question workflow and calls the backend through a small API helper module.

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL for Docker-based local development
- SQLite fallback when `DATABASE_URL` is not set
- Redis for auth token storage
- Passlib / bcrypt password hashing
- OpenAI API integration
- Uvicorn

### Frontend

- React
- Vite
- JavaScript
- CSS
- Browser `fetch` for API calls

### Dev / Infrastructure

- Docker
- Docker Compose
- Environment-based configuration

## API Endpoints

```text
GET    /health
GET    /topics
POST   /topics
DELETE /topics/{topic_id}
GET    /topics/{topic_id}/materials
POST   /topics/{topic_id}/materials
POST   /topics/{topic_id}/ask
POST   /register
POST   /login
GET    /protected
```

## Project Structure

```text
Lumina/
├── backend/
│   ├── app/
│   │   ├── auth.py
│   │   ├── cache.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── services/
│   │       └── openai_service.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── package-lock.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Configuration

Copy the example environment file and add values as needed:

```bash
cp .env.example .env
```

Supported environment variables:

```text
DATABASE_URL=postgresql://lumina_user:lumina_pass@postgres:5432/lumina_db
REDIS_URL=redis://redis:6379/0
OPENAI_API_KEY=your_openai_api_key
VITE_API_URL=http://localhost:8000
```

`OPENAI_API_KEY` is optional for local exploration; without it, the AI endpoint returns a fallback response.

## Run With Docker Compose

```bash
docker compose up --build
```

Then open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
API docs: http://localhost:8000/docs
```

Docker Compose starts:

- PostgreSQL on host port `5434`
- Redis on host port `6379`
- FastAPI backend on host port `8000`
- Vite frontend on host port `5173`

## Run Locally Without Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

If running without Docker, set `REDIS_URL` to a reachable Redis instance before using authenticated routes.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional frontend environment variable:

```text
VITE_API_URL=http://127.0.0.1:8000
```

## Technical Decisions

- FastAPI provides a clear REST API surface and automatic OpenAPI docs.
- SQLAlchemy keeps the database layer explicit while allowing PostgreSQL in Docker and SQLite for lightweight local development.
- Redis stores login tokens separately from the relational data model.
- Docker Compose makes the project easier to run as a complete backend/frontend/database/cache system.
- The OpenAI integration is isolated in `backend/app/services/openai_service.py`, keeping external API logic out of route handlers.

## What This Demonstrates

- Full-stack application structure
- REST API design and endpoint organization
- Relational data modeling and CRUD operations
- Authentication and protected route basics
- Environment-based configuration
- Dockerized local development
- Practical integration with an external API

## Next Improvements

- Add pytest coverage for API endpoints
- Add Playwright end-to-end tests for the main workflow
- Replace debug/local auth behavior with production-ready session settings
- Add CI checks for backend and frontend
- Improve frontend validation and error states
