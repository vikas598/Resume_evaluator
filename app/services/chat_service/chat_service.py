import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.services.chat_service.agent import agent

load_dotenv()
os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")
model = "groq:llama-3.3-70b-versatile"


def chat_service(message:str , db: Session, thread_id:str):
    build_agent = agent(thread_id, db)
    config = {"configurable": {"thread_id": thread_id}}
    print("Thread ID passed to invoke:", thread_id)
    print("Config:", config)
    response = build_agent.invoke({"messages": [{"role": "user", "content": message}]},
    config=config)
    return {
    "response": response["messages"][-1].content
    }


                                    
                                       
                                   