from datetime import datetime
from app import db

class ChatHistory(db.Model):
    __tablename__ = "chat_history"

    id         = db.Column(db.Integer, primary_key=True)
    topic_id   = db.Column(db.Integer, db.ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    question   = db.Column(db.Text, nullable=False)
    answer     = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "topic_id":   self.topic_id,
            "question":   self.question,
            "answer":     self.answer,
            "created_at": self.created_at.isoformat(),
        }
