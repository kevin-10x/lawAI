import json
import random

def generate_contract(prompt: str) -> dict:
    templates = {
        "employment": {
            "title": "Employment Contract",
            "parties": "Between Employer and Employee",
            "clauses": [
                "1. POSITION: The Employee shall serve as [Position].",
                "2. DUTIES: Employee shall perform duties as assigned.",
                "3. COMPENSATION: Monthly salary of KES [Amount].",
                "4. WORKING HOURS: 40 hours per week, Monday to Friday.",
                "5. LEAVE: 21 working days annual leave per year.",
                "6. TERMINATION: 30 days notice period by either party.",
                "7. CONFIDENTIALITY: Employee shall maintain confidentiality.",
                "8. NON-COMPETE: 6 months restriction post-employment.",
                "9. GOVERNING LAW: Laws of Kenya.",
            ],
            "risk_score": 85,
            "notes": "Standard employment contract with common protections."
        },
        "nda": {
            "title": "Non-Disclosure Agreement",
            "parties": "Between Disclosing Party and Receiving Party",
            "clauses": [
                "1. DEFINITION: Confidential information includes all proprietary data.",
                "2. OBLIGATIONS: Recipient shall protect confidential information.",
                "3. EXCLUSIONS: Information already in public domain.",
                "4. TERM: 5 years from date of agreement.",
                "5. RETURN OF MATERIALS: Upon request, return all confidential materials.",
                "6. GOVERNING LAW: Laws of Kenya.",
            ],
            "risk_score": 90,
            "notes": "Standard mutual NDA suitable for business partnerships."
        },
        "service": {
            "title": "Service Agreement",
            "parties": "Between Service Provider and Client",
            "clauses": [
                "1. SERVICES: Provider shall perform services as described in Schedule A.",
                "2. PAYMENT: Client shall pay KES [Amount] within 30 days of invoice.",
                "3. DELIVERABLES: Provider shall deliver within [Timeline].",
                "4. INTELLECTUAL PROPERTY: IP rights transfer upon full payment.",
                "5. WARRANTY: 90 days warranty on services.",
                "6. LIMITATION OF LIABILITY: Liability capped at contract value.",
                "7. TERMINATION: 14 days notice for convenience.",
                "8. GOVERNING LAW: Laws of Kenya.",
            ],
            "risk_score": 82,
            "notes": "Service agreement with IP transfer clause."
        },
    }
    prompt_lower = prompt.lower()
    for key in templates:
        if key in prompt_lower:
            return templates[key]
    return {
        "title": "Custom Agreement",
        "parties": "As specified",
        "clauses": [
            "1. PARTIES: This agreement is between [Party A] and [Party B].",
            "2. RECITALS: The parties wish to enter into this agreement.",
            "3. AGREEMENT: Terms and conditions as mutually agreed.",
            "4. PAYMENT: KES [Amount] payable within [Days] days.",
            "5. TERM: This agreement shall commence on [Start Date].",
            "6. TERMINATION: Either party may terminate with [Notice] notice.",
            "7. GOVERNING LAW: Laws of Kenya.",
        ],
        "risk_score": 75,
        "notes": "Custom agreement template. Review and customize as needed."
    }

def legal_chatbot_response(query: str) -> dict:
    responses = {
        "employee rights": "Under Kenyan employment law, employees are entitled to: minimum wage, 21 days annual leave, sick leave, overtime pay, social security (NSSF), health insurance (NHIF), and protection against unfair dismissal per the Employment Act 2007.",
        "register company": "To register a company in Kenya: 1) Reserve a name via eCitizen, 2) Register with the Registrar of Companies, 3) Obtain KRA PIN, 4) Register for NSSF/NHIF, 5) Apply for relevant licenses. Estimated time: 2-3 weeks.",
        "contract": "A legally valid contract in Kenya requires: offer, acceptance, consideration, intention to create legal relations, capacity of parties, and legality of purpose per the Law of Contract Act.",
        "court": "Required documents for court in Kenya depend on the case type. Generally: pleadings, affidavits, witness statements, list of witnesses, list of documents, and trial bundle.",
        "divorce": "Under Kenyan law, grounds for divorce include: adultery, cruelty, desertion (2+ years), separation (2+ years with consent, 3+ years without), and irretrievable breakdown of marriage per the Marriage Act 2014.",
        "land": "Land transactions in Kenya require: land search at the Ministry of Lands, valuation, sale agreement, completion documents, transfer forms, consent from Land Control Board (if agricultural), and registration.",
        "data protection": "Under Kenya's Data Protection Act 2019, businesses must: register as data processors/controllers, obtain consent, provide data subject rights, implement security measures, and report breaches within 72 hours.",
    }
    query_lower = query.lower()
    for key in responses:
        if key in query_lower:
            return {"response": responses[key], "sources": ["Kenya Laws", "Employment Act 2007", "Data Protection Act 2019"]}
    return {
        "response": "I can help with legal questions in Kenya. Please specify your area of concern: employment, business registration, contracts, court procedures, family law, property, or data protection.",
        "sources": ["General Legal Knowledge Base"]
    }

def analyze_case_research(query: str) -> dict:
    return {
        "query": query,
        "results": [
            {"case": "Kenya Revenue Authority v. Man Diesel & Turbo Se, Kenya [2021] eKLR", "relevance": "High", "summary": "Tax dispute resolution principles."},
            {"case": "Samuel Kamau Macharia v. Kenya Commercial Bank [2012] eKLR", "relevance": "High", "summary": "Constitutional jurisdiction and contractual obligations."},
        ],
        "applicable_laws": ["Constitution of Kenya 2010", "Relevant Acts of Parliament"],
        "summary": f"Research results for: {query}. Consult a lawyer for detailed legal opinion."
    }
