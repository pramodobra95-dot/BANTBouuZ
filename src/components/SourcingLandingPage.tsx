import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CheckCircle, ShieldCheck, HelpCircle, ArrowRight, Phone, 
  MapPin, Clock, DollarSign, UserCheck, Star, Sparkles, AlertCircle 
} from "lucide-react";
import { SEOProduct, SEOLocation, generateSourcingSEO, CITIES, PRODUCTS } from "../lib/seoData";
import { safeAlert } from "../utils/safeAlert";

interface SourcingLandingPageProps {
  product: SEOProduct;
  location: SEOLocation;
  currentUser: any;
  onPostLead: (leadData: any) => Promise<void>;
  onNavigateToTab: (tab: string) => void;
}

export default function SourcingLandingPage({
  product,
  location,
  currentUser,
  onPostLead,
  onNavigateToTab
}: SourcingLandingPageProps) {
  const seo = generateSourcingSEO(product, location);
  
  // Lead submission form state
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState(currentUser?.name || "");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [sourcingBudget, setSourcingBudget] = useState("");
  const [timeline, setTimeline] = useState("Within 15 Days");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Accordion active index
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !mobile || !email || !sourcingBudget) {
      safeAlert("Please fill in all mandatory fields.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      // Create a pre-filled, high-intent lead
      const leadData = {
        title: `Requirement for ${product.name} in ${location.name}`,
        category: product.name, // match category
        description: `Company requires ${product.name} solutions in ${location.name}. Sourcing Budget: ${sourcingBudget}. Timeline: ${timeline}. Additional Notes: ${additionalDetails || "None provided."}`,
        budget: sourcingBudget,
        companyName,
        contactName,
        mobile,
        email,
        city: location.name,
        timeline,
        status: "Submitted",
        // BANT details pre-qualified
        bant: {
          budget: `Sufficient - Budget verified at ${sourcingBudget}`,
          authority: `Decision Maker - Sourcing initiated by ${contactName} (${companyName})`,
          need: `Verified Need - Explicit requirement for ${product.name} solutions`,
          timeline: `Urgency - target timeline set to ${timeline}`
        },
        assignedVendors: []
      };

      await onPostLead(leadData);
      
      // Clear form
      setCompanyName("");
      setMobile("");
      setAdditionalDetails("");
      
      safeAlert(`Successfully posted your sourcing requirement! Our regional BANT desk in ${location.name} will audit the requirement in 2 hours.`, "success");
      
      // Navigate to dashboard to see the submitted lead
      setTimeout(() => {
        onNavigateToTab("dashboard");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      safeAlert(`Failed to submit requirement: ${err?.message || err}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Get dynamic internal links
  const relatedCities = CITIES.filter(c => c.slug !== location.slug).slice(0, 6);
  const relatedProducts = PRODUCTS.filter(p => p.slug !== product.slug).slice(0, 5);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* 1. LOCALIZED HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 py-16 md:py-24 px-4 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent opacity-75" />
        <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/15 border border-blue-400/30 rounded-full text-xs font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified B2B Procurement</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Pre-Qualified <span className="text-blue-400">{product.name}</span> Solutions in <span className="text-emerald-400">{location.name}</span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              We eliminate supplier friction. Source BANT-verified {product.name} solutions from top-tier enterprise vendors in {location.name}. Budget pre-audited, authority certified, immediate deployment timelines.
            </p>

            {/* Micro badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">100% SLA Audited</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">No Consultation Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 shrink-0 fill-yellow-400" />
                <span className="text-xs font-semibold text-slate-200">4.8/5 Platform Rating</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC BANT VALUE METRICS CARD */}
          <div className="md:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              {location.name} Sourcing Metrics
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified Vendors</span>
                <span className="text-sm font-black text-slate-100">14 Active Providers</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Budget Saving</span>
                <span className="text-sm font-black text-emerald-400">18% Cost Reduction</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sourcing Lead Time</span>
                <span className="text-sm font-black text-slate-100">Avg. 12 Business Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Compliance SLA</span>
                <span className="text-sm font-black text-blue-300">Enterprise Standard (99.9%)</span>
              </div>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-200 font-medium">
              Our regional sourcing desk in {location.name} matches local logistics and support teams for onsite integrations.
            </div>
          </div>

        </div>
      </section>

      {/* 2. MAIN WORKSPACE / LAYOUT */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: ABOUT PRODUCT, FEATURES, FAQS, INTERNAL LINKING */}
        <div className="md:col-span-7 space-y-10 text-left">
          
          {/* Section: Sourcing Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Enterprise Sourcing of {product.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {product.description} BANTConfirm provides a direct procurement lane connecting SME and enterprise buyers with reliable partners. No endless pitches or pushy sales reps — just transparent pricing and audited vendor capabilities.
            </p>
            
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex gap-3 items-start mt-6">
              <DollarSign className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 font-black uppercase tracking-wider block">Estimated Regional Pricing</span>
                <span className="text-sm font-extrabold text-[#0066FF]">{product.pricing}</span>
              </div>
            </div>
          </div>

          {/* Section: SLA & Product Features */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              Technical Specifications & SLA Checklist
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {product.features.map((feature, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-slate-700 leading-normal">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: BANT Framework Demonstration */}
          <div className="bg-gradient-to-br from-[#0066FF]/5 to-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#0066FF] tracking-tight">
                Our 4-Step BANT Qualification Framework
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                How BANTConfirm guarantees 100% genuine, action-ready requirements.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center font-black text-sm">B</div>
                <h4 className="text-xs font-extrabold text-slate-800">Budget Audited</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  We pre-verify corporate budget limits to ensure your software selection matches financial allowances.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">A</div>
                <h4 className="text-xs font-extrabold text-slate-800">Authority Confirmed</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Every sourcing requirement is initiated or approved by key decision-makers with buying permissions.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm">N</div>
                <h4 className="text-xs font-extrabold text-slate-800">Need Calibrated</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  We verify actual, high-intent technical needs, eliminating window shoppers and cold calls.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-black text-sm">T</div>
                <h4 className="text-xs font-extrabold text-slate-800">Timeline Bound</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Active projects must possess verified procurement and launching timelines (typically 15 to 90 days).
                </p>
              </div>
            </div>
          </div>

          {/* Section: Accordion FAQ */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0066FF]" />
              Sourcing FAQ & Advisory Info
            </h3>

            <div className="space-y-3">
              {seo.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-[#0066FF] transition-all flex justify-between items-center py-2.5 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-400 font-extrabold">{activeFaq === idx ? "−" : "+"}</span>
                  </button>
                  {activeFaq === idx && (
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold pt-1 pb-3 pl-1 animate-in slide-in-from-top-1 duration-100">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LEAD GENERATION FORM */}
        <div className="md:col-span-5 text-left">
          <div className="sticky top-24 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest block">Instant Sourcing Desk</span>
              <h3 className="text-lg font-black text-slate-900">Request Custom Pricing</h3>
              <p className="text-xs font-semibold text-slate-500 leading-normal">
                Submit your procurement specifications for {product.name} in {location.name}. Our regional BANT managers will match you with certified vendors.
              </p>
            </div>

            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Enterprises Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0066FF] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0066FF] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765..."
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0066FF] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0066FF] transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">Estimated Budget (INR) *</label>
                <select
                  required
                  value={sourcingBudget}
                  onChange={(e) => setSourcingBudget(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0066FF] transition-all"
                >
                  <option value="">Select approved budget limit</option>
                  <option value="Under ₹25,000 / month">Under ₹25,000 / month</option>
                  <option value="₹25,000 - ₹50,000 / month">₹25,000 - ₹50,000 / month</option>
                  <option value="₹50,000 - ₹1,00,000 / month">₹50,000 - ₹1,00,000 / month</option>
                  <option value="Over ₹1,00,000 / month">Over ₹1,00,000 / month</option>
                  <option value="One-time Setup: under ₹2 Lakhs">One-time Setup: under ₹2 Lakhs</option>
                  <option value="One-time Setup: ₹2 Lakhs - ₹10 Lakhs">One-time Setup: ₹2 Lakhs - ₹10 Lakhs</option>
                  <option value="One-time Setup: over ₹10 Lakhs">One-time Setup: over ₹10 Lakhs</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">Target Sourcing Timeline *</label>
                <select
                  required
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0066FF] transition-all"
                >
                  <option value="Within 15 Days">Immediate (Within 15 Days)</option>
                  <option value="Within 30 Days">Medium Term (Within 30 Days)</option>
                  <option value="2-3 Months">Planning Phase (2-3 Months)</option>
                  <option value="Over 3 Months">Exploratory Sourcing (Over 3 Months)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">Additional Specifications (Optional)</label>
                <textarea
                  placeholder="Describe your current software setup, specific integrations, user seats or specialized compliance requirements."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden focus:border-[#0066FF] transition-all resize-none"
                />
              </div>

              <div className="flex gap-2.5 items-start p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  By submitting, you agree to have regional BANTConfirm coordinators telephone-verify this sourcing inquiry. Verified inquiries receive matched bids from up to 3 certified partners.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0066FF] hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                    <span>Verifying Requirement...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Sourcing Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </section>

      {/* 3. SCALABLE INTERNAL LINKING (SITEMAP / GEO & PRODUCT FOOTER) */}
      <section className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8 text-left">
          
          {/* Linked locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
              Explore {product.name} Solutions in Other Cities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {relatedCities.map((city) => (
                <a
                  key={city.slug}
                  href={`/sourcing/${product.slug}-in-${city.slug}`}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#0066FF] bg-slate-50 hover:bg-blue-50/50 p-2 rounded-lg border border-slate-100 transition-all text-center block overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {product.name} {city.name}
                </a>
              ))}
            </div>
          </div>

          {/* Linked products in same location */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
              Other Enterprise Solutions in {location.name}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {relatedProducts.map((prod) => (
                <a
                  key={prod.slug}
                  href={`/sourcing/${prod.slug}-in-${location.slug}`}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#0066FF] bg-slate-50 hover:bg-blue-50/50 p-2 rounded-lg border border-slate-100 transition-all text-center block overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {prod.name} {location.name}
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
