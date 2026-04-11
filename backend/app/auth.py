import secrets

from fastapi import HTTPException, Request
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from datetime import datetime

from .schemas import UserCreate
from .models import User
from .cache import delete_token, save_token, verify_token



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_current_user(request: Request):
    token = request.cookies.get("auth_token")  # Extract token from cookies

    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    
    user_id = verify_token(token)  # Verify the token from cache
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return user_id

def check_existing_user(db: Session,email: str):
	email = db.query(User).filter(User.email == email).first()
	if email:
		return True
	return False

def generate_token():
	return secrets.token_hex(32)  # A 64-character secure token


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user: UserCreate):
	hashed_password = pwd_context.hash(user.password)
	db_user = User(email=user.email,hashed_password=hashed_password,registered_at=datetime.now())
	db.add(db_user)
	db.commit()
	db.refresh(db_user)
	return {"message": "User created successfully", "user_id": db_user.id}


def authenticate_user(email: str, password: str, db: Session):
	user = db.query(User).filter(User.email == email).first()
	if not user:
		print("User not found")
		return False
	if not pwd_context.verify(password, user.hashed_password):
		print("Incorrect password")
		return False
	return user

def login_user(user_id: int):
	token = generate_token()
	save_token(user_id, token)
	return token


def logout_user(token: str | None):
    if token:
        delete_token(token)
