from langchain.tools import tool
from langchain.agents import create_agent

from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from app.models import Thread

load_dotenv()
os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")
model = "groq:llama-3.3-70b-versatile"

checkpointer = None

def agent(thread_id:str, db:Session):
    thread = db.query(Thread).filter(Thread.thread_id == thread_id).first()

    if thread is None:
        raise ValueError("Thread not found")

    @tool
    def get_resume():
        """Retrieve the parsed resume for the current thread."""
        return thread.parsed_resume

    @tool
    def get_jd():
        """Retrieve the parsed JD for the current thread."""
        return thread.parsed_jd
        

    @tool
    def get_score():
        """Retrieve the evaluation score for the current thread."""    
        return thread.result
         
    get_chat_agent= create_agent(
        model= model,
        tools=[get_jd, get_resume,get_score],
        checkpointer= checkpointer,
        system_prompt="Be concise and accurate"
    )

    return get_chat_agent

