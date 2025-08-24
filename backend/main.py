from fastapi import FastAPI, Query as FastAPIQuery, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import RAG_app


class Query(BaseModel):
    user_query:str

class Response(BaseModel):
    rag_response:str

app=FastAPI()
origins=['http://localhost:8080',]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

# Global variable for chat history
chat_history = {}

# fetching response from RAG
def rag_response(query):
    rag_response=RAG_app.main(query=query)
    return rag_response

 
# Fetching user request using POST request
@app.post("/query", response_model=Response)
async def fetch_query(query:Query,session_id: str = FastAPIQuery(...)):
    rag_resp=rag_response(query.user_query)
    if session_id not in chat_history:
        chat_history[session_id]=[]
    chat_history[session_id].append({"user_query":query.user_query, "rag_response":rag_resp})
    if rag_resp is not None:
        return Response(rag_response=rag_resp)
    else:
        return Response(rag_response="")


# Providing the response using get request
@app.get("/history",response_model=list)
async def get_history(session_id: str=FastAPIQuery(...)):
    if session_id not in chat_history:
        raise HTTPException(status_code=404, detail="No history found for this session.")
    return chat_history[session_id]