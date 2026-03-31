from sqlalchemy.orm import Session

from . import models, schemas


def create_topic(db: Session, topic_in: schemas.TopicCreate):
    topic = models.Topic(title=topic_in.title, description=topic_in.description)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


def get_topics(db: Session):
    return db.query(models.Topic).order_by(models.Topic.created_at.desc()).all()


def get_topic(db: Session, topic_id: int):
    return db.query(models.Topic).filter(models.Topic.id == topic_id).first()


def delete_topic(db: Session, topic_id: int):
    topic = get_topic(db, topic_id)
    if not topic:
        return False
    db.delete(topic)
    db.commit()
    return True


def create_material(db: Session, topic_id: int, material_in: schemas.MaterialCreate):
    material = models.Material(topic_id=topic_id, **material_in.model_dump())
    db.add(material)
    db.commit()
    db.refresh(material)
    return material


def get_materials(db: Session, topic_id: int):
    return db.query(models.Material).filter(models.Material.topic_id == topic_id).all()


def add_chat_history(db: Session, topic_id: int, question: str, answer: str):
    chat = models.ChatHistory(topic_id=topic_id, question=question, answer=answer)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat
