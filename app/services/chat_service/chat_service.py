from app.models import User, Thread
from sqlalchemy.orm import Session

def chat_service(message:str , db: Session, thread_id:str):
    return {"response" : "Message recieved"}