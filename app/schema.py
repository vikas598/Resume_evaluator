from pydantic import BaseModel, Field


class Jd(BaseModel):
    role: str | None = None
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    minimum_experience: str | None = None
    educational_requirements: list[str] = Field(default_factory=list)
    responsibility: str | None = None


class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    tech_stack: list[str] = Field(default_factory=list)
    duration: str | None = None
    description: str | None = None


class Resume(BaseModel):
    name: str | None = None
    email: str | None = None
    phone_no: str | None = None
    skills: list[str] = Field(default_factory=list)
    experiences: list[Experience] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)


class Result(BaseModel):
    score: float
    detail: dict