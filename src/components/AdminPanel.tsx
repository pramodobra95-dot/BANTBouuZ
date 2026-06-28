import React, { useState } from "react";
import { 
  Users, Layers, ShoppingBag, BarChart, CheckCircle, AlertTriangle, 
  Trash2, Plus, Calendar, FileText, Globe, ToggleLeft, ToggleRight, 
  Download, ArrowUpRight, Shield, BadgeAlert, PlusCircle, CheckSquare,
  Pencil, UploadCloud
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell 
} from "recharts";
import { Vendor, Product, Lead, Blog, Banner, Category } from "../types";
import { safeAlert } from "../utils/safeAlert";

interface AdminPanelProps {
  vendors: Vendor[];
  products: Product[];
  leads: Lead[];
  categories: Category[];
  blogs: Blog[];
  banners: Banner[];
  onApproveVendor: (vendorId: string) => void;
  onApproveProduct: (productId: string) => void;
  onRejectProduct: (productId: string) => void;
  onToggleFeatureProduct: (productId: string) => void;
  onAssignVendorToLead: (leadId: string, vendorId: string) => void;
  onAddBanner: (bannerData: any) => void;
  onDeleteBanner: (bannerId: string) => void;
  onAddBlog: (blogData: any) => void;
  onDeleteBlog: (blogId: string) => void;
  cmsPages: Record<string, string>;
  onUpdateCMSPage: (key: string, val: string) => void;
  onAddProduct?: (productData: any) => void;
  onUpdateProduct?: (productId: string, productData: any) => void;
  onDeleteProduct?: (productId: string) => void;
  onAddVendor?: (vendorData: any) => void;
  onUpdateVendor?: (vendorId: string, vendorData: any) => void;
  onDeleteVendor?: (vendorId: string) => void;
  registeredUsers?: any[];
  onDeleteUser?: (userId: string) => void;
  onAddCategory?: (catData: { name: string; description: string; icon: string }) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

export default function AdminPanel({
  vendors,
  products,
  leads,
  categories,
  blogs,
  banners,
  onApproveVendor,
  onApproveProduct,
  onRejectProduct,
  onToggleFeatureProduct,
  onAssignVendorToLead,
  onAddBanner,
  onDeleteBanner,
  onAddBlog,
  onDeleteBlog,
  cmsPages,
  onUpdateCMSPage,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  registeredUsers = [],
  onDeleteUser,
  onAddCategory,
  onDeleteCategory
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'products' | 'leads' | 'banners' | 'blogs' | 'cms' | 'users' | 'categories'>('overview');

  // Product addition and editing form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: categories[0]?.name || "CRM Software",
    pricing: "Custom Pricing",
    vendorId: vendors[0]?.id || "ven-1",
    vendorName: vendors[0]?.companyName || "BANTConfirm Verified Partner",
    imagesText: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60",
    featuresText: "AI Qualification, Live Matchmaking, Verified Pricing",
    brochureUrl: "#",
    videoUrl: "",
    faqQuestion1: "",
    faqAnswer1: "",
    faqQuestion2: "",
    faqAnswer2: "",
    approved: true,
    isFeatured: false
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleFileProcess = (file: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      safeAlert("Invalid file format. Please upload a JPEG or PNG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setProductForm(prev => ({
          ...prev,
          imagesText: result
        }));
        safeAlert("Image file uploaded and loaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Vendor addition and editing form state
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [vendorForm, setVendorForm] = useState({
    companyName: "",
    name: "",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60",
    gstNumber: "",
    panNumber: "",
    website: "",
    businessCategory: "CRM Software",
    location: "India",
    approved: true,
    docVerified: true,
    plan: "Free" as const
  });

  const [isDraggingVendorLogo, setIsDraggingVendorLogo] = useState(false);

  const handleVendorLogoProcess = (file: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      safeAlert("Invalid file format. Please upload a JPEG or PNG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setVendorForm(prev => ({
          ...prev,
          logo: result
        }));
        safeAlert("Logo image uploaded and loaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      companyName: vendorForm.companyName,
      name: vendorForm.name,
      logo: vendorForm.logo,
      gstNumber: vendorForm.gstNumber,
      panNumber: vendorForm.panNumber,
      website: vendorForm.website,
      businessCategory: vendorForm.businessCategory,
      location: vendorForm.location,
      approved: vendorForm.approved,
      docVerified: vendorForm.docVerified,
      plan: vendorForm.plan
    };

    if (editingVendor) {
      if (onUpdateVendor) {
        onUpdateVendor(editingVendor.id, payload);
        safeAlert("Vendor updated successfully!");
      }
    } else {
      if (onAddVendor) {
        onAddVendor(payload);
        safeAlert("Vendor created successfully!");
      }
    }

    setShowVendorForm(false);
    setEditingVendor(null);
    setVendorForm({
      companyName: "",
      name: "",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60",
      gstNumber: "",
      panNumber: "",
      website: "",
      businessCategory: "CRM Software",
      location: "India",
      approved: true,
      docVerified: true,
      plan: "Free"
    });
  };

  const handleStartEditVendor = (v: Vendor) => {
    setEditingVendor(v);
    setVendorForm({
      companyName: v.companyName,
      name: v.name,
      logo: v.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60",
      gstNumber: v.gstNumber || "",
      panNumber: v.panNumber || "",
      website: v.website || "",
      businessCategory: v.businessCategory || "CRM Software",
      location: v.location || "India",
      approved: v.approved,
      docVerified: !!v.docVerified,
      plan: (v.plan as any) || "Free"
    });
    setShowVendorForm(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = productForm.featuresText.split(",").map(f => f.trim()).filter(Boolean);
    const faqs = [];
    if (productForm.faqQuestion1 && productForm.faqAnswer1) {
      faqs.push({ question: productForm.faqQuestion1, answer: productForm.faqAnswer1 });
    }
    if (productForm.faqQuestion2 && productForm.faqAnswer2) {
      faqs.push({ question: productForm.faqQuestion2, answer: productForm.faqAnswer2 });
    }

    const selectedVendor = vendors.find(v => v.id === productForm.vendorId);
    const vendorName = selectedVendor ? selectedVendor.companyName : productForm.vendorName;

    const payload = {
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      pricing: productForm.pricing,
      vendorId: productForm.vendorId,
      vendorName,
      images: [productForm.imagesText],
      features,
      brochureUrl: productForm.brochureUrl || "#",
      videoUrl: productForm.videoUrl || "",
      faqs,
      approved: productForm.approved,
      isFeatured: productForm.isFeatured
    };

    if (editingProduct) {
      if (onUpdateProduct) {
        await onUpdateProduct(editingProduct.id, payload);
      }
    } else {
      if (onAddProduct) {
        await onAddProduct(payload);
      }
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      category: categories[0]?.name || "CRM Software",
      pricing: "Custom Pricing",
      vendorId: vendors[0]?.id || "ven-1",
      vendorName: vendors[0]?.companyName || "BANTConfirm Verified Partner",
      imagesText: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60",
      featuresText: "AI Qualification, Live Matchmaking, Verified Pricing",
      brochureUrl: "#",
      videoUrl: "",
      faqQuestion1: "",
      faqAnswer1: "",
      faqQuestion2: "",
      faqAnswer2: "",
      approved: true,
      isFeatured: false
    });
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      category: p.category,
      pricing: p.pricing,
      vendorId: p.vendorId,
      vendorName: p.vendorName,
      imagesText: p.images[0] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60",
      featuresText: p.features.join(", "),
      brochureUrl: p.brochureUrl || "#",
      videoUrl: p.videoUrl || "",
      faqQuestion1: p.faqs[0]?.question || "",
      faqAnswer1: p.faqs[0]?.answer || "",
      faqQuestion2: p.faqs[1]?.question || "",
      faqAnswer2: p.faqs[1]?.answer || "",
      approved: p.approved,
      isFeatured: p.isFeatured
    });
    setShowProductForm(true);
  };

  // New Banner form state
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80",
    linkUrl: "#",
    type: "image" as const
  });

  // New Blog form state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showSeoAccordion, setShowSeoAccordion] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    category: "CRM & Sales",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
    tagsText: "Sourcing, BANT, CRM",
    author: "BANTConfirm Editorial",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    focusKeyword: "",
    schemaMarkup: ""
  });

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        safeAlert("Only JPEG and PNG format images are allowed for SEO Blog manual guidelines.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBanner(bannerForm);
    setShowBannerForm(false);
    setBannerForm({
      title: "",
      subtitle: "",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80",
      linkUrl: "#",
      type: "image"
    });
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = blogForm.tagsText.split(",").map(t => t.trim());
    
    let finalSchema = "";
    if (blogForm.schemaMarkup.trim()) {
      try {
        const parsed = JSON.parse(blogForm.schemaMarkup);
        finalSchema = JSON.stringify(parsed);
      } catch (err) {
        console.error("Invalid schema JSON, using raw text input:", err);
        finalSchema = blogForm.schemaMarkup.trim();
      }
    } else {
      finalSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blogForm.title,
        "author": { "@type": "Person", "name": blogForm.author },
        "publisher": { "@type": "Organization", "name": "BANTConfirm" }
      });
    }

    onAddBlog({
      title: blogForm.title,
      content: blogForm.content,
      category: blogForm.category,
      image: blogForm.image,
      tags,
      author: blogForm.author,
      readTime: "4 mins read",
      metaTitle: blogForm.metaTitle.trim() || `${blogForm.title} - BANTConfirm`,
      metaDescription: blogForm.metaDescription.trim() || (blogForm.content ? blogForm.content.substring(0, 155) + "..." : ""),
      metaKeywords: blogForm.metaKeywords.trim() || tags.join(", "),
      focusKeyword: blogForm.focusKeyword.trim(),
      schemaMarkup: finalSchema
    });
    setShowBlogForm(false);
    setBlogForm({
      title: "",
      content: "",
      category: "CRM & Sales",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
      tagsText: "Sourcing, BANT, CRM",
      author: "BANTConfirm Editorial",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      focusKeyword: "",
      schemaMarkup: ""
    });
  };

  // Export lead data as CSV (Simulated Excel Download)
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Lead ID,Title,Category,Budget,Timeline,Status,Company,Contact,Phone,Email\n";
    
    leads.forEach(l => {
      csvContent += `"${l.id}","${l.title.replace(/"/g, '""')}","${l.category}","${l.budget}","${l.timeline}","${l.status}","${l.companyName}","${l.contactName}","${l.mobile}","${l.email}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bantconfirm_qualified_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recharts Dashboard Data
  const platformRevenueData = [
    { month: "Jan", Subscriptions: 140000, Leads: 80000, Commission: 45000 },
    { month: "Feb", Subscriptions: 190000, Leads: 110000, Commission: 75000 },
    { month: "Mar", Subscriptions: 280000, Leads: 160000, Commission: 120000 },
    { month: "Apr", Subscriptions: 420000, Leads: 250000, Commission: 180000 }
  ];

  const leadDistributionData = [
    { name: "CRM Software", value: 3 },
    { name: "ERP Software", value: 4 },
    { name: "Cloud Telephony", value: 5 },
    { name: "Accounting", value: 2 }
  ];

  const COLORS = ["#0066FF", "#FFC107", "#9333EA", "#22C55E"];

  // Core CMS text editor buffers
  const [cmsPageEditing, setCmsPageEditing] = useState<'about' | 'terms' | 'privacy'>('about');
  const [cmsText, setCmsText] = useState(cmsPages[cmsPageEditing] || "BANTConfirm description");

  React.useEffect(() => {
    if (cmsPages && cmsPages[cmsPageEditing] !== undefined) {
      setCmsText(cmsPages[cmsPageEditing]);
    }
  }, [cmsPages, cmsPageEditing]);

  const handleCmsSave = () => {
    onUpdateCMSPage(cmsPageEditing, cmsText);
    safeAlert("CMS Page updated live on platform routing.");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* Header and navigation bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            BANTConfirm Administrator Console
          </h2>
          <p className="text-xs text-slate-500 mt-1">Global Marketplace Audit & Lead routing controls.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg self-start text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'vendors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registrations ({registeredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Catalog Verification
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'leads' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            BANT Routing ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'banners' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Banners Slider
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'blogs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            SEO Blog
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'cms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            CMS Copy
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'categories' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick numbers bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Buyers</span>
              <p className="text-xl font-black text-slate-800 mt-1">{registeredUsers.filter((u: any) => u.role === 'buyer').length || 1} Active</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Verified Providers</span>
              <p className="text-xl font-black text-slate-800 mt-1">{vendors.length} Partners</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Catalog Items</span>
              <p className="text-xl font-black text-slate-800 mt-1">{products.length} Solutions</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">BANT Leads</span>
              <p className="text-xl font-black text-slate-800 mt-1">{leads.length} Enquiries</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs bg-yellow-400/5 border-yellow-400/20">
              <span className="text-[10px] text-yellow-600 font-bold block uppercase">Dynamic Sitemaps</span>
              <p className="text-xs font-bold text-slate-800 mt-1">Auto-indexing active</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs bg-blue-50/50 border-blue-100">
              <span className="text-[10px] text-[#0066FF] font-bold block uppercase">Platform Revenue</span>
              <p className="text-xl font-black text-slate-800 mt-1">₹8,50,000</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Area Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Platform Sourcing Revenue Streams (INR)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platformRevenueData}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Subscriptions" stackId="1" stroke="#0066FF" fill="#0066FF" fillOpacity={0.4} />
                    <Area type="monotone" dataKey="Leads" stackId="1" stroke="#FFC107" fill="#FFC107" fillOpacity={0.4} />
                    <Area type="monotone" dataKey="Commission" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sourcing Category Pie Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs flex flex-col justify-between">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Sourcing Lead Categories Distribution</h3>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {leadDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-[11px] text-slate-600 font-semibold">
                {leadDistributionData.map((d, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{d.name}</span>
                    </div>
                    <span>{d.value} enquiries</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VENDORS & USERS MANAGEMENT TAB */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl border border-slate-200 p-5 shadow-xs gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Solution Integrators / Vendors</h3>
              <p className="text-xs text-slate-500 mt-1">Add manual entries, verify registrations, upgrade plan tiers or delete vendor profiles.</p>
            </div>
            <button
              onClick={() => {
                setEditingVendor(null);
                setVendorForm({
                  companyName: "",
                  name: "",
                  logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60",
                  gstNumber: "",
                  panNumber: "",
                  website: "",
                  businessCategory: "CRM Software",
                  location: "India",
                  approved: true,
                  docVerified: true,
                  plan: "Free"
                });
                setShowVendorForm(!showVendorForm);
              }}
              className="inline-flex items-center gap-1.5 bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Manual Vendor
            </button>
          </div>

          {/* Vendor creation and editing form */}
          {showVendorForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-extrabold text-slate-900 text-sm mb-4 border-b pb-2">
                {editingVendor ? `Edit Vendor: ${editingVendor.companyName}` : "Create New Manual Vendor"}
              </h4>
              <form onSubmit={handleVendorSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={vendorForm.companyName}
                      onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                      placeholder="e.g. Acme Tech Solutions"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Representative Name *</label>
                    <input
                      type="text"
                      required
                      value={vendorForm.name}
                      onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">GSTIN / Tax ID *</label>
                    <input
                      type="text"
                      required
                      value={vendorForm.gstNumber}
                      onChange={(e) => setVendorForm({ ...vendorForm, gstNumber: e.target.value })}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">PAN Card Number</label>
                    <input
                      type="text"
                      value={vendorForm.panNumber}
                      onChange={(e) => setVendorForm({ ...vendorForm, panNumber: e.target.value })}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Category Focus *</label>
                    <select
                      value={vendorForm.businessCategory}
                      onChange={(e) => setVendorForm({ ...vendorForm, businessCategory: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Plan Tier</label>
                    <select
                      value={vendorForm.plan}
                      onChange={(e) => setVendorForm({ ...vendorForm, plan: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    >
                      <option value="Free">Free Basic</option>
                      <option value="Silver">Silver Tier</option>
                      <option value="Gold">Gold Premium</option>
                      <option value="Enterprise">Enterprise Elite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Website URL</label>
                    <input
                      type="text"
                      value={vendorForm.website}
                      onChange={(e) => setVendorForm({ ...vendorForm, website: e.target.value })}
                      placeholder="e.g. https://example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">HQ Location</label>
                    <input
                      type="text"
                      value={vendorForm.location}
                      onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                      placeholder="e.g. Mumbai, India"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  {/* Logo upload & paste */}
                  <div className="md:col-span-2 border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <span className="block text-slate-800 font-extrabold text-[11px] uppercase tracking-wider">Vendor Logo / Avatar</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Paste Logo Link */}
                      <div className="space-y-3 flex flex-col justify-between">
                        <div>
                          <label className="block text-slate-500 mb-1 font-bold text-[10px] uppercase tracking-wider">Option A: Logo URL Link</label>
                          <input
                            type="url"
                            value={vendorForm.logo}
                            onChange={(e) => setVendorForm({ ...vendorForm, logo: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                          />
                        </div>
                        
                        <div className="border border-slate-200 bg-white rounded-lg p-2.5 flex items-center gap-3">
                          {vendorForm.logo ? (
                            <img 
                              src={vendorForm.logo} 
                              alt="Logo Preview" 
                              className="w-12 h-12 rounded border border-slate-100 shadow-xs shrink-0 object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs border border-dashed shrink-0">
                              No image
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-700 text-[11px]">Logo Preview</p>
                            <p className="text-[9px] text-slate-400 font-mono line-clamp-1 select-all max-w-[180px]">
                              {vendorForm.logo || "No logo source"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Drag & Drop File */}
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold text-[10px] uppercase tracking-wider">Option B: Upload Logo File (JPEG, PNG)</label>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingVendorLogo(true);
                          }}
                          onDragLeave={() => setIsDraggingVendorLogo(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingVendorLogo(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleVendorLogoProcess(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => {
                            document.getElementById("vendor-logo-file-input")?.click();
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[100px] ${
                            isDraggingVendorLogo 
                              ? "border-[#0066FF] bg-blue-50/40" 
                              : "border-slate-200 bg-white hover:border-[#0066FF]/60 hover:bg-slate-50/50"
                          }`}
                        >
                          <input 
                            type="file"
                            id="vendor-logo-file-input"
                            accept="image/jpeg, image/png, image/jpg"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleVendorLogoProcess(e.target.files[0]);
                              }
                            }}
                          />
                          <UploadCloud className={`w-5 h-5 mb-1 transition-colors ${isDraggingVendorLogo ? "text-[#0066FF]" : "text-slate-400"}`} />
                          <p className="font-bold text-slate-700 text-[10px]">
                            {isDraggingVendorLogo ? "Drop it!" : "Drag & drop JPEG/PNG logo"}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">or click to browse local files</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-2 col-span-2">
                    <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vendorForm.approved}
                        onChange={(e) => setVendorForm({ ...vendorForm, approved: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Active Verified Partner</span>
                    </label>

                    <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vendorForm.docVerified}
                        onChange={(e) => setVendorForm({ ...vendorForm, docVerified: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>GSTIN & Identity Docs Verified</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVendorForm(false);
                      setEditingVendor(null);
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0066FF] text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    {editingVendor ? "Save Changes" : "Deploy Vendor"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vendor Approvals Queue */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Solution Integrator Registry</h3>
            
            <div className="overflow-x-auto divide-y divide-slate-100">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-3">Company Details</th>
                    <th className="p-3">GSTIN / Tax ID</th>
                    <th className="p-3">Category Focus</th>
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">Approval Actions</th>
                    <th className="p-3">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-3 font-semibold text-slate-800">
                        <div className="flex items-center space-x-2">
                          <img src={v.logo} alt={v.companyName} className="w-8 h-8 rounded border object-cover shrink-0" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-slate-800">{v.companyName}</p>
                            <p className="text-[10px] text-slate-400">Rep: {v.name} ({v.location})</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700">{v.gstNumber}</td>
                      <td className="p-3">{v.businessCategory}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                          {v.plan || "Free"}
                        </span>
                      </td>
                      <td className="p-3">
                        {v.approved ? (
                          <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
                            Partner Active
                          </span>
                        ) : (
                          <button
                            onClick={() => onApproveVendor(v.id)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer"
                          >
                            Approve & Verify Docs
                          </button>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEditVendor(v)}
                            title="Edit Vendor Specs"
                            className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete vendor "${v.companyName}"?`)) {
                                if (onDeleteVendor) onDeleteVendor(v.id);
                                safeAlert("Vendor profile deleted successfully.");
                              }
                            }}
                            title="Delete Vendor"
                            className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Management List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">App User Registry (Buyers & Sellers)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                  <tr className="border-b border-slate-100">
                    <th className="p-3">User Name</th>
                    <th className="p-3">Registered Email</th>
                    <th className="p-3">Default Account Role</th>
                    <th className="p-3">Control status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registeredUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-800">{u.name}</td>
                      <td className="p-3 font-mono">{u.email}</td>
                      <td className="p-3 uppercase font-bold text-slate-500">{u.role}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete user registration for "${u.name}"?`)) {
                              if (onDeleteUser) onDeleteUser(u.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                        >
                          Delete Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}      {/* 3. PRODUCT CATALOG VERIFICATION TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl border border-slate-200 p-5 shadow-xs gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Catalog Solutions Curation</h3>
              <p className="text-xs text-slate-500 mt-1">Add manual entries, verify submitted solutions, update specifications or delete products.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: "",
                  description: "",
                  category: categories[0]?.name || "CRM Software",
                  pricing: "Custom Pricing",
                  vendorId: vendors[0]?.id || "ven-1",
                  vendorName: vendors[0]?.companyName || "BANTConfirm Verified Partner",
                  imagesText: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60",
                  featuresText: "AI Qualification, Live Matchmaking, Verified Pricing",
                  brochureUrl: "#",
                  videoUrl: "",
                  faqQuestion1: "",
                  faqAnswer1: "",
                  faqQuestion2: "",
                  faqAnswer2: "",
                  approved: true,
                  isFeatured: false
                });
                setShowProductForm(!showProductForm);
              }}
              className="inline-flex items-center gap-1.5 bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Manual Product
            </button>
          </div>

          {/* Product form for add/edit */}
          {showProductForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-extrabold text-slate-900 text-sm mb-4 border-b pb-2">
                {editingProduct ? `Edit Solution: ${editingProduct.name}` : "Create New Manual Product"}
              </h4>
              <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Solution/Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Salesmate CRM Enterprise"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Pricing Label *</label>
                    <input
                      type="text"
                      required
                      value={productForm.pricing}
                      onChange={(e) => setProductForm({ ...productForm, pricing: e.target.value })}
                      placeholder="e.g. ₹1,200/user/month or Custom Quote"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Sourcing Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Associated Vendor / Solution Partner *</label>
                    <select
                      value={productForm.vendorId}
                      onChange={(e) => {
                        const selectedVendor = vendors.find(v => v.id === e.target.value);
                        setProductForm({
                          ...productForm,
                          vendorId: e.target.value,
                          vendorName: selectedVendor ? selectedVendor.companyName : "BANTConfirm Verified Partner"
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    >
                      {vendors.map((v) => (
                        <option key={v.id} value={v.id}>{v.companyName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-500 mb-1 font-bold">Product Pitch / Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Enter a descriptive overview highlighting key BANT features..."
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="md:col-span-2 border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <span className="block text-slate-800 font-extrabold text-[11px] uppercase tracking-wider">Solution Banner / Cover Image</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Side: URL paste and preview */}
                      <div className="space-y-3 flex flex-col justify-between">
                        <div>
                          <label className="block text-slate-500 mb-1 font-bold text-[10px] uppercase tracking-wider">Option A: Image URL Link</label>
                          <input
                            type="url"
                            id="product-image-url-input"
                            value={productForm.imagesText}
                            onChange={(e) => setProductForm({ ...productForm, imagesText: e.target.value })}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                          />
                        </div>
                        
                        <div id="product-image-preview-wrapper" className="border border-slate-200 bg-white rounded-lg p-2.5 flex items-center gap-3">
                          {productForm.imagesText ? (
                            <img 
                              src={productForm.imagesText} 
                              alt="Product Preview" 
                              className="w-16 h-16 rounded object-cover border border-slate-100 shadow-xs shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs border border-dashed shrink-0">
                              No image
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-700 text-[11px]">Live Preview Banner</p>
                            <p className="text-[9px] text-slate-400 font-mono line-clamp-2 select-all leading-tight max-w-[180px]">
                              {productForm.imagesText || "No source assigned"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: File Drag & Drop / Click Upload */}
                      <div>
                        <label className="block text-slate-500 mb-1 font-bold text-[10px] uppercase tracking-wider">Option B: Upload Image File (JPEG, PNG)</label>
                        <div
                          id="product-drag-drop-zone"
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileProcess(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => {
                            document.getElementById("product-file-input")?.click();
                          }}
                          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[110px] ${
                            isDragging 
                              ? "border-[#0066FF] bg-blue-50/40" 
                              : "border-slate-200 bg-white hover:border-[#0066FF]/60 hover:bg-slate-50/50"
                          }`}
                        >
                          <input 
                            type="file"
                            id="product-file-input"
                            accept="image/jpeg, image/png, image/jpg"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileProcess(e.target.files[0]);
                              }
                            }}
                          />
                          <UploadCloud className={`w-6 h-6 mb-1.5 transition-colors ${isDragging ? "text-[#0066FF]" : "text-slate-400"}`} />
                          <p className="font-bold text-slate-700 text-[11px]">
                            {isDragging ? "Drop your image here!" : "Drag & drop JPEG/PNG file"}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">or click to browse local files</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Features (Comma-separated)</label>
                    <input
                      type="text"
                      value={productForm.featuresText}
                      onChange={(e) => setProductForm({ ...productForm, featuresText: e.target.value })}
                      placeholder="Feature 1, Feature 2, Feature 3"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">PDF Brochure URL</label>
                    <input
                      type="text"
                      value={productForm.brochureUrl}
                      onChange={(e) => setProductForm({ ...productForm, brochureUrl: e.target.value })}
                      placeholder="e.g. # or brochure link"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-bold">Video Showcase URL (Optional)</label>
                    <input
                      type="text"
                      value={productForm.videoUrl}
                      onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })}
                      placeholder="e.g. YouTube or Vimeo link"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  {/* FAQ 1 */}
                  <div className="border border-slate-100 p-3 rounded bg-slate-50/50 space-y-2">
                    <p className="font-bold text-slate-700">FAQ Question 1 (Optional)</p>
                    <input
                      type="text"
                      value={productForm.faqQuestion1}
                      onChange={(e) => setProductForm({ ...productForm, faqQuestion1: e.target.value })}
                      placeholder="e.g. Is there a free trial?"
                      className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                    <input
                      type="text"
                      value={productForm.faqAnswer1}
                      onChange={(e) => setProductForm({ ...productForm, faqAnswer1: e.target.value })}
                      placeholder="e.g. Yes, we provide a 14-day premium trial."
                      className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  {/* FAQ 2 */}
                  <div className="border border-slate-100 p-3 rounded bg-slate-50/50 space-y-2">
                    <p className="font-bold text-slate-700">FAQ Question 2 (Optional)</p>
                    <input
                      type="text"
                      value={productForm.faqQuestion2}
                      onChange={(e) => setProductForm({ ...productForm, faqQuestion2: e.target.value })}
                      placeholder="e.g. Do you offer SLA support?"
                      className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                    <input
                      type="text"
                      value={productForm.faqAnswer2}
                      onChange={(e) => setProductForm({ ...productForm, faqAnswer2: e.target.value })}
                      placeholder="e.g. Yes, Enterprise contracts include 24/7 SLA."
                      className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-2 col-span-2">
                    <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.approved}
                        onChange={(e) => setProductForm({ ...productForm, approved: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Auto-Approve / Make Searchable</span>
                    </label>

                    <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Promoted / Sponsored Listing</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0066FF] text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    {editingProduct ? "Save Changes" : "Deploy Product"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                  <tr className="border-b border-slate-100">
                    <th className="p-3">Solution Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Pricing Label</th>
                    <th className="p-3">Verification state</th>
                    <th className="p-3">Promotion Status</th>
                    <th className="p-3">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800">
                        <div className="flex items-center space-x-2">
                          {p.images && p.images[0] && (
                            <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded border object-cover shrink-0" referrerPolicy="no-referrer" />
                          )}
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal">By: {p.vendorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-500">{p.category}</td>
                      <td className="p-3 font-mono">{p.pricing}</td>
                      <td className="p-3">
                        {p.approved ? (
                          <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-100">
                            Approved & Indexing
                          </span>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onApproveProduct(p.id)}
                              className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectProduct(p.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => onToggleFeatureProduct(p.id)}
                          className={`px-3 py-1.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                            p.isFeatured ? 'bg-yellow-400 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {p.isFeatured ? '★ Premium Sponsored' : 'Set Premium'}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEdit(p)}
                            title="Edit Product Specs"
                            className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                if (onDeleteProduct) onDeleteProduct(p.id);
                                safeAlert("Product deleted successfully.");
                              }
                            }}
                            title="Delete Product"
                            className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. LEADS ROUTING & BANT DESK */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Procurement Requirements & BANT Router</h3>
              <p className="text-xs text-slate-400 mt-0.5">Vetter system triggers BANT audits and forwards leads to verified gold vendors.</p>
            </div>
            
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              Export BANT Leads (CSV / Excel)
            </button>
          </div>

          <div className="space-y-4">
            {leads.map((l) => (
              <div key={l.id} className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] bg-slate-100 border text-slate-500 px-2.5 py-0.5 rounded uppercase font-bold">{l.category}</span>
                    <h4 className="font-bold text-slate-800 text-xs mt-1.5">{l.title}</h4>
                    <p className="text-[10px] text-slate-400">Buyer: {l.contactName} ({l.companyName}, {l.city})</p>
                  </div>
                  
                  <span className="text-xs font-bold bg-[#0066FF] text-white py-1 px-3 rounded">
                    Status: {l.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="md:col-span-2 space-y-2">
                    <p className="font-bold text-slate-700">Detailed Description:</p>
                    <p className="bg-white p-3 rounded border border-slate-100 line-clamp-3 leading-relaxed">{l.description}</p>
                  </div>

                  {/* BANT Audit summary */}
                  <div className="bg-yellow-400/5 border border-yellow-400/20 p-3 rounded-lg space-y-1 text-[11px]">
                    <p className="font-bold text-slate-800 uppercase text-[9px] tracking-wider border-b border-yellow-400/20 pb-0.5">BANT Auditor Flags</p>
                    <p><strong>[B]:</strong> {l.bant.budget}</p>
                    <p><strong>[A]:</strong> {l.bant.authority}</p>
                    <p><strong>[N]:</strong> {l.bant.need}</p>
                    <p><strong>[T]:</strong> {l.bant.timeline}</p>
                  </div>
                </div>

                {/* Routing / Assignment dropdown */}
                <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-500">Matched Partner channels:</p>
                    <div className="flex gap-1.5 mt-1.5">
                      {l.assignedVendors.length > 0 ? (
                        l.assignedVendors.map((vId, idx) => (
                          <span key={idx} className="bg-blue-100 text-[#0066FF] px-2.5 py-0.5 rounded font-semibold text-[10px]">
                            Assigned Partner ID: {vId}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No matching vendors assigned yet. Select from dropdown to route.</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-slate-500 font-bold shrink-0">Assign Partner Sourcing Desk:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          onAssignVendorToLead(l.id, e.target.value);
                          e.target.value = ""; // Reset selector
                        }
                      }}
                      className="bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none"
                    >
                      <option value="">-- Choose Vetted Vendor --</option>
                      {vendors.filter(v => v.approved).map((v) => (
                        <option key={v.id} value={v.id}>{v.companyName} ({v.businessCategory})</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BANNERS MANAGEMENT TAB */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Banner Slider Manager</h3>
              <p className="text-xs text-slate-400 mt-0.5">Configure, upload, and schedule premium slider campaigns on the home landing screen.</p>
            </div>
            <button
              onClick={() => setShowBannerForm(!showBannerForm)}
              className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Upload Banner
            </button>
          </div>

          {/* Banner creation form */}
          {showBannerForm && (
            <form onSubmit={handleBannerSubmit} className="bg-slate-50 border p-4 rounded-xl space-y-4 text-xs max-w-xl">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})} // standard typing
                    placeholder="e.g. Expand Your AI Tech Stack"
                    className="w-full bg-white border rounded p-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">Subtext / Marketing Hook *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})}
                    placeholder="e.g. Access qualified AI models with gold implementation partners"
                    className="w-full bg-white border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Campaign Link Location</label>
                  <input
                    type="text"
                    value={bannerForm.linkUrl}
                    onChange={(e) => setBannerForm({...bannerForm, linkUrl: e.target.value})}
                    placeholder="#categories"
                    className="w-full bg-white border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Visual Banner Cover (Image URL)</label>
                  <input
                    type="url"
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border rounded p-1.5"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowBannerForm(false)} className="px-3 py-1.5 border rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-[#0066FF] text-white font-bold rounded cursor-pointer">Deploy Campaign</button>
              </div>
            </form>
          )}

          {/* Banners List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((ban) => (
              <div key={ban.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="h-32 bg-slate-900 relative">
                  <img src={ban.image} alt={ban.title} className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                    <h4 className="font-extrabold text-xs">{ban.title}</h4>
                    <p className="text-[10px] text-slate-300 mt-1">{ban.subtitle}</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border-t flex justify-between items-center text-xs">
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border font-semibold">Active Campaign</span>
                  <button
                    onClick={() => onDeleteBanner(ban.id)}
                    className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SEO BLOG MANAGEMENT TAB */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-800">SEO Sourcing Manual Builder</h3>
              <p className="text-xs text-slate-400 mt-0.5">Publish search engine optimized manuals and whitepapers for SME buyers.</p>
            </div>
            <button
              onClick={() => setShowBlogForm(!showBlogForm)}
              className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Write SEO Article
            </button>
          </div>

          {showBlogForm && (
            <form onSubmit={handleBlogSubmit} className="bg-slate-50 border p-4 rounded-xl space-y-4 text-xs max-w-xl">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                    placeholder="e.g. 5 Bottlenecks to check before Odoo Deployment"
                    className="w-full bg-white border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Article Category Focus</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                    className="w-full bg-white border rounded p-1.5"
                  >
                    <option>CRM & Sales</option>
                    <option>B2B Strategy</option>
                    <option>Cloud Telephony</option>
                    <option>Cyber Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Search Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={blogForm.tagsText}
                    onChange={(e) => setBlogForm({...blogForm, tagsText: e.target.value})}
                    placeholder="e.g. Odoo, ERP, SME scale"
                    className="w-full bg-white border rounded p-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">Article Header Image (JPEG/PNG format) *</label>
                  <div className="flex items-center gap-3 bg-white p-2 border rounded">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleBlogImageUpload}
                      className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#0066FF] hover:file:bg-blue-100 cursor-pointer"
                    />
                    {blogForm.image && (
                      <div className="relative w-12 h-12 rounded border overflow-hidden shrink-0">
                        <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Select a PNG or JPEG image from your computer to represent this manual.</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1">Dynamic Content Body (Markdown format supported) *</label>
                  <textarea
                    rows={4}
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                    placeholder="Write detailed advice and sourcing checklists here..."
                    className="w-full bg-white border rounded p-1.5"
                  />
                </div>

                {/* Technical SEO Section */}
                <div className="col-span-2 border-t border-slate-200/80 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSeoAccordion(!showSeoAccordion)}
                    className="flex items-center justify-between w-full bg-slate-100 hover:bg-slate-200/80 p-2 rounded-lg font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span>🔍 Technical SEO & Schema Configuration</span>
                    <span className="text-xs">{showSeoAccordion ? "Collapse ▲" : "Expand ▼"}</span>
                  </button>

                  {showSeoAccordion && (
                    <div className="mt-3 space-y-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-left">
                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Custom Meta Title</label>
                        <input
                          type="text"
                          value={blogForm.metaTitle}
                          onChange={(e) => setBlogForm({...blogForm, metaTitle: e.target.value})}
                          placeholder="e.g. ERP Sourcing: How to Select the Perfect B2B System"
                          className="w-full bg-white border rounded p-1.5"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Recommended length: 50-60 characters.</p>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">Custom Meta Description</label>
                        <textarea
                          rows={2}
                          value={blogForm.metaDescription}
                          onChange={(e) => setBlogForm({...blogForm, metaDescription: e.target.value})}
                          placeholder="Provide a search snippet summarizing key points (max 155 characters)."
                          className="w-full bg-white border rounded p-1.5"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Recommended length: 120-155 characters.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Focus Keyword</label>
                          <input
                            type="text"
                            value={blogForm.focusKeyword}
                            onChange={(e) => setBlogForm({...blogForm, focusKeyword: e.target.value})}
                            placeholder="e.g. ERP Sourcing"
                            className="w-full bg-white border rounded p-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Meta Keywords</label>
                          <input
                            type="text"
                            value={blogForm.metaKeywords}
                            onChange={(e) => setBlogForm({...blogForm, metaKeywords: e.target.value})}
                            placeholder="e.g. erp, b2b, software selection"
                            className="w-full bg-white border rounded p-1.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold mb-1">JSON-LD Structured Schema Markup</label>
                        <textarea
                          rows={3}
                          value={blogForm.schemaMarkup}
                          onChange={(e) => setBlogForm({...blogForm, schemaMarkup: e.target.value})}
                          placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "..."\n}`}
                          className="w-full bg-white border rounded p-1.5 font-mono text-[10px]"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Input raw JSON schema to define custom Rich Snippet metadata.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowBlogForm(false)} className="px-3 py-1.5 border rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-[#0066FF] text-white font-bold rounded cursor-pointer">Publish Article</button>
              </div>
            </form>
          )}

          {/* Blogs list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((b) => (
              <div key={b.id} className="border rounded-xl bg-white p-4 flex justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded font-bold uppercase">{b.category}</span>
                  <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{b.content.replace(/[#*]/g, "")}</p>
                </div>
                <button
                  onClick={() => onDeleteBlog(b.id)}
                  className="text-rose-600 hover:text-rose-700 shrink-0 self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CMS PAGES & CORE COPY */}
      {activeTab === 'cms' && (
        <div className="bg-white border rounded-xl p-5 space-y-4 max-w-xl mx-auto text-xs text-slate-700">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Dynamic Corporate Page Editors (CMS)</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-semibold">Update B2B footer link content and regulatory agreements in real-time.</p>
          </div>

          <div className="flex border-b border-slate-100 p-1 bg-slate-50 rounded">
            {["about", "terms", "privacy"].map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCmsPageEditing(page as any);
                  setCmsText(cmsPages[page] || "Initial page text");
                }}
                className={`flex-1 text-center py-2 font-bold rounded capitalize cursor-pointer ${
                  cmsPageEditing === page ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                {page} Page Content
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="block text-slate-500 font-bold uppercase text-[10px]">HTML Page Copy Editor</label>
            <textarea
              rows={8}
              value={cmsText}
              onChange={(e) => setCmsText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-3 font-mono text-slate-800 leading-relaxed focus:outline-none focus:bg-white"
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleCmsSave}
                className="bg-[#0066FF] text-white font-bold py-2 px-5 rounded cursor-pointer"
              >
                Publish CMS Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. REGISTERED USERS MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl border border-slate-200 p-5 shadow-xs gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Registered Users Registry</h3>
              <p className="text-xs text-slate-500 mt-1">
                Monitor and manage all user accounts registered on the platform, including buyers, vendors, and admins.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-100">
                Total Registrations: {registeredUsers.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">User Directory</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-extrabold border-b border-slate-100 select-none text-[10px] uppercase tracking-wider">
                    <th className="p-3">User Profile</th>
                    <th className="p-3">Contact Email</th>
                    <th className="p-3">Mobile Number</th>
                    <th className="p-3">Company Name</th>
                    <th className="p-3">Location (City)</th>
                    <th className="p-3">Platform Role</th>
                    <th className="p-3">Registration Date</th>
                    <th className="p-3">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registeredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    registeredUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] font-black text-xs flex items-center justify-center border border-blue-200">
                              {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-800 text-xs">{u.name || "N/A"}</p>
                              <p className="text-[10px] text-slate-400 font-mono select-all">ID: {u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          {u.email}
                        </td>
                        <td className="p-3">
                          {u.mobile ? (
                            <span className="font-mono text-slate-700 font-bold">{u.mobile}</span>
                          ) : (
                            <span className="text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 text-[9px] uppercase">
                              Required / Missing
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {u.companyName ? (
                            <span className="font-semibold text-slate-700">{u.companyName}</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 uppercase italic">
                              Not Provided (Optional)
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {u.city ? (
                            <span className="font-semibold text-slate-700">{u.city}</span>
                          ) : (
                            <span className="text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 text-[9px] uppercase">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider ${
                            u.role === 'admin' 
                              ? 'bg-amber-50 text-amber-600 border-amber-100'
                              : u.role === 'vendor'
                              ? 'bg-purple-50 text-purple-600 border-purple-100'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {u.role || "buyer"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[10px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : "N/A"}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user registration for "${u.name}"?`)) {
                                if (onDeleteUser) onDeleteUser(u.id);
                              }
                            }}
                            title="Delete User Registration Record"
                            className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded transition-colors cursor-pointer inline-flex items-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. CATEGORIES MANAGEMENT TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl border border-slate-200 p-5 shadow-xs gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Categories Manager</h3>
              <p className="text-xs text-slate-500 mt-1">
                Define the marketplace taxonomies, add new software categories, and prune unused ones.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
                Active Categories: {categories.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Add New Category Form */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Add New Category
              </h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem("catName") as HTMLInputElement).value;
                const description = (form.elements.namedItem("catDesc") as HTMLTextAreaElement).value;
                const icon = (form.elements.namedItem("catIcon") as HTMLInputElement).value || "Layers";
                
                if (!name) {
                  safeAlert("Category Name is required!");
                  return;
                }

                if (onAddCategory) {
                  onAddCategory({ name, description, icon });
                  form.reset();
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category Name *</label>
                  <input
                    type="text"
                    name="catName"
                    placeholder="e.g. ERP Systems"
                    required
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Icon Class Name</label>
                  <input
                    type="text"
                    name="catIcon"
                    placeholder="e.g. Layers, ShoppingBag, Database"
                    defaultValue="Layers"
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Available Lucide icons list includes: Layers, ShoppingBag, Database, Users, Calendar, BarChart.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Short Description</label>
                  <textarea
                    name="catDesc"
                    rows={3}
                    placeholder="Brief overview of the category offerings..."
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Create Category
                </button>
              </form>
            </div>

            {/* Right: Category List */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Existing Taxonomies</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-extrabold border-b border-slate-100 select-none text-[10px] uppercase tracking-wider">
                      <th className="p-3">Category info</th>
                      <th className="p-3">Icon</th>
                      <th className="p-3">Products Count</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center p-8 text-slate-400">
                          No categories found. Create one on the left.
                        </td>
                      </tr>
                    ) : (
                      categories.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <p className="font-extrabold text-slate-800 text-xs">{c.name}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.description || "No description provided."}</p>
                            <p className="text-[9px] text-slate-300 font-mono select-all">ID: {c.id}</p>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-[10px]">
                              {c.icon}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {c.productsCount || 0}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete the "${c.name}" category?`)) {
                                  if (onDeleteCategory) onDeleteCategory(c.id);
                                }
                              }}
                              className="text-rose-600 hover:text-rose-900 font-bold text-[11px] p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
