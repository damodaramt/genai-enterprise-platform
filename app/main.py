from dotenv import load_dotenv
load_dotenv()  # MUST be first

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.auth import router as auth_router

app = FastAPI()

# 🔴 CORS CONFIG (FIX)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠ dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔴 ROUTERS
app.include_router(chat_router, prefix="/chat")
app.include_router(auth_router, prefix="/auth")

# 🔴 HEALTH CHECK
@app.get("/")
def root():
    return {"status": "running"}
