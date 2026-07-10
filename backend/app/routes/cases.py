from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.case import Case, CaseStatus, CaseType
from app.models.user import User, UserRole
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/cases", tags=["Cases"])

class CaseRequest(BaseModel):
    title: str
    case_type: str = "other"
    description: str | None = None
    jurisdiction: str | None = None
    court: str | None = None

@router.post("/")
def create_case(req: CaseRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = Case(
        client_id=current_user.id,
        title=req.title,
        case_type=req.case_type,
        description=req.description,
        jurisdiction=req.jurisdiction,
        court=req.court,
        status=CaseStatus.PENDING,
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    return {"message": "Case created", "case": {"id": case.id, "title": case.title, "status": case.status.value}}

@router.get("/")
def list_cases(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Case)
    if current_user.role == UserRole.CLIENT:
        query = query.filter(Case.client_id == current_user.id)
    cases = query.all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "case_number": c.case_number,
            "case_type": c.case_type.value if c.case_type else None,
            "status": c.status.value if c.status else None,
            "jurisdiction": c.jurisdiction,
            "created_at": str(c.created_at),
        }
        for c in cases
    ]

@router.get("/{case_id}")
def get_case(case_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return {
        "id": case.id,
        "title": case.title,
        "case_number": case.case_number,
        "case_type": case.case_type.value if case.case_type else None,
        "status": case.status.value,
        "description": case.description,
        "jurisdiction": case.jurisdiction,
        "court": case.court,
        "notes": case.notes,
        "created_at": str(case.created_at),
    }
