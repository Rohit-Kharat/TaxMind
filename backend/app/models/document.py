from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_type = Column(String)
    size_mb = Column(String)
    status = Column(String, default="processed")
    upload_time = Column(DateTime, default=datetime.utcnow)
