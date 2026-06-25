import React from "react";
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

interface FooterProps {
  onNav: (tab: string) => void;
  openSeoViewer: () => void;
}

export default function Footer({ onNav, openSeoViewer }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      {/* Upper Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 font-black text-xl select-none group">
            <div className="w-6 h-6 bg-[#FFC107] rounded flex items-center justify-center text-xs font-black text-slate-900 shadow-sm">B</div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-[#FFC107]">BANT</span>
              <span className="text-[#0066FF]">Confirm</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            India's premier B2B Enterprise IT & Software Solutions marketplace. We pre-qualify procurement requirements using strict Budget, Authority, Need, and Timeline (BANT) criteria, saving months of sourcing efforts.
          </p>
        </div>

        {/* Categories Column */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Solution Portals</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNav("home")} className="hover:text-white transition-colors cursor-pointer text-left">CRM Software</button></li>
            <li><button onClick={() => onNav("home")} className="hover:text-white transition-colors cursor-pointer text-left">ERP Enterprise Suites</button></li>
            <li><button onClick={() => onNav("home")} className="hover:text-white transition-colors cursor-pointer text-left">Cloud Telephony / IVR</button></li>
            <li><button onClick={() => onNav("home")} className="hover:text-white transition-colors cursor-pointer text-left">Cyber Security & Endpoints</button></li>
            <li><button onClick={() => onNav("home")} className="hover:text-white transition-colors cursor-pointer text-left">WhatsApp Business APIs</button></li>
          </ul>
        </div>

        {/* Corporate Column */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Corporate Info</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNav("about")} className="hover:text-white transition-colors cursor-pointer text-left">About BANTConfirm</button></li>
            <li><button onClick={() => onNav("contact")} className="hover:text-white transition-colors cursor-pointer text-left">Contact Us / Support</button></li>
            <li><button onClick={() => onNav("terms")} className="hover:text-white transition-colors cursor-pointer text-left">Terms of Service</button></li>
            <li><button onClick={() => onNav("privacy")} className="hover:text-white transition-colors cursor-pointer text-left">Privacy Policy</button></li>
            <li><button onClick={() => onNav("become-partner")} className="hover:text-blue-300 text-blue-400 font-extrabold transition-colors cursor-pointer text-left">Become a Partner & FAQ Hub</button></li>
            <li><button onClick={() => onNav("vendor-register")} className="hover:text-white transition-colors cursor-pointer text-left">Vendor Certification Registration</button></li>
          </ul>
        </div>

        {/* Contacts Column */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Corporate HQ</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>Noida, Uttar Pradesh - 201301</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Support@bantconfirm.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Lower Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 BANTConfirm Marketplace Private Limited. All Rights Reserved.</span>
          <div className="flex gap-4 items-center flex-wrap">
            <button onClick={openSeoViewer} className="hover:text-white transition-colors cursor-pointer text-[11px] bg-slate-800 text-slate-400 py-1 px-2.5 rounded">
              🇮🇳 India Sourcing Directory & Sitemap
            </button>
            <span className="text-[11px] text-slate-600">Google Top Search Optimised</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
