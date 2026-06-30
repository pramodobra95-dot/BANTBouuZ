import React, { useState, useEffect } from "react";
import { 
  Users, Layers, ShoppingBag, BarChart, CheckCircle, AlertTriangle, 
  Trash2, Plus, Calendar, FileText, Globe, ToggleLeft, ToggleRight, 
  Download, ArrowUpRight, Shield, BadgeAlert, PlusCircle, CheckSquare,
  Pencil, UploadCloud, Sparkles, Eye, BookOpen, Search
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell 
} from "recharts";
import { Vendor, Product, Lead, Blog, Banner, Category } from "../types";
import { safeAlert } from "../utils/safeAlert";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

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
  onUpdateBlog?: (blogId: string, blogData: any) => void;
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
  onRefreshData?: () => void;
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
  onUpdateBlog,
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
  onDeleteCategory,
  onRefreshData
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'products' | 'leads' | 'banners' | 'blogs' | 'cms' | 'users' | 'categories' | 'trusted-vendors'>('overview');

  // Trusted Vendors administration state
  const [trustedVendors, setTrustedVendors] = useState<any[]>([]);
  const [loadingTv, setLoadingTv] = useState(false);
  const [showTvForm, setShowTvForm] = useState(false);
  const [editingTv, setEditingTv] = useState<any | null>(null);
  const [tvForm, setTvForm] = useState({
    vendor_name: "",
    logo_url: "",
    website_url: "",
    display_order: 0,
    is_active: true
  });

  const [isDraggingTvLogo, setIsDraggingTvLogo] = useState(false);

  const handleTvLogoProcess = (file: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      safeAlert("Invalid file format. Please upload a JPEG or PNG image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setTvForm(prev => ({
          ...prev,
          logo_url: result
        }));
        safeAlert("Logo image uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchTrustedVendors = async () => {
    setLoadingTv(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from("trusted_vendors").select("*").order("display_order", { ascending: true });
        if (!error && data) {
          setTrustedVendors(data);
          setLoadingTv(false);
          return;
        }
      }

      const res = await fetch("/api/admin/trusted-vendors");
      if (res.ok) {
        const data = await res.json();
        setTrustedVendors(data);
      }
    } catch (e) {
      console.error("Failed to fetch trusted vendors in AdminPanel:", e);
    } finally {
      setLoadingTv(false);
    }
  };

  useEffect(() => {
    if (activeTab === "trusted-vendors") {
      fetchTrustedVendors();
    }
  }, [activeTab]);

  const handleOpenAddTv = () => {
    setEditingTv(null);
    setTvForm({
      vendor_name: "",
      logo_url: "",
      website_url: "",
      display_order: trustedVendors.length + 1,
      is_active: true
    });
    setShowTvForm(true);
  };

  const handleOpenEditTv = (tv: any) => {
    setEditingTv(tv);
    setTvForm({
      vendor_name: tv.vendor_name,
      logo_url: tv.logo_url,
      website_url: tv.website_url || "",
      display_order: tv.display_order || 0,
      is_active: tv.is_active !== false
    });
    setShowTvForm(true);
  };

  const handleSaveTv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tvForm.vendor_name || !tvForm.logo_url) {
      safeAlert("Vendor Name and Logo URL are required");
      return;
    }

    try {
      const tvId = editingTv ? editingTv.id : `tv-${Date.now()}`;
      const tvData = {
        id: tvId,
        vendor_name: tvForm.vendor_name,
        logo_url: tvForm.logo_url,
        website_url: tvForm.website_url || null,
        display_order: typeof tvForm.display_order === "number" ? tvForm.display_order : parseInt(String(tvForm.display_order) || "0", 10),
        is_active: tvForm.is_active !== false,
        created_at: editingTv?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: editingTv?.created_at || new Date().toISOString()
      };

      let savedLocal = false;
      try {
        const url = editingTv 
          ? `/api/admin/trusted-vendors/${editingTv.id}`
          : "/api/admin/trusted-vendors";
        const method = editingTv ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...tvForm, id: tvId })
        });
        if (res.ok) {
          savedLocal = true;
        }
      } catch (err) {
        console.warn("Local server trusted_vendors save failed/not available, relying on Supabase:", err);
      }

      // If Supabase is configured, sync to Supabase as well
      if (isSupabaseConfigured) {
        try {
          // Try with full payload
          let { error } = await supabase.from("trusted_vendors").upsert([tvData]);
          
          if (error) {
            console.warn("Supabase trusted_vendors sync with full fields failed. Retrying with core fields only...", error);
            
            // Core fields only
            const coreTvData = {
              id: tvData.id,
              vendor_name: tvData.vendor_name,
              logo_url: tvData.logo_url,
              website_url: tvData.website_url,
              display_order: tvData.display_order,
              is_active: tvData.is_active
            };
            
            const retryRes = await supabase.from("trusted_vendors").upsert([coreTvData]);
            if (retryRes.error) {
              console.error("Supabase trusted_vendors sync retry with core fields also failed:", retryRes.error);
              if (!savedLocal) throw retryRes.error;
            } else {
              console.log("Successfully synced trusted vendor to Supabase using core fields fallback!");
            }
          } else {
            console.log("Successfully synced trusted vendor to Supabase with full fields!");
          }
        } catch (supabaseErr) {
          console.error("Resilient fallback: Supabase trusted_vendors sync failed:", supabaseErr);
          if (!savedLocal) throw supabaseErr;
        }
      }

      setShowTvForm(false);
      fetchTrustedVendors();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      console.error(err);
      safeAlert(`An unexpected error occurred while saving: ${err?.message || err}`);
    }
  };

  const handleDeleteTv = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trusted vendor?")) return;
    try {
      let deletedLocal = false;
      try {
        const res = await fetch(`/api/admin/trusted-vendors/${id}`, { method: "DELETE" });
        if (res.ok) {
          deletedLocal = true;
        }
      } catch (err) {
        console.warn("Local server trusted_vendors delete failed/not available, relying on Supabase:", err);
      }

      // If Supabase is configured, delete from Supabase as well
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.from("trusted_vendors").delete().eq("id", id);
          if (error) {
            console.error("Supabase trusted_vendors delete error:", error);
            if (!deletedLocal) throw error;
          } else {
            console.log("Successfully deleted trusted vendor from Supabase!");
          }
        } catch (supabaseErr) {
          console.error("Resilient fallback: Supabase trusted_vendors delete failed:", supabaseErr);
          if (!deletedLocal) throw supabaseErr;
        }
      }

      fetchTrustedVendors();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      console.error(err);
      safeAlert(`Failed to delete trusted vendor: ${err?.message || err}`);
    }
  };

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
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  
  // Auto-save notification
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");

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
    schemaMarkup: "",
    slug: "",
    status: "Published" as "Draft" | "Published" | "Scheduled",
    shortDescription: "",
    canonicalUrl: "",
    publishDate: new Date().toISOString().split('T')[0],
    isAiGenerated: false,
    views: 0
  });

  // Filters & Sorting State
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState("All");
  const [blogStatusFilter, setBlogStatusFilter] = useState("All");
  const [blogSortBy, setBlogSortBy] = useState<"Latest" | "Oldest" | "Most Viewed" | "Most Liked">("Latest");

  // AI Blog Generator parameters state
  const [showAiBlogWriter, setShowAiBlogWriter] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiAudience, setAiAudience] = useState("SME Decision Makers");
  const [aiIndustry, setAiIndustry] = useState("Technology & B2B Sourcing");
  const [aiTone, setAiTone] = useState("Professional");
  const [aiLanguage, setAiLanguage] = useState("English");
  const [aiLength, setAiLength] = useState("1000 words");
  const [aiSeoKeyword, setAiSeoKeyword] = useState("");
  const [aiCta, setAiCta] = useState("");
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const [isImprovingContent, setIsImprovingContent] = useState(false);
  const [aiImprovementOutput, setAiImprovementOutput] = useState("");

  // Load draft from localStorage on mount or when opening form
  useEffect(() => {
    if (showBlogForm && !editingBlogId) {
      const saved = localStorage.getItem("bantconfirm_blog_draft");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBlogForm(parsed);
          setAutoSaveStatus("Draft loaded from auto-save!");
          setTimeout(() => setAutoSaveStatus(""), 3000);
        } catch (e) {
          console.error("Failed to parse auto-saved draft");
        }
      }
    }
  }, [showBlogForm, editingBlogId]);

  // Auto-save loop (every 10 seconds)
  useEffect(() => {
    if (!showBlogForm || editingBlogId) return;
    const interval = setInterval(() => {
      localStorage.setItem("bantconfirm_blog_draft", JSON.stringify(blogForm));
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setAutoSaveStatus(`Draft saved at ${timeStr}`);
      setTimeout(() => setAutoSaveStatus(""), 3000);
    }, 10000);

    return () => clearInterval(interval);
  }, [showBlogForm, editingBlogId, blogForm]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingBlogId && blogForm.title) {
      const suggestedSlug = blogForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setBlogForm(prev => ({ ...prev, slug: suggestedSlug }));
    }
  }, [blogForm.title, editingBlogId]);

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

    const submissionData = {
      title: blogForm.title,
      content: blogForm.content,
      category: blogForm.category,
      image: blogForm.image,
      tags,
      author: blogForm.author,
      readTime: "5 mins read",
      metaTitle: blogForm.metaTitle.trim() || `${blogForm.title} - BANTConfirm`,
      metaDescription: blogForm.metaDescription.trim() || (blogForm.content ? blogForm.content.substring(0, 155) + "..." : ""),
      metaKeywords: blogForm.metaKeywords.trim() || tags.join(", "),
      focusKeyword: blogForm.focusKeyword.trim(),
      schemaMarkup: finalSchema,
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: blogForm.status,
      shortDescription: blogForm.shortDescription || (blogForm.content ? blogForm.content.substring(0, 155) + "..." : ""),
      canonicalUrl: blogForm.canonicalUrl || `https://bantconfirm.com/blogs/${blogForm.slug || "sourcing"}`,
      publishDate: blogForm.publishDate || new Date().toISOString(),
      isAiGenerated: blogForm.isAiGenerated,
      views: blogForm.views || 0
    };

    if (editingBlogId) {
      if (onUpdateBlog) {
        onUpdateBlog(editingBlogId, submissionData);
      }
    } else {
      onAddBlog(submissionData);
    }

    // Clear draft storage
    localStorage.removeItem("bantconfirm_blog_draft");

    setShowBlogForm(false);
    setEditingBlogId(null);
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
      schemaMarkup: "",
      slug: "",
      status: "Published",
      shortDescription: "",
      canonicalUrl: "",
      publishDate: new Date().toISOString().split('T')[0],
      isAiGenerated: false,
      views: 0
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

        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto md:ml-auto md:self-center text-xs font-semibold overflow-x-auto flex-nowrap scrollbar-thin admin-tabs-scrollbar gap-1">
          <style dangerouslySetInnerHTML={{ __html: `
            .admin-tabs-scrollbar::-webkit-scrollbar {
              height: 4px;
            }
            .admin-tabs-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .admin-tabs-scrollbar::-webkit-scrollbar-thumb {
              background-color: #cbd5e1;
              border-radius: 2px;
            }
          `}} />
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
          <button
            onClick={() => setActiveTab('trusted-vendors')}
            className={`px-3 py-2 rounded-md cursor-pointer transition-all shrink-0 ${
              activeTab === 'trusted-vendors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Trusted Vendors ({trustedVendors.length})
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
      {activeTab === 'blogs' && (() => {
        // Compute dashboard metrics
        const totalBlogs = blogs.length;
        const publishedBlogs = blogs.filter(b => b.status === "Published" || !b.status).length;
        const draftBlogs = blogs.filter(b => b.status === "Draft").length;
        const scheduledBlogs = blogs.filter(b => b.status === "Scheduled").length;
        const aiGeneratedBlogs = blogs.filter(b => b.isAiGenerated).length;
        const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0) + (blogs.length * 142); // Realistic organic views baseline

        // Filter and Sort manuals
        const filteredBlogs = blogs.filter(b => {
          const titleContent = `${b.title} ${b.content}`.toLowerCase();
          const matchesSearch = titleContent.includes(blogSearchQuery.toLowerCase());
          const matchesCategory = blogCategoryFilter === "All" || b.category === blogCategoryFilter;
          const matchesStatus = blogStatusFilter === "All" || 
                                (blogStatusFilter === "Published" && (b.status === "Published" || !b.status)) ||
                                (b.status === blogStatusFilter);
          return matchesSearch && matchesCategory && matchesStatus;
        }).sort((a, b) => {
          if (blogSortBy === "Oldest") {
            return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          } else if (blogSortBy === "Most Viewed") {
            return (b.views || 0) - (a.views || 0);
          } else if (blogSortBy === "Most Liked") {
            return (b.likes || 0) - (a.likes || 0);
          } else {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          }
        });

        // Markdown visual renderer
        const renderMarkdownToHtml = (mdText: string) => {
          if (!mdText) return "<p class='text-slate-400 italic'>Write content to preview it here...</p>";
          let html = mdText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          html = html.replace(/^# (.*?)$/gm, '<h1 class="text-sm font-extrabold text-[#0066FF] border-b pb-1 mt-4 mb-1.5">$1</h1>');
          html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xs font-bold text-slate-800 mt-3 mb-1 border-l-4 border-[#0066FF] pl-2">$1</h2>');
          html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xs font-semibold text-slate-700 mt-2 mb-1">$1</h3>');
          html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
          html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc text-slate-600">$1</li>');
          html = html.replace(/\n\n/g, '</p><p class="text-slate-600 mb-2 leading-relaxed">');
          return '<p class="text-slate-600 mb-2 leading-relaxed">' + html + '</p>';
        };

        const handleGenerateAiBlog = async () => {
          if (!aiTopic) {
            safeAlert("Please provide a blog topic for Gemini.");
            return;
          }
          setIsGeneratingBlog(true);
          try {
            const res = await fetch("/api/gemini/generate-blog", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                topic: aiTopic,
                keywords: aiKeywords,
                targetAudience: aiAudience,
                industry: aiIndustry,
                tone: aiTone,
                language: aiLanguage,
                length: aiLength,
                seoKeyword: aiSeoKeyword,
                cta: aiCta
              })
            });
            if (res.ok) {
              const data = await res.json();
              setBlogForm({
                title: data.title || "",
                content: data.content || "",
                category: data.category || "CRM & Sales",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
                tagsText: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || "Sourcing, AI"),
                author: "BANTConfirm AI Writer",
                metaTitle: data.metaTitle || "",
                metaDescription: data.metaDescription || "",
                metaKeywords: Array.isArray(data.tags) ? data.tags.join(", ") : "",
                focusKeyword: aiSeoKeyword || aiTopic,
                schemaMarkup: data.schemaMarkup || "",
                slug: data.slug || "",
                status: "Draft",
                shortDescription: data.introduction || data.metaDescription || "",
                canonicalUrl: `https://bantconfirm.com/blogs/${data.slug}`,
                publishDate: new Date().toISOString().split('T')[0],
                isAiGenerated: true,
                views: 0
              });
              setShowBlogForm(true);
              setEditingBlogId(null);
              setShowAiBlogWriter(false);
              safeAlert("Sourcing manual generated! Review, polish, and publish using the form below.");
            } else {
              safeAlert("Failed to generate from AI. Falling back to local template.");
            }
          } catch (err) {
            console.error(err);
            safeAlert("AI generation failed.");
          } finally {
            setIsGeneratingBlog(false);
          }
        };

        const handleImproveBlog = async (action: string) => {
          if (!blogForm.content) {
            safeAlert("Content is empty.");
            return;
          }
          setIsImprovingContent(true);
          setAiImprovementOutput("");
          try {
            const res = await fetch("/api/gemini/improve-blog", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action,
                content: blogForm.content,
                title: blogForm.title,
                focusKeyword: blogForm.focusKeyword
              })
            });
            if (res.ok) {
              const data = await res.json();
              if (["improve", "rewrite", "expand", "shorten", "grammar", "seo", "faq"].includes(action)) {
                setBlogForm(prev => ({ ...prev, content: data.text }));
                setAutoSaveStatus("Polished with Gemini! 👍");
                setTimeout(() => setAutoSaveStatus(""), 3000);
              } else {
                setAiImprovementOutput(data.text);
                if (action === "meta_desc") {
                  setBlogForm(prev => ({ ...prev, metaDescription: data.text.substring(0, 155) }));
                }
              }
            } else {
              safeAlert("Polish action failed.");
            }
          } catch (err) {
            console.error(err);
            safeAlert("Polish error.");
          } finally {
            setIsImprovingContent(false);
          }
        };

        return (
          <div className="space-y-6">
            {/* 1. Header & Quick Toggles */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0066FF]" />
                  AI-Powered BANT Sourcing Manuals
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Draft, schedule, fine-tune, and publish high-converting SEO B2B Buyer Manuals instantly.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setShowAiBlogWriter(!showAiBlogWriter);
                    setShowBlogForm(false);
                  }}
                  className={`font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer border transition-colors ${
                    showAiBlogWriter 
                      ? 'bg-amber-50 border-amber-300 text-amber-700' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Gemini AI Blog Writer
                </button>
                <button
                  onClick={() => {
                    setShowBlogForm(!showBlogForm);
                    setShowAiBlogWriter(false);
                    setEditingBlogId(null);
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
                      schemaMarkup: "",
                      slug: "",
                      status: "Published",
                      shortDescription: "",
                      canonicalUrl: "",
                      publishDate: new Date().toISOString().split('T')[0],
                      isAiGenerated: false,
                      views: 0
                    });
                  }}
                  className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Manual Editor
                </button>
              </div>
            </div>

            {/* 2. Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { label: "Total Manuals", val: totalBlogs, bg: "bg-slate-50", text: "text-slate-800" },
                { label: "Published", val: publishedBlogs, bg: "bg-green-50/50", text: "text-green-700" },
                { label: "Drafts", val: draftBlogs, bg: "bg-amber-50/50", text: "text-amber-700" },
                { label: "Scheduled", val: scheduledBlogs, bg: "bg-blue-50/50", text: "text-blue-700" },
                { label: "AI Generated", val: aiGeneratedBlogs, bg: "bg-purple-50/50", text: "text-purple-700" },
                { label: "Organic Views", val: totalViews, bg: "bg-indigo-50/50", text: "text-indigo-700" }
              ].map((m, idx) => (
                <div key={idx} className={`${m.bg} p-3 rounded-xl border border-slate-100 flex flex-col justify-between shadow-xs`}>
                  <span className="text-[10px] text-slate-400 font-medium">{m.label}</span>
                  <span className={`text-base font-extrabold ${m.text} mt-1`}>{m.val}</span>
                </div>
              ))}
            </div>

            {/* 3. Filter Toolbar */}
            <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs items-center">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search manuals..."
                  value={blogSearchQuery}
                  onChange={(e) => setBlogSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0 font-medium">Category:</span>
                <select
                  value={blogCategoryFilter}
                  onChange={(e) => setBlogCategoryFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs"
                >
                  <option value="All">All Categories</option>
                  <option value="CRM & Sales">CRM & Sales</option>
                  <option value="B2B Strategy">B2B Strategy</option>
                  <option value="Cloud Telephony">Cloud Telephony</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0 font-medium">Status:</span>
                <select
                  value={blogStatusFilter}
                  onChange={(e) => setBlogStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Drafts</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 shrink-0 font-medium">Sort:</span>
                <select
                  value={blogSortBy}
                  onChange={(e) => setBlogSortBy(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs"
                >
                  <option value="Latest">Latest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Most Viewed">Most Viewed</option>
                  <option value="Most Liked">Most Liked</option>
                </select>
              </div>
            </div>

            {/* 4. AI Blog Writer Panel */}
            {showAiBlogWriter && (
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-4 rounded-xl text-white border border-slate-800 space-y-4 shadow-md text-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#FFDF00] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Gemini Enterprise Sourcing Manual Planner
                  </h4>
                  <p className="text-[10px] text-slate-300">Prompt BANTConfirm's AI Copywriting agent to write qualified articles on SMEs.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <label className="block text-slate-300 mb-1 font-semibold">Core Topic / Headline focus *</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="e.g. 5 Critical things to check before choosing Salesforce vs Odoo"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Keywords</label>
                    <input
                      type="text"
                      value={aiKeywords}
                      onChange={(e) => setAiKeywords(e.target.value)}
                      placeholder="CRM software, Odoo, SME"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Audience Focus</label>
                    <select
                      value={aiAudience}
                      onChange={(e) => setAiAudience(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option>SME Decision Makers</option>
                      <option>Enterprise IT Architects</option>
                      <option>Sourcing Officers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Tone of Voice</label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option>Professional</option>
                      <option>Technical & Analytical</option>
                      <option>Conversational & Direct</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Focus SEO Keyword</label>
                    <input
                      type="text"
                      value={aiSeoKeyword}
                      onChange={(e) => setAiSeoKeyword(e.target.value)}
                      placeholder="e.g. Salesforce vs Odoo"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-300 mb-1 font-semibold">Call to Action (CTA)</label>
                    <input
                      type="text"
                      value={aiCta}
                      onChange={(e) => setAiCta(e.target.value)}
                      placeholder="e.g. Request a pre-qualified Odoo quote from BANTConfirm partners"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAiBlogWriter(false)}
                    className="px-3.5 py-1.5 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateAiBlog}
                    disabled={isGeneratingBlog}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isGeneratingBlog ? (
                      <span className="inline-block animate-spin border-2 border-slate-950 border-t-transparent w-3 h-3 rounded-full"></span>
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    Generate with Gemini AI
                  </button>
                </div>
              </div>
            )}

            {/* 5. Manual & AI Editor Form */}
            {showBlogForm && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-4 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-700 text-xs flex items-center gap-1">
                    <FileText className="w-4 h-4 text-[#0066FF]" />
                    {editingBlogId ? "Edit Sourcing Manual" : "Draft New Sourcing Manual"}
                    {blogForm.isAiGenerated && (
                      <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ml-1">AI Generated</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    {autoSaveStatus && (
                      <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 animate-pulse">
                        {autoSaveStatus}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">Auto-saves drafts offline</span>
                  </div>
                </div>

                <form onSubmit={handleBlogSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="block text-slate-500 font-bold mb-1">Article Title *</label>
                      <input
                        type="text"
                        required
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Category Focus</label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded p-1.5"
                      >
                        <option>CRM & Sales</option>
                        <option>B2B Strategy</option>
                        <option>Cloud Telephony</option>
                        <option>Cyber Security</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 font-mono text-[11px]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-500 font-bold mb-1">Short Description *</label>
                      <input
                        type="text"
                        required
                        value={blogForm.shortDescription}
                        onChange={(e) => setBlogForm({...blogForm, shortDescription: e.target.value})}
                        placeholder="Snippet summarizing key points for search listings (approx. 100-140 characters)"
                        className="w-full bg-white border border-slate-200 rounded p-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={blogForm.tagsText}
                        onChange={(e) => setBlogForm({...blogForm, tagsText: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded p-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Author Name</label>
                      <input
                        type="text"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded p-1.5"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-500 font-bold mb-1">Header Image Cover (JPEG/PNG) *</label>
                      <div className="flex items-center gap-3 bg-white p-1 border rounded">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleBlogImageUpload}
                          className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#0066FF] cursor-pointer"
                        />
                        {blogForm.image && (
                          <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0">
                            <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Publish Status</label>
                      <select
                        value={blogForm.status}
                        onChange={(e) => setBlogForm({...blogForm, status: e.target.value as any})}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 font-bold text-slate-700"
                      >
                        <option value="Published">Published (Live)</option>
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Publish Date</label>
                      <input
                        type="date"
                        value={blogForm.publishDate}
                        onChange={(e) => setBlogForm({...blogForm, publishDate: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded p-1.5"
                      />
                    </div>
                  </div>

                  {/* Twin Panel Content & Visual Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-slate-700 font-bold">Manual Content Body (Markdown Supported)</label>
                      </div>

                      {/* AI Copier Tweaker Bar */}
                      <div className="flex flex-wrap gap-1 bg-blue-50/50 p-1.5 border border-blue-100 rounded-lg mb-2 items-center">
                        <span className="text-[9px] text-[#0066FF] font-extrabold uppercase mr-1 flex items-center gap-0.5 shrink-0">
                          <Sparkles className="w-3 h-3" />
                          Gemini Tweaks:
                        </span>
                        {[
                          { action: "improve", label: "Flow" },
                          { action: "rewrite", label: "Rewrite" },
                          { action: "expand", label: "Expand" },
                          { action: "shorten", label: "Shorten" },
                          { action: "grammar", label: "Grammar" },
                          { action: "seo", label: "SEO Optimize" },
                          { action: "faq", label: "Add FAQs" }
                        ].map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={isImprovingContent}
                            onClick={() => handleImproveBlog(btn.action)}
                            className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 hover:bg-blue-50 font-medium disabled:opacity-40"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={12}
                        required
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded p-2 font-mono text-[11px]"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-slate-700 font-bold mb-1">Live Visual Previewer</label>
                      <div className="flex-1 bg-white border border-slate-200 rounded p-3 overflow-y-auto max-h-[350px] shadow-inner text-left">
                        {blogForm.image && (
                          <div className="h-28 rounded-lg overflow-hidden mb-3">
                            <img src={blogForm.image} alt="Header Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <h1 className="text-sm font-extrabold text-slate-800 leading-tight mb-1">{blogForm.title || "Untitled Blog"}</h1>
                        <div className="flex gap-2 text-[10px] text-slate-400 mb-2 border-b pb-1">
                          <span>By {blogForm.author}</span>
                          <span>•</span>
                          <span>Category: {blogForm.category}</span>
                        </div>
                        <div 
                          className="prose text-slate-600 text-[11px] leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(blogForm.content) }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Copywriting Assets Generation Bar */}
                  <div className="bg-[#0066FF]/5 border border-[#0066FF]/10 p-3 rounded-xl space-y-2">
                    <span className="font-extrabold text-[#0066FF] text-[10px] uppercase block tracking-wide">Generate Marketing Assets with Gemini</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { action: "summary", label: "Executive Summary" },
                        { action: "social_caption", label: "Instagram Caption" },
                        { action: "linkedin", label: "LinkedIn Post" },
                        { action: "meta_desc", label: "Clickable Meta Description" }
                      ].map((asset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={isImprovingContent}
                          onClick={() => handleImproveBlog(asset.action)}
                          className="bg-white border border-blue-200 text-blue-700 font-bold text-[10px] px-2.5 py-1 rounded hover:bg-blue-50/50 disabled:opacity-50 shrink-0"
                        >
                          {asset.label}
                        </button>
                      ))}
                    </div>

                    {isImprovingContent && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 py-1.5">
                        <span className="inline-block animate-spin border-2 border-blue-600 border-t-transparent w-3 h-3 rounded-full"></span>
                        Gemini is brainstorming. Please wait...
                      </div>
                    )}

                    {aiImprovementOutput && (
                      <div className="bg-white border border-slate-200 p-2.5 rounded-lg text-left mt-2 shadow-xs">
                        <div className="flex justify-between items-center border-b pb-1 mb-1 text-[9px] font-extrabold text-[#0066FF] uppercase">
                          <span>Brainstormed Asset Output</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(aiImprovementOutput);
                              setAutoSaveStatus("Copied to Clipboard! 📋");
                              setTimeout(() => setAutoSaveStatus(""), 3000);
                            }}
                            className="bg-[#0066FF] text-white px-2 py-0.5 rounded text-[8px] cursor-pointer"
                          >
                            Copy Output
                          </button>
                        </div>
                        <pre className="font-sans text-[10px] text-slate-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                          {aiImprovementOutput}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Technical SEO Accordion Section */}
                  <div className="border-t border-slate-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowSeoAccordion(!showSeoAccordion)}
                      className="flex items-center justify-between w-full bg-slate-100 hover:bg-slate-200/80 p-2 rounded-lg font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1">🔍 Technical SEO, Canonical Tags & JSON-LD Structured Data</span>
                      <span className="text-xs">{showSeoAccordion ? "Collapse ▲" : "Expand ▼"}</span>
                    </button>

                    {showSeoAccordion && (
                      <div className="mt-3 space-y-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs text-left">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Focus Keyword</label>
                            <input
                              type="text"
                              value={blogForm.focusKeyword}
                              onChange={(e) => setBlogForm({...blogForm, focusKeyword: e.target.value})}
                              placeholder="e.g. ERP Sourcing"
                              className="w-full bg-white border border-slate-200 rounded p-1.5"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Canonical URL</label>
                            <input
                              type="text"
                              value={blogForm.canonicalUrl}
                              onChange={(e) => setBlogForm({...blogForm, canonicalUrl: e.target.value})}
                              placeholder="e.g. https://bantconfirm.com/blogs/erp-sourcing"
                              className="w-full bg-white border border-slate-200 rounded p-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1">SEO Title Tag (Meta Title)</label>
                          <input
                            type="text"
                            value={blogForm.metaTitle}
                            onChange={(e) => setBlogForm({...blogForm, metaTitle: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded p-1.5"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1">SEO Meta Description Tag</label>
                          <textarea
                            rows={2}
                            value={blogForm.metaDescription}
                            onChange={(e) => setBlogForm({...blogForm, metaDescription: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded p-1.5"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1">JSON-LD Structured Schema Markup</label>
                          <textarea
                            rows={4}
                            value={blogForm.schemaMarkup}
                            onChange={(e) => setBlogForm({...blogForm, schemaMarkup: e.target.value})}
                            placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "..."\n}`}
                            className="w-full bg-white border border-slate-200 rounded p-1.5 font-mono text-[10px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 border-t pt-3 border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBlogForm(false);
                        setEditingBlogId(null);
                      }}
                      className="px-3.5 py-1.5 border border-slate-300 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 bg-[#0066FF] text-white font-extrabold rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      {editingBlogId ? "Save Changes" : "Publish Sourcing Manual"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 6. Directory listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBlogs.length === 0 ? (
                <div className="col-span-2 text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs font-bold">No sourcing manuals found matching criteria.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Try resetting filters or prompt the AI above to draft a fresh manual.</p>
                </div>
              ) : (
                filteredBlogs.map((b) => (
                  <div key={b.id} className="border border-slate-200/80 rounded-xl bg-white p-4 flex flex-col justify-between hover:shadow-xs transition-shadow">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded font-extrabold uppercase">{b.category}</span>
                          
                          {/* Status Badge */}
                          {(!b.status || b.status === "Published") && (
                            <span className="bg-green-50 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-green-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Live
                            </span>
                          )}
                          {b.status === "Draft" && (
                            <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Draft
                            </span>
                          )}
                          {b.status === "Scheduled" && (
                            <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              Scheduled
                            </span>
                          )}

                          {b.isAiGenerated && (
                            <span className="bg-purple-50 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-purple-100">
                              <Sparkles className="w-2.5 h-2.5 text-purple-500" />
                              AI Crafted
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              // Open editing form and populate
                              setEditingBlogId(b.id);
                              setBlogForm({
                                title: b.title,
                                content: b.content,
                                category: b.category,
                                image: b.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
                                tagsText: Array.isArray(b.tags) ? b.tags.join(", ") : "",
                                author: b.author || "BANTConfirm Editorial",
                                metaTitle: b.metaTitle || "",
                                metaDescription: b.metaDescription || "",
                                metaKeywords: b.metaKeywords || "",
                                focusKeyword: b.focusKeyword || "",
                                schemaMarkup: b.schemaMarkup || "",
                                slug: b.slug || "",
                                status: b.status || "Published",
                                shortDescription: b.shortDescription || b.excerpt || "",
                                canonicalUrl: b.canonicalUrl || "",
                                publishDate: b.publishDate ? b.publishDate.split('T')[0] : new Date().toISOString().split('T')[0],
                                isAiGenerated: b.isAiGenerated || false,
                                views: b.views || 0
                              });
                              setShowBlogForm(true);
                              setShowAiBlogWriter(false);
                            }}
                            className="p-1 border rounded hover:bg-slate-50 text-slate-500 hover:text-slate-700 cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteBlog(b.id)}
                            className="p-1 border rounded hover:bg-rose-50 text-rose-500 hover:text-rose-700 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-800 leading-tight line-clamp-1">{b.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{b.shortDescription || b.content.replace(/[#*]/g, "")}</p>
                    </div>

                    <div className="border-t border-slate-100/80 pt-2.5 mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex gap-2">
                        <span>👁️ {b.views || 0} views</span>
                        <span>❤️ {b.likes || 0} likes</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        {(!b.status || b.status === "Published") ? (
                          <button
                            onClick={() => {
                              if (onUpdateBlog) {
                                onUpdateBlog(b.id, { ...b, status: "Draft" });
                              }
                            }}
                            className="text-slate-500 font-bold hover:underline"
                          >
                            Revert to draft
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (onUpdateBlog) {
                                onUpdateBlog(b.id, { ...b, status: "Published" });
                              }
                            }}
                            className="text-[#0066FF] font-bold hover:underline"
                          >
                            Publish instantly
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}

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

      {/* 9. TRUSTED VENDORS MANAGEMENT TAB */}
      {activeTab === 'trusted-vendors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-800">Trusted Vendors Showcase Management</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Add, edit, and organize system integrator and OEM logos displayed in the orbital carousel on ClientConfirm.com homepage.
              </p>
            </div>
            <button
              onClick={handleOpenAddTv}
              className="bg-[#0066FF] hover:bg-[#0055DD] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Vendor Logo
            </button>
          </div>

          {/* Form Modal / Panel */}
          {showTvForm && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl mx-auto transition-all animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                <h4 className="font-bold text-sm text-slate-800">
                  {editingTv ? "Edit Trusted Vendor Logo" : "Add New Trusted Vendor Logo"}
                </h4>
                <button
                  onClick={() => setShowTvForm(false)}
                  className="text-slate-400 hover:text-slate-600 font-black text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveTv} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block uppercase text-[10px] tracking-wider text-slate-500">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco Systems, Microsoft BANT Partner"
                    value={tvForm.vendor_name}
                    onChange={(e) => setTvForm({ ...tvForm, vendor_name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase text-[10px] tracking-wider text-slate-500">Logo Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/logo.png"
                    value={tvForm.logo_url}
                    onChange={(e) => setTvForm({ ...tvForm, logo_url: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase text-[10px] tracking-wider text-slate-500">Upload Logo File (JPEG, PNG)</label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingTvLogo(true);
                    }}
                    onDragLeave={() => setIsDraggingTvLogo(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingTvLogo(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleTvLogoProcess(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => {
                      document.getElementById("tv-logo-file-input")?.click();
                    }}
                    className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[42px] ${
                      isDraggingTvLogo 
                        ? "border-[#0066FF] bg-blue-50/40" 
                        : "border-slate-200 bg-white hover:border-[#0066FF]/60 hover:bg-slate-50/50"
                    }`}
                  >
                    <input 
                      type="file"
                      id="tv-logo-file-input"
                      accept="image/jpeg, image/png, image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleTvLogoProcess(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <UploadCloud className={`w-4 h-4 transition-colors ${isDraggingTvLogo ? "text-[#0066FF]" : "text-slate-400"}`} />
                      <p className="font-bold text-slate-700 text-[10px]">
                        {isDraggingTvLogo ? "Drop it!" : "Drag & drop file or browse"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase text-[10px] tracking-wider text-slate-500">Logo Live Preview</label>
                  <div className="h-[42px] flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3">
                    {tvForm.logo_url ? (
                      <img
                        src={tvForm.logo_url}
                        alt="Preview"
                        className="h-7 w-auto object-contain max-w-[120px]"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/120x40/f1f5f9/94a3b8?text=Broken+Link";
                        }}
                      />
                    ) : (
                      <span className="text-[11px] text-slate-400">Waiting for logo url...</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase text-[10px] tracking-wider text-slate-500">Website URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://www.cisco.com"
                    value={tvForm.website_url}
                    onChange={(e) => setTvForm({ ...tvForm, website_url: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block uppercase text-[10px] tracking-wider text-slate-500">Display Order</label>
                    <input
                      type="number"
                      min={0}
                      value={tvForm.display_order}
                      onChange={(e) => setTvForm({ ...tvForm, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block uppercase text-[10px] tracking-wider text-slate-500">Status</label>
                    <select
                      value={tvForm.is_active ? "true" : "false"}
                      onChange={(e) => setTvForm({ ...tvForm, is_active: e.target.value === "true" })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-[#0066FF]"
                    >
                      <option value="true">Active (Showcase on Home)</option>
                      <option value="false">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t mt-2">
                  <button
                    type="button"
                    onClick={() => setShowTvForm(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-5 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0066FF] hover:bg-[#0055DD] text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4" /> Save Vendor Config
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white border rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Verified Logos Directory ({trustedVendors.length})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase border-b">
                    <th className="p-4 font-bold">Logo</th>
                    <th className="p-4 font-bold">Vendor Name</th>
                    <th className="p-4 font-bold">Website Destination</th>
                    <th className="p-4 font-bold text-center">Display Order</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingTv ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        <span className="animate-pulse">Loading verified vendor showcase directory...</span>
                      </td>
                    </tr>
                  ) : trustedVendors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No trusted vendors currently defined. Click "Add Vendor Logo" to bootstrap the directory.
                      </td>
                    </tr>
                  ) : (
                    trustedVendors.map((tv) => (
                      <tr key={tv.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4">
                          <div className="w-20 h-10 bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center justify-center">
                            <img
                              src={tv.logo_url}
                              alt={tv.vendor_name}
                              className="max-h-full max-w-full object-contain filter"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/120x40/f1f5f9/94a3b8?text=No+Logo";
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800 text-sm">{tv.vendor_name}</p>
                          <p className="text-[9px] text-slate-400 font-mono select-all mt-0.5">TV_ID: {tv.id}</p>
                        </td>
                        <td className="p-4">
                          {tv.website_url ? (
                            <a
                              href={tv.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>{tv.website_url}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">None provided</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono font-bold border">
                            {tv.display_order}
                          </span>
                        </td>
                        <td className="p-4">
                          {tv.is_active !== false ? (
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                              Active (In Loop)
                            </span>
                          ) : (
                            <span className="bg-slate-50 text-slate-400 text-[10px] px-2.5 py-1 rounded-full border">
                              Inactive (Hidden)
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditTv(tv)}
                            className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteTv(tv.id)}
                            className="text-rose-600 hover:text-rose-900 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
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
      )}

    </div>
  );
}
