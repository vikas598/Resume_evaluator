from datetime import datetime
from enum import Enum

from sqlalchemy import ForeignKey, String, DateTime, Enum as SQLEnum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB

from app.database import Base



class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    mail: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    threads = relationship("Thread", back_populates="user")

class Thread(Base):
    __tablename__= "thread"

    thread_id: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    parsed_resume: Mapped[dict] = mapped_column(JSONB, nullable=True)
    parsed_jd: Mapped[dict] = mapped_column(JSONB, nullable=True)
    result : Mapped[dict] = mapped_column(JSONB)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)


    user= relationship("User",back_populates= "threads")

    evaluation = relationship("Evaluation", back_populates="threads", uselist=False, cascade="all, delete-orphan")

class Evaluation(Base):
    __tablename__="convo_history"

    evaluation_id : Mapped[str] = mapped_column(primary_key=True)
    thread_id : Mapped[str] = mapped_column(ForeignKey("thread.thread_id"), unique=True, nullable=False)
    convo : Mapped[dict] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    threads = relationship("Thread", back_populates="evaluation")