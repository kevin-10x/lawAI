from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.document import Document, DocumentType, DocumentStatus
from app.models.user import User
from app.utils.auth import get_current_user
from app.utils.documents import save_upload_file, analyze_document_content

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(None),
    doc_type: str = Form("other"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        file_path = await save_upload_file(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    doc = Document(
        user_id=current_user.id,
        title=title or file.filename,
        file_path=file_path,
        file_type=file.filename.split(".")[-1],
        doc_type=doc_type,
        status=DocumentStatus.COMPLETED,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"message": "Document uploaded", "document": {"id": doc.id, "title": doc.title, "status": doc.status.value}}

@router.post("/analyze/{doc_id}")
def analyze_document(
    doc_id: int,
    content: str = Form(""),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    analysis = analyze_document_content(content)
    doc.ai_analysis = str(analysis)
    doc.risk_score = analysis["risk_score"]
    doc.status = DocumentStatus.COMPLETED
    db.commit()
    return analysis

@router.get("/")
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "doc_type": d.doc_type.value if d.doc_type else None,
            "status": d.status.value if d.status else None,
            "risk_score": d.risk_score,
            "created_at": str(d.created_at),
        }
        for d in docs
    ]

@router.get("/{doc_id}")
def get_document(doc_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "id": doc.id,
        "title": doc.title,
        "file_type": doc.file_type,
        "doc_type": doc.doc_type.value if doc.doc_type else None,
        "status": doc.status.value if doc.status else None,
        "risk_score": doc.risk_score,
        "ai_analysis": doc.ai_analysis,
        "created_at": str(doc.created_at),
    }

@router.delete("/{doc_id}")
def delete_document(doc_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}
