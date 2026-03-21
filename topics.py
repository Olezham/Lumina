from flask import Blueprint, request, jsonify
from app import db
from app.models import Topic

topics_bp = Blueprint("topics", __name__)


def err(msg, code=400):
    return jsonify({"detail": msg}), code


@topics_bp.post("/topics")
def create_topic():
    data  = request.get_json() or {}
    title = (data.get("title") or "").strip()
    if not title:
        return err("Название темы не может быть пустым")

    topic = Topic(title=title, description=(data.get("description") or "").strip())
    db.session.add(topic)
    db.session.commit()
    return jsonify(topic.to_dict()), 201


@topics_bp.get("/topics")
def list_topics():
    topics = Topic.query.order_by(Topic.created_at.desc()).all()
    return jsonify([t.to_dict() for t in topics])


@topics_bp.get("/topics/<int:topic_id>")
def get_topic(topic_id):
    topic = Topic.query.get(topic_id)
    if not topic:
        return err("Тема не найдена", 404)
    return jsonify(topic.to_dict())


@topics_bp.put("/topics/<int:topic_id>")
def update_topic(topic_id):
    topic = Topic.query.get(topic_id)
    if not topic:
        return err("Тема не найдена", 404)

    data  = request.get_json() or {}
    title = (data.get("title") or "").strip()
    if not title:
        return err("Название темы не может быть пустым")

    topic.title       = title
    topic.description = (data.get("description") or "").strip()
    db.session.commit()
    return jsonify(topic.to_dict())


@topics_bp.delete("/topics/<int:topic_id>")
def delete_topic(topic_id):
    topic = Topic.query.get(topic_id)
    if not topic:
        return err("Тема не найдена", 404)

    db.session.delete(topic)  # cascade удалит materials и chat_history
    db.session.commit()
    return jsonify({"ok": True})
