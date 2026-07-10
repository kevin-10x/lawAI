from sqlalchemy import Column, Integer, String, DateTime, Text, Enum as SAEnum, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import enum

class CaseStatus(str, enum.Enum):
    ACTIVE = "active"
    PENDING = "pending"
    CLOSED = "closed"
    ARCHIVED = "archived"

class CaseType(str, enum.Enum):
    CORPORATE = "corporate"
    EMPLOYMENT = "employment"
    COMMERCIAL = "commercial"
    PROPERTY = "property"
    TECHNOLOGY = "technology"
    FAMILY = "family"
    OTHER = "other"

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lawyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=False)
    case_number = Column(String, unique=True, nullable=True)
    case_type = Column(SAEnum(CaseType), default=CaseType.OTHER)
    status = Column(SAEnum(CaseStatus), default=CaseStatus.PENDING)
    description = Column(Text, nullable=True)
    jurisdiction = Column(String, nullable=True)
    court = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
