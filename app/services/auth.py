# app/services/auth.py

import os
from datetime import datetime, timedelta
from typing import Optional

from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext


# Load environment variables
load_dotenv()


# ENV CONFIG
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))


if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY not set in environment")


# Password hashing config
pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto"
)


# =========================
# PASSWORD FUNCTIONS
# =========================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# JWT TOKEN FUNCTIONS
# =========================

def create_access_token(data: dict) -> str:
    """
    data must contain: {"sub": user_email}
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Ensure subject exists
        if "sub" not in payload:
            return None

        return payload

    except JWTError:
        return None
