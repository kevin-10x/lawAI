import os
from fastapi import UploadFile
from app.config import UPLOAD_DIR

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt"}

async def save_upload_file(upload_file: UploadFile) -> str:
    ext = os.path.splitext(upload_file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"File type {ext} not allowed. Allowed: {ALLOWED_EXTENSIONS}")
    file_path = os.path.join(UPLOAD_DIR, upload_file.filename)
    with open(file_path, "wb") as f:
        content = await upload_file.read()
        f.write(content)
    return file_path

def analyze_document_content(content: str) -> dict:
    risk_score = 82
    issues = []
    recommendations = []

    risk_keywords = {
        "payment": ("Payment Terms", "Client can delay payment indefinitely.", "Add a 30-day payment deadline."),
        "termination": ("Termination Clause", "No protection against sudden termination.", "Add notice period."),
        "liability": ("Liability", "Unlimited liability exposure.", "Cap liability to contract value."),
        "confidentiality": ("Confidentiality", "Missing confidentiality clause.", "Add standard NDA clause."),
        "dispute": ("Dispute Resolution", "Unclear dispute resolution process.", "Specify arbitration or court jurisdiction."),
        "indemnification": ("Indemnification", "Missing indemnification clause.", "Add mutual indemnification."),
        "governing law": ("Governing Law", "No governing law specified.", "Specify applicable jurisdiction."),
        "force majeure": ("Force Majeure", "Missing force majeure clause.", "Add force majeure provision."),
        "data protection": ("Data Protection", "No data protection clause.", "Add data processing terms."),
        "non-compete": ("Non-Compete", "Overly broad non-compete.", "Limit scope and duration of non-compete."),
    }

    content_lower = content.lower()
    for keyword, (clause, issue, rec) in risk_keywords.items():
        if keyword not in content_lower:
            issues.append({"clause": clause, "issue": issue, "recommendation": rec})
            risk_score = max(0, risk_score - 8)

    return {
        "risk_score": risk_score,
        "issues": issues,
        "summary": "Contract analyzed successfully.",
        "risk_level": "Low" if risk_score >= 80 else "Medium" if risk_score >= 50 else "High",
    }
