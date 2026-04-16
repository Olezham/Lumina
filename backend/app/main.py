from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .auth import (
    check_existing_user,
    create_user,
    authenticate_user,
    login_user,
    get_current_user,
    set_auth_cookie,
)
from . import crud, models, schemas
from .database import Base, get_db, sync_schema
from .services.openai_service import get_answer

sync_schema(Base.metadata)

app = FastAPI(title="Lumina API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/topics", response_model=list[schemas.TopicRead])
def list_topics(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    return crud.get_topics(db, user_id)


@app.post("/topics", response_model=schemas.TopicRead)
def create_topic(
    topic_in: schemas.TopicCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    return crud.create_topic(db, user_id, topic_in)


@app.delete("/topics/{topic_id}")
def remove_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    if not crud.delete_topic(db, topic_id, user_id):
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"ok": True}


@app.get("/topics/{topic_id}/materials", response_model=list[schemas.MaterialRead])
def list_materials(
    topic_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    topic = crud.get_topic(db, topic_id, user_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return crud.get_materials(db, topic_id)


@app.post("/topics/{topic_id}/materials", response_model=schemas.MaterialRead)
def create_material(
    topic_id: int,
    material_in: schemas.MaterialCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    topic = crud.get_topic(db, topic_id, user_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return crud.create_material(db, topic_id, material_in)


@app.get("/topics/{topic_id}/history", response_model=list[schemas.ChatHistoryRead])
def list_chat_history(
    topic_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    topic = crud.get_topic(db, topic_id, user_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found or This topic not belongs to logged-in user")
    return crud.get_chat_history(db, topic_id)


@app.post("/topics/{topic_id}/ask", response_model=schemas.AskResponse)
def ask_question(
    topic_id: int,
    ask_in: schemas.AskRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    topic = crud.get_topic(db, topic_id, user_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    materials = crud.get_materials(db, topic_id)
    answer = get_answer(topic.title, materials, ask_in.question)
    crud.add_chat_history(db, topic_id, ask_in.question, answer)
    return {"answer": answer}


@app.post("/register")
def register_user(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = check_existing_user(db,email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    result = create_user(db=db, user=user)
    token = login_user(result["user_id"])
    set_auth_cookie(response, token)
    return {
        "message": "User created successfully",
        "user_id": result["user_id"],
        "logged_in": True,
    }


@app.post("/login")
def login(creds: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(creds.email, creds.password, db)
    if user:
        token = login_user(user.id)
        print(f"Generated token for user {user.id}: {token}")  # Debug log
        set_auth_cookie(response, token)
        return {"message": "Login successful"}

    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get('/protected')
def protected(user=Depends(get_current_user)):

    return {"message": "This is a protected route"}
