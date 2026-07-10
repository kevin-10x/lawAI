import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, CreditCard, MessageSquare, BarChart3, LogOut, User, Loader2, AlertTriangle, CheckCircle, Clock, Upload, X } from 'lucide-react';
import { documents as docsApi, consultations as consultationApi, cases as casesApi, payments as paymentsApi } from '../services/api';

const SIDEBAR_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'documents', label: 'My Documents', icon: FileText },
  { id: 'cases', label: 'My Cases', icon: AlertTriangle },
  { id: 'consultations', label: 'Consultations', icon: Calendar },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export default function ClientPortal() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [docList, setDocList] = useState([]);
  const [caseList, setCaseList] = useState([]);
  const [consList, setConsList] = useState([]);
  const [payList, setPayList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard' || activeTab === 'documents') { const r = await docsApi.list(); setDocList(r.data); }
      if (activeTab === 'dashboard' || activeTab === 'consultations') { const r = await consultationApi.list(); setConsList(r.data); }
      if (activeTab === 'dashboard' || activeTab === 'cases') { const r = await casesApi.list(); setCaseList(r.data); }
      if (activeTab === 'dashboard' || activeTab === 'payments') { const r = await paymentsApi.list(); setPayList(r.data); }
    } catch (err) { /* ignore */ }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const formData = new FormData();
    formData.append('file', f);
    formData.append('title', f.name);
    try {
      await docsApi.upload(formData);
      fetchData();
    } catch (err) { alert('Upload failed'); }
  };

  if (!user) return null;

  const cta = [
    { label: 'Documents', value: docList.length, color: 'blue' },
    { label: 'Active Cases', value: caseList.filter((c) => c.status === 'active' || c.status === 'pending').length, color: 'yellow' },
    { label: 'Consultations', value: consList.length, color: 'green' },
    { label: 'Payments', value: payList.length, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a365d] text-white hidden md:flex flex-col">
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center gap-2 font-bold text-lg">
            <FileText className="h-6 w-6 text-[#c5a55a]" />
            <span>Hauzral <span className="text-[#c5a55a]">Legal</span></span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {SIDEBAR_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-[#c5a55a] text-[#1a365d]' : 'hover:bg-blue-800 text-gray-300'}`}>
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-blue-800 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-300 px-3">
            <User className="h-4 w-4" /> {user.full_name}
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-300 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex overflow-x-auto">
        {SIDEBAR_TABS.slice(0, 5).map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${activeTab === tab.id ? 'text-[#c5a55a]' : 'text-gray-500'}`}>
            <tab.icon className="h-5 w-5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1a365d]">{SIDEBAR_TABS.find((t) => t.id === activeTab)?.label || 'Dashboard'}</h1>
          <button onClick={handleLogout} className="md:hidden text-gray-500"><LogOut className="h-5 w-5" /></button>
        </div>

        {loading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#c5a55a]" /></div>}

        {!loading && activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {cta.map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="text-2xl font-bold text-[#1a365d]">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-semibold text-[#1a365d] mb-3">Recent Documents</h3>
                {docList.slice(0, 4).map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                    <span className="text-gray-600">{d.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === 'completed' ? 'bg-green-100 text-green-700' : d.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                  </div>
                ))}
                {docList.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No documents yet</p>}
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-semibold text-[#1a365d] mb-3">Upcoming Consultations</h3>
                {consList.filter((c) => c.status === 'scheduled').slice(0, 4).map((c) => (
                  <div key={c.id} className="py-2 border-b last:border-0 text-sm">
                    <p className="text-gray-600 font-medium">{c.title}</p>
                    <p className="text-gray-400 text-xs">{c.scheduled_date ? new Date(c.scheduled_date).toLocaleDateString() : 'No date set'} &middot; {c.practice_area || 'General'}</p>
                  </div>
                ))}
                {consList.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No consultations yet</p>}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'documents' && (
          <div>
            <label className="bg-[#1a365d] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2b4c7e] transition cursor-pointer inline-flex items-center gap-2 mb-6">
              <Upload className="h-4 w-4" /> Upload Document
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleUpload} className="hidden" />
            </label>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr><th className="px-4 py-3 font-medium text-gray-500">Title</th><th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Type</th><th className="px-4 py-3 font-medium text-gray-500">Status</th><th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Date</th></tr>
                </thead>
                <tbody>
                  {docList.map((d) => (
                    <tr key={d.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{d.title}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell capitalize">{d.doc_type}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === 'completed' ? 'bg-green-100 text-green-700' : d.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{d.status}</span></td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{d.created_at?.split('T')[0]}</td>
                    </tr>
                  ))}
                  {docList.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No documents uploaded</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && activeTab === 'cases' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr><th className="px-4 py-3 font-medium text-gray-500">Title</th><th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Type</th><th className="px-4 py-3 font-medium text-gray-500">Status</th><th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Date</th></tr>
              </thead>
              <tbody>
                {caseList.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{c.title}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell capitalize">{c.case_type}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span></td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{c.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
                {caseList.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No cases yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loading && activeTab === 'consultations' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr><th className="px-4 py-3 font-medium text-gray-500">Title</th><th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Area</th><th className="px-4 py-3 font-medium text-gray-500">Status</th><th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Date</th></tr>
              </thead>
              <tbody>
                {consList.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{c.title}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{c.practice_area || 'General'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'completed' ? 'bg-green-100 text-green-700' : c.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : c.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{c.scheduled_date ? new Date(c.scheduled_date).toLocaleDateString() : 'TBD'}</td>
                  </tr>
                ))}
                {consList.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No consultations</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loading && activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr><th className="px-4 py-3 font-medium text-gray-500">Reference</th><th className="px-4 py-3 font-medium text-gray-500">Amount</th><th className="px-4 py-3 font-medium text-gray-500">Method</th><th className="px-4 py-3 font-medium text-gray-500">Status</th><th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Date</th></tr>
              </thead>
              <tbody>
                {payList.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">{p.reference}</td>
                    <td className="px-4 py-3 text-gray-700">KES {p.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{p.method}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span></td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
                {payList.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No payments yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loading && activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">Messages</h3>
            <p className="text-sm text-gray-400">Your messages with your assigned lawyer will appear here.</p>
          </div>
        )}

        {!loading && activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">Reports</h3>
            <p className="text-sm text-gray-400">Legal reports and analytics will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
