from dotenv import load_dotenv
import os

from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from pinecone import Pinecone
from pinecone import ServerlessSpec

from google import genai
from google.genai import types
load_dotenv()

# Initialize a Pinecone client with your API key
PINECONE_API=os.getenv("PINECONE_API_KEY")
index_name=os.getenv("PINECONE_INDEX_NAME")
region_name=os.getenv("PINECONE_ENVIRONMENT")
pc = Pinecone(api_key=PINECONE_API)
if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=region_name),
    )
index = pc.Index(index_name)

google_api_key = os.getenv("GOOGLE_API_KEY")
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=google_api_key)

# For storing the context of chating
chat_history = []

def pinecone_retriver(query):
    """
    This functions helps to retrive the documents fron the vector database
    query: This is the query to be processed by the user
    """
    vector_store = PineconeVectorStore(index=index, embedding=embeddings)
    retriever = vector_store.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"k": 10, "score_threshold": 0.4},
    )
    query = query
    documents=retriever.invoke(query)
    content_list = [doc.page_content for doc in documents]
    return content_list


def finetuning_RAG_LLM():
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        config=types.GenerateContentConfig(
            system_instruction="You are a summary writing expert. Based on the provided chat history, write the summary of the chat history using decent words possible. Also rephrase the 'Follow Up User Query' into a complete, standalone query and merge it to the summary so that it makes sense. Only output the rewritten summary and nothing else."),
        contents=chat_history
    )
    summary=response.text
    # print("Generated summary===\n ",response.text,"===Summary ended")
    chat_history.clear()
    chat_history.append("Here is the summary of the previous conversation:\n"+summary)


def RAG_LLM_integration(content_list,query):
    client = genai.Client()
    chat_history.append(f"'role':'user','parts':{query}")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=f"You are a machine learning tutor specialized in machine learning. You will be given with a context of relavent imformation based on the user query. Your task is to answer the user's question based ONLY on the provided context. If the answer is not in the context, you must say, 'Sorry! I could not find the answer.'. Keep your answer clear, consise and educational.\n\nContext: {content_list}"),
        contents=chat_history
        )
    chat_history.append(f"'role':'model','parts':{response.text}")
    chatbot_response=response.text
    return chatbot_response

def main(query):
    # query=input("Anything you want to know about ML: ")
    query=query
    content_list=pinecone_retriver(query)
    if(len(chat_history)<=10):
        rag_response=RAG_LLM_integration(content_list,query)
    else:
        finetuning_RAG_LLM()
        rag_response=RAG_LLM_integration(content_list,query)
    return rag_response



if __name__=="__main__":
    design="#"*20
    print(f"{design} Welcome to my RAG {design}")
    print("Press 'Exit' to Exit")
    while True:
        query=input("Anything you want to know about ML: ")
        if query=="Exit":
            break
        content_list=pinecone_retriver(query)
        if(len(chat_history)<=5):
            RAG_LLM_integration(content_list,query)
        else:
            finetuning_RAG_LLM()
            RAG_LLM_integration(content_list,query)