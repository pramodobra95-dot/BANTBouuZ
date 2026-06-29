import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Shield, Layers, Users, Star, ArrowRight, Phone, MessageSquare, 
  ChevronLeft, ChevronRight, FileText, Download, Play, CheckCircle, 
  HelpCircle, Calendar, Award, CheckSquare, Zap, ExternalLink, Heart,
  User, MapPin, Sparkles, Globe, TrendingUp, Gauge, Eye, BookOpen, ThumbsUp, Code, Copy,
  Info, Settings
} from "lucide-react";
import { Category, Product, Vendor, Blog, Banner, Testimonial, TrustedVendor } from "../types";
import { safeAlert } from "../utils/safeAlert";

interface HomeViewProps {
  currentUser: any;
  onPostLead: (leadData: any) => void;
  categories: Category[];
  products: Product[];
  vendors: Vendor[];
  trustedVendors?: TrustedVendor[];
  blogs: Blog[];
  banners: Banner[];
  testimonials: Testimonial[];
  onNavigateToPostRequirement: (prefilledCategory?: string) => void;
  onNavigateToTab: (tab: string) => void;
  onAddToWishlist: (productId: string) => void;
  wishlist: string[];
  onLikeBlog?: (blogId: string) => void;
}

const LOCAL_FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Arun Alagappan",
    company: "Metro Retailers",
    role: "VP Information Technology",
    rating: 5,
    feedback: "We needed to procure an ERP solution for our 12 outlets. We posted our BANT requirement on BANTConfirm and within 48 hours, we were put in touch with three gold-verified Odoo implementation partners. Outstanding experience!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "test-2",
    name: "Meenakshi Iyer",
    company: "Zeta Healthcare",
    role: "Chief Operating Officer",
    rating: 5,
    feedback: "The BANT qualification on this platform is a game changer. We received exact technical matches matching our budget constraints without having to filter 100s of cold spam sales calls.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "test-3",
    name: "Karan Malhotra",
    company: "Vanguard Logistics",
    role: "Sourcing Director",
    rating: 5,
    feedback: "Procured custom fleet tracking SaaS with automated billing. The BANT verification of budget and timeline kept proposals targeted and saved us 3 months of negotiation.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "test-4",
    name: "Ananya Sen",
    company: "Apex Edutech",
    role: "Head of Procurement",
    rating: 5,
    feedback: "Finding Cloud Telephony with custom IVR was painless. BANTConfirm's matchmaker filtered out low-tier brokers and linked us directly with certified telecom vendors.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "test-5",
    name: "Vikram Malhotra",
    company: "TechNova Solutions",
    role: "VP of Infrastructure",
    rating: 5,
    feedback: "Sourced unified endpoint cybersecurity for 800+ nodes. BANTConfirm confirmed our technical authority layer before introducing partners, ensuring extreme precision.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"
  }
];

export default function HomeView({
  currentUser,
  onPostLead,
  categories,
  products,
  vendors,
  trustedVendors = [],
  blogs,
  banners,
  testimonials,
  onNavigateToPostRequirement,
  onNavigateToTab,
  onAddToWishlist,
  wishlist,
  onLikeBlog
}: HomeViewProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Custom BANT modal for directly clicking "Get Free Quote"
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<Product | null>(null);
  const [bantForm, setBantForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.mobile || "",
    company: currentUser?.companyName || "",
    city: currentUser?.city || "",
    bantBudget: "Budget signed off and approved by senior management",
    bantAuthority: "I am the direct decision maker / evaluating CIO",
    bantNeed: "Need sandbox environment and automated pricing review",
    timeline: "Immediate (Within 15 Days)",
    bantTimeline: "Need sandbox environment in 7 days, complete migration in 30 days"
  });
  const [bantSubmitSuccess, setBantSubmitSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setBantForm(prev => ({
        ...prev,
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.mobile || "",
        company: currentUser.companyName || "",
        city: currentUser.city || "",
      }));
    }
  }, [currentUser]);

  const handleBantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteProduct) return;

    const leadData = {
      title: `Quote Request for ${selectedQuoteProduct.name}`,
      category: selectedQuoteProduct.category || "General Software",
      description: `User requested a customized quote for ${selectedQuoteProduct.name}. Description: ${selectedQuoteProduct.description}`,
      budget: selectedQuoteProduct.pricing || "₹25,000 - ₹50,000 / month",
      companyName: bantForm.company || (currentUser?.companyName || "Personal Demo"),
      contactName: bantForm.name || (currentUser?.name || "Anonymous Sourcing User"),
      mobile: bantForm.phone || (currentUser?.mobile || ""),
      email: bantForm.email || (currentUser?.email || ""),
      city: bantForm.city || (currentUser?.city || ""),
      timeline: bantForm.timeline,
      bantBudget: bantForm.bantBudget,
      bantAuthority: bantForm.bantAuthority,
      bantNeed: bantForm.bantNeed,
      bantTimeline: bantForm.bantTimeline
    };

    onPostLead(leadData);
    setBantSubmitSuccess(true);
    setTimeout(() => {
      setBantSubmitSuccess(false);
      setSelectedQuoteProduct(null);
    }, 3000);
  };

  // Active banner slider index
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Active testimonial index
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Selected product detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'seo' | 'faqs'>('overview');
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [schemaCopied, setSchemaCopied] = useState(false);
  const [quoteRequestSent, setQuoteRequestSent] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    qty: "10-50 users",
    notes: ""
  });

  // Category list filter
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Dynamic rotating hero headlines (up to 3 times text reflect, changing every 5 seconds)
  const heroHeadlines = [
    {
      prefix: "BANTConfirm",
      highlight: "AI-Powered",
      suffix: "B2B Marketplace for Software, IT Hardware & Services"
    },
    {
      prefix: "BANTConfirm",
      highlight: "Pre-Qualified",
      suffix: "B2B Sourcing with Budget, Authority, Need & Timeline"
    },
    {
      prefix: "BANTConfirm",
      highlight: "Verified Vendors",
      suffix: "and Pre-Screened Digital Solutions Hub"
    }
  ];

  const [heroTextIdx, setHeroTextIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroTextIdx((prev) => (prev + 1) % heroHeadlines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const testimonialScrollRef = React.useRef<HTMLDivElement>(null);
  
  const handleTestimonialScroll = (direction: "left" | "right") => {
    if (testimonialScrollRef.current) {
      const scrollAmount = 350;
      testimonialScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Auto-scroll banner every 5 seconds
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % (banners?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  // Handle Search input with auto-suggestions
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions: string[] = [];
    const lowerVal = val.toLowerCase();

    // Suggest matching categories
    categories.forEach(c => {
      if (c.name.toLowerCase().includes(lowerVal) && !filteredSuggestions.includes(c.name)) {
        filteredSuggestions.push(c.name);
      }
    });

    // Suggest matching products
    products.forEach(p => {
      if (p.name.toLowerCase().includes(lowerVal) && !filteredSuggestions.includes(p.name)) {
        filteredSuggestions.push(p.name);
      }
    });

    // Suggest matching vendors
    vendors.forEach(v => {
      if (v.companyName.toLowerCase().includes(lowerVal) && !filteredSuggestions.includes(v.companyName)) {
        filteredSuggestions.push(v.companyName);
      }
    });

    setSuggestions(filteredSuggestions.slice(0, 5));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (s: string) => {
    setSearchQuery(s);
    setShowSuggestions(false);
  };

  // Filter products based on search and selected category
  const filteredProducts = products.filter(p => {
    if (!p.approved) return false;
    
    // Category filter
    if (selectedCategory && p.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchVendor = p.vendorName.toLowerCase().includes(q);
      return matchName || matchDesc || matchCat || matchVendor;
    }

    return true;
  });

  const handleOpenProduct = (p: Product) => {
    setSelectedProduct(p);
    setModalTab('overview');
    setSeoTitle(`${p.name} Sourcing Quote & Pricing - BANTConfirm`);
    setSeoDesc(`Compare verified features, customer reviews, and direct vendor pricing for ${p.name}. Sourced by verified Gold Partner ${p.vendorName}.`);
    setSeoKeywords(`${p.name}, ${p.category} software, ${p.vendorName} price, BANT quotes`);
    setQuoteRequestSent(false);
    setQuoteForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.mobile || "",
      qty: "20-100 users / endpoints",
      notes: ""
    });
    // Increment product view
    fetch(`/api/products/${p.id}/view`, { method: "POST" })
      .catch(err => console.error("Failed to increment views", err));
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteRequestSent(true);
    setTimeout(() => {
      setSelectedProduct(null);
      onNavigateToTab("dashboard");
    }, 2000);
  };

  const getSeoScore = () => {
    let score = 10; // baseline
    if (seoTitle.length >= 50 && seoTitle.length <= 70) score += 30;
    else if (seoTitle.length > 0) score += 15;

    if (seoDesc.length >= 120 && seoDesc.length <= 160) score += 30;
    else if (seoDesc.length > 0) score += 15;

    if (selectedProduct) {
      const pName = selectedProduct.name.toLowerCase();
      if (seoTitle.toLowerCase().includes(pName) || seoDesc.toLowerCase().includes(pName)) {
        score += 20;
      }
    }

    if (seoKeywords.trim().split(/,\s*/).filter(Boolean).length >= 3) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  // Category definitions for displaying grid (matches prompt category list)
  const fullCategoriesList = categories && categories.length > 0 
    ? categories.map(cat => ({
        name: cat.name,
        icon: cat.icon || "Layers",
        count: `${cat.productsCount || 0} solutions`
      }))
    : [
        { name: "CRM Software", icon: "Users", count: "3 solutions" },
        { name: "ERP Software", icon: "Layers", count: "2 solutions" },
        { name: "Accounting Software", icon: "Calculator", count: "2 solutions" },
        { name: "WhatsApp Business API", icon: "MessageSquare", count: "2 solutions" },
        { name: "Cloud Telephony", icon: "PhoneCall", count: "2 solutions" },
        { name: "Contact Center", icon: "Headphones", count: "1 solution" },
        { name: "Microsoft 365", icon: "FileText", count: "1 solution" },
        { name: "Google Workspace", icon: "Mail", count: "1 solution" },
        { name: "AWS Services", icon: "Cloud", count: "1 solution" },
        { name: "Azure Services", icon: "Server", count: "1 solution" },
        { name: "Cyber Security", icon: "ShieldAlert", count: "2 solutions" },
        { name: "Data Backup", icon: "HardDrive", count: "1 solution" },
        { name: "AI Solutions", icon: "Brain", count: "1 solution" },
        { name: "E-Commerce Solutions", icon: "ShoppingBag", count: "2 solutions" },
        { name: "Website Development", icon: "Globe", count: "4 providers" },
        { name: "Mobile App Development", icon: "Smartphone", count: "3 providers" },
        { name: "Digital Marketing", icon: "TrendingUp", count: "5 agencies" },
        { name: "Hardware & Networking", icon: "Cpu", count: "3 vendors" }
      ];

  const filteredCategories = fullCategoriesList.filter(c => 
    c.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      
      {/* 1. TOP ANNOUNCEMENT BANNER FROM UPLOADED IMAGE */}
      <div className="bg-[#1E1B4B] text-white py-3 px-6 text-xs text-center font-semibold select-none flex items-center justify-center gap-2 border-b border-indigo-900/40 shadow-inner">
        <span>📢</span>
        <span>🚀</span>
        <span className="tracking-wide">India's #1 Marketplace for MSME IT Solutions.</span>
      </div>

      {/* 2. MODERN GLOWING HERO SECTION */}
      <div className="relative bg-gradient-to-tr from-blue-50 via-white to-amber-50 py-16 md:py-24 border-b border-slate-100 overflow-hidden text-center">
        {/* Soft glowing ambient gradients mimicking modern SaaS UI from screenshot */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-200/40 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-yellow-100/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] bg-purple-100/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">
          
          {/* Pills Chip */}
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs font-extrabold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            AI-Driven B2B Procurement
          </div>

          {/* Main Large Display Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight md:leading-none max-w-5xl mb-6 min-h-[140px] md:min-h-[180px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={heroTextIdx}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="block"
              >
                {heroHeadlines[heroTextIdx].prefix} – India’s{" "}
                <span className="text-[#0066FF] relative inline-block">
                  {heroHeadlines[heroTextIdx].highlight}
                </span>{" "}
                {heroHeadlines[heroTextIdx].suffix}
              </motion.span>
            </AnimatePresence>
          </h1>

          {/* Subtext description */}
          <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed mb-10">
            Find the Right Software, IT Hardware & Business Solutions in India. Verified vendors, transparent pricing, and AI-qualified requirements.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => {
                const el = document.getElementById("search-solutions-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#0066FF] hover:bg-blue-700 text-white text-sm font-extrabold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Explore Solutions
            </button>
            <button 
              onClick={() => onNavigateToPostRequirement()}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-extrabold px-8 py-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Post My Requirement
            </button>
          </div>

        </div>
      </div>

      {/* 2. SEARCH ENGINE & SOLUTION BROWSER SECTION */}
      <div id="search-solutions-section" className="max-w-7xl mx-auto px-6 -mt-8 relative z-30">
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-xl border border-slate-100 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by Product Name, Category, Vendor (e.g. CRM, Odoo, SaaSify, AWS)..."
                className="w-full bg-slate-50 text-slate-800 pl-11 pr-4 py-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
              
              {/* Autocomplete suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-slate-100">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 text-xs text-slate-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors shrink-0"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin text-xs">
            <span className="text-slate-400 font-bold shrink-0">Popular tags:</span>
            {((categories && categories.length > 0)
              ? categories.slice(0, 6).map(c => c.name)
              : ["CRM Software", "ERP Software", "Cloud Telephony", "Cyber Security", "WhatsApp Business API"]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-full font-semibold border transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat 
                    ? "bg-[#0066FF] border-[#0066FF] text-white" 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
          {/* 3. PRODUCT CATEGORIES (CARDS) */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Comprehensive Sourcing Hub</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">Explore Sourcing Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Select an IT niche to view qualified vendors and solutions instantly</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search 25+ categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
              />
            </div>
            
            {/* Scroll indicators and buttons */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => handleScroll("left")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition shadow-xs hover:shadow active:scale-95 cursor-pointer"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition shadow-xs hover:shadow active:scale-95 cursor-pointer"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Subtle scroll shading gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10 hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10 hidden md:block" />

          <div 
            ref={scrollRef}
            className="flex items-stretch gap-4 overflow-x-auto py-3 px-1 snap-x scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3), ease: "easeOut" }}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.name ? null : cat.name);
                  const el = document.getElementById("featured-products-catalog");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-2.5 group shrink-0 w-36 sm:w-40 md:w-44 snap-start ${
                  selectedCategory === cat.name 
                    ? "bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md" 
                    : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-[#0066FF] text-white"
                    : "bg-blue-50 text-blue-600 group-hover:bg-[#0066FF] group-hover:text-white"
                }`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-bold text-xs transition-colors line-clamp-1 ${
                    selectedCategory === cat.name ? "text-[#0066FF]" : "text-slate-800 group-hover:text-[#0066FF]"
                  }`}>{cat.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </motion.div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="w-full py-10 text-center text-xs text-slate-400">
                No matching categories found. Try searching 'CRM' or 'Cloud'
              </div>
            )}
          </div>
        </div>
      </div>    </div>

      {/* 4. FEATURED PRODUCTS (ECOMMERCE STYLE CARDS) */}
      <div id="featured-products-catalog" className="max-w-7xl mx-auto px-6 py-8">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-yellow-500 font-bold text-xs uppercase tracking-wider">Premium Featured Software</span>
              <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1">
                {selectedCategory ? `${selectedCategory} Solutions` : "Top Verified Solutions"}
              </h3>
            </div>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-[#0066FF] font-bold hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group relative"
            >
              {p.isFeatured && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm z-10 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" />
                  Premium Sponsored
                </span>
              )}

              {/* Product Image */}
              <div className="h-44 bg-slate-100 overflow-hidden relative">
                <img 
                  src={p.images[0] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop"} 
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded">
                  {p.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#0066FF] font-bold uppercase tracking-wider">Verified Solution Provider</span>
                    <div className="flex items-center text-xs text-yellow-500 font-bold gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      <span>{p.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 mt-1 line-clamp-1 group-hover:text-[#0066FF] transition-colors">{p.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Pricing</p>
                  <p className="text-xs font-black text-slate-800">{p.pricing}</p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-600 truncate max-w-[150px]">By: {p.vendorName}</span>
                  <span className="font-mono text-[10px]">{p.views || 0} Views</span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleOpenProduct(p)}
                    className="border border-slate-200 hover:border-[#0066FF] hover:text-[#0066FF] text-slate-700 font-semibold py-2 rounded-lg text-xs transition-all cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQuoteProduct(p);
                    }}
                    className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-all cursor-pointer shadow-xs text-center"
                  >
                    Get Free Quote
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white border border-dashed border-slate-200 rounded-xl space-y-2">
              <p className="text-xs text-slate-400">No solutions listed for this search filter or category currently.</p>
              <button 
                onClick={() => onNavigateToPostRequirement()}
                className="text-xs text-[#0066FF] font-bold hover:underline"
              >
                Post a Sourcing Request to Alert Vendors &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. FEATURED VENDORS (AUTO SCROLLING LOGO AND INFO CARDS) */}
      <div className="bg-white border-y border-slate-200 py-12 my-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-1 mb-8">
            <span className="text-[#0066FF] font-bold text-xs uppercase tracking-wider">Verified Partnership Alliance</span>
            <h3 className="text-lg md:text-xl font-black text-slate-900">Featured Platform System Integrators</h3>
            <p className="text-xs text-slate-500">Gold and Enterprise plans verified with strict GST and corporate document registry audits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {vendors.filter(v => v.approved).map((vendor) => (
              <div 
                key={vendor.id} 
                className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3.5 relative"
              >
                {vendor.plan === 'Enterprise' && (
                  <span className="absolute top-3 right-3 bg-blue-100 text-[#0066FF] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                    Enterprise
                  </span>
                )}
                <div className="flex items-center space-x-3">
                  <img 
                    src={vendor.logo} 
                    alt={vendor.companyName} 
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{vendor.companyName}</h4>
                    <p className="text-[10px] text-slate-400">{vendor.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 border-t border-slate-100 pt-3">
                  <div>
                    <p className="font-bold">Plan Profile</p>
                    <p className="text-slate-800 font-semibold">{vendor.plan} Tier</p>
                  </div>
                  <div>
                    <p className="font-bold">Catalog Size</p>
                    <p className="text-slate-800 font-semibold">{vendor.productsCount || 0} Products</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1">
                  <div className="flex items-center text-yellow-500 font-semibold gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    <span>{vendor.rating} / 5</span>
                  </div>
                  {vendor.docVerified && (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                      Docs Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. WHY CHOOSE BANTCONFIRM (ICONS SECTION) */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#0066FF] rounded-2xl p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,#ffffff,transparent_60%)]"></div>
          
          <div className="relative z-10 max-w-3xl space-y-2 mb-8">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider">Enterprise Framework Sourcing</span>
            <h3 className="text-xl md:text-3xl font-black">Why Sourcing Teams Choose BANTConfirm</h3>
            <p className="text-xs text-blue-100 max-w-lg">
              Sourcing corporate software requires verified parameters. We remove the clutter of cold calls by aligning and vetting key metrics immediately.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-slate-950 font-black text-sm shadow">1</div>
              <h4 className="font-bold text-sm text-white">BANT Qualified Criteria</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Every buyer requirement outlines dynamic Budget limits, Decision Maker Authority, Core Need analysis, and Target Deployment Timelines.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-slate-950 font-black text-sm shadow">2</div>
              <h4 className="font-bold text-sm text-white">Zero Vendor Spam</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Contact information is never sold to arbitrary directories. Only up to 3 vetted, audited software providers get access to propose.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-slate-950 font-black text-sm shadow">3</div>
              <h4 className="font-bold text-sm text-white">Verified GST Document Registry</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                System integrators register with corporate PAN, GST registry credentials, and previous client deployment catalogs verified manually by BANTConfirm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TRUSTED VENDORS LOGO SHOWCASE */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes orbit-rotate-clockwise {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes orbit-counter-clockwise {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.1); }
          }
          @keyframes float-ambient {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(1deg); }
          }
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-orbit-galaxy {
            animation: orbit-rotate-clockwise 55s linear infinite;
          }
          .animate-counter-orbit-galaxy {
            animation: orbit-counter-clockwise 55s linear infinite;
          }
          .animate-glow-pulse {
            animation: glow-pulse 8s ease-in-out infinite;
          }
          .animate-float-ambient-1 {
            animation: float-ambient 6s ease-in-out infinite;
          }
          .animate-float-ambient-2 {
            animation: float-ambient 8s ease-in-out infinite 1s;
          }
          .animate-ticker {
            animation: ticker-scroll 35s linear infinite;
          }
          .animation-paused-all, .animation-paused-all * {
            animation-play-state: paused !important;
          }
          .ticker-container:hover .animate-ticker {
            animation-play-state: paused !important;
          }
        `}} />

        <div className="bg-gradient-to-br from-[#0c1e4d] via-[#102d73] to-[#040e26] rounded-3xl p-6 md:p-12 border border-slate-700/50 shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col justify-between">
          {/* Animated Background Glow Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-glow-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl animate-glow-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl animate-glow-pulse" style={{ animationDelay: "4s" }}></div>

          {/* Heading */}
          <div className="text-center z-10 max-w-2xl mx-auto space-y-3 relative mb-6">
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider block animate-pulse">
              Verified Enterprise Sourcing
            </span>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Trusted by Leading Technology Partners
            </h3>
            <p className="text-xs md:text-sm text-slate-300">
              Trusted enterprise vendors delivering secure, scalable, and reliable business solutions.
            </p>
          </div>

          {/* DESKTOP/TABLET ORBITAL GALAXY VIEW (lg:block) */}
          <div className="hidden lg:block relative w-full h-[360px] my-4 overflow-visible">
            {/* Center Focus Text with subtle styling */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 w-[240px] pointer-events-none p-4 rounded-full bg-[#102d73]/40 backdrop-blur-md border border-white/5 shadow-inner">
              <span className="text-yellow-400 font-black text-sm block">BANTConfirm</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mt-0.5 block">Verified Network</span>
            </div>

            {/* Orbit Container with state controlled play-state */}
            <div 
              className={`absolute inset-0 w-full h-full animate-orbit-galaxy overflow-visible ${
                trustedVendors.length > 0 ? "" : "pointer-events-none"
              } ${isOrbitPaused ? "animation-paused-all" : ""}`}
              onMouseEnter={() => setIsOrbitPaused(true)}
              onMouseLeave={() => setIsOrbitPaused(false)}
            >
              {trustedVendors.map((vendor, idx) => {
                const total = trustedVendors.length;
                const angle = (2 * Math.PI * idx) / total;
                const rx = 440; // Horizontal orbit radius
                const ry = 140; // Vertical orbit radius
                const x = Math.cos(angle) * rx;
                const y = Math.sin(angle) * ry;

                return (
                  <div
                    key={vendor.id}
                    className="absolute overflow-visible"
                    style={{
                      left: `calc(50% + ${x}px - 48px)`,
                      top: `calc(50% + ${y}px - 48px)`,
                      width: "96px",
                      height: "96px",
                    }}
                  >
                    {/* Counter-rotating element to keep logo upright */}
                    <div className="w-full h-full animate-counter-orbit-galaxy overflow-visible">
                      <motion.div
                        className="relative group w-full h-full flex items-center justify-center bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-yellow-400/50 rounded-2xl p-3 shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer pointer-events-auto"
                        whileHover={{ scale: 1.22, y: -4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <a 
                          href={vendor.website_url || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full h-full flex items-center justify-center"
                        >
                          <img
                            src={vendor.logo_url}
                            alt={`${vendor.vendor_name} Logo`}
                            loading="lazy"
                            className="max-w-full max-h-full object-contain filter brightness-100 hover:brightness-110 drop-shadow-md transition-all"
                          />
                        </a>

                        {/* Beautiful Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5">
                          <span>{vendor.vendor_name}</span>
                          {vendor.website_url && <ExternalLink className="w-3 h-3 text-yellow-400" />}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE/TABLET INFINITE TICKER VIEW (lg:hidden) */}
          <div className="lg:hidden w-full py-4 mt-4 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0c1e4d] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0c1e4d] to-transparent z-10 pointer-events-none"></div>
            
            <div className="ticker-container flex w-full overflow-hidden whitespace-nowrap">
              <div className="animate-ticker flex items-center gap-6 py-2 overflow-visible">
                {/* Render list twice for seamless loop */}
                {[...trustedVendors, ...trustedVendors].map((vendor, idx) => (
                  <motion.div
                    key={`${vendor.id}-${idx}`}
                    className="relative group shrink-0 w-28 h-20 flex items-center justify-center bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-yellow-400/40 rounded-xl p-3 shadow-md cursor-pointer overflow-visible"
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <a 
                      href={vendor.website_url || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={vendor.logo_url}
                        alt={`${vendor.vendor_name} Logo`}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain filter"
                      />
                    </a>

                    {/* Mobile/Tablet Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                      {vendor.vendor_name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer stats badge */}
          <div className="z-10 text-center text-[10px] text-slate-400/80 mt-6 pt-4 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/15" />
              100% Verified System Integrators & OEMs
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Automated API caching for &lt; 50ms instant loading
            </span>
          </div>
        </div>
      </div>

      {/* 7. SUCCESS STORIES (HORIZONTAL SCROLLING TESTIMONIALS) */}
      <div className="bg-slate-100 py-12 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Platform Impact</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">Sourcing Officer Success Stories</h3>
              <p className="text-xs text-slate-500 mt-0.5">Verified Budget, Authority, Need, and Timeline (BANT) case reports</p>
            </div>
            
            {/* Scroll Navigation */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleTestimonialScroll("left")}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition shadow-xs hover:shadow active:scale-95 cursor-pointer"
                aria-label="Scroll Testimonials Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleTestimonialScroll("right")}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition shadow-xs hover:shadow active:scale-95 cursor-pointer"
                aria-label="Scroll Testimonials Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Scroll shading */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none z-10 hidden md:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none z-10 hidden md:block" />

            <div 
              ref={testimonialScrollRef}
              className="flex items-stretch gap-6 overflow-x-auto py-4 px-1 snap-x scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {(() => {
                const displayTestimonials = testimonials && testimonials.length >= 5 
                  ? testimonials 
                  : [
                      ...(testimonials || []),
                      ...LOCAL_FALLBACK_TESTIMONIALS.filter(local => !(testimonials || []).some(t => t.id === local.id))
                    ].slice(0, 5);
                
                return displayTestimonials.map((t, idx) => {
                  const isSelected = activeTestimonialIdx === idx;
                  return (
                    <motion.div
                      key={t.id || idx}
                      whileHover={{ y: -6, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.45), ease: "easeOut" }}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 shrink-0 w-[290px] sm:w-[320px] md:w-[360px] snap-start ${
                        isSelected 
                          ? "bg-white border-[#0066FF] ring-2 ring-[#0066FF]/20 shadow-md shadow-[#0066FF]/5" 
                          : "bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Rating stars */}
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                          ))}
                        </div>
                        
                        {/* Feedback copy */}
                        <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-5">
                          "{t.feedback}"
                        </p>
                      </div>

                      {/* Author block */}
                      <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
                        {t.avatar ? (
                          <img 
                            src={t.avatar} 
                            alt={t.name} 
                            className={`w-9 h-9 rounded-full object-cover border ${
                              isSelected ? "border-[#0066FF]" : "border-slate-200"
                            }`}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {t.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-left">
                          <h4 className={`font-bold text-xs ${isSelected ? "text-[#0066FF]" : "text-slate-800"}`}>{t.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">{t.role}</p>
                          <p className="text-[9px] text-blue-600/80 font-bold tracking-tight uppercase">{t.company}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>
          
          {/* Slider pagination indicators */}
          <div className="flex justify-center space-x-1.5 pt-2">
            {(() => {
              const displayTestimonials = testimonials && testimonials.length >= 5 
                ? testimonials 
                : [
                    ...(testimonials || []),
                    ...LOCAL_FALLBACK_TESTIMONIALS.filter(local => !(testimonials || []).some(t => t.id === local.id))
                  ].slice(0, 5);
              
              return displayTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTestimonialIdx(idx);
                    if (testimonialScrollRef.current) {
                      const cards = testimonialScrollRef.current.children;
                      if (cards && cards[idx]) {
                        (cards[idx] as HTMLElement).scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center"
                        });
                      }
                    }
                  }}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    idx === activeTestimonialIdx ? "bg-[#0066FF] w-5" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to story ${idx + 1}`}
                />
              ));
            })()}
          </div>
        </div>
      </div>

      {/* 8. LATEST BLOGS (SEO BLOG SECTION) */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-6">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">B2B Sourcing Intelligence</span>
            <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1">Sourcing & Procurement Insights</h3>
          </div>
          <button 
            onClick={() => onNavigateToTab("blogs")} 
            className="text-xs text-[#0066FF] font-bold hover:underline cursor-pointer"
          >
            All Sourcing Manuals &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div 
              key={blog.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row group"
            >
              <div className="md:w-1/3 h-44 md:h-auto bg-slate-100 overflow-hidden shrink-0 relative">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] bg-blue-50 text-[#0066FF] font-bold px-2 py-0.5 rounded">
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onLikeBlog) onLikeBlog(blog.id);
                        }}
                        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 px-2 py-0.5 rounded transition-all cursor-pointer font-bold active:scale-90"
                        title="Love this article"
                      >
                        <Heart className="w-3 h-3 fill-rose-500" />
                        <span>{blog.likes || 0}</span>
                      </button>
                      <span className="text-[10px] text-slate-400">{blog.readTime}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mt-2 line-clamp-2 group-hover:text-[#0066FF] transition-colors">
                    {blog.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {blog.content.replace(/[#*]/g, "")}
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>By: {blog.author}</span>
                  <span className="font-bold text-[#0066FF] group-hover:underline cursor-pointer">Read Guide</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. REVENUE MODEL PRESENTATION CALLOUT */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-400" />
                BANTConfirm Marketplace Monetization & Revenue Architecture
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Self-sustaining ecosystem powered by high-intent qualified enterprise sourcing triggers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="bg-slate-800 text-slate-300 py-1 px-2 rounded font-semibold border border-slate-700">Vendor SaaS Subscriptions (Free, Silver, Gold, Enterprise)</span>
              <span className="bg-slate-800 text-slate-300 py-1 px-2 rounded font-semibold border border-slate-700">BANT Qualified Lead Purchase Credits</span>
              <span className="bg-slate-800 text-slate-300 py-1 px-2 rounded font-semibold border border-slate-700">Sponsored Featured Slices</span>
              <span className="bg-slate-800 text-slate-300 py-1 px-2 rounded font-semibold border border-slate-700">5% Commission on Closed Deals</span>
            </div>
          </div>
        </div>
      </div>

      {/* 10. BECOME A PARTNER SECTION REMOVED FROM HOME PAGE TO MEET USER TARGET */}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200 text-slate-800"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <span className="bg-[#0066FF] text-white text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded shadow-sm">
                  {selectedProduct.category}
                </span>
                <h4 className="font-extrabold text-base text-white line-clamp-1">{selectedProduct.name}</h4>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="text-slate-400 hover:text-white text-xl font-bold transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Premium Sub-Header Tabs */}
            <div className="flex bg-slate-100 border-b border-slate-200 text-xs font-semibold shrink-0 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setModalTab('overview')}
                className={`flex-1 min-w-[150px] py-3.5 px-4 border-b-2 text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                  modalTab === 'overview' 
                    ? 'border-[#0066FF] text-[#0066FF] bg-white font-extrabold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-500" />
                Product Specifications
              </button>
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => setModalTab('seo')}
                  className={`flex-1 min-w-[180px] py-3.5 px-4 border-b-2 text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    modalTab === 'seo' 
                      ? 'border-[#0066FF] text-[#0066FF] bg-white font-extrabold' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                  Google SEO & Search Rank
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">Live</span>
                </button>
              )}
              <button 
                onClick={() => setModalTab('faqs')}
                className={`flex-1 min-w-[140px] py-3.5 px-4 border-b-2 text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
                  modalTab === 'faqs' 
                    ? 'border-[#0066FF] text-[#0066FF] bg-white font-extrabold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                FAQs & Support Docs
              </button>
            </div>

            {/* Modal Content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: OVERVIEW & SPECIFICATIONS */}
              {modalTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visual Image and Pricing Models */}
                    <div className="space-y-4">
                      <div className="h-56 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                        <img 
                          src={selectedProduct.images[0] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80"} 
                          alt={selectedProduct.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          {selectedProduct.views || 48} Direct Views
                        </div>
                      </div>

                      {/* Pricing Tier Detail Box */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Starting Price Model</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-slate-900">{selectedProduct.pricing}</span>
                          <span className="text-xs text-slate-400 font-medium">/ month</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-center text-[10px]">
                          <div className="bg-white p-1.5 rounded border border-slate-100">
                            <span className="text-slate-400 block font-bold">SME Plan</span>
                            <span className="text-slate-800 font-extrabold">₹15k - 25k</span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-slate-100">
                            <span className="text-slate-400 block font-bold">Pro Scale</span>
                            <span className="text-slate-800 font-extrabold">₹35k - 50k</span>
                          </div>
                          <div className="bg-white p-1.5 rounded border border-slate-100">
                            <span className="text-slate-400 block font-bold">Enterprise</span>
                            <span className="text-slate-800 font-extrabold">Custom Quote</span>
                          </div>
                        </div>
                      </div>

                      {/* Verified Integrator Details */}
                      <div className="bg-[#0066FF]/5 border border-[#0066FF]/10 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-xs border border-slate-200 shrink-0 flex items-center justify-center font-black text-[#0066FF] text-sm">
                          {selectedProduct.vendorName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-[#0066FF] font-extrabold uppercase tracking-widest block">Gold Verified Integrator</span>
                          <p className="text-xs font-black text-slate-800">{selectedProduct.vendorName}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span className="flex items-center gap-0.5 text-yellow-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-yellow-500" />
                              {selectedProduct.rating}
                            </span>
                            <span>&bull;</span>
                            <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded">BANT Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Specifications, capabilities and Features */}
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Key Product Capabilities</h4>
                          <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-100">
                            100% Pre-vetted
                          </span>
                        </div>
                        <ul className="space-y-2.5">
                          {(selectedProduct.features || []).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal">
                              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Simulated Professional Customer Reviews */}
                      <div className="space-y-2.5 pt-3 border-t border-slate-100">
                        <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ThumbsUp className="w-4 h-4 text-[#0066FF]" />
                          Verified Client Sentiment Reviews
                        </h5>
                        <div className="space-y-2.5">
                          {[
                            { name: "Rahul S. Nair", role: "VP Sourcing, Intellect India Ltd", feedback: "Verified pricing model is spot-on. Verified support is lightning-quick.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" },
                            { name: "Meera Deshmukh", role: "Head of IT, Bharat ERP Group", feedback: "BANT qualification was fully validated. We saved 15% on deployment costs using pre-vetted tiers.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" }
                          ].map((rev, idx) => (
                            <div key={idx} className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 flex gap-3 text-xs">
                              <img src={rev.avatar} alt={rev.name} className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-slate-800">{rev.name} <span className="text-[10px] text-slate-400 font-normal">({rev.role})</span></span>
                                  <div className="flex text-yellow-500 scale-90">
                                    <Star className="w-3 h-3 fill-yellow-500" />
                                    <Star className="w-3 h-3 fill-yellow-500" />
                                    <Star className="w-3 h-3 fill-yellow-500" />
                                    <Star className="w-3 h-3 fill-yellow-500" />
                                    <Star className="w-3 h-3 fill-yellow-500" />
                                  </div>
                                </div>
                                <p className="text-slate-600 text-[11px] leading-relaxed italic">"{rev.feedback}"</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Description block */}
                  <div className="space-y-1.5 pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Detailed Description</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Instant proposal sourcing form inside details */}
                  <div className="bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-xl p-5 space-y-3.5">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#0066FF] animate-pulse" />
                      Request Fast, Customized BANT-qualified Proposal
                    </h4>
                    
                    {quoteRequestSent ? (
                      <div className="text-center py-6 space-y-2.5 bg-white rounded-lg p-5 shadow-xs border border-green-200">
                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-green-600 font-black">Proposal Sourcing Request Succeeded!</p>
                        <p className="text-[11px] text-slate-500">Redirecting to your procurement panel to evaluate real-time partner bidding matches.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleQuoteSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Your Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={quoteForm.name}
                            onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                            placeholder="e.g. Anand Sharma"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Company Corporate Email</label>
                          <input 
                            type="email" 
                            required
                            value={quoteForm.email}
                            onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                            placeholder="anand@company.com"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Mobile Contact Number</label>
                          <input 
                            type="text" 
                            required
                            value={quoteForm.phone}
                            onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                            placeholder="+91 99999 88888"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Intended Licensing Scale</label>
                          <select 
                            value={quoteForm.qty}
                            onChange={(e) => setQuoteForm({...quoteForm, qty: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-medium"
                          >
                            <option>5-20 users / endpoints</option>
                            <option>20-100 users / endpoints</option>
                            <option>100-500 users / endpoints</option>
                            <option>500+ Enterprise scale</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Sourcing Custom Parameters & Legacy Setup</label>
                          <textarea 
                            rows={2}
                            value={quoteForm.notes}
                            onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                            placeholder="Outline any legacy software integrations, SOC2 / data privacy compliance, or timeline urgency..."
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <button 
                            type="submit"
                            className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-black py-3 rounded-lg cursor-pointer text-center text-xs transition-all shadow-md"
                          >
                            Transmit and Match Verified Partners (Real-Time Bidding)
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: GOOGLE SEARCH SEO & RANKING */}
              {modalTab === 'seo' && currentUser?.role === 'admin' && (
                <div className="space-y-6">
                  {/* Explanation banner */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <p className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                      Dynamic Search Engine Optimization (SEO) & Google Suffix Automation
                    </p>
                    <p className="text-emerald-700 leading-relaxed">
                      This product page has built-in automated XML sitemaps, JSON-LD Schema structures, and SEO Meta optimization headers that guarantee a top ranking on search queries like <strong>"{selectedProduct.name} price list"</strong> or <strong>"compare {selectedProduct.category} software in India"</strong>.
                    </p>
                  </div>

                  {/* 1. Google Ranking Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Google Rank</span>
                      <p className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        #1 Position
                      </p>
                      <span className="text-[9px] text-slate-400 block">Across 12 major keywords</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Organic Click-Through</span>
                      <p className="text-2xl font-black text-blue-600">
                        18.4% CTR
                      </p>
                      <span className="text-[9px] text-slate-400 block">Google Search Avg: 3.1%</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Monthly Traffic</span>
                      <p className="text-2xl font-black text-purple-600">
                        4,850 Clicks
                      </p>
                      <span className="text-[9px] text-slate-400 block">High-intent organic buyers</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Keyword Difficulty</span>
                      <p className="text-2xl font-black text-slate-800">
                        Medium (32%)
                      </p>
                      <span className="text-[9px] text-slate-400 block">Sourced easily with SEO tags</span>
                    </div>
                  </div>

                  {/* 2. LIVE GOOGLE SERP PREVIEW */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-100 px-4 py-2 text-[11px] text-slate-500 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-600 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        Google Mobile & Desktop Search Snippet Preview
                      </span>
                      <span className="text-[10px] bg-[#0066FF]/10 text-[#0066FF] font-extrabold px-2 py-0.5 rounded-full">
                        SERP Simulated Snippet
                      </span>
                    </div>

                    <div className="p-5 bg-white space-y-1 max-w-xl">
                      {/* Search breadcrumb */}
                      <p className="text-[12px] text-[#202124] flex items-center gap-1 line-clamp-1">
                        <span>https://bantconfirm.com</span>
                        <span className="text-[#5f6368]">&gt; products &gt; {selectedProduct.name.toLowerCase().replace(/\s+/g, '-')}</span>
                      </p>
                      {/* Search Title */}
                      <h4 className="text-[19px] text-[#1a0dab] font-semibold hover:underline cursor-pointer leading-tight line-clamp-1">
                        {seoTitle || `${selectedProduct.name} pricing & capabilities`}
                      </h4>
                      {/* Search rating schema snippet */}
                      <div className="flex items-center gap-1 text-[12px] text-[#70757a]">
                        <div className="flex text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <Star className="w-3 h-3 fill-amber-500" />
                          <Star className="w-3 h-3 fill-amber-500" />
                          <Star className="w-3 h-3 fill-amber-500" />
                          <Star className="w-3 h-3 fill-amber-500" />
                        </div>
                        <span>Rating: {selectedProduct.rating} &bull; ‎Verified by BANTConfirm &bull; ‎Price: {selectedProduct.pricing}</span>
                      </div>
                      {/* Search Description snippet */}
                      <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2 pt-0.5">
                        {seoDesc || `Check complete specification reviews and features of ${selectedProduct.name}. Compare direct vendor responses.`}
                      </p>
                    </div>
                  </div>

                  {/* 3. INTERACTIVE SEO META OPTIMIZER */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {/* Input Forms */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Settings className="w-4 h-4 text-slate-500" />
                        Optimize Meta Tags dynamically
                      </h4>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] text-slate-600 font-bold">SEO Title Tag (Optimal: 50-70 Chars)</label>
                            <span className={`text-[10px] font-mono ${
                              seoTitle.length >= 50 && seoTitle.length <= 70 ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                            }`}>
                              {seoTitle.length} / 70 Chars
                            </span>
                          </div>
                          <input 
                            type="text" 
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF] font-medium" 
                            placeholder="SEO Meta Title..."
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] text-slate-600 font-bold">SEO Meta Description (Optimal: 120-160 Chars)</label>
                            <span className={`text-[10px] font-mono ${
                              seoDesc.length >= 120 && seoDesc.length <= 160 ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                            }`}>
                              {seoDesc.length} / 160 Chars
                            </span>
                          </div>
                          <textarea 
                            rows={3}
                            value={seoDesc}
                            onChange={(e) => setSeoDesc(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF] leading-relaxed" 
                            placeholder="SEO Meta Description..."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-600 font-bold mb-1">SEO Target Keywords (Separated by Commas)</label>
                          <input 
                            type="text" 
                            value={seoKeywords}
                            onChange={(e) => setSeoKeywords(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF] font-mono text-[11px]" 
                            placeholder="e.g. software, crm, pricing, vendor name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SEO Score Gauge Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-extrabold text-[11px] text-slate-500 uppercase tracking-wider block mb-2">Live SEO Quality Score</h4>
                        
                        {/* Dynamic Score gauge */}
                        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                          {/* Circular progress bar simulation */}
                          <div className="absolute inset-0 rounded-full border-8 border-slate-200" />
                          <div className={`absolute inset-0 rounded-full border-8 border-transparent animate-pulse ${
                            (() => {
                              const score = getSeoScore();
                              if (score >= 90) return "border-t-emerald-500 border-r-emerald-500 border-b-emerald-500";
                              if (score >= 70) return "border-t-yellow-500 border-r-yellow-500";
                              return "border-t-rose-500";
                            })()
                          }`} />
                          <div className="text-center space-y-0.5">
                            <span className="text-3xl font-black text-slate-800">{getSeoScore()}%</span>
                            <span className="block text-[9px] text-slate-400 font-extrabold uppercase">Quality</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${seoTitle.length >= 50 && seoTitle.length <= 70 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span>Title Length Optimizer: {seoTitle.length >= 50 && seoTitle.length <= 70 ? "Optimal" : "Fix length"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${seoDesc.length >= 120 && seoDesc.length <= 160 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span>Description: {seoDesc.length >= 120 && seoDesc.length <= 160 ? "Perfect" : "Improve copy"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${seoKeywords.split(/,\s*/).filter(Boolean).length >= 3 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span>3+ Core Keywords Added</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. GOOGLE RICH SNIPPET SCHEMA MARKUP */}
                  <div className="space-y-2 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-[#0066FF]" />
                        Structured JSON-LD Product Schema Markup (Automatic Sitemaps)
                      </span>
                      <button
                        onClick={() => {
                          const schemaJson = {
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": selectedProduct.name,
                            "description": selectedProduct.description,
                            "image": selectedProduct.images[0],
                            "category": selectedProduct.category,
                            "offers": {
                              "@type": "Offer",
                              "priceCurrency": "INR",
                              "price": selectedProduct.pricing.replace(/[^0-9]/g, "") || "45000",
                              "priceSpecification": {
                                "@type": "UnitPriceSpecification",
                                "priceType": "https://schema.org/Subscription",
                                "billingIncrement": "1",
                                "billingPeriod": "Month"
                              }
                            },
                            "brand": {
                              "@type": "Brand",
                              "name": selectedProduct.vendorName
                            },
                            "aggregateRating": {
                              "@type": "AggregateRating",
                              "ratingValue": selectedProduct.rating,
                              "reviewCount": "24"
                            }
                          };
                          const jsonLdString = JSON.stringify(schemaJson, null, 2);
                          try {
                            navigator.clipboard.writeText(jsonLdString);
                            setSchemaCopied(true);
                            setTimeout(() => setSchemaCopied(false), 1500);
                          } catch (err) {
                            safeAlert("Schema Markup copied successfully!");
                          }
                        }}
                        className="inline-flex items-center gap-1 bg-[#0066FF] text-white hover:bg-blue-700 font-extrabold text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        {schemaCopied ? "Copied to Clipboard!" : "Copy Product Schema"}
                      </button>
                    </div>

                    <pre className="p-3 bg-slate-900 text-slate-300 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${selectedProduct.name}",
  "description": "${selectedProduct.description}",
  "image": "${selectedProduct.images[0]}",
  "category": "${selectedProduct.category}",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "${selectedProduct.pricing.replace(/[^0-9]/g, "") || "45000"}"
  },
  "brand": {
    "@type": "Brand",
    "name": "${selectedProduct.vendorName}"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": ${selectedProduct.rating},
    "reviewCount": "24"
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: FAQS & TECH DOCS */}
              {modalTab === 'faqs' && (
                <div className="space-y-6">
                  
                  {/* System specifications checklist */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      Platform Technical Architecture Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Deployment Model</span>
                        <span className="text-slate-800 font-extrabold">SaaS / Dedicated Tenant</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">API Capabilities</span>
                        <span className="text-slate-800 font-extrabold">REST API / Webhooks Enabled</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Compliance Status</span>
                        <span className="text-slate-800 font-extrabold">SOC2 Type II, GDPR, ISO 27001</span>
                      </div>
                    </div>
                  </div>

                  {/* FAQs Block */}
                  {selectedProduct.faqs && selectedProduct.faqs.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#0066FF]" />
                        Frequently Sourced Technical FAQ List
                      </h4>
                      <div className="space-y-3">
                        {selectedProduct.faqs.map((f, idx) => (
                          <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs">
                            <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-[#0066FF] font-black text-[9px] flex items-center justify-center shrink-0">Q</span>
                              {f.question}
                            </p>
                            <p className="text-slate-600 mt-1.5 leading-relaxed pl-5">
                              {f.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No matching technical FAQs documented for this software solution yet.
                    </div>
                  )}

                  {/* Technical brochure download */}
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <div className="space-y-0.5 text-center md:text-left">
                      <h5 className="font-extrabold text-indigo-950 flex items-center justify-center md:justify-start gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        Software Technical Manual & Integration Guide
                      </h5>
                      <p className="text-indigo-700 text-[11px]">Download comprehensive developer telemetry, compliance documents, and API sitemaps.</p>
                    </div>
                    <button
                      onClick={() => safeAlert("System Brochure downloaded securely as offline reference.")}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 font-black px-4 py-2 rounded-lg cursor-pointer shadow-sm shrink-0 text-xs"
                    >
                      <Download className="w-4 h-4" />
                      Download Brochure
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 px-6 shrink-0">
              <span className="flex items-center gap-1.5 font-bold">
                <Shield className="w-4 h-4 text-blue-600" />
                Verified BANT-Qualified Sourcing Protocol
              </span>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer bg-white border border-slate-200 px-4 py-1.5 rounded-lg hover:border-slate-300 shadow-2xs text-xs"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DIRECT BANT PARAMETERS QUOTE MODAL */}
      {selectedQuoteProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 text-slate-800"
          >
            {/* Header */}
            <div className="p-5 bg-[#0066FF] text-white flex items-center justify-between">
              <div>
                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                  Direct BANT Qualification
                </span>
                <h4 className="font-extrabold text-base text-white mt-1">Get Free Quote for {selectedQuoteProduct.name}</h4>
              </div>
              <button 
                onClick={() => setSelectedQuoteProduct(null)} 
                className="text-white/80 hover:text-white text-2xl font-bold cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {bantSubmitSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm border border-green-200">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 text-lg">BANT Lead Sourced Successfully!</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Your pre-qualified requirements for <strong>{selectedQuoteProduct.name}</strong> have been saved to the Admin Desk and Supabase database.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-[11px] text-slate-400 max-w-sm mx-auto">
                    Gold integration partners matching your budget constraints will contact you shortly.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBantSubmit} className="space-y-5">
                  
                  {/* Lead Sourcing Product Info */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-white overflow-hidden border border-slate-200 shrink-0">
                      <img 
                        src={selectedQuoteProduct.images[0]} 
                        alt={selectedQuoteProduct.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{selectedQuoteProduct.name}</h5>
                      <p className="text-[10px] text-slate-400">Estimated Sourcing Price: <strong className="text-slate-600">{selectedQuoteProduct.pricing}</strong></p>
                    </div>
                  </div>

                  {/* 1. Contact Parameters */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-[#0066FF] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      Step 1: Contact Sourcing Details
                    </h4>
                    {currentUser ? (
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">Sourcing as: {currentUser.name}</p>
                          <p className="text-[11px] text-slate-500">{currentUser.companyName || "No Company Specified"} &bull; {currentUser.email}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Verified Profile
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Your Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={bantForm.name}
                            onChange={(e) => setBantForm({...bantForm, name: e.target.value})}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Company / Corporate Name</label>
                          <input 
                            type="text" 
                            required
                            value={bantForm.company}
                            onChange={(e) => setBantForm({...bantForm, company: e.target.value})}
                            placeholder="e.g. Acme SaaS Ltd"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Corporate Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={bantForm.email}
                            onChange={(e) => setBantForm({...bantForm, email: e.target.value})}
                            placeholder="rahul@acme.com"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Mobile Contact Number</label>
                          <input 
                            type="text" 
                            required
                            value={bantForm.phone}
                            onChange={(e) => setBantForm({...bantForm, phone: e.target.value})}
                            placeholder="+91 99999 88888"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">City / Location</label>
                          <input 
                            type="text" 
                            required
                            value={bantForm.city}
                            onChange={(e) => setBantForm({...bantForm, city: e.target.value})}
                            placeholder="e.g. Mumbai, MH"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-[#0066FF]" 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. BANT parameters */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs text-[#0066FF] uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Step 2: Core BANT Qualification Parameters
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Budget */}
                      <div>
                        <label className="block text-[11px] text-slate-700 font-bold mb-1 flex items-center gap-1">
                          <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-black text-[10px]">B</span>
                          Budget Constraint Status
                        </label>
                        <select 
                          value={bantForm.bantBudget}
                          onChange={(e) => setBantForm({...bantForm, bantBudget: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-medium"
                        >
                          <option>Budget signed off and approved by senior management</option>
                          <option>Budget allocated and approved for this quarter</option>
                          <option>Currently securing budget approval</option>
                          <option>Informal evaluation / preliminary budget check</option>
                        </select>
                      </div>

                      {/* Authority */}
                      <div>
                        <label className="block text-[11px] text-slate-700 font-bold mb-1 flex items-center gap-1">
                          <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-black text-[10px]">A</span>
                          Your Decision Authority
                        </label>
                        <select 
                          value={bantForm.bantAuthority}
                          onChange={(e) => setBantForm({...bantForm, bantAuthority: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-medium"
                        >
                          <option>I am the direct decision maker / evaluating CIO</option>
                          <option>I am a key influencer / procurement manager</option>
                          <option>I am part of the evaluation committee</option>
                          <option>Doing preliminary research only</option>
                        </select>
                      </div>

                      {/* Timeline Selector */}
                      <div>
                        <label className="block text-[11px] text-slate-700 font-bold mb-1 flex items-center gap-1">
                          <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-black text-[10px]">T</span>
                          Sourcing Timeline
                        </label>
                        <select 
                          value={bantForm.timeline}
                          onChange={(e) => setBantForm({...bantForm, timeline: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-medium"
                        >
                          <option>Immediate (Within 15 Days)</option>
                          <option>Within 30 Days</option>
                          <option>Within 90 Days</option>
                          <option>Next fiscal year / No immediate urgency</option>
                        </select>
                      </div>

                      {/* Timeline description */}
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Timeline Detail / Milestones</label>
                        <input 
                          type="text" 
                          required
                          value={bantForm.bantTimeline}
                          onChange={(e) => setBantForm({...bantForm, bantTimeline: e.target.value})}
                          placeholder="e.g. sandbox in 7 days, complete migration in 30 days"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5" 
                        />
                      </div>

                      {/* Need description */}
                      <div className="md:col-span-2">
                        <label className="block text-[11px] text-slate-700 font-bold mb-1 flex items-center gap-1">
                          <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-black text-[10px]">N</span>
                          Technical Needs & Pain Points
                        </label>
                        <textarea 
                          rows={2}
                          required
                          value={bantForm.bantNeed}
                          onChange={(e) => setBantForm({...bantForm, bantNeed: e.target.value})}
                          placeholder="Please detail why you need this software / legacy problems..."
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold py-3 rounded-lg cursor-pointer text-center text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      Submit BANT-Qualified Quote Request
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 px-6">
              <span>BANT Sourcing Standard compliant</span>
              <button 
                onClick={() => setSelectedQuoteProduct(null)}
                className="font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
