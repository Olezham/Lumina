# Lumina (Flask + raw HTML)

Simple project structure:

- `backend/` — Flask app (renders HTML)
- `frontend/` — old React app (kept for reference, no longer required)

## Backend (Flask)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

Optional environment variables:

- `DATABASE_URL` (default: `sqlite:///./lumina.db`)
- `OPENAI_API_KEY` for AI answers

## Docker Compose

For Docker setup, only `OPENAI_API_KEY` is read from `.env` and passed to the backend.

```bash
cp .env.example .env
# then put your real key into .env
docker compose up --build
```
