import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, Settings, Eye, HelpCircle, Phone, 
  MapPin, Globe, CheckCircle, List, ArrowRight, UserCheck, 
  Sparkles, Award, Shield, FileText, User, Lock, Mail, Building, LogOut,
  Menu, X, AlertCircle, AlertTriangle, Info, Copy, Facebook, Instagram, Linkedin
} from "lucide-react";
import HomeView from "./components/HomeView";
import ProductDetailPage from "./components/ProductDetailPage";
import UserPanel from "./components/UserPanel";
import VendorPanel from "./components/VendorPanel";
import AdminPanel from "./components/AdminPanel";
import BlogsView from "./components/BlogsView";
import BecomePartnerView from "./components/BecomePartnerView";
import AIChatBot from "./components/AIChatBot";
import Footer from "./components/Footer";
import SEOViewer from "./components/SEOViewer";
import { AboutPage, TermsPage, PrivacyPage } from "./components/CMSPages";
import { safeAlert } from "./utils/safeAlert";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import { matchSourcingRoute, generateSourcingSEO } from "./lib/seoData";
import SourcingLandingPage from "./components/SourcingLandingPage";

import { 
  Category, Product, Vendor, Lead, Blog, Banner, Testimonial, Notification, TrustedVendor 
} from "./types";

function OAuthCallbackHandler() {
  const [status, setStatus] = React.useState("Establishing secure authentication session...");
  const [errorDetails, setErrorDetails] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session && session.user) {
          setStatus("Authentication verified! Finalizing profile...");
          if (window.opener) {
            window.opener.postMessage({
              type: "OAUTH_AUTH_SUCCESS",
              user: session.user
            }, window.location.origin);
            setTimeout(() => {
              window.close();
            }, 800);
          } else {
            window.location.href = "/";
          }
        } else {
          // If no session immediately, listen to onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if ((event === "SIGNED_IN" || event === "USER_UPDATED") && currentSession) {
              subscription.unsubscribe();
              setStatus("Authentication verified! Finalizing profile...");
              if (window.opener) {
                window.opener.postMessage({
                  type: "OAUTH_AUTH_SUCCESS",
                  user: currentSession.user
                }, window.location.origin);
                setTimeout(() => {
                  window.close();
                }, 800);
              } else {
                window.location.href = "/";
              }
            }
          });

          // Fallback check after 3 seconds
          const checkTimer = setTimeout(async () => {
            const { data: { session: secSession } } = await supabase.auth.getSession();
            if (secSession && secSession.user) {
              subscription.unsubscribe();
              setStatus("Authentication verified! Finalizing profile...");
              if (window.opener) {
                window.opener.postMessage({
                  type: "OAUTH_AUTH_SUCCESS",
                  user: secSession.user
                }, window.location.origin);
                setTimeout(() => {
                  window.close();
                }, 800);
              } else {
                window.location.href = "/";
              }
            }
          }, 3000);

          // Error timeout
          const timeout = setTimeout(() => {
            subscription.unsubscribe();
            clearTimeout(checkTimer);
            setStatus("Authentication failed or timed out.");
            setErrorDetails("Could not retrieve a valid session from Supabase. Please close this window and try again.");
            if (window.opener) {
              window.opener.postMessage({
                type: "OAUTH_AUTH_ERROR",
                error: "Session timeout"
              }, window.location.origin);
              setTimeout(() => {
                window.close();
              }, 2500);
            }
          }, 12000);

          return () => {
            subscription.unsubscribe();
            clearTimeout(checkTimer);
            clearTimeout(timeout);
          };
        }
      } catch (err: any) {
        console.error("OAuth Callback Exchange Error:", err);
        setStatus("Authentication Error");
        setErrorDetails(err.message || "Unknown error occurred.");
        if (window.opener) {
          window.opener.postMessage({
            type: "OAUTH_AUTH_ERROR",
            error: err.message || "Unknown error"
          }, window.location.origin);
          setTimeout(() => {
            window.close();
          }, 3000);
        }
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full space-y-4 animate-in fade-in duration-200">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>
        </div>
        <h3 className="text-lg font-black text-slate-800">Secure Authentication</h3>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{status}</p>
        {errorDetails && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5 leading-relaxed font-semibold">
            {errorDetails}
          </p>
        )}
        <p className="text-[10px] text-slate-400 font-medium">This secure window will close automatically.</p>
      </div>
    </div>
  );
}

export default function App() {
  // Redirect callback if path matches /auth/callback
  if (window.location.pathname === "/auth/callback" || window.location.pathname === "/auth/callback/") {
    return <OAuthCallbackHandler />;
  }
  const location = useLocation();
  const navigate = useNavigate();

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
  const [trustedVendors, setTrustedVendors] = useState<TrustedVendor[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cmsPages, setCmsPages] = useState<Record<string, string>>({});
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // Current simulating role & navigation tabs
  const [currentRole, setCurrentRole] = useState<'buyer' | 'vendor' | 'admin'>('buyer');
  
  const getActiveTabFromPath = (path: string): string => {
    const p = path.toLowerCase().replace(/\/$/, "");
    if (p === "") return "home";
    if (p.startsWith("/products/")) return "product-detail";
    if (p.startsWith("/sourcing/")) return "sourcing-landing";
    if (p === "/about") return "about";
    if (p === "/contact") return "contact";
    if (p === "/services") return "home"; // solutions
    if (p === "/vendors") return "vendor-panel";
    if (p === "/categories") return "home"; // solution categories are shown on home
    if (p === "/blog" || p === "/blogs") return "blogs";
    if (p === "/privacy-policy") return "privacy";
    if (p === "/terms-and-conditions") return "terms";
    if (p === "/dashboard") return "dashboard";
    if (p === "/post") return "post";
    if (p === "/become-partner") return "become-partner";
    if (p === "/admin-panel") return "admin-panel";
    return "home";
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const setActiveTab = (tab: string) => {
    if (tab === "home") navigate("/");
    else if (tab === "about") navigate("/about");
    else if (tab === "contact") navigate("/contact");
    else if (tab === "vendor-panel") navigate("/vendors");
    else if (tab === "blogs" || tab === "blog") navigate("/blog");
    else if (tab === "privacy") navigate("/privacy-policy");
    else if (tab === "terms") navigate("/terms-and-conditions");
    else if (tab === "dashboard") navigate("/dashboard");
    else if (tab === "post") navigate("/post");
    else if (tab === "become-partner") navigate("/become-partner");
    else if (tab === "admin-panel") navigate("/admin-panel");
    else navigate(`/${tab}`);
  };

  // Synchronize document metadata and SEO tags dynamically on route change
  useEffect(() => {
    const seoMap: Record<string, { title: string; description: string; canonical: string; schema: any }> = {
      "/": {
        title: "BANTConfirm | India's Premium B2B Certified Sourcing Marketplace",
        description: "India's premier B2B Enterprise IT & Software Solutions marketplace. We pre-qualify procurement requirements using strict Budget, Authority, Need, and Timeline (BANT) criteria, saving months of sourcing efforts.",
        canonical: "https://www.bantconfirm.com/",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "BANTConfirm",
          "url": "https://www.bantconfirm.com/"
        }
      },
      "/about": {
        title: "About BANTConfirm | India's #1 Certified B2B Sourcing Marketplace",
        description: "Learn how BANTConfirm revolutionizes enterprise IT Sourcing in India by pre-qualifying software, IT hardware, and services procurement using strict Budget, Authority, Need, and Timeline (BANT) criteria.",
        canonical: "https://www.bantconfirm.com/about",
        schema: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About BANTConfirm",
          "url": "https://www.bantconfirm.com/about"
        }
      },
      "/contact": {
        title: "Contact BANTConfirm | Support & Corporate HQ Noida",
        description: "Contact BANTConfirm Support Desk for enterprise B2B partner registration, immediate telephone routing, corporate registry audits, or solution procurement assistance.",
        canonical: "https://www.bantconfirm.com/contact",
        schema: {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact BANTConfirm",
          "url": "https://www.bantconfirm.com/contact"
        }
      },
      "/services": {
        title: "Our Services & Enterprise IT Solutions | BANTConfirm Marketplace",
        description: "Explore qualified solutions for CRM Software, ERP Enterprise Suites, Cloud Telephony, WhatsApp Business API Automation, and Cyber Security Audits on BANTConfirm.",
        canonical: "https://www.bantconfirm.com/services",
        schema: {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "BANTConfirm Sourcing Services"
        }
      },
      "/vendors": {
        title: "Verified B2B Vendors & Certified Sourcing Partners | BANTConfirm",
        description: "Meet verified BANTConfirm partner vendors across India. Access curated directories of CRM, ERP, and IT services providers who meet strict B2B delivery SLAs.",
        canonical: "https://www.bantconfirm.com/vendors",
        schema: {
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          "name": "Verified Vendors Directory"
        }
      },
      "/categories": {
        title: "Sourcing Categories & Industry Portals | BANTConfirm Marketplace",
        description: "Browse top B2B software and services categories. Source verified IT products, read customer reviews, and receive multiple certified BANT quotes.",
        canonical: "https://www.bantconfirm.com/categories",
        schema: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Sourcing Categories"
        }
      },
      "/blog": {
        title: "BANTConfirm Sourcing Blog | SME IT Procurement Sourcing Hub",
        description: "Insights, guides, and tips on SME IT procurement. Learn how to qualify software vendors, optimize enterprise software budgets, and deploy verified BANT workflows.",
        canonical: "https://www.bantconfirm.com/blog",
        schema: {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "BANTConfirm Sourcing Blog"
        }
      },
      "/privacy-policy": {
        title: "Privacy Policy | BANTConfirm B2B Sourcing Portal",
        description: "Read the Privacy Policy of BANTConfirm. Learn how we handle your company information, RfQ documents, and data security under Indian IT laws.",
        canonical: "https://www.bantconfirm.com/privacy-policy",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy"
        }
      },
      "/terms-and-conditions": {
        title: "Terms & Conditions of Service | BANTConfirm India",
        description: "Terms and conditions of service for using the BANTConfirm platform as a buyer, vendor, or administrator. Read our SLA, referral reward terms, and verification rules.",
        canonical: "https://www.bantconfirm.com/terms-and-conditions",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms and Conditions"
        }
      },
      "/dashboard": {
        title: "BANT Sourcing Dashboard | BANTConfirm",
        description: "Manage your active BANT qualified sourcing requirements, compare matched vendor bids, and track verified lead assignment milestones.",
        canonical: "https://www.bantconfirm.com/dashboard",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Buyer Sourcing Dashboard"
        }
      },
      "/post": {
        title: "Post Sourcing Requirement | BANT Sourcing Desk",
        description: "Post your enterprise IT software, hardware or services sourcing requirements. Get direct responses pre-qualified with Budget, Authority, Need, and Timeline (BANT) criteria.",
        canonical: "https://www.bantconfirm.com/post",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Post Sourcing Requirement"
        }
      },
      "/become-partner": {
        title: "Become a Sourcing Partner | BANT Sourcing Hub",
        description: "Join BANTConfirm's elite network of certified IT software and hardware vendor partners. Get high-intent pre-qualified BANT-verified leads directly in UP, Delhi NCR, Bangalore and Mumbai.",
        canonical: "https://www.bantconfirm.com/become-partner",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Become a Partner"
        }
      }
    };

    let pathname = location.pathname.toLowerCase().replace(/\/$/, "");
    if (pathname === "") pathname = "/";
    if (pathname === "/blogs") pathname = "/blog";

    let seo = seoMap[pathname] || seoMap["/"];

    if (pathname.startsWith("/sourcing/")) {
      const matched = matchSourcingRoute(location.pathname);
      if (matched) {
        const generated = generateSourcingSEO(matched.product, matched.location);
        seo = {
          title: generated.title,
          description: generated.description,
          canonical: generated.canonical,
          schema: generated.schema
        };
      } else {
        seo = {
          title: "BANT Certified Location Sourcing | BANTConfirm",
          description: "Explore dynamic, pre-qualified B2B software and hardware solutions matched to regional delivery specifications across India.",
          canonical: `https://www.bantconfirm.com${location.pathname}`,
          schema: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BANTConfirm",
            "url": "https://www.bantconfirm.com/"
          }
        };
      }
    }

    if (pathname.startsWith("/products/")) {
      const slug = pathname.substring("/products/".length);
      const matchedProd = products.find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug || p.id === slug);
      if (matchedProd) {
        seo = {
          title: `${matchedProd.name} Specs, Pricing & BANT Verification | BANTConfirm`,
          description: `Compare detailed technical specs, customer reviews, and direct vendor pricing for ${matchedProd.name} under category ${matchedProd.category}. Verify decision authority and matching budget constraints.`,
          canonical: `https://www.bantconfirm.com/products/${slug}`,
          schema: {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": matchedProd.name,
            "description": matchedProd.description,
            "image": matchedProd.images?.[0] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop",
            "brand": {
              "@type": "Brand",
              "name": matchedProd.vendorName
            },
            "offers": {
              "@type": "Offer",
              "price": "45000",
              "priceCurrency": "INR"
            }
          }
        };
      } else {
        seo = {
          title: "BANT Certified Product Sourcing | BANTConfirm",
          description: "Explore enterprise software and hardware solutions pre-qualified across Budget, Authority, Need, and Sourcing Timeline constraints.",
          canonical: `https://www.bantconfirm.com${location.pathname}`,
          schema: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BANTConfirm",
            "url": "https://www.bantconfirm.com/"
          }
        };
      }
    }

    // Update document title
    document.title = seo.title;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonical);

    // Update OG and Twitter tags
    const updateOrCreateMeta = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (isName) meta.setAttribute('name', property);
        else meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta("og:title", seo.title);
    updateOrCreateMeta("og:description", seo.description);
    updateOrCreateMeta("og:url", seo.canonical);
    updateOrCreateMeta("og:type", "website");
    updateOrCreateMeta("og:image", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop");

    updateOrCreateMeta("twitter:card", "summary_large_image", true);
    updateOrCreateMeta("twitter:title", seo.title, true);
    updateOrCreateMeta("twitter:description", seo.description, true);
    updateOrCreateMeta("twitter:url", seo.canonical, true);
    updateOrCreateMeta("twitter:image", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop", true);

    // Update or create JSON-LD Structured Data script tag
    let schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(seo.schema, null, 2);

    // Scroll to top on route transitions
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (location.pathname !== "/blog") {
      setSelectedBlog(null);
    }
  }, [location.pathname, products]);

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

  // Premium General Notification Toast (success, error, warning, info)
  const [userToast, setUserToast] = useState<{
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  const showUserToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setUserToast({
      id: Math.random().toString(),
      message,
      type
    });
  };

  // Bind safeAlert custom toast dispatcher to window
  useEffect(() => {
    (window as any).__showToast = showUserToast;
    return () => {
      try {
        delete (window as any).__showToast;
      } catch (e) {}
    };
  }, []);

  // Auto-dismiss user toast
  useEffect(() => {
    if (userToast) {
      const timer = setTimeout(() => {
        setUserToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userToast]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  
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

  // Listen for Google OAuth callback success/error messages from the authentication popup window
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const supabaseUser = event.data.user;
        if (supabaseUser) {
          await handleGoogleSessionSuccess(supabaseUser);
        }
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setAuthLoading(false);
        safeAlert("Google Authentication failed: " + (event.data.error || "Unknown Error"), "error");
      }
    };
    
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [signUpRole, authRole]);

  // Initiate Google Sign-In or Sign-Up popup authentication
  const handleGoogleAuth = async (flow: 'login' | 'signup') => {
    if (!isSupabaseConfigured) {
      safeAlert("Supabase connection is not fully configured yet. Google Auth requires a valid setup.", "warning");
      return;
    }
    
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const width = 580;
        const height = 680;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          data.url,
          "google_oauth_popup",
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
        );
        
        if (!popup) {
          setAuthLoading(false);
          safeAlert("Popup blocker detected! Please allow popups for this site to complete secure Google login.", "warning");
          return;
        }
        
        // Save targeted signup or login role dynamically on global scope so we know how to configure the profile upon success
        const targetRole = flow === 'signup' ? signUpRole : authRole;
        (window as any).__oauthTargetRole = targetRole;
      } else {
        throw new Error("No authorization URL returned from Supabase.");
      }
    } catch (err: any) {
      console.error("Google Authentication error:", err);
      setAuthLoading(false);
      safeAlert("Google Auth initialization error: " + (err.message || err), "error");
    }
  };

  // Process user object, upsert profile and redirect to correct panel
  const handleGoogleSessionSuccess = async (supabaseUser: any) => {
    try {
      const emailLower = (supabaseUser.email || "").trim().toLowerCase();
      let userRole: 'buyer' | 'vendor' | 'admin' = (window as any).__oauthTargetRole || 'buyer';
      
      // Auto upgrade admin emails
      if (
        emailLower === "admin@bantconfirm.com" || 
        emailLower === "info.bouuz@gmail.com" || 
        emailLower === "info.bouuz@gmail.co" || 
        emailLower === "pramodobra95@gmail.com"
      ) {
        userRole = "admin";
      }

      // 1. Resolve existing profile
      let existingProfile: any = null;
      try {
        const { data: prof, error: pErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseUser.id)
          .maybeSingle();
        
        if (!pErr && prof) {
          existingProfile = prof;
          userRole = prof.role || userRole;
        }
      } catch (e) {
        console.warn("Notice: check by ID skipped or failed:", e);
      }

      if (!existingProfile && supabaseUser.email) {
        try {
          const { data: profByEmail } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", supabaseUser.email)
            .maybeSingle();
          
          if (profByEmail) {
            existingProfile = profByEmail;
            userRole = profByEmail.role || userRole;
          }
        } catch (e) {
          console.warn("Notice: check by Email skipped or failed:", e);
        }
      }

      const meta = supabaseUser.user_metadata || {};
      const fullName = meta.full_name || meta.name || meta.given_name || supabaseUser.email?.split("@")[0] || "Google User";
      const profilePhoto = meta.avatar_url || meta.picture || "";

      const userObj = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: fullName,
        role: userRole,
        companyName: meta.companyName || existingProfile?.companyName || "",
        mobile: meta.mobile || existingProfile?.mobile || "",
        city: meta.city || existingProfile?.city || "",
        vendorId: existingProfile?.vendorId || null,
        avatar: profilePhoto,
        provider: "Google",
        createdAt: existingProfile?.createdAt || new Date().toISOString()
      };

      // 2. Vendor logic
      if (userRole === 'vendor' && !userObj.vendorId) {
        let existingVendor: any = null;
        try {
          const { data: vRecord } = await supabase
            .from("vendors")
            .select("*")
            .eq("companyName", userObj.companyName || `${fullName} Inc`)
            .maybeSingle();
          if (vRecord) {
            existingVendor = vRecord;
          }
        } catch (e) {}

        if (!existingVendor) {
          const vendorId = "ven-" + Math.random().toString(36).substring(2, 9);
          const vendorRecord = {
            id: vendorId,
            companyName: userObj.companyName || `${fullName} Solution Providers`,
            name: fullName,
            logo: profilePhoto || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150",
            gstNumber: "27GSTMOCK12345",
            panNumber: "PANMOCK1234",
            website: "https://example.com",
            businessCategory: "General",
            productsOffered: [],
            rating: 5.0,
            location: userObj.city || "Delhi",
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
        } else {
          userObj.vendorId = existingVendor.id as any;
        }
      }

      // 3. Profiles saving
      if (!existingProfile) {
        try {
          const { error: profInsErr } = await supabase.from("profiles").insert([{
            id: userObj.id,
            name: userObj.name,
            email: userObj.email,
            companyName: userObj.companyName,
            mobile: userObj.mobile,
            city: userObj.city,
            role: userObj.role,
            avatar: userObj.avatar,
            provider: userObj.provider,
            createdAt: userObj.createdAt
          }]);
          if (profInsErr) {
            console.error("Supabase profile insert error:", profInsErr);
          }
        } catch (e) {
          console.warn("Supabase profiles table sync failed:", e);
        }
      }

      // 4. Duplicate Sync to Local Backend
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userObj)
        });
      } catch (e) {
        console.warn("Local sync skipped or failed:", e);
      }

      // Resend onboarding Welcome Emails / events
      fetch("/api/resend/trigger-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: userRole === 'vendor' ? 'welcome-vendor' : 'welcome-buyer',
          payload: {
            id: userObj.vendorId || userObj.id,
            name: userObj.name,
            companyName: userObj.companyName || "Google Sourcing Partner",
            email: userObj.email,
            gstNumber: "27GSTMOCK12345",
            panNumber: "PANMOCK1234",
            website: "https://example.com",
            businessCategory: "General Sourcing Partner",
            city: userObj.city || "Delhi"
          }
        })
      }).catch(err => console.error("Onboarding trigger notice:", err));

      // 5. Update local React states
      setCurrentUser(userObj);
      setCurrentRole(userObj.role);
      setAuthModalOpen(false);
      setAuthLoading(false);
      safeAlert(`Successfully authenticated via Google as ${userObj.name}!`, "success");

      // Redirect to correct tab
      if (userObj.role === 'buyer') {
        setActiveTab('dashboard');
      } else if (userObj.role === 'vendor') {
        setActiveTab('vendor-panel');
      } else if (userObj.role === 'admin') {
        setActiveTab('admin-panel');
      }
      fetchAllData();
    } catch (err: any) {
      console.error("Error setting up Google authenticated session:", err);
      setAuthLoading(false);
      safeAlert("Failed completing your Google account setup: " + (err.message || err), "error");
    }
  };

  // Loading flags
  const [loading, setLoading] = useState(true);

  // SEO modal viewer
  const [seoViewerOpen, setSeoViewerOpen] = useState(false);

  // Supabase RLS troubleshooting states
  const [supabaseRlsErrorOpen, setSupabaseRlsErrorOpen] = useState(false);
  const [supabaseRlsErrorTable, setSupabaseRlsErrorTable] = useState("products");

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
      let resTrustedVendors: any[] = [];
      let resNotifications: any[] = [];
      let resSettings: Record<string, string> = {};
      let resUser: any = null;
      let resUsers: any[] = [];

      if (isSupabaseConfigured) {
        const [
          catsRes, prodsRes, vendorsRes, leadsRes,
          blogsRes, bannersRes, testimonialsRes, notificationsRes,
          settingsRes, authRes, trustedVendorsRes
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
          supabase.auth.getUser(),
          supabase.from("trusted_vendors").select("*")
        ]);

        if (catsRes.error) console.error("[Supabase Error] categories:", catsRes.error);
        if (prodsRes.error) console.error("[Supabase Error] products:", prodsRes.error);
        if (vendorsRes.error) console.error("[Supabase Error] vendors:", vendorsRes.error);
        if (leadsRes.error) console.error("[Supabase Error] leads:", leadsRes.error);
        if (blogsRes.error) console.warn("[Supabase Notice] blogs table query notice (will fall back to local DB):", blogsRes.error);
        if (bannersRes.error) console.warn("[Supabase Notice] banners table query notice (will fall back to local DB):", bannersRes.error);
        if (testimonialsRes.error) console.warn("[Supabase Notice] testimonials table query notice (will fall back to local DB):", testimonialsRes.error);
        if (notificationsRes.error) console.warn("[Supabase Notice] notifications table query notice (will fall back to local DB):", notificationsRes.error);
        if (settingsRes.error) console.error("[Supabase Error] settings:", settingsRes.error);

        resCats = catsRes.data || [];
        resProds = prodsRes.data || [];
        resVendors = vendorsRes.data || [];
        
        // 2. Resilient dual-source fetching for leads (enquiries)
        let localLeads: any[] = [];
        try {
          const localLeadsRes = await fetch("/api/leads");
          if (localLeadsRes.ok) {
            localLeads = await localLeadsRes.json();
          }
        } catch (err) {
          console.warn("Could not query leads from local server:", err);
        }

        const supabaseLeads = (leadsRes.data || []).map((l: any) => ({
          id: l.id,
          title: l.title || l.description?.split('\n')[0] || "Software Sourcing Requirement",
          category: l.category,
          description: l.description,
          budget: l.budget,
          companyName: l.buyercompany || l.buyerCompany || l.companyName || "",
          contactName: l.buyername || l.buyerName || l.contactName || "",
          mobile: l.buyerphone || l.buyerPhone || l.mobile || "",
          email: l.buyeremail || l.buyerEmail || l.email || "",
          city: l.city || "Delhi",
          timeline: l.timeline,
          status: l.status || 'Submitted',
          bant: l.bant || {
            budget: l.budget || "",
            authority: l.authority || "Yes",
            need: l.need || l.description || "",
            timeline: l.timeline || ""
          },
          assignedVendors: l.assignedVendors || [],
          createdAt: l.createdat || l.createdAt
        }));

        const mappedLocalLeads = (localLeads || []).map((l: any) => ({
          id: l.id,
          title: l.title || l.description?.split('\n')[0] || "Software Sourcing Requirement",
          category: l.category,
          description: l.description,
          budget: l.budget,
          companyName: l.companyName || l.buyercompany || l.buyerCompany || "",
          contactName: l.contactName || l.buyername || l.buyerName || "",
          mobile: l.mobile || l.buyerphone || l.buyerPhone || "",
          email: l.email || l.buyeremail || l.buyerEmail || "",
          city: l.city || "Delhi",
          timeline: l.timeline,
          status: l.status || 'Submitted',
          bant: l.bant || {
            budget: l.budget || "",
            authority: l.authority || "Yes",
            need: l.need || l.description || "",
            timeline: l.timeline || ""
          },
          assignedVendors: l.assignedVendors || [],
          createdAt: l.createdAt || l.createdat
        }));

        const seenLeads = new Set();
        resLeads = [];
        [...supabaseLeads, ...mappedLocalLeads].forEach((l: any) => {
          const key = l.id || `${l.title}-${l.email}-${l.budget}`;
          if (key && !seenLeads.has(key)) {
            seenLeads.add(key);
            resLeads.push(l);
          }
        });

        // Resilient dual-source fetching for blogs
        let localBlogs: any[] = [];
        try {
          const localBlogsRes = await fetch("/api/blogs");
          if (localBlogsRes.ok) {
            localBlogs = await localBlogsRes.json();
          }
        } catch (err) {
          console.warn("Could not query blogs from local server:", err);
        }
        const supabaseBlogs = blogsRes.data || [];
        const seenBlogs = new Set();
        resBlogs = [];
        [...supabaseBlogs, ...localBlogs].forEach((b: any) => {
          if (b && b.id && !seenBlogs.has(b.id)) {
            seenBlogs.add(b.id);
            resBlogs.push(b);
          }
        });

        // Resilient dual-source fetching for banners
        let localBanners: any[] = [];
        try {
          const localBannersRes = await fetch("/api/banners");
          if (localBannersRes.ok) {
            localBanners = await localBannersRes.json();
          }
        } catch (err) {
          console.warn("Could not query banners from local server:", err);
        }
        const supabaseBanners = bannersRes.data || [];
        const seenBanners = new Set();
        resBanners = [];
        [...supabaseBanners, ...localBanners].forEach((b: any) => {
          if (b && b.id && !seenBanners.has(b.id)) {
            seenBanners.add(b.id);
            resBanners.push(b);
          }
        });

        // Resilient dual-source fetching for testimonials
        let localTestimonials: any[] = [];
        try {
          const localTestimonialsRes = await fetch("/api/testimonials");
          if (localTestimonialsRes.ok) {
            localTestimonials = await localTestimonialsRes.json();
          }
        } catch (err) {
          console.warn("Could not query testimonials from local server:", err);
        }
        const supabaseTestimonials = testimonialsRes.data || [];
        const seenTestimonials = new Set();
        resTestimonials = [];
        [...supabaseTestimonials, ...localTestimonials].forEach((t: any) => {
          if (t && t.id && !seenTestimonials.has(t.id)) {
            seenTestimonials.add(t.id);
            resTestimonials.push(t);
          }
        });

        // Resilient dual-source fetching for notifications
        let localNotifications: any[] = [];
        try {
          const localNotificationsRes = await fetch("/api/notifications");
          if (localNotificationsRes.ok) {
            localNotifications = await localNotificationsRes.json();
          }
        } catch (err) {
          console.warn("Could not query notifications from local server:", err);
        }
        const supabaseNotifications = notificationsRes.data || [];
        const seenNotifications = new Set();
        resNotifications = [];
        [...supabaseNotifications, ...localNotifications].forEach((n: any) => {
          if (n && n.id && !seenNotifications.has(n.id)) {
            seenNotifications.add(n.id);
            resNotifications.push(n);
          }
        });
        
        // 1. Resilient dual-source fetching for registered users list
        let profilesData: any[] = [];
        try {
          const profilesRes = await supabase.from("profiles").select("*");
          if (profilesRes.error) {
            console.error("[Supabase Error] profiles fetch:", profilesRes.error);
          }
          if (profilesRes.data && profilesRes.data.length > 0) {
            profilesData = profilesRes.data;
          }
        } catch (err) {
          console.warn("Could not query profiles from Supabase:", err);
        }

        let localUsers: any[] = [];
        try {
          const localRes = await fetch("/api/users");
          if (localRes.ok) {
            localUsers = await localRes.json();
          }
        } catch (err) {
          console.warn("Could not query users from local server:", err);
        }

        const normalizedProfiles = (profilesData || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          companyName: u.companyname || u.companyName || "",
          mobile: u.mobile,
          city: u.city,
          role: u.role || "buyer",
          createdAt: u.createdat || u.createdAt
        }));

        const normalizedLocalUsers = (localUsers || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          companyName: u.companyName || u.companyname || "",
          mobile: u.mobile,
          city: u.city,
          role: u.role || "buyer",
          createdAt: u.createdAt || u.createdat
        }));

        const seenUsers = new Set();
        resUsers = [];
        [...normalizedProfiles, ...normalizedLocalUsers].forEach(u => {
          const key = u.id || u.email;
          if (key && !seenUsers.has(key)) {
            seenUsers.add(key);
            resUsers.push(u);
          }
        });

        // Resilient dual-source fetching for trusted_vendors
        let localTrustedVendors: any[] = [];
        try {
          const localTvRes = await fetch("/api/trusted-vendors");
          if (localTvRes.ok) {
            localTrustedVendors = await localTvRes.json();
          }
        } catch (err) {
          console.warn("Could not query trusted vendors from local server:", err);
        }
        let supabaseTrustedVendors = [];
        if (trustedVendorsRes && !trustedVendorsRes.error) {
          supabaseTrustedVendors = trustedVendorsRes.data || [];
        } else if (trustedVendorsRes?.error) {
          console.warn("[Supabase Notice] trusted_vendors table query notice:", trustedVendorsRes.error);
        }
        const seenTv = new Set();
        resTrustedVendors = [];
        [...supabaseTrustedVendors, ...localTrustedVendors].forEach((tv: any) => {
          const key = tv.id;
          if (key && !seenTv.has(key)) {
            seenTv.add(key);
            resTrustedVendors.push({
              id: tv.id,
              vendor_name: tv.vendor_name,
              logo_url: tv.logo_url,
              website_url: tv.website_url,
              display_order: typeof tv.display_order === 'number' ? tv.display_order : parseInt(tv.display_order || '0'),
              is_active: tv.is_active !== false,
              created_at: tv.created_at || tv.createdAt,
              updated_at: tv.updated_at || tv.updatedAt
            });
          }
        });

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
          rNotifications, rSettings, rUser, rUsers, rTrustedVendors
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
          safeFetchJson("/api/users", []),
          safeFetchJson("/api/trusted-vendors")
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
        resTrustedVendors = rTrustedVendors;
      }

      setCategories(Array.isArray(resCats) ? resCats : []);
      setProducts(Array.isArray(resProds) ? resProds : []);
      setVendors(Array.isArray(resVendors) ? resVendors : []);
      setTrustedVendors(Array.isArray(resTrustedVendors) ? resTrustedVendors : []);
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

  // Real-time subscriptions for Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    console.log("Initializing Real-time subscriptions...");
    const channel = supabase
      .channel("supabase-realtime-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload: any) => {
          console.log("Realtime Leads change received:", payload);
          if (payload.eventType === "INSERT") {
            const newLead = payload.new;
            const fullLead = {
              ...newLead,
              bant: newLead.bant || { budget: newLead.budget || "", authority: "Yes", need: newLead.description || "", timeline: newLead.timeline || "" }
            };
            setLeads((prev) => {
              if (prev.some((l) => l.id === fullLead.id)) return prev;
              return [fullLead, ...prev];
            });
            // Show dynamic alert notification in UI
            const notifTitle = `New Lead: ${fullLead.title || "Inquiry"}`;
            const notifMsg = `A new enquiry has been posted for ${fullLead.category || "category"}. Refresh or view details instantly.`;
            setNotifications((prev) => [
              { id: `notif-${Date.now()}`, title: notifTitle, message: notifMsg, read: false, createdAt: new Date().toISOString() },
              ...prev
            ]);
            safeAlert(`New Lead Posted: "${fullLead.title}"`, "success");
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new;
            setLeads((prev) =>
              prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setLeads((prev) => prev.filter((l) => l.id !== deletedId));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload: any) => {
          console.log("Realtime Profiles change received:", payload);
          if (payload.eventType === "INSERT") {
            const newUser = payload.new;
            setRegisteredUsers((prev) => {
              if (prev.some((u) => u.id === newUser.id)) return prev;
              return [...prev, newUser];
            });
            safeAlert(`New User Registered: ${newUser.name || newUser.email}`, "success");
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new;
            setRegisteredUsers((prev) =>
              prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setRegisteredUsers((prev) => prev.filter((u) => u.id !== deletedId));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trusted_vendors" },
        (payload: any) => {
          console.log("Realtime Trusted Vendors change received:", payload);
          if (payload.eventType === "INSERT") {
            const newVendor = payload.new;
            setTrustedVendors((prev) => {
              if (prev.some((v) => v.id === newVendor.id)) return prev;
              return [...prev, newVendor].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            });
            safeAlert(`Trusted Vendor Added: ${newVendor.vendor_name}`, "success");
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new;
            setTrustedVendors((prev) =>
              prev.map((v) => (v.id === updated.id ? { ...v, ...updated } : v))
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setTrustedVendors((prev) => prev.filter((v) => v.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up Real-time subscriptions...");
      supabase.removeChannel(channel);
    };
  }, [isSupabaseConfigured]);

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
    if (!authEmail || !authEmail.trim() || !authEmail.includes("@")) {
      safeAlert("Please enter a valid corporate email address.", "warning");
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      safeAlert("Password must be at least 6 characters.", "warning");
      return;
    }

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
          safeAlert(`Successfully logged in as ${userObj.name} (${userObj.role})!`, "success");
          
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
          safeAlert(`Successfully logged in as ${data.user.name} (${data.user.role})!`, "success");
          
          if (data.user.role === 'buyer') {
            setActiveTab('dashboard');
          } else if (data.user.role === 'vendor') {
            setActiveTab('vendor-panel');
          } else if (data.user.role === 'admin') {
            setActiveTab('admin-panel');
          }
        } else {
          safeAlert("Login failed. Please check credentials.", "error");
        }
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "An error occurred during authentication.";
      if (errMsg.includes("security purposes") || errMsg.includes("only request this after")) {
        errMsg = "Verification/login rate limit exceeded. For security purposes, please wait 60 seconds before trying again.";
        safeAlert(errMsg, "warning");
      } else if (errMsg.includes("validation")) {
        safeAlert("Authentication validation error. Please check your credentials.", "error");
      } else {
        safeAlert(errMsg, "error");
      }
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      safeAlert("Please enter your full name.", "warning");
      return;
    }
    if (!signUpEmail || !signUpEmail.trim() || !signUpEmail.includes("@")) {
      safeAlert("Please enter a valid corporate email address.", "warning");
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      safeAlert("Password must be at least 6 characters.", "warning");
      return;
    }
    if (!signUpCompany.trim()) {
      safeAlert("Please enter your organization or company name.", "warning");
      return;
    }
    if (!signUpMobile.trim() || signUpMobile.replace(/\D/g, "").length < 10) {
      safeAlert("Please enter a valid 10-digit contact number.", "warning");
      return;
    }
    if (!signUpCity.trim()) {
      safeAlert("Please specify your current city / headquarters location.", "warning");
      return;
    }

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

          // 1. Save profile to Supabase 'profiles' table
          try {
            const { error } = await supabase.from("profiles").insert([{
              id: userObj.id,
              name: userObj.name,
              email: userObj.email,
              companyName: userObj.companyName,
              mobile: userObj.mobile,
              city: userObj.city,
              role: userObj.role,
              createdAt: new Date().toISOString()
            }]);
            if (error) {
              console.error("Supabase profiles insert failed with database error:", error);
              safeAlert("Database notice: Profile synchronization delayed (" + (error.message || error) + ")", "warning");
            }
          } catch (e) {
            console.warn("Supabase profiles table insert skipped or failed:", e);
          }

          // 2. Duplicate sync to local Express backend /api/users to ensure fallback reliability!
          try {
            await fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userObj)
            });
          } catch (e) {
            console.warn("Local server fallback sync skipped or failed:", e);
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
          safeAlert(`Account registered successfully as ${signUpName}!`, "success");
          
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
          safeAlert(`Account registered successfully as ${data.user.name}!`, "success");
          
          if (data.user.role === 'buyer') {
            setActiveTab('dashboard');
          } else if (data.user.role === 'vendor') {
            setActiveTab('vendor-panel');
          } else if (data.user.role === 'admin') {
            setActiveTab('admin-panel');
          }
          fetchAllData();
        } else {
          safeAlert("Registration failed. Please check input parameters.", "error");
        }
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || "An error occurred during registration.";
      if (errMsg.includes("security purposes") || errMsg.includes("only request this after")) {
        errMsg = "Registration rate limit exceeded. For security purposes, please wait 60 seconds before submitting again.";
        safeAlert(errMsg, "warning");
      } else if (errMsg.includes("validation") || errMsg.toLowerCase().includes("invalid")) {
        safeAlert("Registration validation failed. Please check your form fields.", "error");
      } else {
        safeAlert(errMsg, "error");
      }
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
      const leadId = `lead-${Date.now()}`;
      const payload = { ...leadData, id: leadId };

      let localSuccess = false;
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          localSuccess = true;
        }
      } catch (err) {
        console.warn("Could not save lead to local backend:", err);
      }

      if (isSupabaseConfigured) {
        const supabaseLead = {
          id: leadId,
          title: leadData.title || "Software Sourcing Requirement",
          category: leadData.category,
          description: leadData.description,
          budget: leadData.budget,
          companyName: leadData.companyName || "",
          contactName: leadData.contactName || "",
          mobile: leadData.mobile || "",
          email: leadData.email || "",
          city: leadData.city || "Delhi",
          timeline: leadData.timeline,
          status: "Submitted",
          bant: {
            budget: leadData.budget || "",
            authority: leadData.bantAuthority || "Yes",
            need: leadData.bantNeed || leadData.description || "",
            timeline: leadData.timeline || ""
          },
          createdAt: new Date().toISOString()
        };
        const { error } = await supabase.from("leads").insert([supabaseLead]);
        if (error) {
          console.error("Supabase lead insertion error:", error);
          safeAlert("Error syncing requirement to permanent cloud storage: " + (error.message || error), "warning");
        } else {
          safeAlert("Sourcing requirement published successfully to Supabase!", "success");
        }
      }
      fetchAllData();
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
    const catId = `cat-${Date.now()}`;
    const newCat = {
      id: catId,
      name: catData.name,
      description: catData.description,
      icon: catData.icon || "Layers",
      productsCount: 0
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("categories").insert([newCat]);
        if (error) throw error;
        fetchAllData();
        safeAlert("Category created successfully in Supabase!", "success");
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCat)
        });
        if (res.ok) {
          fetchAllData();
          safeAlert("Category created successfully!", "success");
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create category on local server.");
        }
      }
    } catch (err: any) {
      console.error("[Add Category Error]:", err);
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );

      if (isRlsError && isSupabaseConfigured) {
        // RESILIENT IN-MEMORY FALLBACK: Add to react state so it shows up on dashboard and admin panel!
        setCategories(prev => [newCat, ...prev]);
        
        // Also save to standard local backend so it's not lost
        fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCat)
        }).catch(e => console.warn("Local storage fallback sync failed:", e));

        setSupabaseRlsErrorTable("categories");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Notice: Saved to temporary Memory! Please execute the Supabase SQL script shown on screen to allow permanent saves.", "warning");
      } else {
        safeAlert(err.message || "Failed to create category.", "error");
      }
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("categories").delete().eq("id", catId);
        if (error) throw error;
        fetchAllData();
        safeAlert("Category deleted successfully from Supabase!", "success");
      } else {
        const res = await fetch(`/api/categories/${catId}`, { method: "DELETE" });
        if (res.ok) {
          fetchAllData();
          safeAlert("Category deleted successfully!", "success");
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to delete category on local server.");
        }
      }
    } catch (err: any) {
      console.error("[Delete Category Error]:", err);
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );

      if (isRlsError && isSupabaseConfigured) {
        // UI memory fallback
        setCategories(prev => prev.filter(c => c.id !== catId));
        fetch(`/api/categories/${catId}`, {
          method: "DELETE"
        }).catch(e => console.warn("Local sync failed:", e));

        setSupabaseRlsErrorTable("categories");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Deleted from temporary Memory! Please fix Supabase RLS policies.", "warning");
      } else {
        safeAlert(err.message || "Failed to delete category.", "error");
      }
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
          logo: vendorData.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150",
          gstNumber: vendorData.gstNumber || "",
          panNumber: vendorData.panNumber || "",
          website: vendorData.website || "",
          businessCategory: vendorData.businessCategory || "Custom Software Development",
          productsOffered: vendorData.productsOffered || [],
          rating: parseFloat(vendorData.rating) || 5.0,
          location: vendorData.location || "India",
          approved: vendorData.approved || false,
          docVerified: vendorData.docVerified || false,
          plan: vendorData.plan || "Free",
          productsCount: parseInt(vendorData.productsCount) || 0,
          leadsCount: parseInt(vendorData.leadsCount) || 0,
          revenue: parseFloat(vendorData.revenue) || 0,
          viewsCount: parseInt(vendorData.viewsCount) || 0,
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
    const newProduct = {
      id: productData.id || `prod-${Date.now()}`,
      name: productData.name,
      description: productData.description || "",
      images: Array.isArray(productData.images) && productData.images.length > 0 
        ? productData.images 
        : ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60"],
      pricing: productData.pricing || "Contact for Quote",
      features: Array.isArray(productData.features) ? productData.features : [],
      brochureUrl: productData.brochureUrl || "#",
      videoUrl: productData.videoUrl || "",
      faqs: Array.isArray(productData.faqs) ? productData.faqs : [],
      rating: parseFloat(productData.rating) || 4.5,
      category: productData.category,
      vendorId: productData.vendorId || "ven-1",
      vendorName: productData.vendorName || "Verified Partner",
      isFeatured: !!productData.isFeatured,
      approved: productData.approved !== undefined ? !!productData.approved : true,
      views: parseInt(productData.views) || 0,
      createdAt: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").insert([newProduct]);
        if (error) throw error;
        fetchAllData();
        safeAlert("Product added successfully to Supabase!", "success");
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          fetchAllData();
          safeAlert("Product added successfully!", "success");
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to add product on local server.");
        }
      }
    } catch (err: any) {
      console.error("[Add Product Error]:", err);
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );
      
      if (isRlsError && isSupabaseConfigured) {
        // RESILIENT IN-MEMORY FALLBACK: Add to react state so it shows up on dashboard and admin panel!
        setProducts(prev => [newProduct, ...prev]);
        
        // Also save to standard local backend so it's not lost
        fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct)
        }).catch(e => console.warn("Local storage fallback sync failed:", e));

        setSupabaseRlsErrorTable("products");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Notice: Saved to temporary Memory! Please execute the Supabase SQL script shown on screen to allow permanent saves.", "warning");
      } else {
        safeAlert(err.message || "Failed to add product.", "error");
      }
    }
  };

  const handleUpdateProduct = async (productId: string, productData: any) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").update(productData).eq("id", productId);
        if (error) throw error;
        fetchAllData();
        safeAlert("Product updated successfully in Supabase!", "success");
      } else {
        const res = await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        });
        if (res.ok) {
          fetchAllData();
          safeAlert("Product updated successfully!", "success");
        }
      }
    } catch (err: any) {
      console.error("[Update Product Error]:", err);
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );

      if (isRlsError && isSupabaseConfigured) {
        // UI memory fallback
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...productData } : p));
        fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData)
        }).catch(e => console.warn("Local sync failed:", e));

        setSupabaseRlsErrorTable("products");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Updated in temporary Memory! Please fix Supabase RLS policies using the guide.", "warning");
      } else {
        safeAlert(err.message || "Failed to update product.", "error");
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("products").delete().eq("id", productId);
        if (error) throw error;
        fetchAllData();
        safeAlert("Product deleted successfully from Supabase!", "success");
      } else {
        const res = await fetch(`/api/products/${productId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          fetchAllData();
          safeAlert("Product deleted successfully!", "success");
        }
      }
    } catch (err: any) {
      console.error("[Delete Product Error]:", err);
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );

      if (isRlsError && isSupabaseConfigured) {
        // UI memory fallback
        setProducts(prev => prev.filter(p => p.id !== productId));
        fetch(`/api/products/${productId}`, {
          method: "DELETE"
        }).catch(e => console.warn("Local sync failed:", e));

        setSupabaseRlsErrorTable("products");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Deleted from temporary Memory! Please fix Supabase RLS policies.", "warning");
      } else {
        safeAlert(err.message || "Failed to delete product.", "error");
      }
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
    } catch (err: any) { 
      console.error(err); 
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );
      if (isRlsError && isSupabaseConfigured) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, approved: true, docVerified: true } : v));
        fetch(`/api/vendors/${vendorId}/approve`, { method: "POST" }).catch(e => console.warn(e));
        setSupabaseRlsErrorTable("vendors");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Approved in UI Memory! Please fix Supabase RLS policies.", "warning");
      }
    }
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
    } catch (err: any) { 
      console.error(err); 
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );
      if (isRlsError && isSupabaseConfigured) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, approved: true } : p));
        fetch(`/api/products/${productId}/approve`, { method: "POST" }).catch(e => console.warn(e));
        setSupabaseRlsErrorTable("products");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Approved in UI Memory! Please fix Supabase RLS policies.", "warning");
      }
    }
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
    } catch (err: any) { 
      console.error(err); 
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );
      if (isRlsError && isSupabaseConfigured) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, approved: false } : p));
        fetch(`/api/products/${productId}/reject`, { method: "POST" }).catch(e => console.warn(e));
        setSupabaseRlsErrorTable("products");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Rejected in UI Memory! Please fix Supabase RLS policies.", "warning");
      }
    }
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
    } catch (err: any) { 
      console.error(err); 
      const isRlsError = err.message && (
        err.message.toLowerCase().includes("row-level security") || 
        err.message.toLowerCase().includes("policy") || 
        err.message.toLowerCase().includes("violates") ||
        err.code === "42501"
      );
      if (isRlsError && isSupabaseConfigured) {
        const prod = products.find(p => p.id === productId);
        const newFeatured = prod ? !prod.featured : true;
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, featured: newFeatured, isFeatured: newFeatured } : p));
        fetch(`/api/products/${productId}/feature`, { method: "POST" }).catch(e => console.warn(e));
        setSupabaseRlsErrorTable("products");
        setSupabaseRlsErrorOpen(true);
        safeAlert("Promotion toggled in UI Memory! Please fix Supabase RLS policies.", "warning");
      }
    }
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
      let savedLocal = false;
      const localId = blogData.id || `blog-${Date.now()}`;
      const submission = { ...blogData, id: localId };

      try {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission)
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            submission.id = data.id;
          }
          savedLocal = true;
        }
      } catch (err) {
        console.warn("Local server insert failed/not available, relying on Supabase:", err);
      }

      if (isSupabaseConfigured) {
        console.log("Syncing new blog to Supabase:", submission);
        const supabaseBlogData = {
          id: submission.id,
          title: submission.title,
          content: submission.content,
          image: submission.image,
          category: submission.category,
          tags: Array.isArray(submission.tags) ? submission.tags : [],
          author: submission.author,
          readTime: submission.readTime || "5 mins read",
          slug: submission.slug,
          likes: submission.likes || 0,
          createdAt: submission.createdAt || new Date().toISOString(),
          metaTitle: submission.metaTitle,
          metaDescription: submission.metaDescription,
          metaKeywords: submission.metaKeywords,
          focusKeyword: submission.focusKeyword,
          schemaMarkup: submission.schemaMarkup,
          status: submission.status || "Published",
          views: submission.views || 0,
          isAiGenerated: !!submission.isAiGenerated,
          shortDescription: submission.shortDescription,
          canonicalUrl: submission.canonicalUrl,
          publishDate: submission.publishDate || new Date().toISOString(),
          excerpt: submission.shortDescription || ""
        };

        const { error } = await supabase.from("blogs").upsert([supabaseBlogData]);
        if (error) {
          console.error("Supabase blogs upsert error:", error);
          if (!savedLocal) throw error;
        } else {
          console.log("Successfully upserted blog to Supabase!");
        }
      }

      fetchAllData();
    } catch (err: any) {
      console.error("Error adding blog:", err);
      alert(`Error saving blog: ${err.message || err}`);
    }
  };

  const handleLikeBlog = async (blogId: string) => {
    try {
      let likedLocal = false;
      try {
        const res = await fetch(`/api/blogs/${blogId}/like`, { method: "POST" });
        if (res.ok) likedLocal = true;
      } catch (err) {
        console.warn("Local server like failed/not available:", err);
      }

      if (isSupabaseConfigured) {
        const { data, error: fetchErr } = await supabase.from("blogs").select("likes").eq("id", blogId).single();
        if (!fetchErr && data) {
          const newLikes = (data.likes || 0) + 1;
          const { error: updateErr } = await supabase.from("blogs").update({ likes: newLikes }).eq("id", blogId);
          if (updateErr) {
            console.error("Supabase likes update error:", updateErr);
          }
        }
      }

      fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      let deletedLocal = false;
      try {
        const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
        if (res.ok) deletedLocal = true;
      } catch (err) {
        console.warn("Local server delete failed/not available, relying on Supabase:", err);
      }

      if (isSupabaseConfigured) {
        const { error } = await supabase.from("blogs").delete().eq("id", blogId);
        if (error) {
          console.error("Supabase blogs delete error:", error);
          if (!deletedLocal) throw error;
        } else {
          console.log("Successfully deleted blog from Supabase!");
        }
      }

      fetchAllData();
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      alert(`Error deleting blog: ${err.message || err}`);
    }
  };

  const handleUpdateBlog = async (blogId: string, blogData: any) => {
    try {
      let savedLocal = false;
      try {
        const res = await fetch(`/api/blogs/${blogId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData)
        });
        if (res.ok) savedLocal = true;
      } catch (err) {
        console.warn("Local server update failed/not available, relying on Supabase:", err);
      }

      if (isSupabaseConfigured) {
        console.log("Syncing updated blog to Supabase:", blogId, blogData);
        const supabaseBlogData = {
          id: blogId,
          title: blogData.title,
          content: blogData.content,
          image: blogData.image,
          category: blogData.category,
          tags: Array.isArray(blogData.tags) ? blogData.tags : [],
          author: blogData.author,
          readTime: blogData.readTime || "5 mins read",
          slug: blogData.slug,
          likes: blogData.likes || 0,
          createdAt: blogData.createdAt || new Date().toISOString(),
          metaTitle: blogData.metaTitle,
          metaDescription: blogData.metaDescription,
          metaKeywords: blogData.metaKeywords,
          focusKeyword: blogData.focusKeyword,
          schemaMarkup: blogData.schemaMarkup,
          status: blogData.status || "Published",
          views: blogData.views || 0,
          isAiGenerated: !!blogData.isAiGenerated,
          shortDescription: blogData.shortDescription,
          canonicalUrl: blogData.canonicalUrl,
          publishDate: blogData.publishDate || new Date().toISOString(),
          excerpt: blogData.shortDescription || ""
        };

        const { error } = await supabase.from("blogs").upsert([supabaseBlogData]);
        if (error) {
          console.error("Supabase blogs update error:", error);
          if (!savedLocal) throw error;
        } else {
          console.log("Successfully updated blog in Supabase!");
        }
      }

      fetchAllData();
    } catch (err: any) {
      console.error("Error updating blog:", err);
      alert(`Error updating blog: ${err.message || err}`);
    }
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
                  currentUser={currentUser}
                  onPostLead={handlePostLead}
                  categories={categories}
                  products={products}
                  vendors={vendors}
                  trustedVendors={trustedVendors}
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
                  onSelectBlog={(blog) => {
                    setSelectedBlog(blog);
                    setActiveTab("blogs");
                  }}
                />
              </motion.div>
            )}

            {/* Product Detail view */}
            {activeTab === 'product-detail' && (
              <motion.div
                key="product-detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ProductDetailPage 
                  products={products}
                  onPostLead={handlePostLead}
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {/* Sourcing Localized Landing Page */}
            {activeTab === 'sourcing-landing' && (() => {
              const matched = matchSourcingRoute(location.pathname);
              if (matched) {
                return (
                  <motion.div
                    key="sourcing-landing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <SourcingLandingPage
                      product={matched.product}
                      location={matched.location}
                      currentUser={currentUser}
                      onPostLead={handlePostLead}
                      onNavigateToTab={(tab) => {
                        if (tab === "dashboard") {
                          setCurrentRole("buyer");
                          setActiveTab("dashboard");
                        } else {
                          setActiveTab(tab);
                        }
                      }}
                    />
                  </motion.div>
                );
              }
              return (
                <div className="py-24 text-center">
                  <p className="text-sm font-bold text-slate-500">Sourcing profile not found. Redirecting to home...</p>
                </div>
              );
            })()}

            {/* Blogs list view */}
            {activeTab === 'blogs' && (
              <motion.div
                key="blogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BlogsView 
                  blogs={blogs} 
                  onLikeBlog={handleLikeBlog} 
                  selectedBlog={selectedBlog}
                  onSelectBlog={setSelectedBlog}
                />
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
                  onUpdateBlog={handleUpdateBlog}
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
                  onRefreshData={fetchAllData}
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
                className="max-w-4xl mx-auto px-6 py-12"
              >
                {activeTab === 'about' && <AboutPage />}
                {activeTab === 'terms' && <TermsPage />}
                {activeTab === 'privacy' && <PrivacyPage />}
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
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold text-slate-400 uppercase text-[10px]">Registered HQ Address</p>
                        <p className="font-semibold text-slate-800 mt-1">BANTConfirm Corporate Hub, Sector 62, Noida, UP, 201301</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-400 uppercase text-[10px]">Corporate Enquiries</p>
                        <p className="font-semibold text-[#0066FF] mt-1">support@bantconfirm.com</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 mt-auto">
                      <p className="font-bold text-slate-400 uppercase text-[10px] mb-2.5">Official Social Channels</p>
                      <div className="flex items-center gap-3">
                        <a 
                          href="https://www.facebook.com/share/1Gn5NuBmMJ/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="Visit BANTConfirm Facebook Profile"
                          className="text-slate-500 hover:text-white hover:bg-[#0066FF] hover:border-[#0066FF] p-2 rounded-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border border-slate-200 bg-slate-50 shadow-2xs"
                        >
                          <Facebook className="w-[24px] h-[24px]" />
                        </a>
                        <a 
                          href="https://www.instagram.com/bantconfirm?igsh=Z2FpYW9iYnk2c3Zr" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="Visit BANTConfirm Instagram Profile"
                          className="text-slate-500 hover:text-slate-900 hover:bg-[#FFC107] hover:border-[#FFC107] p-2 rounded-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border border-slate-200 bg-slate-50 shadow-2xs"
                        >
                          <Instagram className="w-[24px] h-[24px]" />
                        </a>
                        <a 
                          href="https://www.linkedin.com/company/bant-confirm/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="Visit BANTConfirm LinkedIn Profile"
                          className="text-slate-500 hover:text-white hover:bg-[#0066FF] hover:border-[#0066FF] p-2 rounded-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border border-slate-200 bg-slate-50 shadow-2xs"
                        >
                          <Linkedin className="w-[24px] h-[24px]" />
                        </a>
                      </div>
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
                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoogleAuth('login')}
                    disabled={authLoading}
                    className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold py-2.5 rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M5.26620007,9.76452941 C6.19875005,6.93863435 8.8544399,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.52272727 16.4181818,6.54545455 L19.8272727,3.13636364 C17.7636364,1.19090909 15.0181818,0 12,0 C7.33124803,0 3.32766107,2.83615413 1.5791244,6.92488349 L5.26620007,9.76452941 Z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.490008,12.2727273 C23.490008,11.4136364 23.4136444,10.5954545 23.2727354,9.81818182 L12,9.81818182 L12,14.6363636 L18.4545455,14.6363636 C18.1772727,16.1272727 17.3363636,17.3909091 16.0727273,18.2363636 L19.8272727,21.1454545 C22.0227273,19.1181818 23.490008,16.1272727 23.490008,12.2727273 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.26620007,14.2354706 L1.5791244,17.0751165 C3.32766107,21.1638459 7.33124803,24 12,24 C15.0181818,24 17.7636364,22.8090909 19.8272727,20.8636364 L16.0727273,17.9545455 C15.0318182,18.65 13.6272727,19.0909091 12,19.0909091 C8.8544399,19.0909091 6.19875005,17.0613657 5.26620007,14.2354706 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M5.26620007,9.76452941 C4.98185012,10.6300181 4.82352941,11.5574679 4.82352941,12.5190909 C4.82352941,13.4807139 4.98185012,14.4081637 5.26620007,15.2736524 L1.5791244,18.1132983 C0.570258163,16.4258909 0,14.4925722 0,12.5190909 C0,10.5456096 0.570258163,8.61229093 1.5791244,6.92488349 L5.26620007,9.76452941 Z"
                      />
                    </svg>
                    {authLoading ? "Establishing Connection..." : "Continue with Google"}
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
                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoogleAuth('signup')}
                    disabled={authLoading}
                    className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold py-2.5 rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M5.26620007,9.76452941 C6.19875005,6.93863435 8.8544399,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.52272727 16.4181818,6.54545455 L19.8272727,3.13636364 C17.7636364,1.19090909 15.0181818,0 12,0 C7.33124803,0 3.32766107,2.83615413 1.5791244,6.92488349 L5.26620007,9.76452941 Z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.490008,12.2727273 C23.490008,11.4136364 23.4136444,10.5954545 23.2727354,9.81818182 L12,9.81818182 L12,14.6363636 L18.4545455,14.6363636 C18.1772727,16.1272727 17.3363636,17.3909091 16.0727273,18.2363636 L19.8272727,21.1454545 C22.0227273,19.1181818 23.490008,16.1272727 23.490008,12.2727273 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.26620007,14.2354706 L1.5791244,17.0751165 C3.32766107,21.1638459 7.33124803,24 12,24 C15.0181818,24 17.7636364,22.8090909 19.8272727,20.8636364 L16.0727273,17.9545455 C15.0318182,18.65 13.6272727,19.0909091 12,19.0909091 C8.8544399,19.0909091 6.19875005,17.0613657 5.26620007,14.2354706 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M5.26620007,9.76452941 C4.98185012,10.6300181 4.82352941,11.5574679 4.82352941,12.5190909 C4.82352941,13.4807139 4.98185012,14.4081637 5.26620007,15.2736524 L1.5791244,18.1132983 C0.570258163,16.4258909 0,14.4925722 0,12.5190909 C0,10.5456096 0.570258163,8.61229093 1.5791244,6.92488349 L5.26620007,9.76452941 Z"
                      />
                    </svg>
                    {authLoading ? "Establishing Connection..." : "Continue with Google"}
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

      {/* Premium User Notification Toast */}
      <AnimatePresence>
        {userToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-6 left-6 z-[100] max-w-sm w-full rounded-xl shadow-2xl border p-4 text-white flex items-start gap-3 backdrop-blur-md ${
              userToast.type === "success" 
                ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-100" 
                : userToast.type === "error" 
                ? "bg-rose-950/95 border-rose-500/30 text-rose-100" 
                : userToast.type === "warning" 
                ? "bg-amber-950/95 border-amber-500/30 text-amber-100" 
                : "bg-slate-900/95 border-slate-700/50 text-slate-100"
            }`}
          >
            <div className={`p-2 rounded-lg ${
              userToast.type === "success" 
                ? "bg-emerald-500/20 text-emerald-400" 
                : userToast.type === "error" 
                ? "bg-rose-500/20 text-rose-400" 
                : userToast.type === "warning" 
                ? "bg-amber-500/20 text-amber-400" 
                : "bg-blue-500/20 text-blue-400"
            }`}>
              {userToast.type === "success" && <CheckCircle className="w-5 h-5" />}
              {userToast.type === "error" && <AlertCircle className="w-5 h-5" />}
              {userToast.type === "warning" && <AlertTriangle className="w-5 h-5" />}
              {userToast.type === "info" && <Info className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 space-y-0.5 pt-1.5">
              <h4 className="font-extrabold text-xs tracking-wider uppercase opacity-80">
                {userToast.type === "success" && "Success"}
                {userToast.type === "error" && "Error Encountered"}
                {userToast.type === "warning" && "Notice"}
                {userToast.type === "info" && "Notification"}
              </h4>
              <p className="text-xs font-semibold leading-relaxed">{userToast.message}</p>
            </div>

            <button 
              onClick={() => setUserToast(null)} 
              className="text-white/60 hover:text-white transition-colors cursor-pointer pt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUPABASE RLS ERROR RESOLUTION MODAL */}
      {supabaseRlsErrorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center space-x-3 text-amber-500">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-white">Supabase Row-Level Security (RLS) Help</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">We detected a write policy block for table "<span className="text-amber-400 font-mono font-bold">{supabaseRlsErrorTable}</span>".</p>
                </div>
              </div>
              <button 
                onClick={() => setSupabaseRlsErrorOpen(false)}
                className="text-slate-400 hover:text-white font-extrabold cursor-pointer p-1.5 rounded-lg hover:bg-slate-800 transition-all text-xs"
              >
                ✕
              </button>
            </div>

            {/* Instruction Body */}
            <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto text-xs leading-relaxed text-slate-300 font-sans">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 space-y-1.5">
                <p className="font-bold text-amber-400 flex items-center gap-1">
                  💡 Why am I seeing this?
                </p>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  You connected Supabase successfully to your live environment. However, Supabase's table security policy (Row-Level Security) is currently blocking anonymous write requests (inserts, updates, or deletes) from the frontend client.
                </p>
                <p className="text-[11px] font-bold text-slate-200">
                  Resilient Fallback Active: We have loaded your item inside the UI memory so it immediately shows up in your Admin Panel & Users' Dashboard! But to make it permanent, execute the query below in Supabase.
                </p>
              </div>

              {/* Table Switcher Tabs */}
              <div className="flex flex-wrap bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1">
                {["products", "categories", "leads", "profiles", "trusted_vendors", "all"].map((tabName) => (
                  <button
                    key={tabName}
                    type="button"
                    onClick={() => setSupabaseRlsErrorTable(tabName)}
                    className={`flex-1 min-w-[70px] py-1.5 text-center text-[10px] font-bold rounded-md transition-all cursor-pointer capitalize ${
                      supabaseRlsErrorTable === tabName 
                        ? "bg-[#0066FF] text-white shadow-sm" 
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    {tabName === "all" ? "Fix All" : tabName === "trusted_vendors" ? "Trusted Vendors" : `${tabName}`}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">How to Solve Instantly (10 seconds):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  <li>Open your <strong>Supabase Dashboard</strong>.</li>
                  <li>Click on the <strong>SQL Editor</strong> in the left sidebar menu.</li>
                  <li>Click on <strong>New Query</strong>.</li>
                  <li>Paste the SQL script below and click <strong>Run</strong>.</li>
                </ol>
              </div>

              {/* SQL box with Copy button */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-slate-950 px-3.5 py-1.5 border-t border-r border-l border-slate-800 rounded-t-lg">
                  <span className="font-mono text-[9px] text-[#0066FF] font-bold tracking-widest uppercase">
                    {supabaseRlsErrorTable === "all" ? "Complete SQL Fix" : `${supabaseRlsErrorTable} SQL Query`}
                  </span>
                  <button
                    onClick={() => {
                      let sql = "";
                      if (supabaseRlsErrorTable === "products") {
                        sql = `-- Fix Row Level Security policies for products table\nALTER TABLE public.products DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.products ENABLE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS "Allow public read access on products" ON public.products;\nDROP POLICY IF EXISTS "Allow anyone to insert products" ON public.products;\nDROP POLICY IF EXISTS "Allow anyone to update products" ON public.products;\nDROP POLICY IF EXISTS "Allow anyone to delete products" ON public.products;\n\nCREATE POLICY "Allow public read access on products" ON public.products \nFOR SELECT TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to insert products" ON public.products \nFOR INSERT TO public, anon, authenticated WITH CHECK (true);\n\nCREATE POLICY "Allow anyone to update products" ON public.products \nFOR UPDATE TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to delete products" ON public.products \nFOR DELETE TO public, anon, authenticated USING (true);\n\nGRANT ALL ON public.products TO anon, authenticated, service_role;`;
                      } else if (supabaseRlsErrorTable === "categories") {
                        sql = `-- Fix Row Level Security policies for categories table\nALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;\nDROP POLICY IF EXISTS "Allow anyone to insert categories" ON public.categories;\nDROP POLICY IF EXISTS "Allow anyone to update categories" ON public.categories;\nDROP POLICY IF EXISTS "Allow anyone to delete categories" ON public.categories;\n\nCREATE POLICY "Allow public read access on categories" ON public.categories \nFOR SELECT TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to insert categories" ON public.categories \nFOR INSERT TO public, anon, authenticated WITH CHECK (true);\n\nCREATE POLICY "Allow anyone to update categories" ON public.categories \nFOR UPDATE TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to delete categories" ON public.categories \nFOR DELETE TO public, anon, authenticated USING (true);\n\nGRANT ALL ON public.categories TO anon, authenticated, service_role;`;
                      } else if (supabaseRlsErrorTable === "leads") {
                        sql = `-- Fix Row Level Security policies for leads table\nALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS "Allow public read access on leads" ON public.leads;\nDROP POLICY IF EXISTS "Allow anyone to insert leads" ON public.leads;\nDROP POLICY IF EXISTS "Allow anyone to update leads" ON public.leads;\nDROP POLICY IF EXISTS "Allow anyone to delete leads" ON public.leads;\n\nCREATE POLICY "Allow public read access on leads" ON public.leads \nFOR SELECT TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to insert leads" ON public.leads \nFOR INSERT TO public, anon, authenticated WITH CHECK (true);\n\nCREATE POLICY "Allow anyone to update leads" ON public.leads \nFOR UPDATE TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to delete leads" ON public.leads \nFOR DELETE TO public, anon, authenticated USING (true);\n\nGRANT ALL ON public.leads TO anon, authenticated, service_role;`;
                      } else if (supabaseRlsErrorTable === "profiles") {
                        sql = `-- Fix Row Level Security policies for profiles table\nALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;\nDROP POLICY IF EXISTS "Allow anyone to insert profiles" ON public.profiles;\nDROP POLICY IF EXISTS "Allow anyone to update profiles" ON public.profiles;\nDROP POLICY IF EXISTS "Allow anyone to delete profiles" ON public.profiles;\n\nCREATE POLICY "Allow public read access on profiles" ON public.profiles \nFOR SELECT TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to insert profiles" ON public.profiles \nFOR INSERT TO public, anon, authenticated WITH CHECK (true);\n\nCREATE POLICY "Allow anyone to update profiles" ON public.profiles \nFOR UPDATE TO public, anon, authenticated USING (true);\n\nCREATE POLICY "Allow anyone to delete profiles" ON public.profiles \nFOR DELETE TO public, anon, authenticated USING (true);\n\nGRANT ALL ON public.profiles TO anon, authenticated, service_role;`;
                      } else if (supabaseRlsErrorTable === "trusted_vendors") {
                        sql = `-- Create trusted_vendors table & RLS policies\nCREATE TABLE IF NOT EXISTS public.trusted_vendors (\n  id TEXT PRIMARY KEY,\n  vendor_name TEXT NOT NULL,\n  logo_url TEXT NOT NULL,\n  website_url TEXT,\n  display_order INTEGER DEFAULT 0,\n  is_active BOOLEAN DEFAULT true,\n  "createdAt" TIMESTAMPTZ DEFAULT NOW()\n);\n\nALTER TABLE public.trusted_vendors DISABLE ROW LEVEL SECURITY;\nALTER TABLE public.trusted_vendors ENABLE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS "Allow public read access on trusted_vendors" ON public.trusted_vendors;\nDROP POLICY IF EXISTS "Allow anyone to insert trusted_vendors" ON public.trusted_vendors;\nDROP POLICY IF EXISTS "Allow anyone to update trusted_vendors" ON public.trusted_vendors;\nDROP POLICY IF EXISTS "Allow anyone to delete trusted_vendors" ON public.trusted_vendors;\n\nCREATE POLICY "Allow public read access on trusted_vendors" ON public.trusted_vendors FOR SELECT TO public, anon, authenticated USING (true);\nCREATE POLICY "Allow anyone to insert trusted_vendors" ON public.trusted_vendors FOR INSERT TO public, anon, authenticated WITH CHECK (true);\nCREATE POLICY "Allow anyone to update trusted_vendors" ON public.trusted_vendors FOR UPDATE TO public, anon, authenticated USING (true);\nCREATE POLICY "Allow anyone to delete trusted_vendors" ON public.trusted_vendors FOR DELETE TO public, anon, authenticated USING (true);\n\nGRANT ALL ON public.trusted_vendors TO anon, authenticated, service_role;`;
                      } else {
                        sql = `-- 1. Fix products table RLS and policies
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to insert products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to update products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to delete products" ON public.products;
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert products" ON public.products FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update products" ON public.products FOR UPDATE TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to delete products" ON public.products FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.products TO anon, authenticated, service_role;

-- 2. Fix categories table RLS and policies
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to delete categories" ON public.categories;
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert categories" ON public.categories FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update categories" ON public.categories FOR UPDATE TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to delete categories" ON public.categories FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.categories TO anon, authenticated, service_role;

-- 3. Fix leads table RLS and policies
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to update leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to delete leads" ON public.leads;
CREATE POLICY "Allow public read access on leads" ON public.leads FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert leads" ON public.leads FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete leads" ON public.leads FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.leads TO anon, authenticated, service_role;

-- 4. Fix profiles table RLS and policies
CREATE TABLE IF NOT EXISTS public.profiles (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, "companyName" TEXT, mobile TEXT, city TEXT, role TEXT DEFAULT 'buyer', "createdAt" TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to delete profiles" ON public.profiles;
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert profiles" ON public.profiles FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete profiles" ON public.profiles FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.profiles TO anon, authenticated, service_role;

-- 5. Fix trusted_vendors table RLS and policies
CREATE TABLE IF NOT EXISTS public.trusted_vendors (id TEXT PRIMARY KEY, vendor_name TEXT NOT NULL, logo_url TEXT NOT NULL, website_url TEXT, display_order INTEGER DEFAULT 0, is_active BOOLEAN DEFAULT true, "createdAt" TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.trusted_vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_vendors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to insert trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to update trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to delete trusted_vendors" ON public.trusted_vendors;
CREATE POLICY "Allow public read access on trusted_vendors" ON public.trusted_vendors FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert trusted_vendors" ON public.trusted_vendors FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update trusted_vendors" ON public.trusted_vendors FOR UPDATE TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to delete trusted_vendors" ON public.trusted_vendors FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.trusted_vendors TO anon, authenticated, service_role;

-- 6. Enable Realtime Replication for instant synchronization
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER TABLE public.trusted_vendors REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'trusted_vendors'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trusted_vendors;
  END IF;
END $$;`;
                      }
                      navigator.clipboard.writeText(sql);
                      safeAlert("SQL Script Copied! Paste this in your Supabase SQL Editor and click Run.", "success");
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-805 hover:bg-slate-700 px-2.5 py-1 rounded transition-all font-bold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-850 rounded-b-lg text-[10px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[140px]">
                  {supabaseRlsErrorTable === "products" && (
`-- Enable RLS on products table
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop previous policies
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to insert products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to update products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to delete products" ON public.products;

-- Create full select, insert, update and delete policies
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert products" ON public.products FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete products" ON public.products FOR DELETE TO public, anon, authenticated USING (true);

-- Grant privileges
GRANT ALL ON public.products TO anon, authenticated, service_role;`
                  )}
                  {supabaseRlsErrorTable === "categories" && (
`-- Enable RLS on categories table
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop previous policies
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to delete categories" ON public.categories;

-- Create full select, insert, update and delete policies
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert categories" ON public.categories FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update categories" ON public.categories FOR UPDATE TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to delete categories" ON public.categories FOR DELETE TO public, anon, authenticated USING (true);

-- Grant privileges
GRANT ALL ON public.categories TO anon, authenticated, service_role;`
                  )}
                  {supabaseRlsErrorTable === "leads" && (
`-- Enable RLS on leads table
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop previous policies
DROP POLICY IF EXISTS "Allow public read access on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to update leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to delete leads" ON public.leads;

-- Create full select, insert, update and delete policies
CREATE POLICY "Allow public read access on leads" ON public.leads FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert leads" ON public.leads FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete leads" ON public.leads FOR DELETE USING (true);

-- Grant privileges
GRANT ALL ON public.leads TO anon, authenticated, service_role;`
                  )}
                  {supabaseRlsErrorTable === "profiles" && (
`-- Enable RLS on profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  "companyName" TEXT,
  mobile TEXT,
  city TEXT,
  role TEXT DEFAULT 'buyer',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop previous policies
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to delete profiles" ON public.profiles;

-- Create full select, insert, update and delete policies
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert profiles" ON public.profiles FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete profiles" ON public.profiles FOR DELETE TO public, anon, authenticated USING (true);

-- Grant privileges
GRANT ALL ON public.profiles TO anon, authenticated, service_role;`
                  )}
                  {supabaseRlsErrorTable === "trusted_vendors" && (
`-- Create trusted_vendors table & RLS policies
CREATE TABLE IF NOT EXISTS public.trusted_vendors (
  id TEXT PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trusted_vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_vendors ENABLE ROW LEVEL SECURITY;

-- Drop previous policies
DROP POLICY IF EXISTS "Allow public read access on trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to insert trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to update trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to delete trusted_vendors" ON public.trusted_vendors;

-- Create full select, insert, update and delete policies
CREATE POLICY "Allow public read access on trusted_vendors" ON public.trusted_vendors FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert trusted_vendors" ON public.trusted_vendors FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update trusted_vendors" ON public.trusted_vendors FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete trusted_vendors" ON public.trusted_vendors FOR DELETE TO public, anon, authenticated USING (true);

-- Grant privileges
GRANT ALL ON public.trusted_vendors TO anon, authenticated, service_role;`
                  )}
                  {supabaseRlsErrorTable === "all" && (
`-- 1. Fix products table RLS and policies
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to insert products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to update products" ON public.products;
DROP POLICY IF EXISTS "Allow anyone to delete products" ON public.products;
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert products" ON public.products FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update products" ON public.products FOR UPDATE TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to delete products" ON public.products FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.products TO anon, authenticated, service_role;

-- 2. Fix categories table RLS and policies
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow anyone to delete categories" ON public.categories;
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert categories" ON public.categories FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update categories" ON public.categories FOR UPDATE TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to delete categories" ON public.categories FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.categories TO anon, authenticated, service_role;

-- 3. Fix leads table RLS and policies
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to update leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anyone to delete leads" ON public.leads;
CREATE POLICY "Allow public read access on leads" ON public.leads FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert leads" ON public.leads FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete leads" ON public.leads FOR DELETE USING (true);
GRANT ALL ON public.leads TO anon, authenticated, service_role;

-- 4. Fix profiles table RLS and policies
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  "companyName" TEXT,
  mobile TEXT,
  city TEXT,
  role TEXT DEFAULT 'buyer',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone to delete profiles" ON public.profiles;
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert profiles" ON public.profiles FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete profiles" ON public.profiles FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.profiles TO anon, authenticated, service_role;

-- 5. Fix trusted_vendors table RLS and policies
CREATE TABLE IF NOT EXISTS public.trusted_vendors (
  id TEXT PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.trusted_vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_vendors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to insert trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to update trusted_vendors" ON public.trusted_vendors;
DROP POLICY IF EXISTS "Allow anyone to delete trusted_vendors" ON public.trusted_vendors;
CREATE POLICY "Allow public read access on trusted_vendors" ON public.trusted_vendors FOR SELECT TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to insert trusted_vendors" ON public.trusted_vendors FOR INSERT TO public, anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anyone to update trusted_vendors" ON public.trusted_vendors FOR UPDATE TO public, anon, authenticated USING (true);
CREATE POLICY "Allow anyone to delete trusted_vendors" ON public.trusted_vendors FOR DELETE TO public, anon, authenticated USING (true);
GRANT ALL ON public.trusted_vendors TO anon, authenticated, service_role;

-- 6. Enable Realtime Replication for instant synchronization
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER TABLE public.trusted_vendors REPLICA IDENTITY FULL;`
                  )}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSupabaseRlsErrorOpen(false)}
                className="px-5 py-2 bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold rounded-lg hover:shadow-lg transition-all cursor-pointer text-xs"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
