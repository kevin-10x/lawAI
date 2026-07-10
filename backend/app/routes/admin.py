from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.models.case import Case
from app.models.document import Document
from app.models.consultation import Consultation
from app.models.payment import Payment
from app.utils.auth import get_current_user, require_role

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/dashboard")
def admin_dashboard(current_user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    total_clients = db.query(User).filter(User.role == UserRole.CLIENT).count()
    total_lawyers = db.query(User).filter(User.role == UserRole.LAWYER).count()
    total_cases = db.query(Case).count()
    total_documents = db.query(Document).count()
    total_consultations = db.query(Consultation).count()
    total_revenue = db.query(Payment).filter(Payment.status == "completed").count()
    revenue_amount = sum(p.amount for p in db.query(Payment).filter(Payment.status == "completed").all())
    return {
        "total_clients": total_clients,
        "total_lawyers": total_lawyers,
        "total_cases": total_cases,
        "total_documents": total_documents,
        "total_consultations": total_consultations,
        "total_revenue": total_revenue,
        "revenue_amount": revenue_amount,
    }

@router.get("/users")
def list_users(current_user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "username": u.username,
            "full_name": u.full_name,
            "role": u.role.value,
            "is_active": u.is_active,
            "created_at": str(u.created_at),
        }
        for u in users
    ]
