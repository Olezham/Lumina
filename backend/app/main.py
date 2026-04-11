import os

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .auth import check_existing_user, create_user, authenticate_user, login_user, get_current_user
from . import crud, models, schemas
from .database import Base, engine, get_db
from .services.openai_service import get_answer

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lumina API")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
    user: models.User = Depends(get_current_user),
):
    return crud.get_topics(db, user.id)


@app.post("/topics", response_model=schemas.TopicRead)
def create_topic(
    topic_in: schemas.TopicCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return crud.create_topic(db, user.id, topic_in)


@app.delete("/topics/{topic_id}")
def remove_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    if not crud.delete_topic(db, topic_id, user.id):
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"ok": True}


@app.get("/topics/{topic_id}/materials", response_model=list[schemas.MaterialRead])
def list_materials(
    topic_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    topic = crud.get_topic(db, topic_id, user.id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return crud.get_materials(db, topic_id)


@app.post("/topics/{topic_id}/materials", response_model=schemas.MaterialRead)
def create_material(
    topic_id: int,
    material_in: schemas.MaterialCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    topic = crud.get_topic(db, topic_id, user.id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return crud.create_material(db, topic_id, material_in)


@app.post("/topics/{topic_id}/ask", response_model=schemas.AskResponse)
def ask_question(
    topic_id: int,
    ask_in: schemas.AskRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    topic = crud.get_topic(db, topic_id, user.id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    materials = crud.get_materials(db, topic_id)
    answer = get_answer(topic.title, materials, ask_in.question)
    crud.add_chat_history(db, topic_id, ask_in.question, answer)
    return {"answer": answer}


@app.post("/register", response_model=schemas.AuthResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = check_existing_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    created_user = create_user(db=db, user=user)
    return {"message": "User created successfully", "user": created_user}


@app.post("/login", response_model=schemas.AuthResponse)
def login(creds: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(creds.email, creds.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = login_user(user.id)
    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
    )
    return {"message": "Login successful", "user": user}


@app.get("/me", response_model=schemas.UserRead)
def get_me(user: models.User = Depends(get_current_user)):
    return user


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="auth_token", samesite="lax")
    return {"message": "Logged out"}


@app.get("/protected")
def protected(user: models.User = Depends(get_current_user)):
    return {"message": "This is a protected route", "user_id": user.id}
