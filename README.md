# Lumina (Split frontend/backend)

Simple project structure:

- `backend/` — FastAPI API service
- `frontend/` — React.js app (Vite)

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Optional environment variables:

- `DATABASE_URL` (default: `sqlite:///./lumina.db`)
- `OPENAI_API_KEY` for AI answers

## Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Optional env var for API URL:

- `VITE_API_URL` (default: `http://127.0.0.1:8000`)
