from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class RegisterUser(BaseModel):
    name: str
    mail: str
    password: str

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
