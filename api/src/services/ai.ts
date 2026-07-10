interface ContractResult {
  title: string;
  parties: string;
  clauses: string[];
  risk_score: number;
  notes: string;
}

interface ChatResponse {
  response: string;
  sources: string[];
}

interface ResearchResult {
  query: string;
  results: { case: string; relevance: string; summary: string }[];
  applicable_laws: string[];
  summary: string;
}

export function generateContract(prompt: string): ContractResult {
  const lower = prompt.toLowerCase();
  if (lower.includes('employment') || lower.includes('employee')) {
    return {
      title: 'Employment Contract',
      parties: 'Between Employer and Employee',
      clauses: [
        '1. POSITION: The Employee shall serve as [Position].',
        '2. DUTIES: Employee shall perform duties as assigned.',
        '3. COMPENSATION: Monthly salary of KES [Amount].',
        '4. WORKING HOURS: 40 hours per week, Monday to Friday.',
        '5. LEAVE: 21 working days annual leave per year.',
        '6. TERMINATION: 30 days notice period by either party.',
        '7. CONFIDENTIALITY: Employee shall maintain confidentiality.',
        '8. NON-COMPETE: 6 months restriction post-employment.',
        '9. GOVERNING LAW: Laws of Kenya.',
      ],
      risk_score: 85,
      notes: 'Standard employment contract with common protections.',
    };
  }
  if (lower.includes('nda') || lower.includes('confidential') || lower.includes('non-disclosure')) {
    return {
      title: 'Non-Disclosure Agreement',
      parties: 'Between Disclosing Party and Receiving Party',
      clauses: [
        '1. DEFINITION: Confidential information includes all proprietary data.',
        '2. OBLIGATIONS: Recipient shall protect confidential information.',
        '3. EXCLUSIONS: Information already in public domain.',
        '4. TERM: 5 years from date of agreement.',
        '5. RETURN OF MATERIALS: Upon request, return all confidential materials.',
        '6. GOVERNING LAW: Laws of Kenya.',
      ],
      risk_score: 90,
      notes: 'Standard mutual NDA suitable for business partnerships.',
    };
  }
  if (lower.includes('service') || lower.includes('contractor') || lower.includes('freelance')) {
    return {
      title: 'Service Agreement',
      parties: 'Between Service Provider and Client',
      clauses: [
        '1. SERVICES: Provider shall perform services as described in Schedule A.',
        '2. PAYMENT: Client shall pay KES [Amount] within 30 days of invoice.',
        '3. DELIVERABLES: Provider shall deliver within [Timeline].',
        '4. INTELLECTUAL PROPERTY: IP rights transfer upon full payment.',
        '5. WARRANTY: 90 days warranty on services.',
        '6. LIMITATION OF LIABILITY: Liability capped at contract value.',
        '7. TERMINATION: 14 days notice for convenience.',
        '8. GOVERNING LAW: Laws of Kenya.',
      ],
      risk_score: 82,
      notes: 'Service agreement with IP transfer clause.',
    };
  }
  return {
    title: 'Custom Agreement',
    parties: 'As specified',
    clauses: [
      '1. PARTIES: This agreement is between [Party A] and [Party B].',
      '2. RECITALS: The parties wish to enter into this agreement.',
      '3. AGREEMENT: Terms and conditions as mutually agreed.',
      '4. PAYMENT: KES [Amount] payable within [Days] days.',
      '5. TERM: This agreement shall commence on [Start Date].',
      '6. TERMINATION: Either party may terminate with [Notice] notice.',
      '7. GOVERNING LAW: Laws of Kenya.',
    ],
    risk_score: 75,
    notes: 'Custom agreement template. Review and customize as needed.',
  };
}

export function legalChatbotResponse(query: string): ChatResponse {
  const lower = query.toLowerCase();
  if (lower.includes('employee right') || lower.includes('worker right') || lower.includes('labour')) {
    return { response: 'Under Kenyan employment law, employees are entitled to: minimum wage, 21 days annual leave, sick leave, overtime pay, social security (NSSF), health insurance (NHIF), and protection against unfair dismissal per the Employment Act 2007.', sources: ['Kenya Laws', 'Employment Act 2007'] };
  }
  if (lower.includes('register company') || lower.includes('business registration') || lower.includes('start business')) {
    return { response: 'To register a company in Kenya: 1) Reserve a name via eCitizen, 2) Register with the Registrar of Companies, 3) Obtain KRA PIN, 4) Register for NSSF/NHIF, 5) Apply for relevant licenses. Estimated time: 2-3 weeks.', sources: ['Companies Act 2015', 'eCitizen Portal'] };
  }
  if (lower.includes('contract') && (lower.includes('valid') || lower.includes('legal'))) {
    return { response: 'A legally valid contract in Kenya requires: offer, acceptance, consideration, intention to create legal relations, capacity of parties, and legality of purpose per the Law of Contract Act.', sources: ['Law of Contract Act', 'Common Law'] };
  }
  if (lower.includes('divorce') || lower.includes('marriage') || lower.includes('separation')) {
    return { response: 'Under Kenyan law, grounds for divorce include: adultery, cruelty, desertion (2+ years), separation (2+ years with consent, 3+ years without), and irretrievable breakdown of marriage per the Marriage Act 2014.', sources: ['Marriage Act 2014', 'Matrimonial Causes Act'] };
  }
  if (lower.includes('land') || lower.includes('property') || lower.includes('title deed')) {
    return { response: 'Land transactions in Kenya require: land search at the Ministry of Lands, valuation, sale agreement, completion documents, transfer forms, consent from Land Control Board (if agricultural), and registration.', sources: ['Land Registration Act', 'Land Control Act'] };
  }
  if (lower.includes('data protection') || lower.includes('privacy') || lower.includes('personal data')) {
    return { response: "Under Kenya's Data Protection Act 2019, businesses must: register as data processors/controllers, obtain consent, provide data subject rights, implement security measures, and report breaches within 72 hours.", sources: ['Data Protection Act 2019', 'ODPC Guidelines'] };
  }
  return { response: "I can help with legal questions in Kenya. Please specify your area of concern: employment, business registration, contracts, court procedures, family law, property, or data protection.", sources: ['General Legal Knowledge Base'] };
}

export function analyzeCaseResearch(query: string): ResearchResult {
  return {
    query,
    results: [
      { case: "Kenya Revenue Authority v. Man Diesel & Turbo Se, Kenya [2021] eKLR", relevance: "High", summary: "Tax dispute resolution principles." },
      { case: "Samuel Kamau Macharia v. Kenya Commercial Bank [2012] eKLR", relevance: "High", summary: "Constitutional jurisdiction and contractual obligations." },
    ],
    applicable_laws: ["Constitution of Kenya 2010", "Relevant Acts of Parliament"],
    summary: `Research results for: ${query}. Consult a lawyer for detailed legal opinion.`,
  };
}

export function analyzeDocumentContent(content: string) {
  const riskKeywords: Record<string, [string, string, string]> = {
    payment: ['Payment Terms', 'Client can delay payment indefinitely.', 'Add a 30-day payment deadline.'],
    termination: ['Termination Clause', 'No protection against sudden termination.', 'Add notice period.'],
    liability: ['Liability', 'Unlimited liability exposure.', 'Cap liability to contract value.'],
    confidentiality: ['Confidentiality', 'Missing confidentiality clause.', 'Add standard NDA clause.'],
    dispute: ['Dispute Resolution', 'Unclear dispute resolution process.', 'Specify arbitration or court jurisdiction.'],
    indemnification: ['Indemnification', 'Missing indemnification clause.', 'Add mutual indemnification.'],
    'governing law': ['Governing Law', 'No governing law specified.', 'Specify applicable jurisdiction.'],
    'force majeure': ['Force Majeure', 'Missing force majeure clause.', 'Add force majeure provision.'],
    'data protection': ['Data Protection', 'No data protection clause.', 'Add data processing terms.'],
    'non-compete': ['Non-Compete', 'Overly broad non-compete.', 'Limit scope and duration of non-compete.'],
  };

  let riskScore = 82;
  const issues: { clause: string; issue: string; recommendation: string }[] = [];
  const lower = content.toLowerCase();

  for (const [keyword, [clause, issue, rec]] of Object.entries(riskKeywords)) {
    if (!lower.includes(keyword)) {
      issues.push({ clause, issue, recommendation: rec });
      riskScore = Math.max(0, riskScore - 8);
    }
  }

  return {
    risk_score: riskScore,
    risk_level: riskScore >= 80 ? 'Low' : riskScore >= 50 ? 'Medium' : 'High',
    issues,
    summary: 'Contract analyzed successfully.',
  };
}
