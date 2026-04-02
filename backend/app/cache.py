import os
import redis

REDIS_URL = os.getenv('REDIS_URL')
r = redis.Redis.from_url(REDIS_URL)

def save_token(user_id: int, token: str, expires_in: int = 3600):
    r.setex(f"auth_token:{token}", expires_in, user_id)

def verify_token(token: str) -> int:
    user_id = r.get(f"auth_token:{token}")
    return int(user_id) if user_id else None