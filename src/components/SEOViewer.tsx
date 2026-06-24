import React, { useState } from "react";
import { Search, Globe, Code, FileText, X, Check, Copy } from "lucide-react";

interface SEOViewerProps {
  onClose: () => void;
}

export default function SEOViewer({ onClose }: SEOViewerProps) {
  const [activeTab, setActiveTab] = useState<'meta' | 'sitemap' | 'robots' | 'schema'>('meta');
  const [selectedRoute, setSelectedRoute] = useState<string>("/products/salesforce-crm-cloud");
  const [copied, setCopied] = useState(false);

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

  const currentMeta = metaDataByRoute[selectedRoute] || metaDataByRoute["/products/salesforce-crm-cloud"];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>https://bantconfirm.com/</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bantconfirm.com/vendors/register</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Dynamic Categories -->
  <url>
    <loc>https://bantconfirm.com/categories/crm-software</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bantconfirm.com/categories/cloud-telephony</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Dynamic Products -->
  <url>
    <loc>https://bantconfirm.com/products/salesforce-crm-cloud</loc>
    <lastmod>2026-06-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  const robotsTxt = `# robots.txt for BANTConfirm Marketplace
User-agent: *
Allow: /
Allow: /products/
Allow: /categories/
Allow: /blog/
Disallow: /admin/
Disallow: /user/dashboard/
Disallow: /api/

Sitemap: https://bantconfirm.com/sitemap.xml`;

  const structuredDataJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Salesforce CRM Cloud Customizer",
    "image": currentMeta.ogImage,
    "description": currentMeta.description,
    "brand": {
      "@type": "Brand",
      "name": "Salesforce"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "1500",
      "priceTemplate": "Per user/month",
      "seller": {
        "@type": "Organization",
        "name": "SaaSify Solutions Pvt Ltd"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24"
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-[#0066FF]" />
            <h3 className="font-bold text-sm text-white">BANTConfirm SEO Crawler Control Panel</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 p-1">
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

        {/* Dynamic Route selector if dynamic schema selected */}
        {activeTab === 'meta' && (
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Select Dynamic SEO Route:</span>
            <div className="flex gap-2">
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
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed">
          {activeTab === 'meta' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Head Metadata Tags Injected Automatically:</span>
                <button
                  onClick={() => handleCopy(`<title>${currentMeta.title}</title>\n<meta name="description" content="${currentMeta.description}" />`)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer text-slate-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-2 bg-slate-900/50 p-4 rounded border border-slate-800/80">
                <p className="text-yellow-400 font-bold">// Standard HTML tags</p>
                <p>&lt;<span className="text-blue-400">title</span>&gt;{currentMeta.title}&lt;/<span className="text-blue-400">title</span>&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">name</span>=<span className="text-orange-300">"description"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.description}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">name</span>=<span className="text-orange-300">"keywords"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.keywords}"</span> /&gt;</p>
                
                <p className="text-yellow-400 font-bold mt-4 pt-2">// Open Graph / Facebook tags</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:title"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogTitle}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:description"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogDesc}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:url"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogUrl}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:image"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogImage}"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">property</span>=<span className="text-orange-300">"og:type"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"product"</span> /&gt;</p>
                
                <p className="text-yellow-400 font-bold mt-4 pt-2">// Twitter Card tags</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">name</span>=<span className="text-orange-300">"twitter:card"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"summary_large_image"</span> /&gt;</p>
                <p>&lt;<span className="text-blue-400">meta</span> <span className="text-green-400">name</span>=<span className="text-orange-300">"twitter:title"</span> <span className="text-green-400">content</span>=<span className="text-orange-300">"{currentMeta.ogTitle}"</span> /&gt;</p>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">JSON-LD Structured Schema (Google Rich Snippets):</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(structuredDataJson, null, 2))}
                  className="hover:text-white flex items-center gap-1 cursor-pointer text-slate-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 p-4 rounded border border-slate-800 text-blue-300 overflow-x-auto">
                {JSON.stringify(structuredDataJson, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Dynamic Sitemap Link: <span className="text-yellow-400">/sitemap.xml</span></span>
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

          {activeTab === 'robots' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Search Engine Directives: <span className="text-yellow-400">/robots.txt</span></span>
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
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
          <span>Sitemap generates dynamic slugs in real-time.</span>
          <span className="text-[#0066FF] font-semibold">BANTConfirm SEO Optimization v2.1</span>
        </div>
      </div>
    </div>
  );
}
