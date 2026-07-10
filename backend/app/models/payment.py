from sqlalchemy import Column, Integer, String, DateTime, Float, Enum as SAEnum, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(str, enum.Enum):
    MPESA = "mpesa"
    CARD = "card"
    BANK = "bank"
    OTHER = "other"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="KES")
    method = Column(SAEnum(PaymentMethod), default=PaymentMethod.MPESA)
    status = Column(SAEnum(PaymentStatus), default=PaymentStatus.PENDING)
    reference = Column(String, unique=True, nullable=True)
    description = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    mpesa_code = Column(String, nullable=True)
    is_subscription = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
