const fs = require("fs");
const path = require("path");

/**
 * BANTConfirm Sitemap Generator Script
 * This automated script queries the local JSON database file (and seeds/fallbacks)
 * to statically compile a ready-to-deploy sitemap.xml inside the public/ and dist/ folders.
 */
function generateSitemap() {
  console.log("Starting automated sitemap.xml generation...");

  const dbPath = path.join(__dirname, "../data/db.json");
  let products = [];
  let blogs = [];

  try {
    if (fs.existsSync(dbPath)) {
      const dbContent = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      products = dbContent.products || [];
      blogs = dbContent.blogs || [];
      console.log(`Loaded JSON DB. Products: ${products.length}, Blogs: ${blogs.length}`);
    } else {
      console.log("No db.json found, compiling standard base static map...");
    }
  } catch (err) {
    console.error("Warning: Could not read local DB files. Compiling static only.", err);
  }

  const staticUrls = [
    { loc: "https://www.bantconfirm.com/", changefreq: "daily", priority: "1.0" },
    { loc: "https://www.bantconfirm.com/about", changefreq: "weekly", priority: "0.8" },
    { loc: "https://www.bantconfirm.com/contact", changefreq: "weekly", priority: "0.8" },
    { loc: "https://www.bantconfirm.com/services", changefreq: "weekly", priority: "0.8" },
    { loc: "https://www.bantconfirm.com/vendors", changefreq: "daily", priority: "0.9" },
    { loc: "https://www.bantconfirm.com/categories", changefreq: "daily", priority: "0.9" },
    { loc: "https://www.bantconfirm.com/blog", changefreq: "daily", priority: "0.8" },
    { loc: "https://www.bantconfirm.com/privacy-policy", changefreq: "monthly", priority: "0.5" },
    { loc: "https://www.bantconfirm.com/terms-and-conditions", changefreq: "monthly", priority: "0.5" },
    { loc: "https://www.bantconfirm.com/become-partner", changefreq: "weekly", priority: "0.8" }
  ];

  const todayStr = new Date().toISOString().split("T")[0];

  let urlsXml = staticUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join("");

  // Add active products
  products.filter(p => p.approved).forEach(p => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    urlsXml += `
  <url>
    <loc>https://www.bantconfirm.com/products/${slug}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add blog posts
  blogs.forEach(b => {
    urlsXml += `
  <url>
    <loc>https://www.bantconfirm.com/blog/${b.slug || b.id}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsXml}
</urlset>`;

  // Write to public/ directory for client-side bundle access
  const publicDir = path.join(__dirname, "../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf-8");
  console.log("Successfully generated sitemap.xml inside public/ directory.");

  // Also write to dist/ directory if it exists to ensure instant deployment availability
  const distDir = path.join(__dirname, "../dist");
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
    console.log("Successfully mirrored sitemap.xml to dist/ directory.");
  }
}

generateSitemap();
