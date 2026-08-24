# Lumina

A full-stack AI-assisted learning workspace for organizing study topics, storing reference materials, and asking contextual questions about them.

This project demonstrates a modern frontend/backend architecture with authentication, persistent data storage, an external AI service integration, and containerized local development.

## What it does

- Create and manage learning topics
- Add reference materials to individual topics
- Ask AI-assisted questions using the saved topic context
- Store question and answer history
- Register and authenticate users
- Protect authenticated routes
- Run the full application with Docker Compose

## Tech stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL / SQLite
- OpenAI API
- Redis
- Passlib / bcrypt authentication
- Uvicorn

### Frontend
- React
- Vite
- React Router
- Axios
- React Hook Form
- Zod
- Zustand
- Radix UI
- Sass

### Dev / Infrastructure
- Docker
- Docker Compose
- Environment-based configuration

## Architecture

```text
React / Vite frontend
        |
        | REST API
        v
FastAPI backend
   |        |        |
   |        |        +--> OpenAI API
   |        +-----------> Redis
   +--------------------> SQLAlchemy -> PostgreSQL / SQLite
```

The backend exposes REST endpoints for topics, materials, authentication, protected resources, and AI-assisted Q&A. The frontend consumes these endpoints through Axios and uses client-side routing and state management.

## API examples

Some of the implemented endpoints include:

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

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Default API URL:

```text
http://127.0.0.1:8000
```

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

## Docker Compose

```bash
cp .env.example .env
```

Add your OpenAI API key to `.env`:

```text
OPENAI_API_KEY=your_key_here
```

Then run:

```bash
docker compose up --build
```

## Configuration

Supported backend environment variables include:

```text
DATABASE_URL
OPENAI_API_KEY
```

If `DATABASE_URL` is not provided, the app can use a local SQLite database for development.

## Why I built it

Lumina is a practical full-stack project focused on connecting application UI, backend API design, relational data, authentication, and an external AI service in one working system.

It is also a sandbox for improving backend architecture, API design, database handling, and frontend/backend integration.

## Next improvements

- Automated API tests with Pytest
- End-to-end tests with Playwright
- CI workflow with GitHub Actions
- Improved authorization and session handling
- Production deployment configuration
- API documentation examples and screenshots
