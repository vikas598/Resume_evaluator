import os
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool
from langgraph.checkpoint.postgres import PostgresSaver 

load_dotenv()
os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")
model = "groq:llama-3.3-70b-versatile"

from app.models import User, Thread
from sqlalchemy.orm import Session
from app.config import settings

DB_URI = f'postgresql://{settings.DATABASE_USERNAME}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOSTNAME}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}'

def chat_service(message:str , db: Session, thread_id:str):
    return {"response" : "Message recieved"}

with PostgresSaver.from_conn_string(DB_URI) as checkpointer:
    checkpointer.setup()

    chat_agent= create_agent(
        model= model,
        tools=[],
        checkpointer= checkpointer,
        system_prompt="Be concise and accurate"
    )

    print(chat_agent.invoke({"messages":[{"role":"user","content":"How are you?"}]},
                            config={"configurable": { "thread_id": "thread-1"} }))
                                    
                                       
                                   