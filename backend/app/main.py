from flask import Flask, redirect, render_template, request, url_for

from .database import Base, SessionLocal, engine
from .models import Topic, Material
from .services.openai_service import get_answer

# Готовим таблицы при запуске приложения.
Base.metadata.create_all(bind=engine)

app = Flask(__name__)


# Определяет активную тему: из query-параметра или первую в списке.
def pick_active_topic_id(topics: list, requested_topic_id: int | None) -> int | None:
    if not topics:
        return None
    if requested_topic_id and any(topic.id == requested_topic_id for topic in topics):
        return requested_topic_id
    return topics[0].id


@app.get("/")
def index():
    # Главная страница: темы + материалы выбранной темы.
    requested_topic_id = request.args.get("topic_id", type=int)

    with SessionLocal() as db:
        topics = crud.get_topics(db)
        active_topic_id = pick_active_topic_id(topics, requested_topic_id)
        materials = crud.get_materials(db, active_topic_id) if active_topic_id else []

    return render_template(
        "index.html",
        topics=topics,
        active_topic_id=active_topic_id,
        materials=materials,
        answer="",
        question="",
    )


@app.post("/topics")
def create_topic():
    # Создание новой темы из формы.
    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()

    if not title:
        return redirect(url_for("index"))

    with SessionLocal() as db:
        topic = crud.create_topic(db, title=title, description=description)

    return redirect(url_for("index", topic_id=topic.id))


@app.post("/materials")
def create_material():
    # Добавление материала в выбранную тему.
    topic_id = request.form.get("topic_id", type=int)
    title = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()

    if not topic_id or not title or not content:
        return redirect(url_for("index", topic_id=topic_id))

    with SessionLocal() as db:
        if crud.get_topic(db, topic_id):
            crud.create_material(db, topic_id=topic_id, title=title, content=content)

    return redirect(url_for("index", topic_id=topic_id))

    return redirect(url_for("index"))

@app.post("/ask")
def ask_question():
    # Генерация ответа по материалам выбранной темы.
    topic_id = request.form.get("topic_id", type=int)
    question = request.form.get("question", "").strip()

    with SessionLocal() as db:
        topics = crud.get_topics(db)
        active_topic_id = pick_active_topic_id(topics, topic_id)
        materials = crud.get_materials(db, active_topic_id) if active_topic_id else []

        answer = ""
        if active_topic_id and question:
            topic = crud.get_topic(db, active_topic_id)
            if topic:
                answer = get_answer(topic.title, materials, question)
                crud.add_chat_history(db, active_topic_id, question, answer)

    return render_template(
        "index.html",
        topics=topics,
        active_topic_id=active_topic_id,
        materials=materials,
        answer=answer,
        question=question,
    )


@app.get("/health")
def health_check():
    # Простой health-check для контейнера/мониторинга.
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(debug=True)
