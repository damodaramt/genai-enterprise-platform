from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.services.llm import generate_response
from app.core.deps import get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.core.db import get_db

router = APIRouter(prefix="/chat", tags=["chat"])


# ✅ FIXED
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


@router.post("/", response_model=ChatResponse)
def chat(
    req: ChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print("USER:", user.email)
    print("MESSAGE:", req.message)

    message = req.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message required")

    try:
        response = generate_response(message)
    except Exception as e:
        print("LLM ERROR:", e)
        raise HTTPException(status_code=500, detail="LLM generation failed")

    chat_record = Chat(
        user_id=user.id,
        query=message,
        response=response
    )

    db.add(chat_record)
    db.commit()
    db.refresh(chat_record)

    return {
        "user_message": message,
        "ai_response": response
    }


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
        {
            "id": c.id,
            "user_message": c.query,
            "ai_response": c.response,
            "created_at": c.created_at,
        }
        for c in chats
    ]
