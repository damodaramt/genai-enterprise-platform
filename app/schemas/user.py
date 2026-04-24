# app/schemas/user.py

from pydantic import BaseModel, EmailStr, Field


# =========================
# SIGNUP SCHEMA
# =========================
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


# =========================
# LOGIN SCHEMA
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# USER RESPONSE (DB → API)
# =========================
class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True


# =========================
# TOKEN RESPONSE (IMPORTANT)
# =========================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
