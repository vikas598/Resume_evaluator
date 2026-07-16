from groq import Groq
from dotenv import load_dotenv
import os
from pypdf import PdfReader
from docx import Document
from pydantic import BaseModel
import json

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

schema_jd= Jd.model_json_schema()
response_type={"type":"json_object"}

def get_jd():  
    with open("job_description.txt", "r") as file:
        JD= file.read()
        print(JD)
    
    prompt=f'''
        You are an expert HR assistant specializing in analyzing job descriptions.

        Your task is to carefully read the provided job description and extract all relevant information according to the provided JD schema. Return the extracted information as a valid JSON object that strictly conforms to the schema.

        Guidelines:
        - Extract only information that is explicitly stated or can be directly inferred from the job description.
        - Do NOT invent, assume, infer, or exaggerate any information that is not present.
        - If a field or value is not mentioned in the job description, return `null` for that field.
        - If a list-type field is not mentioned, return `null` instead of an empty list unless the schema explicitly requires otherwise.
        - If a nested object contains missing fields, set those individual fields to `null`.
        - Preserve the original meaning of the job description without adding extra context.
        - Return only valid JSON.
        - Do not include explanations, markdown, comments, or any additional text outside the JSON response.
        - Ensure the output strictly follows the provided JD schema.

        Input:
        {JD}

        Output:
        {schema_jd}
        '''
    message={
        'role':'user',
        'content': prompt
    }
    messsages=[message]
    response= client.chat.completions.create(model=MODEL, messages=messsages, response_format=response_type)
    result =response.choices[0].message.content
    raw_json= json.loads(result)
    jobd=Jd(**raw_json)
    return jobd

