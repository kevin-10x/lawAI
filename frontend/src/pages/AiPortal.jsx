import { useState } from 'react';
import { Bot, FileText, Send, Upload, Loader2, AlertTriangle, MessageSquare, BookOpen } from 'lucide-react';
import { ai as aiApi, documents as docsApi } from '../services/api';

const TABS = [
  { id: 'chat', label: 'Legal Chatbot', icon: MessageSquare },
  { id: 'contract', label: 'Generate Contract', icon: FileText },
  { id: 'analyze', label: 'Analyze Contract', icon: AlertTriangle },
  { id: 'research', label: 'Case Research', icon: BookOpen },
];

export default function AiPortal() {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [contractPrompt, setContractPrompt] = useState('');
  const [contractResult, setContractResult] = useState(null);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const handleChat = async () => {
    if (!chatQuery.trim()) return;
    setLoading(true);
    try {
      const res = await aiApi.chat({ query: chatQuery });
      setChatHistory((prev) => [...prev, { role: 'user', text: chatQuery }, { role: 'ai', text: res.data.response }]);
      setChatResponse(res.data.response);
      setChatQuery('');
    } catch (err) {
      setChatHistory((prev) => [...prev, { role: 'user', text: chatQuery }, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleGenerateContract = async () => {
    if (!contractPrompt.trim()) return;
    setLoading(true);
    try {
      const res = await aiApi.generateContract({ prompt: contractPrompt });
      setContractResult(res.data);
    } catch (err) {
      setContractResult({ error: 'Failed to generate contract' });
    }
    setLoading(false);
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await aiApi.research({ query: researchQuery });
      setResearchResult(res.data);
    } catch (err) {
      setResearchResult({ error: 'Research failed' });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', f);
    formData.append('title', f.name);
    try {
      const uploadRes = await docsApi.upload(formData);
      const docId = uploadRes.data.document.id;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const content = ev.target.result;
        const analysisRes = await docsApi.analyze(docId, content);
        setAnalysis(analysisRes.data);
      };
      reader.readAsText(f);
    } catch (err) {
      setAnalysis({ error: 'Analysis failed' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0f2440] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bot className="h-12 w-12 text-[#c5a55a] mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">AI Legal Portal</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Your 24/7 AI-powered legal assistant. Draft, analyze, research, and get legal answers instantly.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border">
          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-[#c5a55a] text-[#1a365d]' : 'text-gray-500 hover:text-gray-700'}`}>
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Legal Chatbot */}
            {activeTab === 'chat' && (
              <div>
                <h2 className="text-xl font-bold text-[#1a365d] mb-4">Legal Chatbot</h2>
                <p className="text-gray-500 text-sm mb-6">Ask any legal question and get instant answers based on Kenyan law.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 h-80 overflow-y-auto space-y-3">
                  {chatHistory.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Ask me anything about Kenyan law</p>
                      <p className="text-xs mt-2">Try: "What are my employee rights?" or "How do I register a company?"</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-lg rounded-lg px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-[#1a365d] text-white' : 'bg-white border text-gray-700'}`}>{msg.text}</div>
                    </div>
                  ))}
                  {loading && <div className="flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-[#c5a55a]" /></div>}
                </div>
                <div className="flex gap-2">
                  <input value={chatQuery} onChange={(e) => setChatQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="Type your legal question..." className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                  <button onClick={handleChat} disabled={loading} className="bg-[#1a365d] text-white px-4 py-2 rounded-lg hover:bg-[#2b4c7e] transition"><Send className="h-5 w-5" /></button>
                </div>
              </div>
            )}

            {/* Generate Contract */}
            {activeTab === 'contract' && (
              <div>
                <h2 className="text-xl font-bold text-[#1a365d] mb-4">AI Contract Generator</h2>
                <p className="text-gray-500 text-sm mb-6">Describe the contract you need, and AI will generate a professional draft.</p>
                <textarea value={contractPrompt} onChange={(e) => setContractPrompt(e.target.value)} rows={4} placeholder='e.g., "Create a software development agreement between a Kenyan startup and a freelance developer"' className="w-full border rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                <button onClick={handleGenerateContract} disabled={loading} className="mt-4 bg-[#1a365d] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-[#2b4c7e] transition flex items-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Generate Contract
                </button>
                {contractResult && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-[#1a365d] mb-2">{contractResult.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{contractResult.parties}</p>
                    <div className="space-y-2 mb-4">
                      {contractResult.clauses?.map((clause, i) => <p key={i} className="text-sm text-gray-700">{clause}</p>)}
                    </div>
                    {contractResult.risk_score && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">Risk Score:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${contractResult.risk_score >= 80 ? 'bg-green-100 text-green-700' : contractResult.risk_score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{contractResult.risk_score}/100</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{contractResult.notes}</p>
                    <p className="text-xs text-gray-400 mt-4">Note: This is a draft. Have a lawyer review before signing.</p>
                  </div>
                )}
              </div>
            )}

            {/* Analyze Contract */}
            {activeTab === 'analyze' && (
              <div>
                <h2 className="text-xl font-bold text-[#1a365d] mb-4">Contract Analyzer</h2>
                <p className="text-gray-500 text-sm mb-6">Upload a contract document and AI will analyze it for risks, missing clauses, and provide recommendations.</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#c5a55a] transition cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload PDF, DOCX, or TXT</p>
                  <input id="fileInput" type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" />
                </div>
                {loading && <div className="flex items-center gap-2 mt-4 text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Analyzing document...</div>}
                {analysis && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-[#1a365d] mb-4">Contract Risk Report</h3>
                    {analysis.risk_score !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Contract Safety Score</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${analysis.risk_score >= 80 ? 'bg-green-100 text-green-700' : analysis.risk_score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{analysis.risk_level}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${analysis.risk_score >= 80 ? 'bg-green-500' : analysis.risk_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${analysis.risk_score}%` }}></div>
                        </div>
                        <p className="text-right text-sm text-gray-500 mt-1">{analysis.risk_score}/100</p>
                      </div>
                    )}
                    {analysis.issues?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-[#1a365d] mb-3">Issues Found:</h4>
                        <div className="space-y-3">
                          {analysis.issues.map((issue, i) => (
                            <div key={i} className="bg-white rounded-lg p-3 border">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium text-sm text-gray-700">{issue.clause}</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-1"><strong>Risk:</strong> {issue.issue}</p>
                              <p className="text-xs text-green-600"><strong>Recommendation:</strong> {issue.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.error && <p className="text-red-500 text-sm">{analysis.error}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Case Research */}
            {activeTab === 'research' && (
              <div>
                <h2 className="text-xl font-bold text-[#1a365d] mb-4">Case Research Assistant</h2>
                <p className="text-gray-500 text-sm mb-6">Search for relevant cases, laws, and legal principles.</p>
                <textarea value={researchQuery} onChange={(e) => setResearchQuery(e.target.value)} rows={3} placeholder='e.g., "Find Kenyan employment cases related to unfair dismissal"' className="w-full border rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                <button onClick={handleResearch} disabled={loading} className="mt-4 bg-[#1a365d] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-[#2b4c7e] transition flex items-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />} Search
                </button>
                {researchResult && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-6">
                    <h3 className="font-bold text-[#1a365d] mb-3">Research Results</h3>
                    <p className="text-sm text-gray-500 mb-4">Query: {researchResult.query}</p>
                    {researchResult.results?.map((r, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border mb-3">
                        <p className="text-sm font-medium text-[#1a365d]">{r.case}</p>
                        <p className="text-xs text-gray-500 mt-1">{r.summary}</p>
                        <span className="text-xs text-[#c5a55a] font-medium">{r.relevance} relevance</span>
                      </div>
                    ))}
                    {researchResult.applicable_laws && (
                      <div className="mt-3">
                        <h4 className="font-medium text-sm text-[#1a365d]">Applicable Laws:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">{researchResult.applicable_laws.map((l, i) => <li key={i}>{l}</li>)}</ul>
                      </div>
                    )}
                    {researchResult.summary && <p className="text-xs text-gray-400 mt-3">{researchResult.summary}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
