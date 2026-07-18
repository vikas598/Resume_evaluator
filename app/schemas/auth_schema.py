from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class RegisterUser(BaseModel):
    id: int
    name: str
    mail: str
    password: str
    role: str
    created_at: datetime

class UserRegisterOut(BaseModel):
    id: int
    mail: EmailStr
    created_at: datetime

class UserLogin(BaseModel):
    mail : EmailStr
    password: str 

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str]=None
