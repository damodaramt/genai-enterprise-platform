from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.auth import router as auth_router

app = FastAPI()


# ✅ STRICT CORS (REQUIRED FOR PREFLIGHT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://genai-enterprise-platform.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],   # 🔴 MUST be "*"
    allow_headers=["*"],   # 🔴 MUST be "*"
)


# ✅ ROUTES
app.include_router(chat_router, prefix="/chat")
app.include_router(auth_router, prefix="/auth")


# ✅ HEALTH
@app.get("/")
def root():
    return {"status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}
