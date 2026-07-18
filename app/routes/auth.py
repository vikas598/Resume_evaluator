from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm 
from sqlalchemy.orm import Session

from app.database import get_db
from app import models , oauth2
from app.schemas import auth_schema

router= APIRouter(tags=['Authentication'])

@router.post('/login', response_model=auth_schema.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session=Depends(get_db)):
    user= db.query(models.User).filter(models.User.mail == user_credentials.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")
    
    if not oauth2.verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    access_token= oauth2.create_access_token(data={"user_id":user.id})
    return {"access_token": access_token, "token_type":"bearer"}