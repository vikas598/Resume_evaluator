from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app import models , oauth2
from app.schemas import auth_schema

router= APIRouter(tags=['User'])

@router.post('/register', status_code=status.HTTP_201_CREATED, response_model=auth_schema.UserRegisterOut )
def create_user(user: auth_schema.RegisterUser, db:Session = Depends(get_db)):
    try:
        hashed_password = oauth2.get_password_hash(user.password)
        user.password = hashed_password
        new_user = models.User(**user.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists.")