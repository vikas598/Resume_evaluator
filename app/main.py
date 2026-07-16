from groq import Groq
from dotenv import load_dotenv
import os
from pypdf import PdfReader
from docx import Document
from pydantic import BaseModel

load_dotenv()
API_KEY= os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"

if not API_KEY:
    raise ValueError("api key not found")

client = Groq(api_key=API_KEY)

class Jd(BaseModel):
    role:str
    required_skills:list[str]
    preffered_skills: list[str]
    minimum_experience: str
    educational_requirements: list[str]
    responsibility:str

class Experience(BaseModel):
    company:str
    role:str
    tech_stack:list[str]
    duration:str
    description:str

class Resume(BaseModel):
    name:str
    email:str
    phone_no: int
    skills:list[str]
    experiences: list[Experience]
    projects: list[str]
    certifications: list[str]

class Result(BaseModel):
    score:float
    detail:dict