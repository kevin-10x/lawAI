import { Scale, Target, Eye, Heart, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#1a365d] to-[#0f2440] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="h-12 w-12 text-[#c5a55a] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Hauzral Legal</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Making legal services faster, affordable, and accessible through technology.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-[#1a365d] mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">Hauzral Legal Consultancy is a technology-powered legal services company based in Nairobi, Kenya. We combine experienced human lawyers with cutting-edge AI technology to deliver faster, more affordable legal services.</p>
              <p className="text-gray-600">Our mission is to democratize access to legal services in Kenya and across Africa by leveraging AI to reduce costs and turnaround times while maintaining the highest quality standards through lawyer oversight.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-[#c5a55a]">500+</div>
                  <div className="text-sm text-gray-500">Clients</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-[#c5a55a]">50+</div>
                  <div className="text-sm text-gray-500">Practice Areas</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-[#c5a55a]">98%</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-[#c5a55a]">24/7</div>
                  <div className="text-sm text-gray-500">AI Support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To make legal services accessible, affordable, and efficient for every individual and business in Kenya through the power of AI and human expertise.' },
              { icon: Eye, title: 'Our Vision', desc: 'To become Africa\'s leading technology-powered legal services platform, setting the standard for accessible and quality legal assistance.' },
              { icon: Heart, title: 'Our Values', desc: 'Integrity, innovation, accessibility, and client-centricity guide everything we do at Hauzral Legal.' },
            ].map((v) => (
              <div key={v.title} className="text-center p-6">
                <div className="bg-[#1a365d]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"><v.icon className="h-7 w-7 text-[#1a365d]" /></div>
                <h3 className="text-lg font-bold text-[#1a365d] mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1a365d] mb-4">Powered by Hauzral Technologies</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">Hauzral Legal Consultancy is a vertical under Hauzral Technologies, alongside other AI-powered solutions.</p>
          <Link to="/contact" className="bg-[#1a365d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2b4c7e] transition">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
