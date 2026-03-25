from flask import Flask, render_template
from app.models.db import db
from flask_cors import CORS



cards = [{"title": "Machine Fundamentals", "materials": 12, "updated": "2 hours ago"},
		{"title": "World History Notes", "materials": 8, "updated": "Yesterday"},
		{"title": "Product Strategy Research", "materials": 21, "updated": "3 days ago"}]


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://lumina_user:lumina_pass@localhost:5432/lumina_db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        from app.models.topic import Topic
        from app.models.material import Material
        from app.models.chat_history import ChatHistory

        db.create_all()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)