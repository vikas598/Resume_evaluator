from pydantic import BaseModel

class ResumeOut(BaseModel):
    filename: list[str]
    message: str
    number_of_file: int

class JDOut(BaseModel):
    filename: str
    message: str
    