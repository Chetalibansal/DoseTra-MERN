# 💊 DoseTra – AI-Powered Smart Medicine Reminder System

![MERN](https://img.shields.io/badge/MERN-Full%20Stack-green)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

DoseTra is an intelligent medicine reminder and adherence tracking platform that helps users manage medications efficiently. It combines scheduling, reminders, health analytics, AI-powered medicine assistance, and Google Calendar integration to improve medication adherence.

---

## 🚀 Features

### 👤 Authentication
- JWT Authentication
- Google OAuth Login
- Secure password hashing using bcrypt
- Protected routes

### 💊 Medicine Management
- Add, edit, and delete medicines
- Custom dosage schedules
- Frequency-based reminders
- Medicine history

### ⏰ Smart Reminders
- Daily reminders
- Missed dose tracking
- Upcoming medication dashboard
- Adherence monitoring

### 📊 Dashboard & Analytics
- Daily medication overview
- Adherence percentage
- Dose statistics
- Interactive charts using Recharts

### 🤖 AI Health Assistant
- Answers medicine-related questions
- Personalized medication guidance
- Retrieves user medication schedules
- Context-aware responses using RAG
- Privacy-first architecture (AI never directly accesses database)

### 📅 Google Calendar Integration
- Sync medicine schedules
- Automatic event creation
- Delete synced events
- OAuth-based authorization

### 📄 Reports
- Medication adherence reports
- Downloadable summaries

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- ShadCN UI
- Redux Toolkit
- RTK Query
- React Router
- Recharts
- Axios
- Framer Motion

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Passport Google OAuth

## AI

- Groq LLM
- Retrieval-Augmented Generation (RAG)
- LanceDB Vector Database
- Sentence Transformers

---

# 📂 Project Structure

```
DoseTra/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── data/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
|   ├── scripts/
│   ├── utils/
│   ├── services/
|   |     |──chatbot/
|   |     ├──rag/   
│   ├── config/
│   └── server.js
│   └── app.js
│   └── start.js
|
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/DoseTra.git

cd DoseTra
```

---

## Install Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Install Backend

```bash
cd backend

npm install

npm start
```

---


# 🔑 Environment Variables

## Backend

Create a `.env` file inside `backend`.

```env
PORT=7000

MONGO_URI=

JWT_SECRET_KEY=

JWT_EXPIRES=

EMAIL_USER=

EMAIL_PASS = 

FRONTEND_URL = http://localhost:5173

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_CALENDAR_REDIRECT_URI=

GEMINI_API_KEY =

DEFAULT_TIMEZONE =

GROQ_API_KEY =

GROQ_MODEL = llama-3.3-70b-versatile

GEMINI_EMBEDDINGS_MODEL = gemini-embedding-001

MEDICINE_DB_URL = 
```

---

## FRONTEND

Create a `.env` file inside `frontend`.

```env
VITE_FRONTEND_URL = http://localhost:5173

VITE_BACKEND_URL = http://localhost:7000

VITE_GOOGLE_CLIENT_ID =

GOOGLE_CLIENT_SECRET = 
```

---

# 📡 API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login

POST /api/auth/google
```

## Medicines

```
GET /api/medicine

POST /api/medicine

PUT /api/medicine/:id

DELETE /api/medicine/:id
```

## Dashboard

```
GET /api/dashboard
```

## AI

```
POST /api/chatbot/query

POST /api/ai/predict
```

## Calendar

```
GET /api/calendar/sync

DELETE /api/calendar/:id
```

---

# 🧠 AI Workflow

```
User Query
      │
      ▼
Intent Detection
      │
      ▼
Retrieve Context (RAG)
      │
      ▼
Groq LLM
      │
      ▼
Personalized Response
```

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---
