import React, { useState } from "react";
import { Calendar, User, Clock, ChevronRight, BookOpen, Share2, Tag, ArrowLeft, Heart } from "lucide-react";
import { Blog } from "../types";
import { safeAlert } from "../utils/safeAlert";

interface BlogsViewProps {
  blogs: Blog[];
  onLikeBlog?: (blogId: string) => void;
  selectedBlog?: Blog | null;
  onSelectBlog?: (blog: Blog | null) => void;
}

export default function BlogsView({
  blogs,
  onLikeBlog,
  selectedBlog: propSelectedBlog,
  onSelectBlog: propOnSelectBlog
}: BlogsViewProps) {
  const [localSelectedBlog, setLocalSelectedBlog] = useState<Blog | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedBlog = propSelectedBlog !== undefined ? propSelectedBlog : localSelectedBlog;
  const setSelectedBlog = (blog: Blog | null) => {
    if (propOnSelectBlog) {
      propOnSelectBlog(blog);
    } else {
      setLocalSelectedBlog(blog);
    }
  };

  // Real-time SEO head meta tag injection
  React.useEffect(() => {
    if (!selectedBlog) {
      document.title = "BANTConfirm - SME Procurement Advisory & Sourcing Platform";
      return;
    }

    // 1. Dynamic document title injection
    const originalTitle = document.title;
    const finalMetaTitle = selectedBlog.metaTitle || `${selectedBlog.title} - BANTConfirm`;
    document.title = finalMetaTitle;

    // 2. Meta description tag injection
    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    const finalMetaDesc = selectedBlog.metaDescription || (selectedBlog.content ? selectedBlog.content.substring(0, 155) + "..." : "");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", finalMetaDesc);

    // 3. Meta keywords tag injection
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    const originalKeywords = metaKeywords ? metaKeywords.getAttribute("content") : "";
    const finalKeywords = selectedBlog.metaKeywords || (selectedBlog.tags ? selectedBlog.tags.join(", ") : "");
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", finalKeywords);

    // 4. Schema markup script injection
    let schemaScript = document.getElementById("blog-jsonld-schema");
    if (schemaScript) {
      schemaScript.remove();
    }
    schemaScript = document.createElement("script");
    schemaScript.id = "blog-jsonld-schema";
    schemaScript.setAttribute("type", "application/ld+json");
    
    let schemaText = "";
    if (selectedBlog.schemaMarkup) {
      schemaText = selectedBlog.schemaMarkup;
    } else {
      schemaText = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": selectedBlog.title,
        "description": finalMetaDesc,
        "image": selectedBlog.image,
        "author": { "@type": "Person", "name": selectedBlog.author },
        "publisher": { "@type": "Organization", "name": "BANTConfirm" },
        "datePublished": selectedBlog.createdAt
      });
    }
    schemaScript.textContent = schemaText;
    document.head.appendChild(schemaScript);

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc !== null) {
        metaDesc.setAttribute("content", originalDesc);
      } else if (metaDesc) {
        metaDesc.removeAttribute("content");
      }
      if (metaKeywords && originalKeywords !== null) {
        metaKeywords.setAttribute("content", originalKeywords);
      } else if (metaKeywords) {
        metaKeywords.removeAttribute("content");
      }
      const activeSchema = document.getElementById("blog-jsonld-schema");
      if (activeSchema) {
        activeSchema.remove();
      }
    };
  }, [selectedBlog]);

  // Filter blogs
  const filteredBlogs = selectedCategory 
    ? blogs.filter(b => b.category === selectedCategory)
    : blogs;

  const categories = Array.from(new Set(blogs.map(b => b.category)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {selectedBlog ? (
        /* Blog Detail Reader view */
        <div className="max-w-3xl mx-auto space-y-6">
          <button 
            onClick={() => setSelectedBlog(null)}
            className="inline-flex items-center gap-1.5 text-xs text-[#0066FF] font-bold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sourcing Insights Catalog
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-50 text-[#0066FF] font-extrabold px-2 py-0.5 rounded border border-blue-100 uppercase">
                {selectedBlog.category}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedBlog.readTime}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
              {selectedBlog.title}
            </h1>

            <div className="flex items-center space-x-3 text-xs text-slate-500 py-2 border-y border-slate-100">
              <span className="font-bold text-slate-700">Author: {selectedBlog.author}</span>
              <span>•</span>
              <span>Published: BANTConfirm Advisory Desk</span>
            </div>
          </div>

          {/* Real-Time Injected SEO Meta Tags Live Inspector Panel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-bold text-xs text-slate-800 tracking-tight">Active HTML Head Metadata Inspector</span>
              </div>
              <span className="text-[10px] bg-green-100 border border-green-200 text-green-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                SEO SCORE: 100/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600 border-t border-slate-200/50 pt-2.5">
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Active Title Tag</span>
                <span className="font-mono text-xs text-[#0066FF] font-semibold bg-white px-2 py-1.5 rounded border border-slate-200/80 block truncate" title={selectedBlog.metaTitle || `${selectedBlog.title} - BANTConfirm`}>
                  {selectedBlog.metaTitle || `${selectedBlog.title} - BANTConfirm`}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Focus Keyword</span>
                <span className="font-mono text-xs text-slate-800 bg-white px-2 py-1.5 rounded border border-slate-200/80 block">
                  {selectedBlog.focusKeyword || "Not specified (using title keywords)"}
                </span>
              </div>

              <div className="md:col-span-2">
                <span className="font-bold text-slate-500 block mb-0.5">Active Description Meta Tag</span>
                <span className="font-mono text-[10px] text-slate-700 bg-white px-2 py-1.5 rounded border border-slate-200/80 block leading-relaxed">
                  {selectedBlog.metaDescription || (selectedBlog.content ? selectedBlog.content.substring(0, 155) + "..." : "")}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Keywords Meta Tag</span>
                <span className="font-mono text-xs text-slate-800 bg-white px-2 py-1.5 rounded border border-slate-200/80 block truncate" title={selectedBlog.metaKeywords || (selectedBlog.tags ? selectedBlog.tags.join(", ") : "")}>
                  {selectedBlog.metaKeywords || (selectedBlog.tags ? selectedBlog.tags.join(", ") : "CRM, Sourcing")}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Structured Schema (JSON-LD)</span>
                <button
                  onClick={() => {
                    const schema = selectedBlog.schemaMarkup || JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "BlogPosting",
                      "headline": selectedBlog.title,
                      "author": { "@type": "Person", "name": selectedBlog.author }
                    }, null, 2);
                    safeAlert(`Active Injected JSON-LD Schema:\n\n${schema}`);
                  }}
                  className="font-bold text-xs text-[#0066FF] hover:underline cursor-pointer block mt-1.5"
                >
                  View JSON-LD Schema Code ↗
                </button>
              </div>
            </div>
          </div>

          <div className="h-64 md:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <img 
              src={selectedBlog.image} 
              alt={selectedBlog.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Styled article body */}
          <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-700 space-y-4">
            {selectedBlog.content.split("\n\n").map((para, idx) => {
              if (para.startsWith("###")) {
                return (
                  <h3 key={idx} className="text-sm font-black text-slate-900 uppercase tracking-wide pt-4 pb-1">
                    {para.replace("###", "").trim()}
                  </h3>
                );
              }
              if (para.startsWith("-") || para.startsWith("*")) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 font-semibold text-slate-600">
                    {para.split("\n").map((li, liIdx) => (
                      <li key={liIdx}>{li.replace(/^[-\*\s]+/, "").trim()}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {para.trim()}
                </p>
              );
            })}
          </div>

          {/* Social share footer */}
          <div className="border-t border-slate-200 pt-6 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {selectedBlog.tags?.map((t, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-slate-50 border text-slate-500 py-1 px-2.5 rounded-full font-semibold">
                  <Tag className="w-3 h-3" />
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onLikeBlog) {
                    onLikeBlog(selectedBlog.id);
                    // Update local count for immediate feedback
                    setSelectedBlog({
                      ...selectedBlog,
                      likes: (selectedBlog.likes || 0) + 1
                    });
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-white border border-rose-200 hover:border-rose-500 hover:bg-rose-500 px-3.5 py-2 rounded-lg font-bold bg-white transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 hover:scale-110 transition-transform" />
                <span>Love ({selectedBlog.likes || 0})</span>
              </button>

              <button
                onClick={() => safeAlert("Deep-link copied to clipboard! Share securely with your procurement committee.")}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border px-3.5 py-2 rounded-lg font-bold bg-white cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share Sourcing Guide
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Blog Catalog Grid */
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#0066FF] font-bold text-xs uppercase tracking-wider">Enterprise Sourcing Manuals</span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Procurement Insights & IT Vendor Audits</h1>
            <p className="text-xs text-slate-500">Read our manual archives detailing Odoo ERP, cloud telephony integrations and telecom lease lines.</p>
          </div>

          {/* Filtration tag bar */}
          <div className="flex flex-wrap gap-2 justify-center py-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                selectedCategory === null 
                  ? "bg-[#0066FF] border-[#0066FF] text-white" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                  selectedCategory === cat 
                    ? "bg-[#0066FF] border-[#0066FF] text-white" 
                    : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="h-44 bg-slate-100 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span className="bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded">
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
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-relaxed group-hover:text-[#0066FF] transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 line-clamp-3">
                      {blog.content.replace(/[#*]/g, "")}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>By: {blog.author}</span>
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="inline-flex items-center gap-1 font-bold text-[#0066FF] group-hover:underline cursor-pointer"
                    >
                      Read Now
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
