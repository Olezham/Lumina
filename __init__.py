from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)
    CORS(app)

    from app.routes.topics   import topics_bp
    from app.routes.materials import materials_bp
    from app.routes.chat     import chat_bp

    app.register_blueprint(topics_bp)
    app.register_blueprint(materials_bp)
    app.register_blueprint(chat_bp)

    with app.app_context():
        db.create_all()

    return app
