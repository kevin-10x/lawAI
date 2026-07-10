import { useState } from 'react';
import { Calendar, Clock, Phone, Video, MessageSquare, Building, Loader2, CheckCircle } from 'lucide-react';
import { consultations as consultationApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const practiceAreas = [
  'Corporate Law', 'Employment Law', 'Commercial Law', 'Technology Law', 'Property Law', 'Family Law', 'Intellectual Property', 'Tax Law', 'Litigation', 'Compliance',
];

export default function Consultation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [form, setForm] = useState({ title: '', description: '', practice_area: '', mode: 'video', scheduled_date: '', duration_minutes: 30 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await consultationApi.create(form);
      setSuccess(true);
    } catch (err) {
      alert('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a365d] mb-2">Consultation Booked!</h2>
          <p className="text-gray-500 mb-6">We will confirm your appointment shortly via email and phone.</p>
          <button onClick={() => navigate('/portal')} className="bg-[#1a365d] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2b4c7e] transition">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0f2440] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="h-12 w-12 text-[#c5a55a] mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Book a Consultation</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Speak with a qualified lawyer about your legal matter. Choose your preferred mode and time.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Video, label: 'Video Call', value: 'video' },
              { icon: Phone, label: 'Phone Call', value: 'phone' },
              { icon: MessageSquare, label: 'Chat', value: 'chat' },
            ].map((m) => (
              <button key={m.value} onClick={() => setForm({ ...form, mode: m.value })} className={`flex items-center gap-3 p-4 rounded-lg border-2 transition text-left ${form.mode === m.value ? 'border-[#c5a55a] bg-[#c5a55a]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <m.icon className={`h-5 w-5 ${form.mode === m.value ? 'text-[#c5a55a]' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${form.mode === m.value ? 'text-[#1a365d]' : 'text-gray-600'}`}>{m.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matter Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g., Contract Review, Company Registration" className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Briefly describe your legal matter..." className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Practice Area</label>
                <select value={form.practice_area} onChange={(e) => setForm({ ...form, practice_area: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]">
                  <option value="">Select area</option>
                  {practiceAreas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) })} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]">
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
              <input type="datetime-local" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Consultation Fee</p>
                <p className="text-xs text-gray-500">Paid after booking confirmation</p>
              </div>
              <div className="text-xl font-bold text-[#1a365d]">KES 1,500</div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#1a365d] text-white py-3 rounded-lg font-semibold hover:bg-[#2b4c7e] transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calendar className="h-5 w-5" />} Book Consultation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
