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

## Troubleshooting

- `Connection ... failed: FATAL: password authentication failed for user "postgres"`:
  this app expects `lumina_user/lumina_pass` in Docker (`lumina_db`). If you set
  `DATABASE_URL` manually, make sure credentials match your running Postgres.
- `error while creating mount source path .../Lumina/backend: no such file or directory`:
  run `docker compose up --build` from the repository root (the folder that contains
  `backend/` and `docker-compose.yml`), and verify `backend/` exists on your machine.
  If you renamed/moved the project, stop old containers first:
  `docker compose down --remove-orphans`.
