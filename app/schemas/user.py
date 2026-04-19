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
# RESPONSE SCHEMA (OPTIONAL BUT RECOMMENDED)
# =========================
class UserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True
