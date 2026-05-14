from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
import os

from app.services.ai_agent import AIAgentService
from app.services.vector_store import VectorStoreService
from app.services.doc_processor import DocumentProcessor

# Initialize services (before app creation)
ai_service = AIAgentService()
vs_service = VectorStoreService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize knowledge base
    kb_path = os.path.join("app", "data", "tax_kb.txt")
    vs_service.initialize_kb(kb_path)
    yield
    # Shutdown (cleanup if needed)


app = FastAPI(title="TaxMind API", version="1.0.0", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []


@app.get("/")
async def root():
    return {"message": "Welcome to TaxMind AI API", "status": "online", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = await ai_service.get_response(request.message, request.history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        filename = file.filename.lower()
        
        parsed_text = ""
        if filename.endswith(".pdf"):
            parsed_text = DocumentProcessor.parse_pdf(content)
        elif filename.endswith(".xls") or filename.endswith(".xlsx"):
            parsed_text = DocumentProcessor.parse_excel(content)
        elif filename.endswith(".txt"):
            parsed_text = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")
            
        parsed_text = DocumentProcessor.cleanup_text(parsed_text)
        
        if parsed_text:
            success = vs_service.add_text(parsed_text, metadata={"source": file.filename})
            if not success:
                raise HTTPException(status_code=500, detail="Failed to add document to vector store.")
                
        return {"message": "File processed and added to knowledge base successfully.", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
