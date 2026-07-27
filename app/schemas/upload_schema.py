from pydantic import BaseModel

class ResumeOut(BaseModel):
    filename: list[str]
    message: str
    number_of_file: int

class JDOut(BaseModel):
    thread_id: str
    filename: str
    message: str
    