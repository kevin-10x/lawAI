import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-[#1a365d] to-[#0f2440] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Get in touch with our legal team. We're here to help.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Phone, label: 'Phone', value: '+254 700 000 000', sub: 'Mon-Fri 8am-5pm' },
              { icon: Mail, label: 'Email', value: 'legal@hauzral.com', sub: 'We reply within 24hrs' },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', sub: 'Virtual consultations available' },
            ].map((c) => (
              <div key={c.label} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="bg-[#1a365d]/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><c.icon className="h-6 w-6 text-[#1a365d]" /></div>
                <h3 className="font-semibold text-[#1a365d] mb-1">{c.label}</h3>
                <p className="text-gray-600">{c.value}</p>
                <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-[#1a365d] mb-2">Message Sent!</h2>
                <p className="text-gray-500">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]" />
                </div>
                <button type="submit" className="bg-[#1a365d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2b4c7e] transition flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
