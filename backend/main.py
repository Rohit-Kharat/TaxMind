from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_agent import AIAgentService
from app.services.vector_store import VectorStoreService
import os

app = FastAPI(title="TaxMind API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
ai_service = AIAgentService()
vs_service = VectorStoreService()

# Initialize KB on startup
@app.on_event("startup")
async def startup_event():
    kb_path = os.path.join("app", "data", "tax_kb.txt")
    vs_service.initialize_kb(kb_path)

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = await ai_service.get_response(request.message, request.history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to TaxMind AI API", "status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
