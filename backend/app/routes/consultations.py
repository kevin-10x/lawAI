from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.consultation import Consultation, ConsultationStatus, ConsultationMode
from app.models.user import User, UserRole
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/consultations", tags=["Consultations"])

class ConsultationRequest(BaseModel):
    title: str
    description: str | None = None
    practice_area: str | None = None
    mode: str = "video"
    scheduled_date: str | None = None
    duration_minutes: int = 30

@router.post("/")
def create_consultation(req: ConsultationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    consultation = Consultation(
        client_id=current_user.id,
        title=req.title,
        description=req.description,
        practice_area=req.practice_area,
        mode=req.mode,
        scheduled_date=datetime.fromisoformat(req.scheduled_date) if req.scheduled_date else None,
        duration_minutes=req.duration_minutes,
        fee=1500,
        status=ConsultationStatus.SCHEDULED,
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return {"message": "Consultation booked", "consultation": {"id": consultation.id, "title": consultation.title, "status": consultation.status.value}}

@router.get("/")
def list_consultations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Consultation)
    if current_user.role == UserRole.CLIENT:
        query = query.filter(Consultation.client_id == current_user.id)
    elif current_user.role == UserRole.LAWYER:
        query = query.filter(Consultation.lawyer_id == current_user.id)
    consultations = query.all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "practice_area": c.practice_area,
            "mode": c.mode.value if c.mode else None,
            "status": c.status.value if c.status else None,
            "scheduled_date": str(c.scheduled_date) if c.scheduled_date else None,
            "fee": c.fee,
            "created_at": str(c.created_at),
        }
        for c in consultations
    ]

@router.get("/{consultation_id}")
def get_consultation(consultation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return {
        "id": consultation.id,
        "title": consultation.title,
        "description": consultation.description,
        "practice_area": consultation.practice_area,
        "mode": consultation.mode.value if consultation.mode else None,
        "status": consultation.status.value,
        "scheduled_date": str(consultation.scheduled_date) if consultation.scheduled_date else None,
        "duration_minutes": consultation.duration_minutes,
        "fee": consultation.fee,
        "notes": consultation.notes,
        "created_at": str(consultation.created_at),
    }

@router.patch("/{consultation_id}/status")
def update_consultation_status(consultation_id: int, status: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    consultation.status = ConsultationStatus(status)
    db.commit()
    return {"message": f"Consultation status updated to {status}"}
