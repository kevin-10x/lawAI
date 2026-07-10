from sqlalchemy import Column, Integer, String, DateTime, Text, Enum as SAEnum, ForeignKey, Float
from sqlalchemy.sql import func
from app.database import Base
import enum

class ConsultationStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ConsultationMode(str, enum.Enum):
    VIDEO = "video"
    PHONE = "phone"
    CHAT = "chat"
    IN_PERSON = "in_person"

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    practice_area = Column(String, nullable=True)
    mode = Column(SAEnum(ConsultationMode), default=ConsultationMode.VIDEO)
    status = Column(SAEnum(ConsultationStatus), default=ConsultationStatus.SCHEDULED)
    scheduled_date = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=30)
    fee = Column(Float, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
