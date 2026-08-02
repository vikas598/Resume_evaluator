from app.services.chat_service import agent

def get_chat_history(thread_id:str):
    config={
        "configurable" : {"thread_id":thread_id}
    }
    checkpoint = agent.checkpointer.get_tuple(config)
    messages = checkpoint[1]["channel_values"]["messages"]
    history=[]
    for message in messages:
        if message.type== "tool":
            continue
    
        if message.type=="ai" and not message.content :
            continue

        history.append({
            "role":message.type,
            "content" : message.content
        })

    
    return history