from flask import Blueprint, request, jsonify
from app import db
from app.models import Topic, Material, ChatHistory
from app.services import get_answer

chat_bp = Blueprint("chat", __name__)


def err(msg, code=400):
    return jsonify({"detail": msg}), code


@chat_bp.post("/topics/<int:topic_id>/ask")
def ask_question(topic_id):
    topic = Topic.query.get(topic_id)
    if not topic:
        return err("Тема не найдена", 404)

    data     = request.get_json() or {}
    question = (data.get("question") or "").strip()
    if not question:
        return err("Вопрос не может быть пустым")

    materials = Material.query.filter_by(topic_id=topic_id).all()
    if not materials:
        return err("В теме нет материалов. Добавьте материалы перед тем, как задавать вопросы.")

    answer = get_answer(topic.title, materials, question)

    chat = ChatHistory(topic_id=topic_id, question=question, answer=answer)
    db.session.add(chat)
    db.session.commit()
    return jsonify(chat.to_dict()), 201


@chat_bp.get("/topics/<int:topic_id>/history")
def get_history(topic_id):
    if not Topic.query.get(topic_id):
        return err("Тема не найдена", 404)

    history = (ChatHistory.query
               .filter_by(topic_id=topic_id)
               .order_by(ChatHistory.created_at.desc())
               .all())
    return jsonify([h.to_dict() for h in history])
