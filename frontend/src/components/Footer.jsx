import { Link } from 'react-router-dom';
import { Scale, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f2440] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Scale className="h-6 w-6 text-[#c5a55a]" />
              <span>Hauzral <span className="text-[#c5a55a]">Legal</span></span>
            </div>
            <p className="text-sm text-gray-400">Smart legal solutions powered by lawyers + AI. Making legal services faster, affordable, and accessible.</p>
            <p className="text-xs text-gray-500 mt-2">Nairobi, Kenya</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-[#c5a55a] transition">Contract Drafting</Link></li>
              <li><Link to="/services" className="hover:text-[#c5a55a] transition">Business Consultancy</Link></li>
              <li><Link to="/services" className="hover:text-[#c5a55a] transition">Compliance</Link></li>
              <li><Link to="/ai-portal" className="hover:text-[#c5a55a] transition">AI Legal Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#c5a55a] transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#c5a55a] transition">Contact</Link></li>
              <li><Link to="/consultation" className="hover:text-[#c5a55a] transition">Book Consultation</Link></li>
              <li><Link to="/login" className="hover:text-[#c5a55a] transition">Client Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#c5a55a]" /> +254 700 000 000</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#c5a55a]" /> legal@hauzral.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#c5a55a]" /> Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Hauzral Legal Consultancy. All rights reserved. | Powered by Hauzral Technologies
        </div>
      </div>
    </footer>
  );
}
