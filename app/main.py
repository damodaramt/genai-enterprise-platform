ashok_siva6363@genai-chatbot-server:~/genai-chat$ cat app/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.chat import router as chat_router

from app.db.database import engine, Base

import app.models.user  # noqa
import app.models.chat  # noqa

app = FastAPI(
    title="GenAI Backend",
    version="1.0.0",
)

@app.on_event("startup")
def startup():
    print("🚀 Starting application...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables ensured")


# TEMP: allow all origins for debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later to Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])


@app.get("/")
def root():
    return {"status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}

