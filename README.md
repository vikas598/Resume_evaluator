# Resume Evaluator

live link :-  https://resume-evaluator-two.vercel.app/

Resume Evaluator is a full-stack application that helps users evaluate resumes against a job description using AI. Users can create an account, upload a job description and resume, and receive a structured match score with relevant insights.

## Features

- User authentication and authorization with JWT
- Upload and parse job descriptions
- Upload and parse resumes
- AI-assisted resume-to-job matching
- Chat-based follow-up experience powered by Groq and LangGraph
- Responsive React frontend with Vite

## Tech Stack

### Backend
- Python 3.12+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic settings
- LangGraph + Groq
- JWT-based auth

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Project Structure

- app/ - FastAPI backend
  - config.py - environment settings
  - database.py - database connection and session setup
  - main.py - FastAPI app entry point
  - routes/ - API endpoints for auth, upload, chat, and user data
  - services/ - parsing, evaluation, and chat logic
- frontend/ - React frontend
  - src/ - components, pages, and services
  - public/ - static assets
- requirements.txt - Python dependency list
- pyproject.toml - Python project configuration

## Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL database
- A Groq API key

## Environment Variables

Create a .env file in the project root with the following values:

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_HOSTNAME=localhost
DATABASE_PORT=5432
DATABASE_NAME=resume_evaluator
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTE=30
```

## Backend Setup

1. Create and activate a virtual environment
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
   On Windows PowerShell:
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at http://localhost:8000.

## Frontend Setup

1. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173.

## API Overview

Main backend endpoints include:

- POST /auth/register - register a new user
- POST /auth/login - sign in and receive a JWT token
- POST /upload/jd - upload a job description
- POST /upload/resume - upload a resume for evaluation
- POST /chat - continue the evaluation conversation with AI

## Notes

- The application expects a running PostgreSQL instance and a valid Groq API key.
- The backend loads environment values from the project root .env file.
- The frontend is designed to work with the backend API during local development.
