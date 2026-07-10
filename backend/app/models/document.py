from sqlalchemy import Column, Integer, String, DateTime, Text, Enum as SAEnum, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import enum

class DocumentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class DocumentType(str, enum.Enum):
    CONTRACT = "contract"
    LEGAL_LETTER = "legal_letter"
    AFFIDAVIT = "affidavit"
    AGREEMENT = "agreement"
    POLICY = "policy"
    OTHER = "other"

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    file_type = Column(String, nullable=True)
    doc_type = Column(SAEnum(DocumentType), default=DocumentType.OTHER)
    status = Column(SAEnum(DocumentStatus), default=DocumentStatus.PENDING)
    ai_analysis = Column(Text, nullable=True)
    risk_score = Column(Integer, nullable=True)
    risk_report = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
