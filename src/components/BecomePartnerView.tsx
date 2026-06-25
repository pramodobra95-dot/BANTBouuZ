import React, { useState } from "react";
import { 
  Users, CheckCircle, HelpCircle, Mail, Shield, Award, 
  Sparkles, Building, Phone, Laptop, ArrowRight, User, AlertCircle, FileText
} from "lucide-react";

interface BecomePartnerViewProps {
  onRegisterSuccess: (vendorData: any) => void;
  onNavigateToTab: (tab: string, subTab?: string) => void;
}

export default function BecomePartnerView({ onRegisterSuccess, onNavigateToTab }: BecomePartnerViewProps) {
  // Form fields
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState("");
  const [description, setDescription] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailSimulator, setShowEmailSimulator] = useState(false);
  const [simulatedVendor, setSimulatedVendor] = useState<any | null>(null);
  const [activeEmailTab, setActiveEmailTab] = useState<"confirmation" | "welcome">("confirmation");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyName || !mobile || !email || !products || !description) {
      alert("Please fill in all the required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        name,
        companyName,
        mobile,
        email,
        products,
        description
      };

      const res = await fetch("/api/auth/register-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSimulatedVendor(data.vendor);
        setShowEmailSimulator(true);
        // Call the parent callback to update current user state
        onRegisterSuccess(data);
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToProductListing = () => {
    // Navigate to vendor-panel on the products tab to upload their products
    onNavigateToTab("vendor-panel", "products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-10">
      {/* Banner / Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-blue-600 font-extrabold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
          Join India's Most Pre-Qualified Enterprise Network
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Become a Certified Partner & Trust FAQ Center
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Zero entry barriers, 100% performance-aligned leads, and automated referral programs. Register today and instantly list your software products to active tech buyers.
        </p>
      </div>

      {/* Grid: Registration Form (Left) & Info/FAQs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 md:p-8 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              Join the Alliance: Partner Registration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete this application to register and instantly access the Product Sourcing Portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Dev"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. SaaSify Solutions Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email ID (Corporate Preferred) *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target IT Products & Solutions to List *
              </label>
              <div className="relative">
                <Laptop className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SaaS HRMS, Enterprise ERP CRM, AI Support Chatbots"
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Specify which key solutions you wish to publish to our catalog.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company & Sourcing Capabilities Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Give a brief description of your products, targeted client size (SME/Enterprise), and key industries served."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
            >
              {isSubmitting ? "Processing Registry..." : "Register Partner Account & View Welcome Emails →"}
            </button>
          </form>
        </div>

        {/* Right: Info / dual FAQs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Why partner block */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black">
              <Award className="w-4 h-4" />
              <span>THE BANTCONFIRM EDGE</span>
            </div>
            <h4 className="text-base font-black tracking-tight text-white">Why register as a BANTConfirm Technology Partner?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We operate India's highest-converting IT lead registry. By qualifying buyers under rigorous Budget, Authority, Need, and Timeline assessments, we provide deals ready for commercial closure.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">No Upfront Commitment</p>
                  <p className="text-[11px] text-slate-400">We do not charge any upfront amount. Setup, listing, and validation are completely free of cost.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">Commission on Closed Leads Only</p>
                  <p className="text-[11px] text-slate-400">We only take a performance success commission once your deal is closed and paid.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ 1: Partners */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mb-3">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Frequently Asked FAQ for Partners
            </h4>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 flex items-start gap-1">
                  <span className="text-blue-600 font-extrabold">Q:</span>
                  <span>Are there any upfront charges to join or list our IT products?</span>
                </p>
                <p className="text-slate-600 pl-4 leading-relaxed bg-slate-50/50 p-2 rounded border border-slate-100">
                  <strong>No upfront charges.</strong> We do not charge any upfront amount. We only take a performance-based success commission on successfully closed leads (deals).
                </p>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <p className="font-bold text-slate-900 flex items-start gap-1">
                  <span className="text-blue-600 font-extrabold">Q:</span>
                  <span>What is the commission percentage on closed deals?</span>
                </p>
                <p className="text-slate-600 pl-4 leading-relaxed">
                  We charge a fair, pre-agreed performance commission on the final contract size, billed only after the deal is officially closed.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ 2: Users */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2 mb-3">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Frequently Asked FAQ for Users & Buyers
            </h4>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 flex items-start gap-1">
                  <span className="text-amber-500 font-extrabold">Q:</span>
                  <span>How do I post an enquiry and match with vendors?</span>
                </p>
                <p className="text-slate-600 pl-4 leading-relaxed">
                  Posting is entirely free! Simply click <strong>"Post Requirement"</strong> in the top menu. Enter your tech needs, and our BANT qualification workspace instantly matches you with verified options.
                </p>
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <p className="font-bold text-slate-900 flex items-start gap-1">
                  <span className="text-amber-500 font-extrabold">Q:</span>
                  <span>How can I earn referral rewards off my closed enquiries?</span>
                </p>
                <p className="text-slate-600 pl-4 leading-relaxed bg-slate-50/50 p-2 rounded border border-slate-100">
                  If you share your software/IT requirement and it closes successfully with a certified partner, you earn real cash rewards! You get <strong>up to a 10% commission</strong> of the closed deal as a referral bonus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL CONFIRMATION AND WELCOME DISPATCH SIMULATOR (Modal) */}
      {showEmailSimulator && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-2xl shadow-2xl max-w-4xl w-full h-[650px] overflow-hidden flex flex-col border border-blue-900/40 animate-fade-in">
            {/* Simulator Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-xs font-bold text-slate-400 pl-2">BANTConfirm Auto-Mailer Simulator</span>
              </div>
              <span className="text-[10px] bg-blue-900/50 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded-full font-bold">
                2 simulated dispatches sent successfully
              </span>
            </div>

            {/* Main Section */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-900">
              {/* Mail list sidebar */}
              <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-3 shrink-0">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Inbox ({email})</p>
                
                <button
                  onClick={() => setActiveEmailTab("confirmation")}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-all flex flex-col gap-1 ${
                    activeEmailTab === "confirmation" 
                      ? "bg-blue-600/20 border-l-4 border-blue-500 text-white font-bold" 
                      : "text-slate-400 hover:bg-slate-900 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-extrabold text-blue-400 text-[10px]">RE: Partner Registry</span>
                    <span className="text-[9px] text-slate-500">Just now</span>
                  </div>
                  <span className="line-clamp-1">1. Confirmation: Partnership Onboarding...</span>
                </button>

                <button
                  onClick={() => setActiveEmailTab("welcome")}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-all flex flex-col gap-1 ${
                    activeEmailTab === "welcome" 
                      ? "bg-blue-600/20 border-l-4 border-blue-500 text-white font-bold" 
                      : "text-slate-400 hover:bg-slate-900 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-extrabold text-yellow-400 text-[10px]">Welcome Pack</span>
                    <span className="text-[9px] text-slate-500">Just now</span>
                  </div>
                  <span className="line-clamp-1">2. Welcome: Features & Benefits Guide</span>
                </button>

                <div className="p-3 bg-blue-950/20 rounded-lg border border-blue-900/30 space-y-1.5 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1 text-blue-400 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Auto-Approval Mode</span>
                  </div>
                  <p className="leading-normal">
                    Your partner account has been auto-approved for this workspace. Click the bottom button anytime to land in the product listing portal and list your software.
                  </p>
                </div>
              </div>

              {/* Mail reader area */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-900 text-slate-200">
                {activeEmailTab === "confirmation" ? (
                  /* Email 1: Confirmation */
                  <div className="space-y-4 max-w-2xl mx-auto bg-white text-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 text-xs">
                    {/* Email Headers */}
                    <div className="border-b pb-4 space-y-1.5 text-[11px] text-slate-500">
                      <div><strong className="text-slate-800">From:</strong> partner-registry@bantconfirm.com</div>
                      <div><strong className="text-slate-800">To:</strong> {email}</div>
                      <div><strong className="text-slate-800">Subject:</strong> Partner Registry Application Received - BANTConfirm</div>
                      <div><strong className="text-slate-800">Date:</strong> {new Date().toUTCString()}</div>
                    </div>

                    {/* Email Body */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 bg-[#FFC107] rounded flex items-center justify-center text-[10px] font-black text-slate-900">B</div>
                        <span className="font-black text-slate-900 text-sm">BANTConfirm Alliance Registry</span>
                      </div>

                      <p>Dear <strong className="text-slate-900">{name}</strong>,</p>
                      
                      <p>
                        Thank you for registering your enterprise offering on BANTConfirm. This email confirms that we have successfully received your partnership profile details for <strong className="text-slate-900">{companyName}</strong>.
                      </p>

                      <div className="bg-slate-50 p-3 rounded border space-y-1">
                        <p className="font-bold text-slate-800 mb-1">Registered Specifications:</p>
                        <p><strong>Primary Partner Rep:</strong> {name}</p>
                        <p><strong>Registered Company:</strong> {companyName}</p>
                        <p><strong>Contact Hotline:</strong> {mobile}</p>
                        <p><strong>Target Products:</strong> {products}</p>
                      </div>

                      <p className="leading-relaxed">
                        Our compliance algorithms have verified your email domain and company details. Your account has been provisioned with standard free partner status so you can proceed to the catalog listings immediately.
                      </p>

                      <p className="text-slate-500 pt-4 border-t">
                        Sincerely,<br />
                        <strong>BANTConfirm Partner Onboarding Desk</strong><br />
                        <span className="text-[10px]">Marketplace Alliance Hub, India</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Email 2: Welcome Pack & Benefits */
                  <div className="space-y-4 max-w-2xl mx-auto bg-white text-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 text-xs">
                    {/* Email Headers */}
                    <div className="border-b pb-4 space-y-1.5 text-[11px] text-slate-500">
                      <div><strong className="text-slate-800">From:</strong> welcome@bantconfirm.com</div>
                      <div><strong className="text-slate-800">To:</strong> {email}</div>
                      <div><strong className="text-slate-800">Subject:</strong> Welcome to BANTConfirm - Features & Partner Benefit Guide</div>
                      <div><strong className="text-slate-800">Date:</strong> {new Date().toUTCString()}</div>
                    </div>

                    {/* Email Body */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 bg-[#0066FF] rounded flex items-center justify-center text-[10px] font-black text-white">B</div>
                        <span className="font-black text-slate-900 text-sm">Welcome to BANTConfirm</span>
                      </div>

                      <p>Hi <strong className="text-slate-900">{name}</strong>,</p>

                      <p className="font-medium text-[#0066FF] text-xs">
                        Welcome to the future of high-intent B2B sales. Here is how BANTConfirm helps you win more closed contracts:
                      </p>

                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mt-3 mb-1 border-b pb-1">
                        🌟 Key Partner Benefits & Core Features
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <span className="text-blue-600 font-extrabold shrink-0 mt-0.5">1.</span>
                          <div>
                            <strong>No Upfront Barrier:</strong> BANTConfirm never charges setup, platform, or fixed directory fees. Listing is completely free of charge.
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-blue-600 font-extrabold shrink-0 mt-0.5">2.</span>
                          <div>
                            <strong>100% Success-Aligned Commissions:</strong> We do not charge per low-quality click. We only take a performance commission on deals successfully closed and paid.
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-blue-600 font-extrabold shrink-0 mt-0.5">3.</span>
                          <div>
                            <strong>High-Intent BANT Sourcing Leads:</strong> Get matched only with IT evaluators whose procurement budgets and timelines have been pre-qualified through BANT criteria.
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-blue-600 font-extrabold shrink-0 mt-0.5">4.</span>
                          <div>
                            <strong>Up to 10% User Rewards:</strong> Enterprise stakeholders posting verified requirements get compensated for their closing effort via referral distributions.
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50/80 p-3 rounded-lg border border-blue-100 text-blue-900 mt-4">
                        <p className="font-bold">Next Action Required:</p>
                        <p className="text-[11px] text-blue-800">
                          To start receiving matching leads, log in to your dashboard and populate your solution profiles with details, features, pricing models, and tech configurations.
                        </p>
                      </div>

                      <p className="text-slate-500 pt-4 border-t">
                        Best Regards,<br />
                        <strong>Rohan Das</strong><br />
                        <span className="text-[10px]">Founder, BANTConfirm Technology Solutions</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Automated emails copy dispatched to <strong className="text-white">{email}</strong>.
              </span>
              <button
                onClick={handleProceedToProductListing}
                className="bg-[#0066FF] hover:bg-blue-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-102"
              >
                <span>Upload Product Listing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
