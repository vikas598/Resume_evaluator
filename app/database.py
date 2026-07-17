from sqlalchemy import create_engine
from sqlalchemy.orm import Session, DeclarativeBase

from app.config import settings


SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.DATABASE_USERNAME}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOSTNAME}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}'

engine= create_engine(SQLALCHEMY_DATABASE_URL)

class Base(DeclarativeBase):
    pass

