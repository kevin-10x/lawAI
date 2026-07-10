import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/ai-portal', label: 'AI Portal' },
    { to: '/consultation', label: 'Consultation' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#1a365d] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Scale className="h-7 w-7 text-[#c5a55a]" />
            <span>Hauzral <span className="text-[#c5a55a]">Legal</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`hover:text-[#c5a55a] transition text-sm font-medium ${isActive(l.to) ? 'text-[#c5a55a]' : ''}`}>{l.label}</Link>
            ))}
            {user ? (
              <Link to="/portal" className="bg-[#c5a55a] text-[#1a365d] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#d4b96e] transition">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="bg-[#c5a55a] text-[#1a365d] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#d4b96e] transition">
                Client Login
              </Link>
            )}
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#1a365d] border-t border-blue-800 px-4 pb-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`block py-2 text-sm ${isActive(l.to) ? 'text-[#c5a55a]' : 'text-white hover:text-[#c5a55a]'}`}>{l.label}</Link>
          ))}
          {user ? (
            <Link to="/portal" className="block py-2 text-sm text-[#c5a55a] font-semibold">Dashboard</Link>
          ) : (
            <Link to="/login" className="block py-2 text-sm text-[#c5a55a] font-semibold">Client Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
