import React, { useState } from "react";
import { 
  PlusCircle, CheckSquare, List, Heart, User, Bell, Shield, 
  MapPin, Clock, FileText, CheckCircle, TrendingUp, Sparkles 
} from "lucide-react";
import { Lead, Product, Category, Notification } from "../types";

interface UserPanelProps {
  currentUser: any;
  leads: Lead[];
  products: Product[];
  categories: Category[];
  notifications: Notification[];
  onPostLead: (leadData: any) => void;
  onUpdateProfile: (profileData: any) => void;
  wishlist: string[];
  onRemoveFromWishlist: (productId: string) => void;
  prefilledCategory?: string;
}

export default function UserPanel({
  currentUser,
  leads,
  products,
  categories,
  notifications,
  onPostLead,
  onUpdateProfile,
  wishlist,
  onRemoveFromWishlist,
  prefilledCategory
}: UserPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'post' | 'requirements' | 'saved' | 'profile'>('dashboard');

  // Form State for Post Requirement
  const [form, setForm] = useState({
    title: "",
    category: prefilledCategory || "CRM Software",
    description: "",
    budget: "₹25,000 - ₹50,000 / month",
    companyName: currentUser?.companyName || "",
    contactName: currentUser?.name || "",
    mobile: currentUser?.mobile || "",
    email: currentUser?.email || "",
    city: currentUser?.city || "",
    timeline: "Immediate (Within 15 Days)",
    // BANT Questions
    bantBudget: "Budget signed off and approved by senior management",
    bantAuthority: "I am the direct decision maker / evaluating CIO",
    bantNeed: "Critical workflow issues with our legacy system causing 30% lead drops",
    bantTimeline: "Need sandbox environment in 7 days, complete migration in 30 days"
  });

  const [postSuccess, setPostSuccess] = useState(false);

  // Form State for Profile
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    companyName: currentUser?.companyName || "",
    mobile: currentUser?.mobile || "",
    email: currentUser?.email || "",
    city: currentUser?.city || "",
    gstNumber: currentUser?.gstNumber || "33ABCDE1234F1Z0",
    businessType: currentUser?.businessType || "SME Services",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    emailNotifications: currentUser?.emailNotifications !== false
  });

  React.useEffect(() => {
    if (currentUser) {
      setProfileForm(prev => ({
        ...prev,
        name: currentUser.name || "",
        companyName: currentUser.companyName || "",
        mobile: currentUser.mobile || "",
        email: currentUser.email || "",
        city: currentUser.city || "",
        gstNumber: currentUser.gstNumber || "33ABCDE1234F1Z0",
        businessType: currentUser.businessType || "SME Services",
        emailNotifications: currentUser.emailNotifications !== false
      }));
      setForm(prev => ({
        ...prev,
        companyName: currentUser.companyName || prev.companyName,
        contactName: currentUser.name || prev.contactName,
        mobile: currentUser.mobile || prev.mobile,
        email: currentUser.email || prev.email,
        city: currentUser.city || prev.city
      }));
    }
  }, [currentUser]);

  const [profileSuccess, setProfileSuccess] = useState(false);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPostLead(form);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      // Reset form
      setForm(prev => ({
        ...prev,
        title: "",
        description: ""
      }));
      setActiveTab('requirements');
    }, 2000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  // Get status color matching
  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Assigned':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Vendor Contacted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Proposal Received':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Closed Won':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Closed Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusProgress = (status: Lead['status']) => {
    switch (status) {
      case 'Submitted': return 15;
      case 'Assigned': return 35;
      case 'Vendor Contacted': return 55;
      case 'Proposal Received': return 75;
      case 'Closed Won': return 100;
      case 'Closed Lost': return 100;
      default: return 0;
    }
  };

  // Saved/Wishlist products list
  const savedProducts = products.filter(p => wishlist.includes(p.id));

  // Filter leads posted by the user's company (or simulate)
  const myLeads = leads; // Showing leads for demonstration purposes with full states

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* Tab Navigation header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Procurement & Sourcing Panel</h2>
          <p className="text-xs text-slate-500 mt-1">Simulated corporate account: <span className="font-semibold text-[#0066FF]">{currentUser?.name} ({currentUser?.companyName})</span></p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg self-start text-xs font-semibold overflow-x-auto max-w-full whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'post' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Post Lead (BANT)
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'requirements' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Requirements ({myLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'saved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Wishlist ({savedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Corporate Profile
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Requirements Posted</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{myLeads.length}</p>
              <div className="text-[10px] text-green-600 font-semibold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Auto-qualified in BANT formats</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Vendor Channels</span>
              <p className="text-2xl font-black text-slate-800 mt-1">3 Verified</p>
              <div className="text-[10px] text-slate-400 mt-2">Active proposal engagement</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Saved Products</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{savedProducts.length}</p>
              <div className="text-[10px] text-slate-400 mt-2">Quick sourcing triggers ready</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 bg-[#0066FF]/5 border-[#0066FF]/20">
              <span className="text-[10px] text-[#0066FF] font-bold uppercase block">BANT Verification Status</span>
              <p className="text-sm font-bold text-slate-800 mt-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500 fill-green-500" />
                SME Tier Verified
              </p>
              <div className="text-[10px] text-slate-500 mt-2">GSTIN registration verified</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Notifications */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Recent Notifications & Security Logs</h3>
              <div className="space-y-3.5">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-3 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-[#0066FF]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{n.title}</h4>
                      <p className="text-slate-500 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Just Now • System Audit Logs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Sourcing Advice */}
            <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,#ffffff,transparent_50%)]"></div>
              <h3 className="font-bold text-xs text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 z-10 relative">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                AI BANT Qualification Tips
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed z-10 relative">
                Our AI auditing matches your requirements with vendors only when your budget, decision authority, and timeline constraints are fully qualified.
              </p>
              <div className="space-y-3 pt-2 z-10 relative">
                <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700/60 text-[11px]">
                  <p className="font-bold text-white">1. Specify precise user scale</p>
                  <p className="text-slate-400 mt-0.5">Helps cloud telephony providers allocate exact SIP trunk channels.</p>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700/60 text-[11px]">
                  <p className="font-bold text-white">2. State integration bottlenecks</p>
                  <p className="text-slate-400 mt-0.5">Let Odoo/ERP vendors understand legacy system limitations beforehand.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. POST REQUIREMENT (BANT FORM) */}
      {activeTab === 'post' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl mx-auto shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-6">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#0066FF]" />
              Post Pre-Qualified Sourcing requirement (BANT Method)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Provide clear specifications. Our algorithm verifies and forwards criteria directly to verified vendors.</p>
          </div>

          {postSuccess ? (
            <div className="text-center py-10 space-y-3">
              <CheckSquare className="w-12 h-12 text-green-500 mx-auto animate-bounce" />
              <h4 className="font-bold text-green-600 text-sm">BANT Requirement Submitted Successfully!</h4>
              <p className="text-xs text-slate-500">Redirecting to your tracking panel to review live deal statuses...</p>
            </div>
          ) : (
            <form onSubmit={handlePostSubmit} className="space-y-6 text-xs text-slate-700">
              
              {/* Core Sourcing Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider border-b border-slate-50 pb-1">1. Sourcing Specifications</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Requirement Title *</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      placeholder="e.g. Need CRM with WhatsApp broadcasting and Call Center integration"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Core Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Estimated Budget Range *</label>
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({...form, budget: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>₹10,000 - ₹25,000 / month</option>
                      <option>₹25,000 - ₹50,000 / month</option>
                      <option>₹50,000 - ₹1,00,000 / month</option>
                      <option>₹1,00,000+ per month</option>
                      <option>₹2,00,000 - ₹10,000,000 (One-time setup)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-500 font-semibold mb-1">Detailed Technical Specifications *</label>
                    <textarea
                      rows={3}
                      required
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      placeholder="Outline user seat counts, legacy systems, integrations required, security certifications required..."
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* BANT Qualification Questionnaire */}
              <div className="space-y-4 bg-yellow-400/5 p-4 rounded-xl border border-yellow-400/20">
                <h4 className="font-extrabold text-slate-800 uppercase text-[11px] tracking-wider border-b border-yellow-400/20 pb-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  2. Mandatory BANT Audit Questions
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">[Budget (B)] Has this budget been approved internally by finance? *</label>
                    <input
                      type="text"
                      required
                      value={form.bantBudget}
                      onChange={(e) => setForm({...form, bantBudget: e.target.value})}
                      placeholder="e.g. Yes, approved SME budget up to 50k/mo"
                      className="w-full bg-white border border-slate-200 rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">[Authority (A)] What is your corporate procurement evaluation authority? *</label>
                    <input
                      type="text"
                      required
                      value={form.bantAuthority}
                      onChange={(e) => setForm({...form, bantAuthority: e.target.value})}
                      placeholder="e.g. Evaluating Manager reporting to CIO for sign off"
                      className="w-full bg-white border border-slate-200 rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">[Need (N)] What critical business bottleneck does this solution solve? *</label>
                    <textarea
                      rows={2}
                      required
                      value={form.bantNeed}
                      onChange={(e) => setForm({...form, bantNeed: e.target.value})}
                      placeholder="e.g. Outbound calls connectivity dropping, manual ledger error rates..."
                      className="w-full bg-white border border-slate-200 rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">[Timeline (T)] What is the hard target live timeline for deployment? *</label>
                    <input
                      type="text"
                      required
                      value={form.bantTimeline}
                      onChange={(e) => setForm({...form, bantTimeline: e.target.value})}
                      placeholder="e.g. Within 30 days maximum, starting testing next week"
                      className="w-full bg-white border border-slate-200 rounded p-2"
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Contact Registration */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider border-b border-slate-50 pb-1">3. Corporate Registry Contact Info</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Company Corporate Name</label>
                    <input
                      type="text"
                      required
                      value={form.companyName}
                      onChange={(e) => setForm({...form, companyName: e.target.value})}
                      placeholder="e.g. Deva Consulting Pvt Ltd"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Primary Contact Name</label>
                    <input
                      type="text"
                      required
                      value={form.contactName}
                      onChange={(e) => setForm({...form, contactName: e.target.value})}
                      placeholder="e.g. Prabhu Deva"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Registered Mobile *</label>
                    <input
                      type="text"
                      required
                      value={form.mobile}
                      onChange={(e) => setForm({...form, mobile: e.target.value})}
                      placeholder="+91 99999 88888"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Registered Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder="pramod@company.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Corporate City Location</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({...form, city: e.target.value})}
                      placeholder="Chennai"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Target Integration Timeline</label>
                    <select
                      value={form.timeline}
                      onChange={(e) => setForm({...form, timeline: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                    >
                      <option>Immediate (Within 15 Days)</option>
                      <option>1 Month</option>
                      <option>2-3 Months</option>
                      <option>Just Sourcing Quotes / Checking Options</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded shadow-xs cursor-pointer"
                >
                  Post Qualification Lead &rarr;
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* 3. MY REQUIREMENTS TAB */}
      {activeTab === 'requirements' && (
        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl bg-white p-4">
            <p className="text-xs text-slate-400 font-bold">Requirement Flow Pipeline</p>
            <div className="mt-4 grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-slate-500">
              <div className="bg-blue-50 text-blue-700 p-2 rounded border border-blue-200">1. Submitted</div>
              <div className="bg-yellow-50 text-yellow-700 p-2 rounded border border-yellow-200">2. Assigned</div>
              <div className="bg-purple-50 text-purple-700 p-2 rounded border border-purple-200">3. Vendor Contacted</div>
              <div className="bg-orange-50 text-orange-700 p-2 rounded border border-orange-200">4. Proposal Received</div>
              <div className="bg-green-50 text-green-700 p-2 rounded border border-green-200">5. Closed Won</div>
              <div className="bg-rose-50 text-rose-700 p-2 rounded border border-rose-200">6. Closed Lost</div>
            </div>
          </div>

          <div className="space-y-4">
            {myLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-50 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border">
                        {lead.category}
                      </span>
                      <span className="text-[10px] text-slate-400">Posted on: {new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800">{lead.title}</h3>
                  </div>

                  <span className={`px-2.5 py-1 text-[11px] font-semibold border rounded-md shrink-0 self-start ${getStatusBadge(lead.status)}`}>
                    Status: {lead.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Audit Pipeline Progress</span>
                    <span>{getStatusProgress(lead.status)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0066FF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${getStatusProgress(lead.status)}%` }}
                    />
                  </div>
                </div>

                {/* Technical Specifications & BANT summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <p className="font-semibold text-slate-500">Core Specifications:</p>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100/80">{lead.description}</p>
                    <div className="flex gap-4 text-[11px] text-slate-400 font-semibold pt-1">
                      <span>Target Budget limit: <span className="text-slate-700">{lead.budget}</span></span>
                      <span>Target Timeline: <span className="text-slate-700">{lead.timeline}</span></span>
                    </div>
                  </div>

                  <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3.5 space-y-2.5">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                      <Shield className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      Dynamic BANT Criteria
                    </p>
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      <p><strong>[B] Budget:</strong> {lead.bant.budget}</p>
                      <p><strong>[A] Authority:</strong> {lead.bant.authority}</p>
                      <p><strong>[N] Need:</strong> {lead.bant.need}</p>
                      <p><strong>[T] Timeline:</strong> {lead.bant.timeline}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned partner channels if available */}
                <div className="border-t border-slate-100 pt-3.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Matched Certified Vendor Channels</p>
                  <div className="flex flex-wrap gap-3">
                    {lead.assignedVendors.length > 0 ? (
                      lead.assignedVendors.map((vId, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-[#0066FF] py-1 px-2.5 rounded text-[11px] font-semibold">
                          <CheckSquare className="w-3.5 h-3.5" />
                          Matched Vendor (ID: {vId}) - Live proposals queued
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">BANTConfirm auditing team is currently verifying matching criteria with gold partners. Leads typically match within 12-24 hours.</span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. WISHLIST / SAVED PRODUCTS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group relative">
                  <div className="h-44 bg-slate-100 relative">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => onRemoveFromWishlist(p.id)}
                      className="absolute top-3 right-3 bg-white text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-full border border-slate-100 shadow-sm cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] text-[#0066FF] font-bold uppercase tracking-wider">{p.category}</span>
                      <h4 className="font-bold text-xs text-slate-800 mt-1 line-clamp-1">{p.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="font-black text-slate-800">{p.pricing}</span>
                      <button
                        onClick={() => {
                          setForm(prev => ({ ...prev, title: `Sourcing Inquiry for: ${p.name}`, category: p.category }));
                          setActiveTab('post');
                        }}
                        className="bg-[#0066FF] text-white font-bold py-1.5 px-3 rounded text-[10px] cursor-pointer"
                      >
                        Source Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 bg-white border border-dashed rounded-xl text-center text-xs text-slate-400">
              No solutions wishlisted currently. Click browse to find CRM, ERP, and cloud modules!
            </div>
          )}
        </div>
      )}

      {/* 5. PROFILE & BUSINESS SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl mx-auto shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-6">
            <h3 className="font-black text-slate-800 text-sm">Buyer Profile & Registered Entity Registry</h3>
            <p className="text-xs text-slate-500 mt-1">Manage corporate details, tax registration identification and verified contact desks.</p>
          </div>

          {profileSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-lg mb-4 text-center font-bold">
              Business Registry Profile Updated Successfully!
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Contact Officer Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Company Entity Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.companyName}
                  onChange={(e) => setProfileForm({...profileForm, companyName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Primary Email Address</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Mobile Contact Phone</label>
                <input
                  type="text"
                  required
                  value={profileForm.mobile}
                  onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Corporate City Location</label>
                <input
                  type="text"
                  required
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Registered corporate GSTIN *</label>
                <input
                  type="text"
                  required
                  value={profileForm.gstNumber}
                  onChange={(e) => setProfileForm({...profileForm, gstNumber: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-500 font-semibold mb-1">Registered Business Type</label>
                <select
                  value={profileForm.businessType}
                  onChange={(e) => setProfileForm({...profileForm, businessType: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                >
                  <option>SME Services</option>
                  <option>E-Commerce Retailer</option>
                  <option>Automotive Manufacturing</option>
                  <option>Healthcare / Care Homes</option>
                  <option>IT Outsourcing Agency</option>
                </select>
              </div>

              {/* Email Notifications Toggle for Lead Updates */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4 mt-2">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800 text-xs">Email Notifications Settings</p>
                  <p className="text-[10px] text-slate-400">Receive instant email dispatch notifications whenever a sourcing lead's status is updated.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase ${profileForm.emailNotifications ? 'text-green-600' : 'text-slate-400'}`}>
                    {profileForm.emailNotifications ? 'Subscribed' : 'Unsubscribed'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={profileForm.emailNotifications}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setProfileForm(prev => ({ ...prev, emailNotifications: isChecked }));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold py-2 px-5 rounded cursor-pointer"
              >
                Save Registry Updates
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
