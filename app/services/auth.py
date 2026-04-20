# app/services/auth.py

from datetime import datetime, timedelta
from typing import Optional, Dict

import os
from jose import JWTError, jwt
from passlib.context import CryptContext


# =========================
# CONFIG (READ FROM ENV ONLY)
# =========================

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set")


# =========================
# PASSWORD CONFIG
# =========================

pwd_context = CryptContext(
    schemes=["bcrypt"],   # ✅ STANDARD
    deprecated="auto"
)


# =========================
# PASSWORD FUNCTIONS
# =========================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


# =========================
# JWT TOKEN FUNCTIONS
# =========================

def create_access_token(data: Dict[str, str]) -> str:
    """
    data must include: {"sub": user_email}
    """
    if "sub" not in data:
        raise ValueError("Token data must include 'sub'")

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if "sub" not in payload:
            return None

        return payload

    except JWTError:
        return None
