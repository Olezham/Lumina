# Lumina (Simple Flask app)

Lumina is now a single Flask application with server-rendered HTML (no separate React frontend).

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

Then open `http://127.0.0.1:8000`.

Optional environment variables:

- `DATABASE_URL` (default: `sqlite:///./lumina.db`)
- `OPENAI_API_KEY` for AI answers

## Docker Compose

For Docker setup, only `OPENAI_API_KEY` is read from `.env` and passed to the app.

```bash
cp .env.example .env
# then put your real key into .env
docker compose up --build
```
