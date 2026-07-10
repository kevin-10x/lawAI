import { Link } from 'react-router-dom';
import { FileText, Shield, Search, Users, Briefcase, Building, Scale, CheckCircle, ArrowRight, BookOpen, Gavel } from 'lucide-react';

const services = [
  {
    icon: FileText, title: 'Contract & Agreement Services', desc: 'Professional contract drafting, review, and analysis for all business needs.',
    items: ['Employment contracts', 'NDAs', 'Service agreements', 'Lease agreements', 'Partnership agreements', 'Investment agreements'],
    price: 'KES 3,000 - 20,000',
  },
  {
    icon: Building, title: 'Business Legal Consultancy', desc: 'End-to-end legal support for startups and established companies.',
    items: ['Company registration guidance', 'Business structure advice', 'Shareholder agreements', 'Terms & conditions', 'Privacy policies', 'Compliance audits'],
    price: 'KES 10,000/mo (Startup)',
  },
  {
    icon: Briefcase, title: 'Legal Advisory Services', desc: 'Expert consultations across multiple practice areas.',
    items: ['Corporate Law', 'Employment Law', 'Commercial Law', 'Technology Law', 'Property Law', 'Intellectual Property'],
    price: 'KES 1,500 - 5,000/session',
  },
  {
    icon: Search, title: 'Contract Analysis & Review', desc: 'Upload your contract and get a detailed risk report within minutes.',
    items: ['AI-powered analysis', 'Risk scoring', 'Missing clause detection', 'Version comparison', 'Plain language summaries', 'Lawyer verification'],
    price: 'KES 3,000/review',
  },
  {
    icon: Shield, title: 'Compliance & Risk Management', desc: 'Stay compliant with Kenyan laws and regulations.',
    items: ['Data protection compliance', 'Employment compliance', 'Tax requirements', 'Industry regulations', 'Policy review', 'Risk audits'],
    price: 'From KES 5,000',
  },
  {
    icon: Gavel, title: 'Legal Document Preparation', desc: 'Generate court-ready legal documents.',
    items: ['Demand letters', 'Affidavits', 'Legal notices', 'Pleadings', 'Motions', 'Witness statements'],
    price: 'KES 2,000 - 10,000',
  },
];

const packages = [
  { name: 'Startup Package', price: 'KES 10,000/mo', features: ['Legal consultation', 'Contract reviews', 'Compliance advice', 'Business documents', 'Email support'], popular: false },
  { name: 'Professional Package', price: 'KES 25,000/mo', features: ['Dedicated legal advisor', 'Unlimited contract review', 'Compliance monitoring', 'Contract management', 'Priority support'], popular: true },
  { name: 'Corporate Package', price: 'KES 50,000+/mo', features: ['Dedicated legal team', 'Compliance monitoring', 'Contract management', 'Legal reporting', 'Board advisory'], popular: false },
];

export default function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a365d] to-[#0f2440] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Comprehensive legal solutions powered by experienced lawyers and AI technology</p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100">
                <div className="bg-[#1a365d]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-[#1a365d]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1a365d] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{s.desc}</p>
                <ul className="space-y-2 mb-4">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-[#c5a55a] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="text-[#c5a55a] font-semibold text-sm">{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Service Packages</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Choose a plan that fits your legal needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.name} className={`rounded-xl p-6 border-2 ${pkg.popular ? 'border-[#c5a55a] bg-[#c5a55a]/5 relative' : 'border-gray-200 bg-white'}`}>
                {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c5a55a] text-[#1a365d] text-xs font-bold px-4 py-1 rounded-full">Popular</div>}
                <h3 className="text-xl font-bold text-[#1a365d] mb-2">{pkg.name}</h3>
                <div className="text-3xl font-bold text-[#1a365d] mb-4">{pkg.price}</div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-[#c5a55a] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/consultation" className={`block text-center py-2 rounded-lg font-semibold text-sm transition ${pkg.popular ? 'bg-[#1a365d] text-white hover:bg-[#2b4c7e]' : 'bg-gray-100 text-[#1a365d] hover:bg-gray-200'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a365d] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-300 mb-8">Contact us for tailored legal packages for your business.</p>
          <Link to="/contact" className="bg-[#c5a55a] text-[#1a365d] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b96e] transition inline-flex items-center gap-2">
            Contact Us <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
