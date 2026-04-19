# 🚀 GenAI Enterprise Platform

Production-ready **multi-tenant AI platform** built with FastAPI, React, JWT authentication, and OpenAI.
Designed for scalable, secure, and real-world enterprise use cases.

---

## 🧠 Overview

This platform enables organizations to interact with AI securely using their own data.
It supports **multi-user access, tenant isolation, persistent chat history, and LLM-powered responses**.

---

## ✨ Core Features

* 🔐 JWT-based authentication system
* 🏢 Multi-tenant architecture (organization-level isolation)
* 💬 AI-powered chat (OpenAI GPT)
* 🗄 Chat history persistence (PostgreSQL)
* ⚡ FastAPI backend with clean architecture
* 🎯 Modern UI (React + Vite)
* 🔄 API-driven scalable design

---

## 🏗 System Architecture

```
Client (React)
   ↓
FastAPI Backend
   ↓
Authentication Layer (JWT)
   ↓
LLM Service (OpenAI)
   ↓
PostgreSQL Database
```

---

## ⚙️ Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL

### Frontend

* React (Vite)
* Axios

### AI Layer

* OpenAI GPT (gpt-4o-mini)

### Infrastructure

* Docker (planned)
* Vercel (frontend deployment)

---

## 📦 Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

* **Backend**: http://34.93.50.136:8000
* **Frontend**: (Deploy via Vercel)

---

## 🔐 Environment Variables

Create `.env` file:

```env
OPENAI_API_KEY=
DATABASE_URL=
JWT_SECRET_KEY=
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 📈 Roadmap / Improvements

* 📄 RAG (document-based retrieval system)
* 🏢 Organization-level data isolation (advanced multi-tenancy)
* 🐳 Docker & containerized deployment
* ☸️ Kubernetes for scaling
* ⚡ Redis caching layer
* 📊 Observability (logs, metrics)

---

## 🎯 Use Cases

* Enterprise knowledge assistants
* Internal AI copilots
* Customer support automation
* Document-based Q&A systems

---

## 👨‍💻 Author

**Damodaram**

