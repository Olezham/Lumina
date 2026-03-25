from datetime import datetime
from . import db

class Topic(db.Model):
    __tablename__ = "topics"

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(32), nullable=False)
    description = db.Column(db.Text, default="")
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    materials = db.relationship("Material",    backref="topic", cascade="all, delete-orphan", lazy=True)
    history   = db.relationship("ChatHistory", backref="topic", cascade="all, delete-orphan", lazy=True)

    def to_dict(self):
        return {
            "id":          self.id,
            "title":       self.title,
            "description": self.description or "",
            "created_at":  self.created_at.isoformat(),
        }
