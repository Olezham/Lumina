import secrets

from fastapi import Depends, HTTPException, Request
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from datetime import datetime

from .schemas import UserCreate
from .models import User
from .cache import save_token, verify_token
from .database import get_db



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("auth_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")

    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Authenticated user not found")

    return user


def check_existing_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def generate_token():
    return secrets.token_hex(32)


def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        registered_at=datetime.now(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not pwd_context.verify(password, user.hashed_password):
        return None
    return user


def login_user(user_id: int):
    token = generate_token()
    save_token(user_id, token)
    return token
