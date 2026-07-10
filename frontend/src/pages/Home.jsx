import { Link } from 'react-router-dom';
import { Scale, FileText, Shield, Search, MessageSquare, CheckCircle, ArrowRight, Users, Building, Briefcase } from 'lucide-react';

const features = [
  { icon: FileText, title: 'Contract Drafting', desc: 'Generate professional legal documents from simple instructions with AI assistance.' },
  { icon: Search, title: 'Contract Analysis', desc: 'Upload contracts and get AI-powered risk analysis, clause explanations, and recommendations.' },
  { icon: Shield, title: 'Compliance Checker', desc: 'Ensure your business meets data protection, employment, and regulatory requirements.' },
  { icon: MessageSquare, title: 'Legal Chatbot', desc: 'Get instant answers to legal questions 24/7 through our AI legal assistant.' },
  { icon: Briefcase, title: 'Business Advisory', desc: 'Expert guidance on company registration, governance, and business structure.' },
  { icon: Users, title: 'Case Research', desc: 'AI-powered legal research for relevant cases, laws, and legal principles.' },
];

const stats = [
  { number: '500+', label: 'Clients Served' },
  { number: '1,400+', label: 'Documents Generated' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '50+', label: 'Practice Areas' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#1a365d] to-[#0f2440] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#c5a55a]/20 text-[#c5a55a] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Scale className="h-4 w-4" /> Smart Legal Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Legal Services <br />
                <span className="text-[#c5a55a]">Powered by Lawyers + AI</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Making legal services faster, affordable, and accessible for individuals, startups, SMEs, and organizations across Kenya.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/consultation" className="bg-[#c5a55a] text-[#1a365d] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b96e] transition flex items-center gap-2">
                  Book Consultation <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/ai-portal" className="border border-[#c5a55a] text-[#c5a55a] px-6 py-3 rounded-lg font-semibold hover:bg-[#c5a55a]/10 transition">
                  Try AI Portal
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="bg-[#c5a55a]/10 rounded-2xl p-8 border border-[#c5a55a]/20">
                <Scale className="h-48 w-48 text-[#c5a55a]/60 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-[#1a365d]">{s.number}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Our Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Comprehensive legal services combining human expertise with AI efficiency</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="bg-[#1a365d]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-[#1a365d]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1a365d] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-6">Why Choose Hauzral Legal?</h2>
              <ul className="space-y-4">
                {[
                  'Qualified lawyers review every document',
                  'AI-powered efficiency for faster turnaround',
                  'Affordable pricing starting from KES 999/month',
                  'M-Pesa & mobile money payments accepted',
                  '24/7 client portal access',
                  'Kenya-focused legal expertise',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#c5a55a] mt-0.5 shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/services" className="inline-flex items-center gap-2 text-[#1a365d] font-semibold mt-6 hover:text-[#c5a55a] transition">
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border">
              <h3 className="text-xl font-bold text-[#1a365d] mb-4">Client Dashboard Preview</h3>
              <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm font-medium text-gray-500">Active Matters</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">3 Active</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Contract Review', status: 'Processing', color: 'yellow' },
                    { name: 'Company Registration', status: 'Completed', color: 'green' },
                    { name: 'Legal Consultation', status: 'Scheduled', color: 'blue' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <span>{item.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-700`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a365d] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">Book a consultation with our legal team or try our AI Legal Portal instantly.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/consultation" className="bg-[#c5a55a] text-[#1a365d] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b96e] transition">Book Consultation</Link>
            <Link to="/register" className="border border-[#c5a55a] text-[#c5a55a] px-6 py-3 rounded-lg font-semibold hover:bg-[#c5a55a]/10 transition">Create Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
