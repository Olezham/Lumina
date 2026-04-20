from datetime import datetime
from pydantic import BaseModel


class TopicBase(BaseModel):
    title: str
    description: str = ""


class TopicCreate(TopicBase):
    pass


class TopicRead(TopicBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MaterialBase(BaseModel):
    title: str
    content: str
    source_type: str = "text"
    file_name: str = ""


class MaterialCreate(MaterialBase):
    pass


class MaterialUpdate(BaseModel):
    title: str
    content: str
    source_type: str = "text"
    file_name: str = ""


class MaterialRead(MaterialBase):
    id: int
    topic_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    answer: str


class ChatHistoryRead(BaseModel):
    id: int
    topic_id: int
    question: str
    answer: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserCredentials(BaseModel):
    email: str
    password: str

class UserCreate(UserCredentials):
    pass 

class UserLogin(UserCredentials):
    pass
