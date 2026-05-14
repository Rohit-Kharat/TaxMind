from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
import os
from sqlalchemy.orm import Session

from app.services.ai_agent import AIAgentService
from app.services.vector_store import VectorStoreService
from app.services.doc_processor import DocumentProcessor
from app.core.database import engine, Base, get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageResponse

# Create DB tables
Base.metadata.create_all(bind=engine)

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


@app.get("/chat/history", response_model=List[ChatMessageResponse])
def get_chat_history(db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).order_by(ChatMessage.timestamp.asc()).all()
    return messages


@app.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # Save user message
        user_msg = ChatMessage(role="user", content=request.message)
        db.add(user_msg)
        db.commit()

        response = await ai_service.get_response(request.message, request.history)
        
        # Save bot response
        bot_msg = ChatMessage(role="bot", content=response)
        db.add(bot_msg)
        db.commit()
        
        return {"response": response}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/documents", response_model=List[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.upload_time.desc()).all()
    return docs

@app.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        filename = file.filename.lower()
        size_mb = f"{(len(content) / 1024 / 1024):.2f} MB"
        
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
                
        # Save to Database
        db_doc = Document(
            filename=file.filename,
            file_type=file.filename.split('.')[-1].upper(),
            size_mb=size_mb,
            status="processed"
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        
        return db_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
