from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, engine, get_db
from .services.openai_service import get_answer

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lumina API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/topics", response_model=list[schemas.TopicRead])
def list_topics(db: Session = Depends(get_db)):
    return crud.get_topics(db)


@app.post("/topics", response_model=schemas.TopicRead)
def create_topic(topic_in: schemas.TopicCreate, db: Session = Depends(get_db)):
    return crud.create_topic(db, topic_in)


@app.delete("/topics/{topic_id}")
def remove_topic(topic_id: int, db: Session = Depends(get_db)):
    if not crud.delete_topic(db, topic_id):
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"ok": True}


@app.get("/topics/{topic_id}/materials", response_model=list[schemas.MaterialRead])
def list_materials(topic_id: int, db: Session = Depends(get_db)):
    topic = crud.get_topic(db, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return crud.get_materials(db, topic_id)


@app.post("/topics/{topic_id}/materials", response_model=schemas.MaterialRead)
def create_material(topic_id: int, material_in: schemas.MaterialCreate, db: Session = Depends(get_db)):
    topic = crud.get_topic(db, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return crud.create_material(db, topic_id, material_in)


@app.post("/topics/{topic_id}/ask", response_model=schemas.AskResponse)
def ask_question(topic_id: int, ask_in: schemas.AskRequest, db: Session = Depends(get_db)):
    topic = crud.get_topic(db, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    materials = crud.get_materials(db, topic_id)
    answer = get_answer(topic.title, materials, ask_in.question)
    crud.add_chat_history(db, topic_id, ask_in.question, answer)
    return {"answer": answer}
