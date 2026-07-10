import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import init_db
from app.routes.auth import router as auth_router
from app.routes.documents import router as documents_router
from app.routes.consultations import router as consultations_router
from app.routes.cases import router as cases_router
from app.routes.payments import router as payments_router
from app.routes.admin import router as admin_router
from app.services.ai_service import generate_contract, legal_chatbot_response, analyze_case_research
from pydantic import BaseModel

app = FastAPI(title="Hauzral Legal Consultancy API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(consultations_router)
app.include_router(cases_router)
app.include_router(payments_router)
app.include_router(admin_router)

class AIContractRequest(BaseModel):
    prompt: str

class AIChatRequest(BaseModel):
    query: str

class AIResearchRequest(BaseModel):
    query: str

@app.post("/api/ai/generate-contract")
def ai_generate_contract(req: AIContractRequest):
    return generate_contract(req.prompt)

@app.post("/api/ai/chat")
def ai_chat(req: AIChatRequest):
    return legal_chatbot_response(req.query)

@app.post("/api/ai/research")
def ai_research(req: AIResearchRequest):
    return analyze_case_research(req.query)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Hauzral Legal Consultancy API", "version": "1.0.0"}

@app.on_event("startup")
def on_startup():
    init_db()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
