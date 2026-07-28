from pydantic import BaseModel, Field


class EvaluationDetailOut(BaseModel):
    matching_skills: list[str] = Field(default_factory=list)
    missing_important_skills: list[str] = Field(default_factory=list)
    final_verdict: str = ""


class ResumeEvaluationOut(BaseModel):
    thread_id: str
    name: str
    score: float
    detail: EvaluationDetailOut


class JDOut(BaseModel):
    thread_id: str
    filename: str
    message: str
    