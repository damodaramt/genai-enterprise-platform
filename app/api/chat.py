from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

from app.services.llm import generate_response
from app.core.deps import get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.db.database import SessionLocal

router = APIRouter(tags=["chat"])

logger = logging.getLogger(__name__)


# =========================
# DB DEPENDENCY
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# SCHEMAS
# =========================
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    user_message: str
    ai_response: str


class ChatHistoryItem(BaseModel):
    id: int
    user_message: str
    ai_response: str
    created_at: datetime


# =========================
# HEALTH
# =========================
@router.get("/")
def chat_root(user: User = Depends(get_current_user)):
    return {
        "status": "chat service active",
        "user": user.email
    }


# =========================
# CHAT
# =========================
@router.post("/", response_model=ChatResponse)
def chat(
    req: ChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = req.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message required")

    logger.info(f"Incoming message: {message}")

    # 🔴 SAFE LLM CALL (with fallback)
    try:
        response = generate_response(message)

        if not response:
            response = "No response from AI"

    except Exception as e:
        logger.error(f"LLM ERROR: {str(e)}")

        # ✅ fallback (IMPORTANT)
        response = "AI service temporarily unavailable"

    # =========================
    # SAVE TO DB
    # =========================
    chat_record = Chat(
        user_id=user.id,
        query=message,
        response=response
    )

    try:
        db.add(chat_record)
        db.commit()
        db.refresh(chat_record)
    except Exception as e:
        logger.error(f"DB ERROR: {str(e)}")

    return {
        "user_message": message,
        "ai_response": response
    }


# =========================
# HISTORY
# =========================
@router.get("/history", response_model=List[ChatHistoryItem])
def get_chat_history(
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == user.id)
        .order_by(Chat.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return [
        ChatHistoryItem(
            id=c.id,
            user_message=c.query,
            ai_response=c.response,
            created_at=c.created_at
        )
        for c in chats
    ]
