from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import oauth2, models
from app.schemas import chat_schema
from app.services.chat_service.chat_service import chat_service
router = APIRouter(tags=["Chat"])

@router.post("/chat",response_model=chat_schema.ChatResponse)
async def chat( request: chat_schema.ChatRequest ,db: Session= Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user) ):
    try:
        thread = db.query(models.Thread).filter( models.Thread.user_id == current_user.id).first()

        if thread is None:
            raise HTTPException(
                status_code=404,
                detail="No active evaluation found."
            )
        
        return chat_service(request.message, db, thread.thread_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))