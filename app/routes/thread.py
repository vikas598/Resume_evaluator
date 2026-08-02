from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List

from app import oauth2, models
from app.database import get_db
from app.schemas.thread_schema import Thread, ThreadDetail, ThreadUpdate
from app.services.chat_history import get_chat_history


router = APIRouter(tags=['thread'])

@router.get("/threads", response_model=List[Thread],status_code=status.HTTP_200_OK)
def get_threads(db: Session= Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user) ):
    try:
        thread = db.query(models.Thread).filter(models.Thread.user_id == current_user.id).order_by(models.Thread.updated_at.desc()).all()
        return [
            {
                "thread_id":t.thread_id,
                "title":t.title,
                "updated_at":t.updated_at
            }
        for t in thread]

    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error while fetching threads.")

@router.get("/threads/{thread_id}", response_model=ThreadDetail, status_code=status.HTTP_200_OK)
def get_thread(thread_id: str ,db: Session= Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user) ):
    try:
        thread = db.query(models.Thread).filter(models.Thread.thread_id == thread_id, models.Thread.user_id == current_user.id).first()
        if not thread:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

        history = get_chat_history(thread_id)
        
        return {
                    "thread_id": thread.thread_id,
                    "title": thread.title,
                    "updated_at": thread.updated_at,
                    "parsed_jd": thread.parsed_jd,
                    "parsed_resume": thread.parsed_resume,
                    "result": thread.result,
                    "history": history
                }

    except SQLAlchemyError:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error while fetching thread.")

@router.patch("/threads/{thread_id}", status_code=status.HTTP_200_OK)
def update_thread(thread_id: str, request: ThreadUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user) ):
    try:
        thread = (db.query(models.Thread).filter(models.Thread.thread_id == thread_id, models.Thread.user_id == current_user.id).first())

        if not thread:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")
        thread.title = request.title
        db.commit()
        db.refresh(thread)
        return {
            "message": "Thread updated successfully"
        }
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error while updating thread.")

@router.delete("/threads/{thread_id}", status_code=status.HTTP_200_OK)
def delete_thread( thread_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    try:
        thread = (db.query(models.Thread).filter(models.Thread.thread_id == thread_id, models.Thread.user_id == current_user.id).first())

        if not thread:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")
        db.delete(thread)
        db.commit()

        return {
            "message": "Thread deleted successfully"
        }

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error while deleting thread.")

    