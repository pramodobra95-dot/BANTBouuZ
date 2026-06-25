import React, { useState } from "react";
import { 
  Search, Globe, Code, FileText, X, Check, Copy, 
  MapPin, Building, CheckCircle, ChevronRight, Laptop, Sparkles, Database 
} from "lucide-react";

interface SEOViewerProps {
  onClose: () => void;
}

export default function SEOViewer({ onClose }: SEOViewerProps) {
  const [activeTab, setActiveTab] = useState<'directory' | 'meta' | 'schema' | 'sitemap' | 'robots'>('directory');
  const [copied, setCopied] = useState(false);

  // Regional SEO config builder state
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [selectedService, setSelectedService] = useState("CRM Software Integration");

  const cities = [
    "Bangalore", "Mumbai", "Delhi NCR", "Noida", "Gurgaon", 
    "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad"
  ];

  const states = [
    { name: "Karnataka", hub: "Bangalore", code: "KA" },
    { name: "Maharashtra", hub: "Mumbai & Pune", code: "MH" },
    { name: "Delhi NCT", hub: "New Delhi", code: "DL" },
    { name: "Uttar Pradesh", hub: "Noida", code: "UP" },
    { name: "Haryana", hub: "Gurgaon", code: "HR" },
    { name: "Telangana", hub: "Hyderabad", code: "TS" },
    { name: "Tamil Nadu", hub: "Chennai", code: "TN" },
    { name: "West Bengal", hub: "Kolkata", code: "WB" },
    { name: "Gujarat", hub: "Ahmedabad", code: "GJ" }
  ];

  const services = [
    "CRM Software Integration",
    "ERP Enterprise Implementations",
    "Cloud Telephony & Call Centers",
    "WhatsApp Business API Automation",
    "Cyber Security Audits",
    "Custom Software Procurement",
    "BANT Lead Sourcing Hub"
  ];

  // Helper to generate dynamic title & description
  const getDynamicSEO = (city: string, service: string) => {
    const title = `Top ${service} in ${city} | Verified BANT Sourcing India`;
    const desc = `Compare and hire the best certified providers for ${service} in ${city}, India. Pre-qualified enterprise buyers, verified pricing plans, zero upfront setup, and up to 10% referral rewards.`;
    const slug = `/sourcing/${city.toLowerCase().replace(/\s+/g, '-')}/${service.toLowerCase().replace(/\s+/g, '-')}`;
    const keywords = `${service} ${city}, best ${service} India, certified BANT providers ${city}, IT procurement ${city}`;
    return { title, desc, slug, keywords };
  };

  const currentDynamic = getDynamicSEO(selectedCity, selectedService);

  const metaDataByRoute: Record<string, {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDesc: string;
    ogUrl: string;
    ogImage: string;
  }> = {
    "/products/salesforce-crm-cloud": {
      title: "Buy Salesforce CRM Cloud Customizer | BANTConfirm Marketplace",
      description: "Get verified quotes for Salesforce CRM Cloud Customizer. Pre-qualified BANT leads & solutions from SaaSify Solutions Pvt Ltd. Tailored for SME pipeline management.",
      keywords: "Salesforce CRM, CRM software B2B, cloud crm solutions, salesforce quotes india",
      ogTitle: "Salesforce CRM Cloud Customizer on BANTConfirm",
      ogDesc: "Compare and buy qualified CRM systems with full BANT criteria support.",
      ogUrl: "https://bantconfirm.com/products/salesforce-crm-cloud",
      ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"
    },
    "/categories/cloud-telephony": {
      title: "Top Cloud Telephony Software & Call Centers | BANTConfirm",
      description: "Browse verified Cloud Telephony solutions. Get multiple quotes for Virtual PBX systems, IVR solutions, and call recording servers. ISO-certified providers.",
      keywords: "Cloud Telephony, Virtual PBX, Call Center, DID Number, SIP Trunk",
      ogTitle: "Cloud Telephony Marketplace on BANTConfirm",
      ogDesc: "Identify top-rated enterprise cloud telephony providers and SIP trunks with detailed reviews.",
      ogUrl: "https://bantconfirm.com/categories/cloud-telephony",
      ogImage: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=600&auto=format&fit=crop"
    },
    "/blog/how-to-choose-crm": {
      title: "How to Choose the Right CRM Software for Your Growing SME | Blog",
      description: "Learn how to qualify CRM requirements using BANT scoring framework to avoid overpaying for unnecessary IT licensing.",
      keywords: "CRM guide, SME CRM, BANT lead qualification, CRM implementation, software compare",
      ogTitle: "BANT Sourcing Guide: SME CRM Selection Framework",
      ogDesc: "Free B2B guide to scaling sales pipeline tracking with CRM and WhatsApp integration.",
      ogUrl: "https://bantconfirm.com/blog/how-to-choose-crm",
      ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"
    }
  };

  const [selectedRoute, setSelectedRoute] = useState<string>("/products/salesforce-crm-cloud");
  const currentMeta = metaDataByRoute[selectedRoute] || metaDataByRoute["/products/salesforce-crm-cloud"];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Regional Portals -->
  <url>
    <loc>https://bantconfirm.com/</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bantconfirm.com/become-partner</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- India State Sourcing Directories -->
  ${states.map(s => `  <url>
    <loc>https://bantconfirm.com/states/${s.name.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Top Indian Tech Cities Directories -->
  ${cities.map(c => `  <url>
    <loc>https://bantconfirm.com/cities/${c.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Static Categories -->
  <url>
    <loc>https://bantconfirm.com/categories/crm-software</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bantconfirm.com/categories/cloud-telephony</loc>
    <lastmod>2026-06-25</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  const robotsTxt = `# robots.txt for BANTConfirm Marketplace India
User-agent: *
Allow: /
Allow: /products/
Allow: /categories/
Allow: /blog/
Allow: /sourcing/
Allow: /cities/
Allow: /states/
Disallow: /admin/
Disallow: /user/dashboard/
Disallow: /api/

Sitemap: https://bantconfirm.com/sitemap.xml`;

  // Localized JSON-LD Schema
  const dynamicSchemaJson = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `BANTConfirm - ${selectedService} in ${selectedCity}`,
    "description": currentDynamic.desc,
    "url": `https://bantconfirm.com${currentDynamic.slug}`,
    "telephone": "+91-9876543210",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": selectedCity,
      "addressCountry": "IN",
      "addressRegion": states.find(s => s.hub.includes(selectedCity) || s.name.toLowerCase().includes(selectedCity.toLowerCase()))?.name || "India"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "12.9716",
      "longitude": "77.5946"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.linkedin.com/company/bantconfirm"
    ]
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col h-[650px] animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">BANTConfirm National SEO & Sourcing Index Hub</h3>
              <p className="text-[10px] text-slate-400">Targeting Google First Page for Indian B2B Sourcing Searches</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 p-1 flex-wrap">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'directory' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4 text-red-400" />
            <span>🇮🇳 India Sourcing Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'meta' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Dynamic Meta Tags</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'schema' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Structured JSON-LD</span>
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'sitemap' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Sitemap.xml</span>
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'robots' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Robots.txt</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-950">
          
          {/* 1. India Sourcing Directory (Interactive Regional Hubs) */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              {/* Top Banner explaining the search strategy */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-4 rounded-xl border border-slate-800/80 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">National SEO Campaign: India Regional B2B Sourcing</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    By generating highly-optimized dynamic landers combining India's top 10 tech cities with major enterprise products and services, BANTConfirm ranks first page on Google for queries like <em>"CRM software providers in Gurgaon"</em> or <em>"ERP services in Pune"</em>.
                  </p>
                </div>
              </div>

              {/* Dynamic Sourcing Generator Preview */}
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-1.5 text-xs text-white font-extrabold uppercase">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span>Real-Time SEO Meta Generator</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Select values below to review real-time Google tag outputs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target India City:</label>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded p-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sourcing Product/Service:</label>
                    <select 
                      value={selectedService} 
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded p-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Simulated Google Search Result */}
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1.5">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <span>https://bantconfirm.com</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span className="text-slate-400">sourcing</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span className="text-blue-400 font-medium">{currentDynamic.slug.split('/').pop()}</span>
                  </div>
                  <h4 className="text-sm md:text-base font-medium text-blue-400 hover:underline cursor-pointer leading-tight">
                    {currentDynamic.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    {currentDynamic.desc}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="text-[9px] bg-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded font-mono border border-blue-800/40">Keywords: {currentDynamic.keywords}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 text-[10px]">
                  <button 
                    onClick={() => handleCopy(`<title>${currentDynamic.title}</title>\n<meta name="description" content="${currentDynamic.desc}" />`)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 px-3 rounded flex items-center gap-1 cursor-pointer font-bold font-mono"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Page Tags</span>
                  </button>
                </div>
              </div>

              {/* Grid: States list & City index for indexing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State Index */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/60 space-y-3">
                  <h5 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>State Wise Sourcing Hubs (India)</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
                    {states.map(s => (
                      <div key={s.name} className="flex items-center gap-1.5 p-1 hover:bg-slate-900 rounded transition-all">
                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="text-slate-200">{s.name}</span>
                        <span className="text-slate-500 text-[9px]">({s.code})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* City Index */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/60 space-y-3">
                  <h5 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>City Wise Tech Hubs (India)</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
                    {cities.map(c => (
                      <div key={c} className="flex items-center gap-1.5 p-1 hover:bg-slate-900 rounded transition-all">
                        <CheckCircle className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="text-slate-200">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Meta Tags tab */}
          {activeTab === 'meta' && (
            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 rounded-t">
                <span className="text-xs text-slate-400">Select Static Product/Category Route:</span>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(metaDataByRoute).map((route) => (
                    <button
                      key={route}
                      onClick={() => setSelectedRoute(route)}
                      className={`px-3 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedRoute === route ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {route}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Standard & Social Graph Tags (Injected):</span>
                <button
                  onClick={() => handleCopy(`<title>${currentMeta.title}</title>\n<meta name="description" content="${currentMeta.description}" />`)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer text-slate-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-2 bg-slate-900/50 p-4 rounded border border-slate-800/80">
                <p className="text-yellow-400 font-bold">// HTML Head tags</p>
                <p>&lt;<span className="text-blue-400">title</span>&gt;{currentMeta.title}&lt;/<span className="text-blue-400">title</span>&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">name</span>=<span className="text-orange-300">"description"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.description}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">name</span>=<span className="text-orange-300">"keywords"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.keywords}"</span> /&gt;</p>
                
                <p className="text-yellow-400 font-bold mt-4 pt-2">// Open Graph / Social Tags</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:title"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogTitle}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:description"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogDesc}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:url"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogUrl}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:image"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogImage}"</span> /&gt;</p>
              </div>
            </div>
          )}

          {/* 3. Structured Data tab */}
          {activeTab === 'schema' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">JSON-LD Local Business & Sourcing Service Schema:</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(dynamicSchemaJson, null, 2))}
                  className="hover:text-white flex items-center gap-1 cursor-pointer text-slate-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 p-4 rounded border border-slate-800 text-blue-300 overflow-x-auto">
                {JSON.stringify(dynamicSchemaJson, null, 2)}
              </pre>
            </div>
          )}

          {/* 4. Sitemap.xml tab */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Auto-Generated Sitemap.xml (Includes Cities & States):</span>
                <button
                  onClick={() => handleCopy(sitemapXml)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer text-slate-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 p-4 rounded border border-slate-800 text-green-300 overflow-x-auto whitespace-pre">
                {sitemapXml}
              </pre>
            </div>
          )}

          {/* 5. Robots.txt tab */}
          {activeTab === 'robots' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Robots.txt Crawl Directives:</span>
                <button
                  onClick={() => handleCopy(robotsTxt)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer text-slate-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 p-4 rounded border border-slate-800 text-orange-200 overflow-x-auto whitespace-pre">
                {robotsTxt}
              </pre>
            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
          <span>Active Directories are fully indexable by Google Search Console & Bing crawlers.</span>
          <span className="text-blue-500 font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
            <span>BANTConfirm Dynamic India SEO Engine Live</span>
          </span>
        </div>
      </div>
    </div>
  );
}
