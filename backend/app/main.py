from flask import Flask, redirect, render_template, request, url_for

from .database import Base, SessionLocal, engine
from .models import Topic, Material
from .services.openai_service import get_answer

# Готовим таблицы при запуске приложения.
Base.metadata.create_all(bind=engine)

app = Flask(__name__)


def _parse_topic_id(value: str | None) -> int | None:
    if not value:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


@app.get("/")
def index():
    selected_topic_id = _parse_topic_id(request.args.get("topic_id"))
    answer = request.args.get("answer", "")

    with SessionLocal() as db:
        topics = db.query(Topic).order_by(Topic.created_at.desc()).all()

        if selected_topic_id is None and topics:
            selected_topic_id = topics[0].id

        selected_topic = None
        materials: list[Material] = []
        if selected_topic_id is not None:
            selected_topic = db.query(Topic).filter(Topic.id == selected_topic_id).first()
            if selected_topic:
                materials = db.query(Material).filter(Material.topic_id == selected_topic_id).all()

    return render_template(
        "index.html",
        topics=topics,
        selected_topic_id=selected_topic_id,
        selected_topic=selected_topic,
        materials=materials,
        answer=answer,
    )


@app.post("/topics")
def create_topic():
    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()

    if title:
        with SessionLocal() as db:
            topic = Topic(title=title, description=description)
            db.add(topic)
            db.commit()
            db.refresh(topic)
            return redirect(url_for("index", topic_id=topic.id))

    return redirect(url_for("index"))


@app.post("/materials")
def create_material():
    topic_id = _parse_topic_id(request.form.get("topic_id"))
    title = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()

    if topic_id and title and content:
        with SessionLocal() as db:
            topic = db.query(Topic).filter(Topic.id == topic_id).first()
            if topic:
                material = Material(topic_id=topic_id, title=title, content=content)
                db.add(material)
                db.commit()

    return redirect(url_for("index", topic_id=topic_id))


@app.post("/ask")
def ask_question():
    topic_id = _parse_topic_id(request.form.get("topic_id"))
    question = request.form.get("question", "").strip()

    if not topic_id or not question:
        return redirect(url_for("index", topic_id=topic_id))

    with SessionLocal() as db:
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        if not topic:
            return redirect(url_for("index"))
        materials = db.query(Material).filter(Material.topic_id == topic_id).all()
        answer = get_answer(topic.title, materials, question)

    return redirect(url_for("index", topic_id=topic_id, answer=answer))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
