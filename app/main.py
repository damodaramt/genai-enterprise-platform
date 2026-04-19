from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.auth import router as auth_router

app = FastAPI()

# ✅ PRODUCTION-SAFE CORS CONFIG
origins = [
    "http://localhost:5173",
    "https://genai-enterprise-platform.vercel.app",
    "https://genai-enterprise-platform-lyypb52g8-damodaramts-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # ❗ NOT "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(chat_router, prefix="/chat")
app.include_router(auth_router, prefix="/auth")

# HEALTH CHECK
@app.get("/")
def root():
    return {"status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}
