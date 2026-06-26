import React, { useState } from "react";
import { 
  Plus, Edit2, Trash2, ShoppingBag, Landmark, Key, Globe, 
  MapPin, CheckCircle, AlertTriangle, Play, HelpCircle, FileText, 
  Star, TrendingUp, Users, DollarSign, Eye, Award, CheckSquare 
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell 
} from "recharts";
import { Vendor, Product, Lead, Category } from "../types";
import { safeAlert } from "../utils/safeAlert";

interface VendorPanelProps {
  currentUser: any;
  vendorProfile: Vendor | undefined;
  products: Product[];
  leads: Lead[];
  categories: Category[];
  onRegisterVendor: (vendorData: any) => void;
  onUpdateVendor: (vendorId: string, updatedData: any) => void;
  onAddProduct: (productData: any) => void;
  onUpdateProduct: (productId: string, productData: any) => void;
  onDeleteProduct: (productId: string) => void;
  onClaimLead: (leadId: string, vendorId: string) => void;
  onUpdateLeadAssignmentStatus: (leadId: string, vendorId: string, status: string) => void;
  onUpdateProfile?: (profileData: any) => void;
  initialActiveTab?: 'dashboard' | 'products' | 'leads' | 'plans' | 'register';
}

export default function VendorPanel({
  currentUser,
  vendorProfile,
  products,
  leads,
  categories,
  onRegisterVendor,
  onUpdateVendor,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onClaimLead,
  onUpdateLeadAssignmentStatus,
  onUpdateProfile,
  initialActiveTab
}: VendorPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'leads' | 'plans' | 'register'>(
    initialActiveTab || (vendorProfile ? 'dashboard' : 'register')
  );

  React.useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    } else if (vendorProfile) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('register');
    }
  }, [vendorProfile, initialActiveTab]);

  // Registration Form State
  const [registerForm, setRegisterForm] = useState({
    companyName: currentUser?.companyName || "",
    name: currentUser?.name || "",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop",
    gstNumber: "27AAAAA1111A1Z1",
    panNumber: "AAAAA1111A",
    website: "https://saasify.co.in",
    businessCategory: "CRM Software",
    productsOffered: ["CRM Software", "ERP Software"],
    location: "Mumbai, Maharashtra",
    plan: "Gold" as const
  });

  const [registerSuccess, setRegisterSuccess] = useState(false);

  // New Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "CRM Software",
    pricing: "₹1,500 / user / month onwards",
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop"],
    featuresText: "Feature 1\nFeature 2\nFeature 3",
    brochureUrl: "#",
    videoUrl: "",
    faqQuestion1: "Is training included?",
    faqAnswer1: "Yes, we provide 4 hours of complimentary training.",
    faqQuestion2: "Are updates included?",
    faqAnswer2: "All security patches and platform updates are free."
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterVendor(registerForm);
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setActiveTab('dashboard');
    }, 2000);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = productForm.featuresText.split("\n").filter(f => f.trim());
    const faqs = [];
    if (productForm.faqQuestion1.trim()) {
      faqs.push({ question: productForm.faqQuestion1, answer: productForm.faqAnswer1 });
    }
    if (productForm.faqQuestion2.trim()) {
      faqs.push({ question: productForm.faqQuestion2, answer: productForm.faqAnswer2 });
    }

    const payload = {
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      pricing: productForm.pricing,
      images: productForm.images,
      features,
      faqs,
      brochureUrl: productForm.brochureUrl,
      videoUrl: productForm.videoUrl,
      vendorId: vendorProfile?.id || "ven-1",
      vendorName: vendorProfile?.companyName || "SaaSify Solutions Pvt Ltd"
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, payload);
    } else {
      onAddProduct(payload);
    }

    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      category: "CRM Software",
      pricing: "₹1,500 / user / month onwards",
      images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop"],
      featuresText: "Feature 1\nFeature 2\nFeature 3",
      brochureUrl: "#",
      videoUrl: "",
      faqQuestion1: "Is training included?",
      faqAnswer1: "Yes, we provide 4 hours of complimentary training.",
      faqQuestion2: "Are updates included?",
      faqAnswer2: "All security patches and platform updates are free."
    });
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      category: p.category,
      pricing: p.pricing,
      images: p.images,
      featuresText: p.features.join("\n"),
      brochureUrl: p.brochureUrl || "#",
      videoUrl: p.videoUrl || "",
      faqQuestion1: p.faqs[0]?.question || "Is training included?",
      faqAnswer1: p.faqs[0]?.answer || "Yes, we provide 4 hours of complimentary training.",
      faqQuestion2: p.faqs[1]?.question || "Are updates included?",
      faqAnswer2: p.faqs[1]?.answer || "All security patches and platform updates are free."
    });
    setShowProductModal(true);
  };

  // Vendor plan tiers
  const subscriptionPlans = [
    { name: "Free Plan", price: "₹0 / month", limit: "5 Products", perks: ["Basic matching", "Community forums", "Standard profile"] },
    { name: "Silver Plan", price: "₹4,999 / month", limit: "25 Products", perks: ["Instant BANT notifications", "Email dispatch support", "Document verified checkmark"] },
    { name: "Gold Plan", price: "₹9,999 / month", limit: "100 Products", perks: ["3x higher matching frequency", "Sponsored listed search tags", "Lead claim credits included"] },
    { name: "Enterprise Plan", price: "₹24,999 / month", limit: "Unlimited Products", perks: ["All capabilities unlocked", "Dedicated account audit rep", "Pre-qualified direct telephone bridges"] }
  ];

  // Helper stats based on vendor profile
  const activeVendor = vendorProfile || {
    id: "ven-1",
    companyName: "SaaSify Solutions Pvt Ltd",
    name: "Rajesh Kumar",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=60",
    rating: 4.8,
    approved: true,
    plan: "Gold",
    productsCount: 3,
    leadsCount: 14,
    revenue: 450000,
    viewsCount: 1250
  };

  const myProducts = products.filter(p => p.vendorId === activeVendor.id);

  // Mock charts data using recharts
  const leadsTrendData = [
    { name: "Week 1", Leads: 2, Revenue: 150000 },
    { name: "Week 2", Leads: 5, Revenue: 180000 },
    { name: "Week 3", Leads: 4, Revenue: 210000 },
    { name: "Week 4", Leads: 8, Revenue: 450000 }
  ];

  const leadStatusPieData = [
    { name: "New Leads", value: 4, color: "#0066FF" },
    { name: "Contacted", value: 5, color: "#9333EA" },
    { name: "Proposal Sent", value: 3, color: "#F97316" },
    { name: "Closed Won", value: 2, color: "#22C55E" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* Upper info tab */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-4">
        <div className="flex items-center space-x-3.5">
          <img 
            src={activeVendor.logo} 
            alt={activeVendor.companyName} 
            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-xl font-black text-slate-900">{activeVendor.companyName}</h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Account Lead: <strong>{activeVendor.name}</strong></span>
              <span>•</span>
              <span className="bg-yellow-400 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">{activeVendor.plan} Tier Partner</span>
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 p-1 rounded-lg self-start text-xs font-semibold overflow-x-auto max-w-full whitespace-nowrap scrollbar-none">
          {activeVendor.approved ? (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
                  activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Dashboard Analytics
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
                  activeTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Manage Products ({myProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
                  activeTab === 'leads' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                BANT Lead Desk
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-4 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
                  activeTab === 'plans' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Settings & Plans
              </button>
            </>
          ) : (
            <div className="text-xs font-bold text-slate-500 p-2">
              Registration & Verification Guard active
            </div>
          )}
        </div>
      </div>

      {/* REGISTRATION GUARD PANEL */}
      {!activeVendor.approved && activeTab === 'register' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl mx-auto shadow-xs space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 pb-4">
            <span className="text-[#0066FF] font-bold text-xs uppercase tracking-wider">Become a Certified Solution Partner</span>
            <h3 className="text-lg font-black text-slate-900">Partner Registration Details</h3>
            <p className="text-xs text-slate-500">Provide company credentials. BANTConfirm auditor verifies files manually prior to catalog indexing.</p>
          </div>

          {registerSuccess ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Registration Received - Admin Approval Required</h4>
              <p className="text-xs text-slate-500">
                Documents are queued. To explore the fully active Vendor Dashboard for demo purposes, you will be auto-switched to approved Gold credentials instantly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Company Registered Name *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.companyName}
                    onChange={(e) => setRegisterForm({...registerForm, companyName: e.target.value})}
                    placeholder="e.g. Acme Software Integrations"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Company Website URL</label>
                  <input
                    type="url"
                    value={registerForm.website}
                    onChange={(e) => setRegisterForm({...registerForm, website: e.target.value})}
                    placeholder="https://acmesystems.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Company GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.gstNumber}
                    onChange={(e) => setRegisterForm({...registerForm, gstNumber: e.target.value})}
                    placeholder="27AAAAA1111A1Z1"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Corporate Permanent Account Number (PAN) *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.panNumber}
                    onChange={(e) => setRegisterForm({...registerForm, panNumber: e.target.value})}
                    placeholder="AAAAA1111A"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Core Category Focus</label>
                  <select
                    value={registerForm.businessCategory}
                    onChange={(e) => setRegisterForm({...registerForm, businessCategory: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                  >
                    {categories && categories.length > 0 ? (
                      categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))
                    ) : (
                      <>
                        <option>CRM Software</option>
                        <option>ERP Software</option>
                        <option>Cloud Telephony</option>
                        <option>Cyber Security</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Entity Base Location</label>
                  <input
                    type="text"
                    required
                    value={registerForm.location}
                    onChange={(e) => setRegisterForm({...registerForm, location: e.target.value})}
                    placeholder="e.g. Delhi NCR"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg cursor-pointer"
                >
                  Submit Certified Registry &rarr;
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 1. DASHBOARD ANALYTICS TAB */}
      {activeVendor.approved && activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Live Products</span>
              <p className="text-xl font-black text-slate-800 mt-1">{myProducts.length}</p>
              <div className="text-[10px] text-slate-400 mt-1.5">Gold plan slots unlocked</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">BANT Leads Purchased</span>
              <p className="text-xl font-black text-slate-800 mt-1">{activeVendor.leadsCount || 0}</p>
              <div className="text-[10px] text-green-600 font-semibold mt-1.5 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>84% conversion potential</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Closed Won Value</span>
              <p className="text-xl font-black text-slate-800 mt-1">₹{activeVendor.revenue ? activeVendor.revenue.toLocaleString() : "4,50,000"}</p>
              <div className="text-[10px] text-slate-400 mt-1.5">B2B Deal contract value</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Product Search Views</span>
              <p className="text-xl font-black text-slate-800 mt-1">{activeVendor.viewsCount || 1250}</p>
              <div className="text-[10px] text-slate-400 mt-1.5">Unique buyer searches</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs bg-[#0066FF]/5 border-[#0066FF]/20">
              <span className="text-[10px] text-[#0066FF] font-bold uppercase block">Lead Bid Credit Balance</span>
              <p className="text-xl font-black text-slate-800 mt-1">8 Credits</p>
              <div className="text-[10px] text-slate-500 mt-1.5">Claims ₹1,500/lead</div>
            </div>
          </div>

          {/* Interactive Charts Section using Recharts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales Trend Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Monthly Sourcing Leads Acquisition & Pipeline Revenue</span>
                <span className="text-[10px] text-slate-400 font-mono">Last 4 Weeks</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadsTrendData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Leads" fill="#0066FF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Revenue" fill="#F97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leads Status Pie Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs flex flex-col justify-between">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Active lead pipeline status
              </h3>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadStatusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {leadStatusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-1.5 text-[11px] font-semibold text-slate-600">
                {leadStatusPieData.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span>{s.name}</span>
                    </div>
                    <span>{s.value} Leads</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. PRODUCT MANAGEMENT TAB */}
      {activeVendor.approved && activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Your Catalog Solutions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Add and modify software modules listed on the main BANTConfirm search engine.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Product / Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between relative">
                {/* Approval Flag */}
                <span className={`absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm ${
                  p.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {p.approved ? 'Approved & Live' : 'Pending Approval'}
                </span>

                <div>
                  <div className="h-36 bg-slate-100">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] text-[#0066FF] font-bold uppercase tracking-wider">{p.category}</span>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{p.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">{p.pricing}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PRODUCT FORM MODAL */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full h-[580px] overflow-hidden flex flex-col border border-slate-200">
                <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
                  <h4 className="font-bold text-sm">{editingProduct ? "Edit Marketplace Product" : "Add New Solution Profile"}</h4>
                  <button onClick={() => setShowProductModal(false)} className="text-white hover:text-slate-200">&times;</button>
                </div>

                <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="e.g. Twilio WhatsApp API Bridge"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Marketplace Category *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Licensing Price Label *</label>
                      <input
                        type="text"
                        required
                        value={productForm.pricing}
                        onChange={(e) => setProductForm({...productForm, pricing: e.target.value})}
                        placeholder="e.g. ₹1,500/user/month onwards"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Demo Video Embed URL</label>
                      <input
                        type="url"
                        value={productForm.videoUrl}
                        onChange={(e) => setProductForm({...productForm, videoUrl: e.target.value})}
                        placeholder="https://youtube.com/embed/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-500 font-semibold mb-1">Brief Technical Description *</label>
                      <textarea
                        rows={2}
                        required
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-500 font-semibold mb-1">Technical Capabilities (One per line) *</label>
                      <textarea
                        rows={3}
                        required
                        value={productForm.featuresText}
                        onChange={(e) => setProductForm({...productForm, featuresText: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                      />
                    </div>

                    <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                      <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Configure Sourcing FAQs</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input 
                            type="text" 
                            placeholder="FAQ 1 Question" 
                            value={productForm.faqQuestion1} 
                            onChange={(e) => setProductForm({...productForm, faqQuestion1: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded p-1.5 mb-1"
                          />
                          <input 
                            type="text" 
                            placeholder="FAQ 1 Answer" 
                            value={productForm.faqAnswer1} 
                            onChange={(e) => setProductForm({...productForm, faqAnswer1: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded p-1.5"
                          />
                        </div>
                        <div>
                          <input 
                            type="text" 
                            placeholder="FAQ 2 Question" 
                            value={productForm.faqQuestion2} 
                            onChange={(e) => setProductForm({...productForm, faqQuestion2: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded p-1.5 mb-1"
                          />
                          <input 
                            type="text" 
                            placeholder="FAQ 2 Answer" 
                            value={productForm.faqAnswer2} 
                            onChange={(e) => setProductForm({...productForm, faqAnswer2: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded p-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-[#0066FF] text-white font-bold rounded cursor-pointer">Publish Solution</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BANT LEAD DESK TAB */}
      {activeVendor.approved && activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-800">BANT Lead Qualified Inbox</h3>
            <p className="text-xs text-slate-400 mt-0.5">Acquire and qualify high-intent procurement requirements directly matching your verified capabilities.</p>
          </div>

          {/* Quick email alert subscription toggle */}
          <div className="bg-[#0066FF]/5 border border-[#0066FF]/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs text-slate-800">Email Notification Alerts for Lead Updates</h4>
              <p className="text-[10px] text-slate-500">Receive real-time email dispatches when buyers update their BANT requirements or status.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase ${currentUser?.emailNotifications !== false ? 'text-green-600' : 'text-slate-400'}`}>
                {currentUser?.emailNotifications !== false ? 'Subscribed' : 'Unsubscribed'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={currentUser?.emailNotifications !== false}
                  onChange={(e) => {
                    if (onUpdateProfile) {
                      onUpdateProfile({ emailNotifications: e.target.checked });
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {leads.map((lead: any) => (
              <div key={lead.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-50 pb-3 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-slate-100 border text-slate-600 px-2 py-0.5 rounded uppercase font-extrabold">{lead.category}</span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">{lead.title}</h4>
                    <p className="text-[10px] text-slate-400">Target Budget Limit: <strong>{lead.budget}</strong></p>
                  </div>

                  {lead.isPurchasedByMe ? (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded border border-green-200 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Acquired & Unlocked
                    </span>
                  ) : (
                    <button
                      onClick={() => onClaimLead(lead.id, activeVendor.id)}
                      className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      Unlock Contact Info (1 Credit)
                    </button>
                  )}
                </div>

                {/* Sourcing Needs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
                  <div className="md:col-span-2">
                    <p className="font-bold text-slate-500 mb-1">Sourcing Specifications Details:</p>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100/80">{lead.description}</p>
                  </div>

                  {/* Qualified BANT scores */}
                  <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3 space-y-2">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[9px] uppercase tracking-wider border-b border-yellow-400/20 pb-0.5">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      BANT Qualification Audit
                    </p>
                    <div className="space-y-1 text-[11px] leading-relaxed">
                      <p><strong>[B] Budget:</strong> {lead.bant.budget}</p>
                      <p><strong>[A] Authority:</strong> {lead.bant.authority}</p>
                      <p><strong>[N] Need:</strong> {lead.bant.need}</p>
                      <p><strong>[T] Timeline:</strong> {lead.bant.timeline}</p>
                    </div>
                  </div>
                </div>

                {/* Contact detail block revealed only if claimed */}
                {lead.isPurchasedByMe && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Buyer Contact Name</p>
                      <p className="font-bold text-slate-800 mt-0.5">{lead.contactName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Buyer Contact Phone</p>
                      <p className="font-bold text-[#0066FF] mt-0.5">{lead.mobile}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Corporate Contact Email</p>
                      <p className="font-bold text-[#0066FF] mt-0.5">{lead.email}</p>
                    </div>

                    {/* Progress controller */}
                    <div className="md:col-span-3 border-t border-slate-100 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-slate-500">Pipeline Status: <strong className="text-slate-800">{lead.assignmentStatus}</strong></span>
                      
                      <div className="flex gap-1.5">
                        {["Contacted", "Proposal Sent", "Closed Won", "Closed Lost"].map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateLeadAssignmentStatus(lead.id, activeVendor.id, st)}
                            className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                              lead.assignmentStatus === st 
                                ? 'bg-slate-900 border-slate-900 text-white' 
                                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUBSCRIPTION & PLANS TAB */}
      {activeVendor.approved && activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center space-y-1 mb-6">
            <span className="text-[#0066FF] font-bold text-xs uppercase tracking-wider">Premium Solution Partner Network</span>
            <h3 className="text-lg font-black text-slate-900">Partner Subscription Packages</h3>
            <p className="text-xs text-slate-500">Upgrade your plan to unlock higher catalog listing quotas, BANT qualification search alerts and sponsored tags.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl p-5 flex flex-col justify-between space-y-6 bg-white transition-all shadow-xs relative ${
                  activeVendor.plan === plan.name.split(" ")[0] 
                    ? "border-[#0066FF] ring-1 ring-blue-500 bg-blue-50/10" 
                    : "border-slate-200 hover:border-blue-400"
                }`}
              >
                {activeVendor.plan === plan.name.split(" ")[0] && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    Your Active Plan
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">{plan.name}</h4>
                    <p className="text-lg font-black text-slate-900 mt-1">{plan.price}</p>
                    <span className="text-[10px] text-slate-400 block font-semibold mt-1">Sourcing Cap: {plan.limit}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    {plan.perks.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onUpdateVendor(activeVendor.id, { plan: plan.name.split(" ")[0] });
                    safeAlert(`Plan switched successfully to ${plan.name}! Premium tags have been deployed on catalog.`);
                  }}
                  disabled={activeVendor.plan === plan.name.split(" ")[0]}
                  className={`w-full font-bold text-xs py-2 rounded-lg cursor-pointer transition-all ${
                    activeVendor.plan === plan.name.split(" ")[0]
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {activeVendor.plan === plan.name.split(" ")[0] ? 'Active Plan' : `Upgrade to ${plan.name.split(" ")[0]}`}
                </button>
              </div>
            ))}
          </div>

          {/* Email notifications settings for Vendors */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl mx-auto shadow-xs space-y-4 mt-8">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm">Partner Sourcing Alerts & Notification Settings</h4>
              <p className="text-xs text-slate-500 mt-1">Configure your email preferences to receive BANT-qualified lead match dispatches and system updates.</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800 text-xs">Email Lead Matching Dispatch</p>
                <p className="text-[10px] text-slate-400">Receive instant email alerts whenever a new requirement matching your product category is qualified by our BANT auditors.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase ${currentUser?.emailNotifications !== false ? 'text-green-600' : 'text-slate-400'}`}>
                  {currentUser?.emailNotifications !== false ? 'Active' : 'Muted'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentUser?.emailNotifications !== false}
                    onChange={(e) => {
                      if (onUpdateProfile) {
                        onUpdateProfile({ emailNotifications: e.target.checked });
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
