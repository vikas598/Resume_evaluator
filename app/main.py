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
    company:str | None
    role:str | None
    tech_stack:list[str] | None
    duration:str | None
    description:str | None

class Resume(BaseModel):
    name:str
    email:str | None
    phone_no: int | None
    skills:list[str] | None
    experiences: list[Experience] | None
    projects: list[str] | None
    certifications: list[str] | None

class Result(BaseModel):
    score:float
    detail:dict

schema_jd= Jd.model_json_schema()
schema_resume= Resume.model_json_schema()
response_format={"type":"json_object"}

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
    response= client.chat.completions.create(model=MODEL, messages=messsages, response_format=response_format)
    result =response.choices[0].message.content
    raw_json= json.loads(result)
    jobd=Jd(**raw_json)
    return jobd

def resume_extractor(filepath):
    if filepath.lower().endswith(".pdf"):
        text=pdf_extractor(filepath)
    elif filepath.lower().endswith(".docx"):
        text=docx_extractor(filepath)
    else:
        raise ValueError("invalid file type!! ")
    return text

def pdf_extractor(filepath):
    reader= PdfReader(filepath)
    text= "\n".join(
        page.extract_text() or ""
        for page in reader.pages
    )
    return text

def docx_extractor(filepath):
    doc = Document(filepath)

    text = ""

    # Extract paragraphs
    for para in doc.paragraphs:
        if para.text.strip():
            text += para.text.strip() + "\n"

    # Extract tables
    for table in doc.tables:
        for row in table.rows:
            row_text = " | ".join(cell.text.strip() for cell in row.cells)
            text += row_text + "\n"

    return text

def resume_parser(text):
    system_prompt= f'''
        You are an expert Resume Analyzer specializing in extracting structured information from resumes.

        The user will provide a resume. Your task is to carefully analyze the resume and extract all relevant information according to the provided Resume schema.

        resume schema: 

        Guidelines: {schema_resume}
        - Extract only information that is explicitly stated in the resume.
        - Do NOT invent, assume, infer, or exaggerate any information.
        - Do NOT fill in missing details based on context or common assumptions.
        - Every field defined in the schema must be present in the output.
        - If a scalar field (such as name, email, phone number, location, designation, etc.) is missing, return `null`.
        - If a list field (such as skills, education, work_experience, projects, certifications, languages, achievements, publications, etc.) is missing, return an empty list (`[]`).
        - If a nested object's property is missing, set that property to `null`.
        - Preserve the original information without rewording or adding extra details.
        - Ensure the output strictly conforms to the provided Resume schema.
        - Return only a valid JSON object.
        - Do not include explanations, markdown, comments, or any text outside the JSON response.
        '''
    system_message={
        "role": "system",
        "content": system_prompt
    }

    message={
        'role': "user",
        "content": text
    }
    messsages=[system_message,message]
    response= client.chat.completions.create(model=MODEL, messages=messsages, response_format=response_format)
    result =response.choices[0].message.content
    raw_json= json.loads(result)
    resume=Jd(**raw_json)
    return resume

def score(jobd, resume):
    match_schema= Result.model_json_schema
    prompt = f"""
    You are an HR recruiter.

    Compare the candidate's resume with the job description.

    JOB DESCRIPTION:
    {jobd.model_dump_json(indent=2)}

    CANDIDATE RESUME:
    {resume.model_dump_json(indent=2)}
    Return JSON matching this schema:

    {match_schema}

    Give me:

    1. Candidate name
    2. Matching skills
    3. Missing important skills
    4. Whether experience requirement is met
    5. Overall match percentage from 0 to 100
    6. A short final verdict

    Keep the response concise and easy to read.
    """
    message={
        "role": "user",
        "content" : prompt
    }
    messages=[message]
    response_format={
        "type": "json_object"
    }
    response = client.chat.completions.create(model=MODEL, messages=messages, response_format=response_format)
    data = json.loads(response.choices[0].message.content)
    return Result(**data)