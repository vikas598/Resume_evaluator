from groq import Groq

from app.config import settings

API_KEY = settings.GROQ_API_KEY
MODEL = "llama-3.3-70b-versatile"

client = Groq(api_key=API_KEY)