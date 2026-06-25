import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, Settings, Eye, HelpCircle, Phone, 
  MapPin, Globe, CheckCircle, List, ArrowRight, UserCheck, 
  Sparkles, Award, Shield, FileText, User, Lock, Mail, Building, LogOut,
  Menu, X
} from "lucide-react";
import HomeView from "./components/HomeView";
import UserPanel from "./components/UserPanel";
import VendorPanel from "./components/VendorPanel";
import AdminPanel from "./components/AdminPanel";
import BlogsView from "./components/BlogsView";
import BecomePartnerView from "./components/BecomePartnerView";
import AIChatBot from "./components/AIChatBot";
import Footer from "./components/Footer";
import SEOViewer from "./components/SEOViewer";
import { safeAlert } from "./utils/safeAlert";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";

import { 
  Category, Product, Vendor, Lead, Blog, Banner, Testimonial, Notification 
} from "./types";

export default function App() {
  // Current simulating role & navigation tabs
  const [currentRole, setCurrentRole] = useState<'buyer' | 'vendor' | 'admin'>('buyer');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefilledCategory, setPrefilledCategory] = useState<string | undefined>(undefined);
  const [vendorInitialTab, setVendorInitialTab] = useState<'dashboard' | 'products' | 'leads' | 'plans' | 'register' | undefined>(undefined);

  // Real-time toast notification state
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
    actionLabel?: string;
    action?: () => void;
  } | null>(null);

  const showToastAlert = (title: string, message: string, action?: () => void, actionLabel = "Verify Now") => {
    setActiveToast({
      id: Math.random().toString(),
      title,
      message,
      actionLabel,
      action
    });
  };

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  // Login fields state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authRole, setAuthRole] = useState<'buyer' | 'vendor' | 'admin'>('buyer');
  
  // Signup fields state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpCompany, setSignUpCompany] = useState("");
  const [signUpMobile, setSignUpMobile] = useState("");
  const [signUpCity, setSignUpCity] = useState("");
  const [signUpRole, setSignUpRole] = useState<'buyer' | 'vendor' | 'admin'>('buyer');

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("bantconfirm_wishlist") : null;
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
      return [];
    }
  });

  // State arrays fetched from backend
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cmsPages, setCmsPages] = useState<Record<string, string>>({});
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  // Loading flags
  const [loading, setLoading] = useState(true);

  // SEO modal viewer
  const [seoViewerOpen, setSeoViewerOpen] = useState(false);

  // Fetch all states from Supabase or Express fullstack API on mount
  const fetchAllData = async () => {
    try {
      let resCats: any[] = [];
      let resProds: any[] = [];
      let resVendors: any[] = [];
      let resLeads: any[] = [];
      let resBlogs: any[] = [];
      let resBanners: any[] = [];
      let resTestimonials: any[] = [];
      let resNotifications: any[] = [];
      let resSettings: Record<string, string> = {};
      let resUser: any = null;
      let resUsers: any[] = [];

      if (isSupabaseConfigured) {
        const [
          catsRes, prodsRes, vendorsRes, leadsRes,
          blogsRes, bannersRes, testimonialsRes, notificationsRes,
          settingsRes, authRes
        ] = await Promise.all([
          supabase.from("categories").select("*"),
          supabase.from("products").select("*"),
          supabase.from("vendors").select("*"),
          supabase.from("leads").select("*"),
          supabase.from("blogs").select("*"),
          supabase.from("banners").select("*"),
          supabase.from("testimonials").select("*"),
          supabase.from("notifications").select("*"),
          supabase.from("settings").select("*"),
          supabase.auth.getUser()
        ]);

        resCats = catsRes.data || [];
        resProds = prodsRes.data || [];
        resVendors = vendorsRes.data || [];
        resLeads = leadsRes.data || [];
        resBlogs = blogsRes.data || [];
        resBanners = bannersRes.data || [];
        resTestimonials = testimonialsRes.data || [];
        resNotifications = notificationsRes.data || [];
        resUsers = [];

        const settingsMap: Record<string, string> = {};
        if (settingsRes.data) {
          settingsRes.data.forEach((item: any) => {
            settingsMap[item.key || item.id] = item.value;
          });
        }
        resSettings = settingsMap;

        if (authRes.data?.user) {
          const uMeta = authRes.data.user.user_metadata;
          const emailLower = (authRes.data.user.email || "").trim().toLowerCase();
          let userRole = uMeta?.role || "buyer";
          if (emailLower === "admin@bantconfirm.com" || emailLower === "info.bouuz@gmail.com" || emailLower === "info.bouuz@gmail.co" || emailLower === "pramodobra95@gmail.com") {
            userRole = "admin";
          }
          resUser = {
            id: authRes.data.user.id,
            email: authRes.data.user.email || "",
            name: uMeta?.name || authRes.data.user.email?.split("@")[0] || "User",
            role: userRole,
            companyName: uMeta?.companyName || "",
            mobile: uMeta?.mobile || "",
            city: uMeta?.city || "",
            vendorId: uMeta?.vendorId || null
          };
        }
      } else {
        const safeFetchJson = async (url: string, fallback: any = []) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return fallback;
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              return fallback;
            }
            return await res.json();
          } catch (err) {
            console.warn(`Failed to fetch JSON from ${url}:`, err);
            return fallback;
          }
        };

        const [
          rCats, rProds, rVendors, rLeads, 
          rBlogs, rBanners, rTestimonials, 
          rNotifications, rSettings, rUser, rUsers
        ] = await Promise.all([
          safeFetchJson("/api/categories"),
          safeFetchJson("/api/products"),
          safeFetchJson("/api/vendors"),
          safeFetchJson("/api/leads"),
          safeFetchJson("/api/blogs"),
          safeFetchJson("/api/banners"),
          safeFetchJson("/api/testimonials"),
          safeFetchJson("/api/notifications"),
          safeFetchJson("/api/settings", {}),
          safeFetchJson("/api/auth/me", null),
          safeFetchJson("/api/users", [])
        ]);
        resCats = rCats;
        resProds = rProds;
        resVendors = rVendors;
        resLeads = rLeads;
        resBlogs = rBlogs;
        resBanners = rBanners;
        resTestimonials = rTestimonials;
        resNotifications = rNotifications;
        resSettings = rSettings;
        resUser = rUser;
        resUsers = rUsers;
      }

      setCategories(Array.isArray(resCats) ? resCats : []);
      setProducts(Array.isArray(resProds) ? resProds : []);
      setVendors(Array.isArray(resVendors) ? resVendors : []);
      setRegisteredUsers(Array.isArray(resUsers) ? resUsers : []);
      if (Array.isArray(resLeads)) {
        setLeads(resLeads.map((l: any) => ({
          ...l,
          bant: l.bant || { budget: l.budget || "", authority: "Yes", need: l.description || "", timeline: l.timeline || "" }
        })));
      } else {
        setLeads([]);
      }
      setBlogs(Array.isArray(resBlogs) ? resBlogs : []);
      setBanners(Array.isArray(resBanners) ? resBanners : []);
      setTestimonials(Array.isArray(resTestimonials) ? resTestimonials : []);
      setNotifications(Array.isArray(resNotifications) ? resNotifications : []);
      setCmsPages(resSettings || {});
      
      if (resUser && resUser.id) {
        setCurrentUser(resUser);
        setCurrentRole(resUser.role);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load platform data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-detect role from email to simplify login
  useEffect(() => {
    const emailLower = authEmail.trim().toLowerCase();
    if (emailLower === "admin@bantconfirm.com" || emailLower === "info.bouuz@gmail.com" || emailLower === "info.bouuz@gmail.co" || emailLower === "pramodobra95@gmail.com") {
      setAuthRole("admin");
    } else if (emailLower.includes("vendor") || emailLower === "vendor@bantconfirm.com" || emailLower.includes("seller") || emailLower.includes("partner") || emailLower.includes("provider")) {
      setAuthRole("vendor");
    } else {
      setAuthRole("buyer");
    }
  }, [authEmail]);

  // Auto-detect role from signup email to simplify registration
  useEffect(() => {
    const emailLower = signUpEmail.trim().toLowerCase();
    if (emailLower === "admin@bantconfirm.com" || emailLower === "info.bouuz@gmail.com" || emailLower === "info.bouuz@gmail.co" || emailLower === "pramodobra95@gmail.com") {
      setSignUpRole("admin");
    } else if (emailLower.includes("vendor") || emailLower === "vendor@bantconfirm.com" || emailLower.includes("seller") || emailLower.includes("partner") || emailLower.includes("provider")) {
      setSignUpRole("vendor");
    } else {
      setSignUpRole("buyer");
    }
  }, [signUpEmail]);

  // Automated notification system & toast alert for administrators checking new vendor registration
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') return;

    let lastCheckedTime = new Date().toISOString();

    const checkNewRegistrations = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from("vendors")
            .select("*")
            .gt("createdAt", lastCheckedTime)
            .eq("approved", false);

          if (!error && data && data.length > 0) {
            data.forEach((vendor: any) => {
              showToastAlert(
                `New Vendor Registration: ${vendor.companyName}`,
                `${vendor.name || "A new vendor"} has applied and requires verification.`,
                () => {
                  setActiveTab("admin-panel");
                }
              );
            });
            lastCheckedTime = new Date().toISOString();
            fetchAllData();
          }
        }
      } catch (err) {
        console.warn("Notification system fetch error:", err);
      }
    };

    const interval = setInterval(checkNewRegistrations, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [currentUser, isSupabaseConfigured]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
        if (data.user) {
          const uMeta = data.user.user_metadata;
          const emailLower = (data.user.email || "").trim().toLowerCase();
          let userRole = uMeta?.role || authRole;
          if (emailLower === "admin@bantconfirm.com" || emailLower === "info.bouuz@gmail.com" || emailLower === "info.bouuz@gmail.co" || emailLower === "pramodobra95@gmail.com") {
            userRole = "admin";
          }
          const userObj = {
            id: data.user.id,
            email: data.user.email || "",
            name: uMeta?.name || data.user.email?.split("@")[0] || "User",
            role: userRole,
            companyName: uMeta?.companyName || "",
            mobile: uMeta?.mobile || "",
            city: uMeta?.city || "",
            vendorId: uMeta?.vendorId || null
          };
          setCurrentUser(userObj);
          setCurrentRole(userObj.role);
          setAuthModalOpen(false);
          setAuthEmail("");
          setAuthPassword("");
          safeAlert(`Successfully logged in as ${userObj.name} (${userObj.role})!`);
          
          if (userObj.role === 'buyer') {
            setActiveTab('dashboard');
          } else if (userObj.role === 'vendor') {
            setActiveTab('vendor-panel');
          } else if (userObj.role === 'admin') {
            setActiveTab('admin-panel');
          }
        }
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail, password: authPassword, role: authRole })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setCurrentRole(data.user.role);
          setAuthModalOpen(false);
          setAuthEmail("");
          setAuthPassword("");
          safeAlert(`Successfully logged in as ${data.user.name} (${data.user.role})!`);
          
          if (data.user.role === 'buyer') {
            setActiveTab('dashboard');
          } else if (data.user.role === 'vendor') {
            setActiveTab('vendor-panel');
          } else if (data.user.role === 'admin') {
            setActiveTab('admin-panel');
          }
        } else {
          safeAlert("Login failed. Please check credentials.");
        }
      }
    } catch (err: any) {
      console.error(err);
      safeAlert(err.message || "An error occurred during authentication.");
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: signUpEmail,
          password: signUpPassword,
          options: {
            data: {
              name: signUpName,
              companyName: signUpCompany,
              mobile: signUpMobile,
              city: signUpCity,
              role: signUpRole
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          const emailLower = (data.user.email || "").trim().toLowerCase();
          let userRole = signUpRole;
          if (emailLower === "admin@bantconfirm.com" || emailLower === "info.bouuz@gmail.com" || emailLower === "info.bouuz@gmail.co" || emailLower === "pramodobra95@gmail.com") {
            userRole = "admin";
          }
          const userObj = {
            id: data.user.id,
            email: data.user.email || "",
            name: signUpName,
            role: userRole,
            companyName: signUpCompany,
            mobile: signUpMobile,
            city: signUpCity,
            vendorId: null
          };

          if (signUpRole === 'vendor') {
            const vendorId = "ven-" + Math.random().toString(36).substring(2, 9);
            const vendorRecord = {
              id: vendorId,
              companyName: signUpCompany,
              name: signUpName,
              logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150",
              gstNumber: "27GSTMOCK12345",
              panNumber: "PANMOCK1234",
              website: "https://example.com",
              businessCategory: "General",
              productsOffered: [],
              rating: 5.0,
              location: signUpCity,
              approved: false,
              docVerified: false,
              plan: 'Free',
              productsCount: 0,
              leadsCount: 0,
              revenue: 0,
              viewsCount: 0,
              createdAt: new Date().toISOString()
            };
            await supabase.from("vendors").insert([vendorRecord]);
            userObj.vendorId = vendorId as any;
            
            await supabase.auth.updateUser({
              data: { vendorId }
            });
          }

          // Trigger Resend onboarding welcome email & admin registration alerts
          fetch("/api/resend/trigger-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: signUpRole === 'vendor' ? 'welcome-vendor' : 'welcome-buyer',
              payload: {
                id: userObj.vendorId || userObj.id,
                name: signUpName,
                companyName: signUpCompany,
                email: signUpEmail,
                gstNumber: "27GSTMOCK12345",
                panNumber: "PANMOCK1234",
                website: "https://example.com",
                businessCategory: "General Sourcing Partner",
                city: signUpCity
              }
            })
          }).catch(err => console.error("Resend onboarding trigger failed:", err));

          setCurrentUser(userObj);
          setCurrentRole(userObj.role);
          setAuthModalOpen(false);
          setSignUpName("");
          setSignUpEmail("");
          setSignUpPassword("");
          setSignUpCompany("");
          setSignUpMobile("");
          setSignUpCity("");
          safeAlert(`Account registered successfully as ${signUpName}!`);
          
          if (signUpRole === 'buyer') {
            setActiveTab('dashboard');
          } else if (signUpRole === 'vendor') {
            setActiveTab('vendor-panel');
          } else if (signUpRole === 'admin') {
            setActiveTab('admin-panel');
          }
          fetchAllData();
        }
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: signUpName,
            email: signUpEmail,
            companyName: signUpCompany,
            mobile: signUpMobile,
            city: signUpCity,
            role: signUpRole,
            password: signUpPassword
          })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setCurrentRole(data.user.role);
          setAuthModalOpen(false);
          setSignUpName("");
          setSignUpEmail("");
          setSignUpPassword("");
          setSignUpCompany("");
          setSignUpMobile("");
          setSignUpCity("");
          safeAlert(`Account registered successfully as ${data.user.name}!`);
          
          if (data.user.role === 'buyer') {
            setActiveTab('dashboard');
          } else if (data.user.role === 'vendor') {
            setActiveTab('vendor-panel');
          } else if (data.user.role === 'admin') {
            setActiveTab('admin-panel');
          }
          fetchAllData();
        } else {
          safeAlert("Registration failed. Please check input parameters.");
        }
      }
    } catch (err: any) {
      console.error(err);
      safeAlert(err.message || "An error occurred during registration.");
    }
  };

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
      }
      setCurrentUser(null);
      setCurrentRole('buyer');
      setActiveTab('home');
      safeAlert("Logged out successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  // Save wishlist modifications
  const handleAddToWishlist = (pId: string) => {
    let updated;
    if (wishlist.includes(pId)) {
      updated = wishlist.filter(id => id !== pId);
    } else {
      updated = [...wishlist, pId];
    }
    setWishlist(updated);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("bantconfirm_wishlist", JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("Storage writing is blocked or restricted:", e);
    }
  };

  // 1. Post Lead (BANT)
  const handlePostLead = async (leadData: any) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Claim Lead (Vendor desk credit charge)
  const handleClaimLead = async (leadId: string, vendorId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Categories management (Add/Delete)
  const handleAddCategory = async (catData: { name: string; description: string; icon: string }) => {
    try {
      if (isSupabaseConfigured) {
        const catId = `cat-${Date.now()}`;
        const newCat = {
          id: catId,
          name: catData.name,
          description: catData.description,
          icon: catData.icon || "Layers",
          productsCount: 0
        };
        const { error } = await supabase.from("categories").insert([newCat]);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(catData)
        });
        if (res.ok) fetchAllData();
      }
      safeAlert("Category created successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("categories").delete().eq("id", catId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/categories/${catId}`, { method: "DELETE" });
        if (res.ok) fetchAllData();
      }
      safeAlert("Category deleted successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Update Vendor profile plan
  const handleUpdateVendor = async (vendorId: string, updatedData: any) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("vendors").update(updatedData).eq("id", vendorId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/vendors/${vendorId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        });
        if (res.ok) {
          fetchAllData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVendor = async (vendorData: any) => {
    try {
      if (isSupabaseConfigured) {
        const newVendor = {
          id: vendorData.id || `ven-${Date.now()}`,
          companyName: vendorData.companyName,
          name: vendorData.name || "",
          email: vendorData.email || "",
          mobile: vendorData.mobile || "",
          gstNumber: vendorData.gstNumber || "",
          panNumber: vendorData.panNumber || "",
          website: vendorData.website || "",
          businessCategory: vendorData.businessCategory || "Custom Software Development",
          location: vendorData.location || "India",
          approved: vendorData.approved || false,
          verified: vendorData.verified || false,
          createdAt: new Date().toISOString()
        };
        const { error } = await supabase.from("vendors").insert([newVendor]);
        if (error) throw error;
        
        showToastAlert(
          `New Vendor Registered: ${newVendor.companyName}`,
          `A new software provider (${newVendor.name}) has applied and requires verification.`,
          () => {
            setActiveTab("admin-panel");
          }
        );
        fetchAllData();
      } else {
        const res = await fetch("/api/vendors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vendorData)
        });
        if (res.ok) {
          fetchAllData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("vendors").delete().eq("id", vendorId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/vendors/${vendorId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          fetchAllData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (isSupabaseConfigured) {
        safeAlert("User registration entry removed successfully!");
      } else {
        const res = await fetch(`/api/users/${userId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          safeAlert("User registration entry removed successfully!");
          fetchAllData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Update dynamic Lead assignment status inside vendor desk
  const handleUpdateLeadAssignmentStatus = async (leadId: string, vendorId: string, status: string) => {
    try {
      const res = await fetch("/api/lead-assignments/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, vendorId, status })
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Vendor products management (Add/Update/Delete)
  const handleAddProduct = async (productData: any) => {
    try {
      if (isSupabaseConfigured) {
        const newProduct = {
          id: productData.id || `prod-${Date.now()}`,
          name: productData.name,
          category: productData.category,
          vendorId: productData.vendorId,
          vendorName: productData.vendorName || "Verified Partner",
          price: productData.price || "Contact for Quote",
          priceModel: productData.priceModel || "Custom Quote",
          trialPeriod: productData.trialPeriod || "No Trial",
          rating: parseFloat(productData.rating) || 4.5,
          approved: productData.approved || false,
          featured: productData.featured || false,
          description: productData.description || "",
          logo: productData.logo || "",
          features: Array.isArray(productData.features) ? productData.features : [productData.features || ""],
          createdAt: new Date().toISOString()
        };
        const { error } = await supabase.from("products").insert([newProduct]);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          fetchAllData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = async (productId: string, productData: any) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").update(productData).eq("id", productId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          fetchAllData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").delete().eq("id", productId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/products/${productId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          fetchAllData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin controls
  const handleApproveVendor = async (vendorId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("vendors").update({ approved: true, verified: true }).eq("id", vendorId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/vendors/${vendorId}/approve`, { method: "POST" });
        if (res.ok) fetchAllData();
      }
    } catch (err) { console.error(err); }
  };

  const handleApproveProduct = async (productId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").update({ approved: true }).eq("id", productId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/products/${productId}/approve`, { method: "POST" });
        if (res.ok) fetchAllData();
      }
    } catch (err) { console.error(err); }
  };

  const handleRejectProduct = async (productId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").update({ approved: false }).eq("id", productId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/products/${productId}/reject`, { method: "POST" });
        if (res.ok) fetchAllData();
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleFeatureProduct = async (productId: string) => {
    try {
      const prod = products.find(p => p.id === productId);
      const newFeatured = prod ? !prod.featured : true;
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").update({ featured: newFeatured }).eq("id", productId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/products/${productId}/feature`, { method: "POST" });
        if (res.ok) fetchAllData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAssignVendorToLead = async (leadId: string, vendorId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("leads").update({ assignedVendorId: vendorId }).eq("id", leadId);
        if (error) throw error;
        fetchAllData();
      } else {
        const res = await fetch(`/api/leads/${leadId}/assign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId })
        });
        if (res.ok) fetchAllData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddBanner = async (bannerData: any) => {
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerData)
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      const res = await fetch(`/api/banners/${bannerId}`, { method: "DELETE" });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleAddBlog = async (blogData: any) => {
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleLikeBlog = async (blogId: string) => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, { method: "POST" });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateCMSPage = async (key: string, val: string) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: val })
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateProfile = async (profileData: any) => {
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCurrentUser(data.user);
          safeAlert("Profile settings persisted successfully!");
        } else {
          safeAlert("Failed to update profile: " + data.error);
        }
      } else {
        safeAlert("Failed to update profile.");
      }
    } catch (e: any) {
      console.error(e);
      safeAlert("Error updating profile.");
    }
  };

  // Helper selector for quick BANT navigation prefill
  const handleNavigateToPostRequirement = (prefilledCat?: string) => {
    setPrefilledCategory(prefilledCat);
    setCurrentRole('buyer');
    setActiveTab('post'); // This routes directly into UserPanel BANT post form
  };

  const handleTabClick = (tab: string, requiredRole?: 'buyer' | 'vendor' | 'admin') => {
    if (!currentUser) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      return;
    }
    
    // Admins can view everything!
    if (currentUser.role === 'admin') {
      if (requiredRole === 'vendor') {
        setCurrentRole('vendor');
      } else if (requiredRole === 'buyer') {
        setCurrentRole('buyer');
      }
      setActiveTab(tab);
      return;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
      safeAlert(`Access Restricted. This view requires a ${requiredRole} account. You are logged in as a ${currentUser.role}.`);
      return;
    }
    
    if (requiredRole) {
      setCurrentRole(requiredRole);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* CORE PLATFORM HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm px-4 md:px-8 py-3 md:py-4 flex flex-row items-center justify-between gap-4">
        {/* Left side: Logo */}
        <div 
          onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 bg-[#FFC107] rounded flex items-center justify-center font-black text-slate-900 text-lg shadow-sm transition-transform group-hover:scale-105 duration-300">B</div>
          <span className="text-xl font-black tracking-tight">
            <span className="text-[#FFC107]">BANT</span>
            <span className="text-[#0066FF]">Confirm</span>
          </span>
        </div>

        {/* Center: Global Nav tabs (Desktop Only) */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button 
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'home' ? 'text-[#0066FF] bg-blue-50/80 font-bold' : 'hover:text-[#0066FF]'}`}
          >
            Solutions
          </button>
          
          <button 
            onClick={() => handleTabClick('vendor-panel', 'vendor')}
            className={`hidden px-3 py-1.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'vendor-panel' ? 'text-[#0066FF] bg-blue-50/80 font-bold' : 'hover:text-[#0066FF]'}`}
          >
            Vendors
          </button>
          
          <button 
            onClick={() => handleTabClick('dashboard', 'buyer')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'dashboard' ? 'text-[#0066FF] bg-blue-50/80 font-bold' : 'hover:text-[#0066FF]'}`}
          >
            BANT Sourcing Panel
          </button>
          
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`hidden px-3 py-1.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'blogs' ? 'text-[#0066FF] bg-blue-50/80 font-bold' : 'hover:text-[#0066FF]'}`}
          >
            Resources
          </button>

          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => handleTabClick('admin-panel', 'admin')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all ${activeTab === 'admin-panel' ? 'ring-2 ring-purple-400 font-extrabold' : ''}`}
            >
              Admin Desk
            </button>
          )}
        </nav>

        {/* Right side: Action, Sourcing & Auth Section (Desktop Only) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => {
              if (!currentUser) {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              } else {
                handleNavigateToPostRequirement();
              }
            }}
            className="bg-[#FFC107] hover:bg-yellow-500 text-slate-900 text-xs font-black px-4 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all"
          >
            Post Requirement
          </button>

          <div className="h-6 w-[1px] bg-slate-200" />

          {/* Unified Authentication UI */}
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className="text-[#0066FF] hover:bg-blue-50 font-bold px-3 py-2 rounded-lg text-xs transition-all cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setAuthModalTab('signup');
                  setAuthModalOpen(true);
                }}
                className="bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold px-3 py-2 rounded-lg text-xs transition-all cursor-pointer shadow-xs"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden lg:block leading-none">
                  <div className="text-[10px] font-black text-slate-800 leading-tight">{currentUser.name}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{currentUser.role}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                title="Sign Out Session"
                className="text-slate-400 hover:text-red-600 transition-all cursor-pointer p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button (Mobile Only) */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => {
              if (!currentUser) {
                setAuthModalTab('login');
                setAuthModalOpen(true);
              } else {
                handleNavigateToPostRequirement();
              }
            }}
            className="bg-[#FFC107] hover:bg-yellow-500 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xs cursor-pointer transition-all animate-pulse"
          >
            Post Req
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none transition-colors cursor-pointer"
            id="mobile-menu-toggle-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV DROPDOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-md z-30 sticky top-[57px]"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {/* Navigation Links */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'home' ? 'text-[#0066FF] bg-blue-50 font-bold' : 'hover:text-[#0066FF] hover:bg-slate-50'}`}
                >
                  Solutions
                </button>
                
                <button 
                  onClick={() => { handleTabClick('vendor-panel', 'vendor'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'vendor-panel' ? 'text-[#0066FF] bg-blue-50 font-bold' : 'hover:text-[#0066FF] hover:bg-slate-50'}`}
                >
                  Vendors
                </button>
                
                <button 
                  onClick={() => { handleTabClick('dashboard', 'buyer'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'dashboard' ? 'text-[#0066FF] bg-blue-50 font-bold' : 'hover:text-[#0066FF] hover:bg-slate-50'}`}
                >
                  BANT Sourcing Panel
                </button>
                
                <button 
                  onClick={() => { setActiveTab('blogs'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg cursor-pointer font-bold transition-all ${activeTab === 'blogs' ? 'text-[#0066FF] bg-blue-50 font-bold' : 'hover:text-[#0066FF] hover:bg-slate-50'}`}
                >
                  Resources
                </button>

                {currentUser?.role === 'admin' && (
                  <button 
                    onClick={() => { handleTabClick('admin-panel', 'admin'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg cursor-pointer font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all ${activeTab === 'admin-panel' ? 'ring-2 ring-purple-400 font-extrabold' : ''}`}
                  >
                    Admin Desk
                  </button>
                )}
              </div>

              <div className="h-[1px] bg-slate-100 w-full" />

              {/* Sourcing & Auth section */}
              <div className="flex flex-col gap-3">
                {!currentUser ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        setAuthModalTab('login');
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-center border border-slate-200 text-[#0066FF] hover:bg-blue-50 font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        setAuthModalTab('signup');
                        setAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-center bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-lg text-sm transition-all cursor-pointer shadow-xs"
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="text-left leading-none">
                        <div className="text-xs font-black text-slate-800 leading-tight">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{currentUser.role}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-slate-500 hover:text-red-600 transition-all cursor-pointer p-2 hover:bg-slate-100 rounded-lg flex items-center gap-2 text-xs font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER DYNAMIC ROUTE CHANNELS */}
      <main className="flex-1">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <span className="w-8 h-8 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin inline-block" />
            <p className="text-xs text-slate-500 font-bold">Verifying certified B2B databases...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Home view */}
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <HomeView
                  categories={categories}
                  products={products}
                  vendors={vendors}
                  blogs={blogs}
                  banners={banners}
                  testimonials={testimonials}
                  onNavigateToPostRequirement={handleNavigateToPostRequirement}
                  onNavigateToTab={(tab) => {
                    if (tab === "dashboard") {
                      setCurrentRole("buyer");
                      setActiveTab("dashboard");
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  onAddToWishlist={handleAddToWishlist}
                  wishlist={wishlist}
                  onLikeBlog={handleLikeBlog}
                />
              </motion.div>
            )}

            {/* Blogs list view */}
            {activeTab === 'blogs' && (
              <motion.div
                key="blogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BlogsView blogs={blogs} onLikeBlog={handleLikeBlog} />
              </motion.div>
            )}

            {/* Buyer Profile/Dashboard */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {currentUser ? (
                  <UserPanel
                    currentUser={currentUser}
                    leads={leads}
                    products={products}
                    categories={categories}
                    notifications={notifications}
                    onPostLead={handlePostLead}
                    onUpdateProfile={handleUpdateProfile}
                    wishlist={wishlist}
                    onRemoveFromWishlist={handleAddToWishlist}
                    prefilledCategory={prefilledCategory}
                  />
                ) : (
                  <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                    <Lock className="w-12 h-12 text-[#0066FF] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h3>
                    <p className="text-sm text-slate-500 mb-6">Please log in to access your BANT confirmed sourcing workspace.</p>
                    <button 
                      onClick={() => {
                        setAuthModalTab('login');
                        setAuthModalOpen(true);
                      }}
                      className="bg-[#0066FF] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition"
                    >
                      Log In or Sign Up
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Direct access sub form for post requirement */}
            {activeTab === 'post' && (
              <motion.div
                key="post"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {currentUser ? (
                  <UserPanel
                    currentUser={currentUser}
                    leads={leads}
                    products={products}
                    categories={categories}
                    notifications={notifications}
                    onPostLead={handlePostLead}
                    onUpdateProfile={handleUpdateProfile}
                    wishlist={wishlist}
                    onRemoveFromWishlist={handleAddToWishlist}
                    prefilledCategory={prefilledCategory}
                  />
                ) : (
                  <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                    <Lock className="w-12 h-12 text-[#0066FF] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h3>
                    <p className="text-sm text-slate-500 mb-6">Please log in to post your requirements with full verification.</p>
                    <button 
                      onClick={() => {
                        setAuthModalTab('login');
                        setAuthModalOpen(true);
                      }}
                      className="bg-[#0066FF] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition"
                    >
                      Log In or Sign Up
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Vendor Portal view */}
            {activeTab === 'vendor-panel' && (
              <motion.div
                key="vendor-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {currentUser ? (
                  <VendorPanel
                    currentUser={currentUser}
                    vendorProfile={vendors.find(v => v.id === currentUser.vendorId) || vendors[0]}
                    products={products}
                    leads={leads}
                    categories={categories}
                    onRegisterVendor={(vData) => safeAlert("Partnership registered successfully! Documents queued for admin evaluation.")}
                    onUpdateVendor={handleUpdateVendor}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onClaimLead={handleClaimLead}
                    onUpdateLeadAssignmentStatus={handleUpdateLeadAssignmentStatus}
                    onUpdateProfile={handleUpdateProfile}
                    initialActiveTab={vendorInitialTab}
                  />
                ) : (
                  <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                    <Lock className="w-12 h-12 text-[#0066FF] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Partnership Hub</h3>
                    <p className="text-sm text-slate-500 mb-6">Sign in to claim qualified leads, view active RfQs, and manage your products.</p>
                    <button 
                      onClick={() => {
                        setAuthModalTab('login');
                        setAuthModalOpen(true);
                      }}
                      className="bg-[#0066FF] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition"
                    >
                      Log In or Sign Up
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Admin Desk view */}
            {activeTab === 'admin-panel' && (
              <motion.div
                key="admin-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AdminPanel
                  vendors={vendors}
                  products={products}
                  leads={leads}
                  categories={categories}
                  blogs={blogs}
                  banners={banners}
                  onApproveVendor={handleApproveVendor}
                  onApproveProduct={handleApproveProduct}
                  onRejectProduct={handleRejectProduct}
                  onToggleFeatureProduct={handleToggleFeatureProduct}
                  onAssignVendorToLead={handleAssignVendorToLead}
                  onAddBanner={handleAddBanner}
                  onDeleteBanner={handleDeleteBanner}
                  onAddBlog={handleAddBlog}
                  onDeleteBlog={handleDeleteBlog}
                  cmsPages={cmsPages}
                  onUpdateCMSPage={handleUpdateCMSPage}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onAddVendor={handleAddVendor}
                  onUpdateVendor={handleUpdateVendor}
                  onDeleteVendor={handleDeleteVendor}
                  registeredUsers={registeredUsers}
                  onDeleteUser={handleDeleteUser}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </motion.div>
            )}

            {/* Static CMS Pages */}
            {(activeTab === 'about' || activeTab === 'terms' || activeTab === 'privacy') && (
              <motion.div
                key="static-pages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto px-6 py-12 space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Platform Documentation</span>
                  <h2 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
                    {activeTab === 'about' ? 'About BANTConfirm' : activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                  </h2>
                </div>
                
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 leading-relaxed text-xs text-slate-600 space-y-4 shadow-xs">
                  {cmsPages[activeTab] ? (
                    cmsPages[activeTab].split("\n").map((para, idx) => {
                      const trimmed = para.trim();
                      if (!trimmed) return <div key={idx} className="h-2" />;
                      
                      // Check for bullet points starting with '-'
                      if (trimmed.startsWith("- ")) {
                        const content = trimmed.slice(2);
                        const colonIdx = content.indexOf(":");
                        if (colonIdx !== -1) {
                          const boldHeader = content.slice(0, colonIdx + 1);
                          const rest = content.slice(colonIdx + 1);
                          return (
                            <div key={idx} className="flex items-start gap-2 pl-4">
                              <span className="text-[#0066FF] font-black mt-0.5">•</span>
                              <p className="text-xs">
                                <strong className="text-slate-800 font-bold">{boldHeader}</strong>
                                {rest}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className="flex items-start gap-2 pl-4">
                            <span className="text-[#0066FF] font-black mt-0.5">•</span>
                            <p className="text-xs">{content}</p>
                          </div>
                        );
                      }
                      
                      // Check for numbered points starting with numbers
                      if (/^\d+\./.test(trimmed)) {
                        const colonIdx = trimmed.indexOf(":");
                        if (colonIdx !== -1) {
                          const boldHeader = trimmed.slice(0, colonIdx + 1);
                          const rest = trimmed.slice(colonIdx + 1);
                          return (
                            <p key={idx} className="text-xs text-slate-700">
                              <strong className="text-slate-900 font-extrabold">{boldHeader}</strong>
                              {rest}
                            </p>
                          );
                        }
                      }
                      
                      return <p key={idx} className="text-xs text-slate-600 font-medium leading-relaxed">{para}</p>;
                    })
                  ) : (
                    <p className="text-slate-400 italic">Dynamic content is loading...</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Become Partner view */}
            {activeTab === 'become-partner' && (
              <motion.div
                key="become-partner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BecomePartnerView
                  onRegisterSuccess={(data) => {
                    setCurrentUser(data.user);
                    fetchAllData();
                  }}
                  onNavigateToTab={(tab, subTab) => {
                    if (subTab) {
                      setVendorInitialTab(subTab as any);
                    } else {
                      setVendorInitialTab(undefined);
                    }
                    setActiveTab(tab);
                  }}
                />
              </motion.div>
            )}

            {/* Static Contact page */}
            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="max-w-2xl mx-auto px-6 py-12 space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Contact BANTConfirm Support Desk</h2>
                  <p className="text-xs text-slate-500">Immediate telephone routing and corporate registry audits.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-slate-400 uppercase text-[10px]">Registered HQ Address</p>
                      <p className="font-semibold text-slate-800 mt-1">BANTConfirm Corporate Hub, BKC, Mumbai, MH, 400051</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 uppercase text-[10px]">Registry Audit Helpline</p>
                      <p className="font-semibold text-[#0066FF] mt-1">+91 (022) 5555 7777</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 uppercase text-[10px]">Corporate Enquiries</p>
                      <p className="font-semibold text-[#0066FF] mt-1">support@bantconfirm.com</p>
                    </div>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); safeAlert("Enquiry dispatched safely! Sourcing desk callback queued."); }} className="space-y-3">
                    <input type="text" placeholder="Your Name" required className="w-full bg-slate-50 border p-2 rounded" />
                    <input type="email" placeholder="Corporate Email" required className="w-full bg-slate-50 border p-2 rounded" />
                    <textarea placeholder="Outline your inquiry details..." rows={3} required className="w-full bg-slate-50 border p-2 rounded" />
                    <button type="submit" className="w-full bg-[#0066FF] text-white font-bold py-2 rounded">Dispatch Inquiry</button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* FLOAT AI BUSINESS CONSULTANT CHATBOT */}
      <AIChatBot />

      {/* DYNAMIC SEO SITE CONFIGURE VIEW MODAL */}
      {seoViewerOpen && (
        <SEOViewer onClose={() => setSeoViewerOpen(false)} />
      )}

      {/* UNIFIED AUTHENTICATION MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {/* Header banner */}
            <div className="bg-[#0066FF] text-white px-6 py-5 text-center relative">
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-white/85 hover:text-white font-extrabold cursor-pointer text-base"
              >
                ✕
              </button>
              <h3 className="text-xl font-black">Welcome to BANTConfirm</h3>
              <p className="text-xs text-white/85 mt-1">Unified access for Buyers, Vendors, and Administrators</p>
            </div>
            
            {/* Toggle tabs */}
            <div className="flex border-b text-sm font-bold">
              <button 
                type="button"
                onClick={() => setAuthModalTab('login')}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${authModalTab === 'login' ? 'border-b-2 border-[#0066FF] text-[#0066FF]' : 'text-slate-500 hover:text-slate-850'}`}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => setAuthModalTab('signup')}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${authModalTab === 'signup' ? 'border-b-2 border-[#0066FF] text-[#0066FF]' : 'text-slate-500 hover:text-slate-855'}`}
              >
                Create Account
              </button>
            </div>             <div className="p-6 space-y-4">
              {authModalTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1 hidden">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Select Role</label>
                    <select 
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-hidden hidden"
                    >
                      <option value="buyer">Sourcing Buyer (Procurement / SME)</option>
                      <option value="vendor">Solution Provider (SaaS / Vendor)</option>
                      <option value="admin">Marketplace Administrator (Admin)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. info.bouuz@gmail.co" 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-lg text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Authenticate Session
                  </button>
                  <div className="pt-3 border-t border-slate-100 text-center space-y-1 select-none hidden">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Demo Credentials</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Admin: <span className="text-[#0066FF] font-extrabold">info.bouuz@gmail.com</span><br />
                      Buyer: <span className="text-slate-700 font-semibold">buyer@bantconfirm.com</span> | Vendor: <span className="text-slate-700 font-semibold">vendor@bantconfirm.com</span><br />
                      <span className="text-[9px] text-slate-400 italic">Password: any value</span>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignUpSubmit} className="space-y-3">
                  <div className="space-y-1 hidden">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Desired Profile Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignUpRole('buyer')}
                        className={`py-2 text-center rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${signUpRole === 'buyer' ? 'bg-blue-50 border-[#0066FF] text-[#0066FF]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                      >
                        Sourcing Buyer
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignUpRole('vendor')}
                        className={`py-2 text-center rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${signUpRole === 'vendor' ? 'bg-blue-50 border-[#0066FF] text-[#0066FF]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                      >
                        Solution Provider
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Full Name * (Mandatory)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Anand Sen" 
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Corporate Email * (Mandatory)</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. anand@corp.in" 
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Choose Password * (Mandatory)</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Enterprise Company Name (Optional - If Available)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Zenith Solutions Ltd" 
                      value={signUpCompany}
                      onChange={(e) => setSignUpCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Contact Mobile * (Mandatory)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="+91 99999 88888" 
                        value={signUpMobile}
                        onChange={(e) => setSignUpMobile(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">City Location * (Mandatory)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Noida" 
                        value={signUpCity}
                        onChange={(e) => setSignUpCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-lg text-xs transition-all shadow-sm cursor-pointer mt-2"
                  >
                    Register Account
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer 
        onNav={(tab) => {
          if (tab === "vendor-register") {
            setCurrentRole("vendor");
            setActiveTab("vendor-panel");
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }} 
        openSeoViewer={() => setSeoViewerOpen(true)}
      />

      {/* Real-time Administrator Toast Alert */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700/50 p-4 animate-bounce-short">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-xs text-white">{activeToast.title}</h4>
              <p className="text-[11px] text-slate-300 leading-normal">{activeToast.message}</p>
              {activeToast.action && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      activeToast.action?.();
                      setActiveToast(null);
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    {activeToast.actionLabel || "Verify Now"}
                  </button>
                  <button
                    onClick={() => setActiveToast(null)}
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => setActiveToast(null)} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
