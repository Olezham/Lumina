from sqlalchemy.orm import Session

from . import models


# Создает новую тему.
def create_topic(db: Session, title: str, description: str = ""):
    topic = models.Topic(title=title, description=description)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


# Возвращает список тем (новые сверху).
def get_topics(db: Session):
    return db.query(models.Topic).order_by(models.Topic.created_at.desc()).all()


# Ищет тему по id.
def get_topic(db: Session, topic_id: int):
    return db.query(models.Topic).filter(models.Topic.id == topic_id).first()


# Удаляет тему, если она существует.
def delete_topic(db: Session, topic_id: int):
    topic = get_topic(db, topic_id)
    if not topic:
        return False
    db.delete(topic)
    db.commit()
    return True


# Добавляет материал к теме.
def create_material(db: Session, topic_id: int, title: str, content: str):
    material = models.Material(topic_id=topic_id, title=title, content=content)
    db.add(material)
    db.commit()
    db.refresh(material)
    return material


# Возвращает материалы конкретной темы.
def get_materials(db: Session, topic_id: int):
    return db.query(models.Material).filter(models.Material.topic_id == topic_id).all()


# Сохраняет вопрос и ответ в историю.
def add_chat_history(db: Session, topic_id: int, question: str, answer: str):
    chat = models.ChatHistory(topic_id=topic_id, question=question, answer=answer)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat
