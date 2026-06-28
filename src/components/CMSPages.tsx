import React, { useEffect } from "react";
import { 
  CheckCircle, Users, Target, TrendingUp, Clock, Shield, FileText, 
  Lock, Building, ChevronRight, Info, Globe, Award, HelpCircle, 
  Scale, Key, Eye, HelpCircle as HelpIcon 
} from "lucide-react";

// Hook to dynamically update document metadata for SEO optimization
function useSeoMetadata(title: string, description: string, keywords: string) {
  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Helper to create or update meta tag
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateOgTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("robots", "index, follow");
    
    // OG Tags
    updateOgTag("og:title", title);
    updateOgTag("og:description", description);
    updateOgTag("og:type", "website");
    updateOgTag("og:url", window.location.href);

    // Dynamic schema markup insertion for SEO Rich Snippets
    let schemaScript = document.getElementById("seo-schema-markup");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.setAttribute("id", "seo-schema-markup");
      schemaScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(schemaScript);
    }
    
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BANTConfirm",
      "url": "https://bantconfirm.com",
      "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@bantconfirm.com",
        "contactType": "customer service"
      },
      "description": description
    };
    schemaScript.innerHTML = JSON.stringify(organizationSchema);

    return () => {
      // Revert title on unmount to default
      document.title = "BANTConfirm - India's Pre-Qualified B2B Enterprise IT Sourcing Marketplace";
    };
  }, [title, description, keywords]);
}

// ---------------------------------------------------------
// 1. ABOUT US PAGE
// ---------------------------------------------------------
export function AboutPage() {
  useSeoMetadata(
    "About BANTConfirm - Verified B2B Enterprise IT Sourcing Marketplace",
    "Learn about BANTConfirm, India's leading pre-qualified B2B software procurement marketplace. Discover how we utilize the global BANT framework to connect buyers with certified SaaS and IT vendors securely and quickly.",
    "BANTConfirm, software procurement, verified B2B leads, BANT framework, IT sourcing India, certified SaaS vendors, enterprise software buying"
  );

  return (
    <article className="space-y-16 py-4 animate-in fade-in duration-300">
      {/* Dynamic Intro Banner */}
      <header className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 md:p-12 text-white border border-slate-800">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 rounded-full bg-yellow-500/5 blur-3xl" />
        
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0066FF] text-xs font-black uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" /> India's Leading Sourcing Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Redefining <span className="text-[#FFC107]">B2B Technology Sourcing</span> with Mathematical Precision
          </h1>
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            Traditional enterprise software procurement takes months of cold calling, misaligned pricing, and unqualified pitches. 
            BANTConfirm solves this by auditing every single software inquiry using the globally validated <strong>BANT Framework</strong> before introducing certified solution providers.
          </p>
        </div>
      </header>

      {/* The Core BANT Framework Infographic */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0066FF]">The Qualification Standard</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Four Pillars of Lead Qualification</h2>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            We don't just collect enquiries. Our dedicated validation desk calls every buyer to verify and confirm their exact BANT metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Budget */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-black text-lg">
              B
            </div>
            <h3 className="text-sm font-black text-slate-900">Budget (बजट)</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We verify that the enterprise has defined and allocated a realistic financial budget that aligns with software licensing, implementation, and maintenance costs.
            </p>
          </div>

          {/* Pillar 2: Authority */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0066FF] font-black text-lg">
              A
            </div>
            <h3 className="text-sm font-black text-slate-900">Authority (अधिकार)</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We confirm the buyer is a key stakeholder (CIO, CTO, IT Director, or Procurement Head) with direct decision-making power or influential advisory authority.
            </p>
          </div>

          {/* Pillar 3: Need */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-black text-lg">
              N
            </div>
            <h3 className="text-sm font-black text-slate-900">Need (आवश्यकता)</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We document exact pain points, required integrations (e.g., WhatsApp, CRM, Tally), deployment types (SaaS/On-Premise), and concurrent user-load constraints.
            </p>
          </div>

          {/* Pillar 4: Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 font-black text-lg">
              T
            </div>
            <h3 className="text-sm font-black text-slate-900">Timeline (समय सीमा)</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We establish an active purchasing timeline. We only qualify buyers ready to select a software partner and deploy within a maximum of 30 to 90 days.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works / The Procurement Process */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0066FF]">Step-by-Step Flow</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">How BANTConfirm Works</h2>
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            A frictionless, streamlined, and secure transaction process from requirement post to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="relative bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="absolute top-4 right-4 text-xs font-black text-slate-300">01</div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-xs">
              Post
            </div>
            <h4 className="text-xs font-black text-slate-800">1. Requirement Posted</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              A business buyer submits an active requirement describing their technical challenges, expected budget, and organizational scale.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="absolute top-4 right-4 text-xs font-black text-slate-300">02</div>
            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold text-xs">
              Audit
            </div>
            <h4 className="text-xs font-black text-slate-800">2. Human Audit Desk</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Our certification desk calls the buyer to verify the corporate domain, contact identity, authority layer, budget availability, and purchase timelines.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="absolute top-4 right-4 text-xs font-black text-slate-300">03</div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              Match
            </div>
            <h4 className="text-xs font-black text-slate-800">3. Smart Matching</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              The verified lead is structured with specific BANT compliance indexes and visible to certified software vendors in their control dashboards.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="absolute top-4 right-4 text-xs font-black text-slate-300">04</div>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold text-xs">
              Connect
            </div>
            <h4 className="text-xs font-black text-slate-800">4. High-Intent Pitch</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Selected certified vendors unlock contact coordinates using lead credits. They connect directly with highly responsive, pre-qualified decision-makers.
            </p>
          </div>
        </div>
      </section>

      {/* Structured Value Proposition: Buyers vs. Vendors */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* For Buyers Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Free Enterprise Sourcing</span>
              <h3 className="text-lg font-black text-slate-900 leading-none mt-0.5">For Corporate Buyers</h3>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Stop dealing with relentless cold outreach, generic sales pitches, and unqualified emails. Streamline your enterprise tech discovery for free.
          </p>

          <ul className="space-y-3.5">
            <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
              <CheckCircle className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
              <span><strong>Zero Cost, Always:</strong> Finding, qualifying, and getting matching bids is 100% free for verified business evaluators.</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
              <CheckCircle className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
              <span><strong>Pre-Vetted Bids:</strong> Pitch requests are routed only to certified, compliant developers with verified success portfolios.</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
              <CheckCircle className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
              <span><strong>Absolute Privacy Control:</strong> Your direct phone and email coordinates remain secure until you explicitly select matching bids.</span>
            </li>
          </ul>
        </div>

        {/* For Vendors Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC107] text-slate-900 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-600">Enterprise CRM Pipelines</span>
              <h3 className="text-lg font-black text-slate-900 leading-none mt-0.5">For Certified Vendors</h3>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Ditch expensive ad spends, unqualified directories, and cold calling. Gain immediate access to active buyers in real, pre-qualified purchase windows.
          </p>

          <ul className="space-y-3.5">
            <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
              <CheckCircle className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" />
              <span><strong>Mathematical ROI:</strong> Buy credits only for leads whose exact budget scale, need constraints, and timelines are pre-verified.</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
              <CheckCircle className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" />
              <span><strong>Direct Authority Connect:</strong> Connect directly with verified evaluators, skipping bureaucratic barriers or dead ends.</span>
            </li>
            <li className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
              <CheckCircle className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" />
              <span><strong>Competitive Limit:</strong> Each qualified lead is assigned to a maximum of 3 vendors to ensure highly healthy conversion ratios.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Brand Stats / Compliance */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#0066FF]">₹25 Cr+</div>
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">IT Budgets Verified</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#0066FF]">5,000+</div>
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Enterprise Leads Audited</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#0066FF]">350+</div>
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Certified IT Vendors</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#0066FF]">98.4%</div>
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">BANT Qualification Accuracy</div>
        </div>
      </section>
    </article>
  );
}

// ---------------------------------------------------------
// 2. TERMS OF SERVICE PAGE
// ---------------------------------------------------------
export function TermsPage() {
  useSeoMetadata(
    "Terms of Service - BANTConfirm Sourcing Marketplace",
    "Review BANTConfirm's Terms of Service. Learn about platform agreements, user compliance, buyer sourcing responsibilities, certified partner standards, and credit/fee transaction policies.",
    "BANTConfirm terms of service, platform agreements, corporate compliance, vendor contract terms, lead refund policies, IT legal terms"
  );

  return (
    <article className="space-y-8 py-4 animate-in fade-in duration-300 text-xs text-slate-600 leading-relaxed font-medium">
      <header className="border-b border-slate-200 pb-4">
        <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Legal Agreement & Compliance</span>
        <h1 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">Terms of Service</h1>
        <p className="text-slate-500 mt-1.5 text-xs font-semibold">Effective Date: June 28, 2026 | Document Reference: BC-TOS-2026-V2</p>
      </header>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
        <Info className="w-5 h-5 shrink-0 text-amber-600" />
        <p className="leading-relaxed">
          Please read this legal agreement carefully before using BANTConfirm. By registering as a corporate buyer, certified software partner, or general representative, you agree to be bound by all of the following rules, terms, and conditions.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 space-y-6 shadow-xs text-slate-600">
        {/* Section 1 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">1</span>
            1. Sourcing Accuracy & Buyer Obligations
          </h2>
          <p>
            Any entity submitting inquiries or requirements (referred to as a "Buyer") represents and warrants that all corporate information, including GSTIN numbers, contact credentials, operational budgets, and purchase timelines, is completely accurate, authentic, and authorized by their company.
          </p>
          <p>
            Submission of fake, misleading, or exploratory inquiries designed purely for intelligence gathering without active, verified buying intent is strictly prohibited. BANTConfirm reserves the right to suspend any account engaging in such behavior immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">2</span>
            2. BANT Auditing Desk Right of Verification
          </h2>
          <p>
            BANTConfirm operates a specialized audit desk. We reserve the absolute right to contact buyers via telephone, corporate email, video conference, or WhatsApp to audit information before listing the inquiry on our partner marketplace.
          </p>
          <p>
            If a buyer is unresponsive to audit requests for more than three (3) business days, or fails to provide credible authority indicators, the sourcing request will be archived and marked as "Disqualified" to protect vendor resource integrity.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">3</span>
            3. Vendor Certification, Code of Conduct & Lead Fair-Use
          </h2>
          <p>
            Vendors, developers, and consultants registered under the "Vendor" tier must hold valid business licenses, GSTIN registrations, and proof of technical delivery compliance in India.
          </p>
          <p>
            Vendors agree to contact assigned buyers in a professional, courteous manner strictly to address the specific posted requirement. Sending unrelated promotional materials, spamming, or sharing the buyer's private coordinates with third parties is a critical violation of these terms and will result in immediate termination of partner status without any refunds.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">4</span>
            4. Sourcing Transaction Fees, Commission & Refunds
          </h2>
          <p>
            Access to qualified BANT leads on our marketplace requires either lead credits or an active partnership subscription subscription plan.
          </p>
          <p>
            <strong>Refund Policy on Discrepancies:</strong> If a vendor purchases a qualified lead and discovers that the buyer's contact coordinates are invalid (e.g., incorrect phone number or incorrect corporate email) or the project is canceled within five (5) days, the vendor can submit a refund claim. Our compliance team will audit the recording/record of qualification, and if verified, credits will be fully refunded to the vendor's wallet.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">5</span>
            5. Intellectual Property & Trademark Protection
          </h2>
          <p>
            All content, database structures, algorithms, verification procedures, dashboard UI structures, logos, brand names, and the proprietary "BANT Qualification Indexing" used on BANTConfirm are the exclusive intellectual property of BANTConfirm Sourcing Marketplace Private Limited. Unauthorized harvesting, scraping, crawling, or copying is strictly prohibited and subject to legal action.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">6</span>
            6. Limitation of Liability
          </h2>
          <p>
            BANTConfirm is a professional procurement and matching engine. While we apply rigorous audits to confirm BANT criteria, we do not guarantee that buyers will close contracts, purchase software, or accept vendor proposals. We are not responsible or liable for any business losses, project delays, implementation failures, or contractual disputes between the buyer and matched vendors.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">7</span>
            7. Governing Law and Jurisdiction
          </h2>
          <p>
            These terms and any actions or disputes relating to your use of this platform shall be governed by, and construed in accordance with, the laws of the Republic of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of Gautam Buddha Nagar, Noida, Uttar Pradesh, India.
          </p>
        </section>
      </div>
    </article>
  );
}

// ---------------------------------------------------------
// 3. PRIVACY POLICY PAGE
// ---------------------------------------------------------
export function PrivacyPage() {
  useSeoMetadata(
    "Privacy Policy - BANTConfirm Secure Sourcing Marketplace",
    "Read BANTConfirm's Privacy Policy. Learn how we securely protect corporate data, handle contact numbers, manage cookies, and comply with the DPDP Act of India and GDPR regulations.",
    "BANTConfirm privacy policy, corporate data protection, secure database storage, DPDP compliance, GDPR privacy standards, cookies usage"
  );

  return (
    <article className="space-y-8 py-4 animate-in fade-in duration-300 text-xs text-slate-600 leading-relaxed font-medium">
      <header className="border-b border-slate-200 pb-4">
        <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Data Safety & Trust Charter</span>
        <h1 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 mt-1.5 text-xs font-semibold">Effective Date: June 28, 2026 | Document Reference: BC-PRIVACY-2026-V2</p>
      </header>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
        <Lock className="w-5 h-5 shrink-0 text-blue-600" />
        <p className="leading-relaxed">
          At BANTConfirm, we are deeply committed to protecting your personal and corporate information. This privacy charter outlines how we collect, store, secure, and securely transfer data to facilitate pre-qualified B2B software sourcing.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 space-y-6 shadow-xs text-slate-600">
        {/* Section 1 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">1</span>
            1. Information We Collect
          </h2>
          <p>
            We collect information from various stages of your platform interaction to ensure a highly qualified secure experience:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-4 text-slate-500 font-semibold">
            <li><strong>Personal Contact Data:</strong> Full Name, Corporate Email Addresses, Business Phone / Mobile Coordinates, Profile Photos (when logging in securely via Google OAuth).</li>
            <li><strong>Enterprise Corporate Data:</strong> Registered Company Name, Corporate HQ, Location/City, GSTIN / Tax Identifiers, Operational Domains, Company Size, and Industry Verticals.</li>
            <li><strong>Requirement Sourcing Data:</strong> Specific technical challenges, integration constraints, licensing requirements, and active budgets.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">2</span>
            2. How We Protect & Mask Buyer Coordinates
          </h2>
          <p>
            To eliminate unwanted spam and maintain strict privacy, BANTConfirm enforces the following data-protection protocol:
          </p>
          <p>
            A buyer's direct email, telephone numbers, and specific contact names are **strictly masked and hidden** from the public dashboard. Only certified technology partners who meet the matching criteria and purchase the pre-verified lead credits can unlock access to the buyer's contact coordinates.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">3</span>
            3. Google OAuth Scope and Identity Consent
          </h2>
          <p>
            When utilizing Google Sign-In or Google Sign-Up, BANTConfirm only requests access to basic identity metadata: your full name, email address, and profile photo. 
          </p>
          <p>
            We do NOT request access to, read, or process your personal Google Drive, Contacts, Calendar, Gmail inbox, or other secure Google Workspace applications. OAuth data is strictly handled server-side to establish a fast, secure user session.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">4</span>
            4. Data Retention, Storage and Server Security
          </h2>
          <p>
            All platform data is hosted securely in cloud databases with TLS 1.3 encryption in transit and AES-256 encryption at rest. 
          </p>
          <p>
            We strictly comply with the **Digital Personal Data Protection (DPDP) Act of India (2023)** and adhere to GDPR data portability guidelines. Personal and corporate profiling databases are audited regularly to protect against data leaks.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">5</span>
            5. Cookies and Web Session Identifiers
          </h2>
          <p>
            We utilize secure session cookies and localStorage variables strictly to maintain authentication states, preserve cart wishlist selections, and map current dashboard tab selections. No unauthorized third-party cross-site advertising or tracking cookies are permitted on our domains.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">6</span>
            6. User Rights & Data Deletion (Opt-Out)
          </h2>
          <p>
            Users maintain complete sovereignty over their data. You hold the legal right to request:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4 text-slate-500 font-semibold">
            <li>Review and editing of current profile data records.</li>
            <li>Archiving of open sourcing leads.</li>
            <li>Complete deletion of your account and all associated profile records from our databases.</li>
          </ul>
          <p>
            To initiate an account deletion or opt-out audit request, please email our Corporate Trust Officer directly at <strong>trust@bantconfirm.com</strong> from your registered business email. Requests are fully executed within 48 operational hours.
          </p>
        </section>
      </div>
    </article>
  );
}
