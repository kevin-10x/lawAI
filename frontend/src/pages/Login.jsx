import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Loader2 } from 'lucide-react';
import { auth } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await auth.login(form);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') navigate('/admin');
      else navigate('/portal');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Scale className="h-10 w-10 text-[#c5a55a] mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-[#1a365d]">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your Hauzral Legal account</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#1a365d] text-white py-2.5 rounded-lg font-semibold hover:bg-[#2b4c7e] transition flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null} Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/register" className="text-[#c5a55a] font-semibold hover:underline">Register</Link></p>
      </div>
    </div>
  );
}
