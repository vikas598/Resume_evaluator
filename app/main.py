from fastapi import FastAPI
from groq import Groq 
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app import models
from app.routes import upload,auth,user

Base.metadata.create_all(bind=engine)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(auth.router)
app.include_router(user.router)

@app.get("/")
def root():
    return{"message":"Hello world"}


API_KEY = settings.GROQ_API_KEY 
MODEL = "llama-3.3-70b-versatile"

if not API_KEY:
     raise ValueError("API key not found")

client = Groq(api_key=API_KEY)