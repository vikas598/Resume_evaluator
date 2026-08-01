from fastapi import FastAPI
from groq import Groq 
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi import FastAPI

from langgraph.checkpoint.postgres import PostgresSaver

from app.services.chat_service import agent
from app.config import settings
from app.config import settings
from app.database import Base, engine
from app import models
from app.routes import upload,auth,user,chat

# DB_URI = f'postgresql://{settings.DATABASE_USERNAME}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOSTNAME}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}?sslmode=require&channel_binding=require'
DB_URI = f'postgresql://{settings.DATABASE_USERNAME}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOSTNAME}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}'

@asynccontextmanager
async def lifespan(app: FastAPI):
    cm = PostgresSaver.from_conn_string(DB_URI)

    agent.checkpointer = cm.__enter__()
    agent.checkpointer.setup()
    yield

    cm.__exit__(None, None, None)

Base.metadata.create_all(bind=engine)

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://resume-evaluator-two.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return{"message":"Hello world"}


API_KEY = settings.GROQ_API_KEY 
MODEL = "llama-3.3-70b-versatile"

if not API_KEY:
     raise ValueError("API key not found")

client = Groq(api_key=API_KEY)