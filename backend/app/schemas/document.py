from pydantic import BaseModel
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    size_mb: str
    status: str
    upload_time: datetime

    class Config:
        from_attributes = True
