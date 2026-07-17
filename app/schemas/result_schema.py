from pydantic import BaseModel

class EvaluationResultOut(BaseModel):
    candidate_name: str
    matching_skills: list[str]
    missing_skills: list[str]
    experience_requirement_met: bool
    overall_match_percentage: float
    final_verdict: str