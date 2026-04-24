# app/main.py

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router

# DB
from app.db.database import engine, Base

# 🔴 IMPORTANT: register ALL models BEFORE create_all
import app.models.user  # noqa
import app.models.chat  # noqa

app = FastAPI(
    title="GenAI Backend",
    version="1.0.0",
)


# =========================
# DATABASE INIT
# =========================
@app.on_event("startup")
def startup():
    print("🚀 Starting application...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables ensured")


# =========================
# CORS (ONLY HERE)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://genai-enterprise-platform.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROUTES
# =========================
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])


# =========================
# HEALTH CHECKS
# =========================
@app.get("/", tags=["health"])
def root():
    return {"status": "running"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
