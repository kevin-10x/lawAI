from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.payment import Payment, PaymentStatus, PaymentMethod
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])

class PaymentRequest(BaseModel):
    amount: float
    method: str = "mpesa"
    phone_number: str | None = None
    description: str | None = None

@router.post("/")
def create_payment(req: PaymentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    import uuid
    payment = Payment(
        user_id=current_user.id,
        amount=req.amount,
        currency="KES",
        method=PaymentMethod(req.method),
        status=PaymentStatus.PENDING,
        reference=f"PAY-{uuid.uuid4().hex[:8].upper()}",
        phone_number=req.phone_number,
        description=req.description,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    # In production, initiate M-Pesa STK Push here
    payment.status = PaymentStatus.COMPLETED
    payment.mpesa_code = f"MPESA{payment.reference}"
    db.commit()
    return {
        "message": "Payment initiated",
        "payment": {
            "id": payment.id,
            "reference": payment.reference,
            "amount": payment.amount,
            "status": payment.status.value,
            "mpesa_code": payment.mpesa_code,
        }
    }

@router.get("/")
def list_payments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    payments = db.query(Payment).filter(Payment.user_id == current_user.id).all()
    return [
        {
            "id": p.id,
            "reference": p.reference,
            "amount": p.amount,
            "currency": p.currency,
            "method": p.method.value if p.method else None,
            "status": p.status.value,
            "description": p.description,
            "created_at": str(p.created_at),
        }
        for p in payments
    ]
