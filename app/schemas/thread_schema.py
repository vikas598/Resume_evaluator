from pydantic import BaseModel
from typing import List, Any
from datetime import datetime

class Thread(BaseModel):
    thread_id: str
    title: str
    updated_at: datetime

class ChatMessage(BaseModel):
    role: str
    content: str


class ThreadDetail(BaseModel):
    thread_id: str
    title: str
    updated_at: datetime

    parsed_jd: dict[str, Any]
    parsed_resume: dict[str, Any]
    result: dict[str, Any]

    history: List[ChatMessage]