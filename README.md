# 🚀 GenAI Enterprise Platform

Production-ready **GenAI chatbot platform** built with FastAPI, React, PostgreSQL, and OpenAI.
Designed with **scalable architecture, secure authentication, and Kubernetes deployment**.

---

## 🧠 Overview

This platform enables users to interact with AI in a secure and scalable environment.

It includes:

* JWT-based authentication
* Persistent chat history
* LLM-powered responses
* Kubernetes-based deployment
* Public access via Cloudflare Tunnel

---

## ✨ Features

* 🔐 JWT Authentication (Login / Signup)
* 💬 AI Chat (OpenAI integration)
* 🗄 Persistent Chat History (PostgreSQL)
* ⚡ FastAPI backend (clean architecture)
* 🎯 React + Vite frontend
* ☸️ Kubernetes deployment (scalable)
* 🌐 Cloudflare Tunnel (secure public exposure)
* 🔄 REST API-based architecture

---

## 🏗 Architecture

```
Frontend (Vercel - React)
        ↓
Cloudflare Tunnel (Public URL)
        ↓
FastAPI Backend (Kubernetes Pod)
        ↓
PostgreSQL (K8s Service)
```

---

## 🔄 Request Flow

```
User → Login → JWT Token
User → Chat Request → Backend (JWT Verified)
Backend → OpenAI → Response
Backend → Store in PostgreSQL
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

### AI

* OpenAI (gpt-4o-mini)

### Infrastructure

* Docker
* Kubernetes (Minikube)
* Cloudflare Tunnel
* Vercel (Frontend Hosting)

---

## 📁 Project Structure

```
genai-chat/
│
├── app/                # FastAPI backend
│   ├── api/
│   ├── models/
│   ├── services/
│   └── core/
│
├── frontend/           # React frontend
│
├── k8s/                # Kubernetes manifests
│
├── Dockerfile.backend
├── requirements.txt
├── README.md
```

---

## ⚙️ Local Setup

### Backend

```
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## ☸️ Kubernetes Deployment

```
kubectl apply -f k8s/base/
kubectl get pods -n genai
kubectl get svc -n genai
```

---

## 🌐 Public Access (Cloudflare Tunnel)

```
cloudflared tunnel --url http://localhost:8000
```

---

## 🔐 Environment Variables

Create `.env` file:

```
OPENAI_API_KEY=your_key
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET_KEY=your_secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 🔌 API Usage

### Signup

```
POST /auth/signup
```

### Login

```
POST /auth/login
```

### Chat

```
POST /chat/
Authorization: Bearer <TOKEN>
```

---

## 📸 Screenshots

(Add these images for proof)

* Chat UI working
* Swagger API docs (/docs)
* Kubernetes pods (`kubectl get pods`)
* Kubernetes services (`kubectl get svc`)
* Cloudflare public URL working

---

## 📈 Scalability

* Kubernetes deployment with HPA
* Stateless backend
* Database separation
* Easily extendable to multi-region

---

## 🎯 Use Cases

* Enterprise AI assistants
* Internal copilots
* Chat-based automation
* Knowledge base systems

---

## 🚀 Future Improvements

* RAG (PDF / document chat)
* Vector DB (FAISS / Pinecone)
* Streaming responses
* Redis caching
* Observability (Prometheus + Grafana)
* CI/CD pipeline

---

## 👨‍💻 Author

Damodaram

---

## ⭐ Summary

This project demonstrates:

* Full-stack development
* Kubernetes deployment
* LLM integration
* Production-level debugging
* Real-world system design
