from datetime import datetime
from . import db

class Material(db.Model):
    __tablename__ = "materials"

    id          = db.Column(db.Integer, primary_key=True)
    topic_id    = db.Column(db.Integer, db.ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    title       = db.Column(db.String(255), nullable=False)
    content     = db.Column(db.Text, nullable=False)
    source_type = db.Column(db.String(20), default="text")  # text | file
    file_name   = db.Column(db.String(255), default="")
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":          self.id,
            "topic_id":    self.topic_id,
            "title":       self.title,
            "content":     self.content,
            "source_type": self.source_type,
            "file_name":   self.file_name or "",
            "created_at":  self.created_at.isoformat(),
        }
