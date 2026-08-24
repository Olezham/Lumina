import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def client(tmp_path, monkeypatch):
    backend_dir = Path(__file__).resolve().parents[1]
    sys.path.insert(0, str(backend_dir))

    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{tmp_path / 'lumina_test.db'}")
    monkeypatch.setenv("REDIS_URL", "redis://localhost:6379/0")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    for module_name in list(sys.modules):
        if module_name == "app" or module_name.startswith("app."):
            del sys.modules[module_name]

    from app import auth
    from app.database import Base, engine
    from app.main import app

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    monkeypatch.setattr(auth, "save_token", lambda user_id, token: None)

    with TestClient(app) as test_client:
        yield test_client


def test_health_check_returns_ok(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_topic_material_and_ask_workflow_uses_fallback_without_openai_key(client):
    topic_response = client.post(
        "/topics",
        json={"title": "SQL validation", "description": "Report QA checks"},
    )
    assert topic_response.status_code == 200
    topic = topic_response.json()
    assert topic["title"] == "SQL validation"

    topics_response = client.get("/topics")
    assert topics_response.status_code == 200
    assert [item["title"] for item in topics_response.json()] == ["SQL validation"]

    material_response = client.post(
        f"/topics/{topic['id']}/materials",
        json={"title": "Duplicate records", "content": "Find duplicate MRNs."},
    )
    assert material_response.status_code == 200
    assert material_response.json()["topic_id"] == topic["id"]

    ask_response = client.post(
        f"/topics/{topic['id']}/ask",
        json={"question": "What should I check?"},
    )
    assert ask_response.status_code == 200
    assert "OpenAI API key is missing" in ask_response.json()["answer"]


def test_missing_topic_routes_return_404(client):
    materials_response = client.get("/topics/999/materials")
    ask_response = client.post("/topics/999/ask", json={"question": "Anything?"})
    delete_response = client.delete("/topics/999")

    assert materials_response.status_code == 404
    assert ask_response.status_code == 404
    assert delete_response.status_code == 404


def test_register_and_login_user_sets_auth_cookie(client):
    register_response = client.post(
        "/register",
        json={"email": "qa@example.com", "password": "secret123"},
    )
    assert register_response.status_code == 200
    assert register_response.json()["message"] == "User created successfully"

    duplicate_response = client.post(
        "/register",
        json={"email": "qa@example.com", "password": "secret123"},
    )
    assert duplicate_response.status_code == 400

    login_response = client.post(
        "/login",
        json={"email": "qa@example.com", "password": "secret123"},
    )
    assert login_response.status_code == 200
    assert login_response.json() == {"message": "Login successful"}
    assert "auth_token" in login_response.cookies
