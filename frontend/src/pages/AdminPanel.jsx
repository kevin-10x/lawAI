import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Calendar, CreditCard, LogOut, Loader2, Scale } from 'lucide-react';
import { admin as adminApi } from '../services/api';

export default function AdminPanel() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') { const r = await adminApi.dashboard(); setData(r.data); }
      if (activeTab === 'users') { const r = await adminApi.users(); setUserList(r.data); }
    } catch (err) { /* ignore */ }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user || user.role !== 'admin') return null;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#1a365d] text-white hidden md:flex flex-col">
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Scale className="h-6 w-6 text-[#c5a55a]" />
            <span>Hauzral <span className="text-[#c5a55a]">Admin</span></span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-[#c5a55a] text-[#1a365d]' : 'hover:bg-blue-800 text-gray-300'}`}>
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-300 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#1a365d] mb-6">Admin Dashboard</h1>

        {loading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#c5a55a]" /></div>}

        {!loading && activeTab === 'dashboard' && data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="text-3xl font-bold text-[#1a365d]">{data.total_clients}</div><div className="text-sm text-gray-500">Total Clients</div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="text-3xl font-bold text-[#1a365d]">{data.total_lawyers}</div><div className="text-sm text-gray-500">Lawyers</div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="text-3xl font-bold text-[#1a365d]">{data.total_cases}</div><div className="text-sm text-gray-500">Cases</div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="text-3xl font-bold text-[#1a365d]">{data.total_documents}</div><div className="text-sm text-gray-500">Documents</div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="text-3xl font-bold text-[#1a365d]">{data.total_consultations}</div><div className="text-sm text-gray-500">Consultations</div></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="text-3xl font-bold text-[#1a365d]">KES {data.revenue_amount?.toLocaleString() || 0}</div><div className="text-sm text-gray-500">Revenue</div></div>
          </div>
        )}

        {!loading && activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr><th className="px-4 py-3 font-medium text-gray-500">Name</th><th className="px-4 py-3 font-medium text-gray-500">Email</th><th className="px-4 py-3 font-medium text-gray-500">Role</th><th className="px-4 py-3 font-medium text-gray-500">Status</th><th className="px-4 py-3 font-medium text-gray-500">Joined</th></tr>
              </thead>
              <tbody>
                {userList.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{u.full_name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 capitalize"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'lawyer' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-3 text-gray-500">{u.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
