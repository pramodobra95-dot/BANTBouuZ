// SEO Configuration and Dynamic Generator for BANTConfirm Sourcing Landing Pages

export interface SEOProduct {
  name: string;
  slug: string;
  description: string;
  pricing: string;
  features: string[];
  faqs: { question: string; answer: string }[];
}

export interface SEOLocation {
  name: string;
  slug: string;
  type: "city" | "state" | "industrial_area";
  parentState?: string;
  parentCity?: string;
}

export const PRODUCTS: SEOProduct[] = [
  {
    name: "Cloud Telephony",
    slug: "cloud-telephony",
    description: "Enterprise-grade virtual PBX, multi-level IVR, and cloud telephone routing systems designed to automate incoming client calls and sync with CRM platforms.",
    pricing: "₹1,499 per channel / month onwards",
    features: [
      "Multi-level Interactive Voice Response (IVR)",
      "High-Fidelity Call Recording & Cloud Archives",
      "Real-time Agent Monitoring & Live Panel",
      "API Integrations with Salesforce, Zoho, & Tally",
      "Intelligent Skill-Based Call Routing"
    ],
    faqs: [
      {
        question: "Do we need any physical hardware to deploy Cloud Telephony?",
        answer: "No, Cloud Telephony is 100% cloud-hosted. Your team can place and receive calls using softphone apps on mobile phones, tablets, or laptops."
      },
      {
        question: "Can we integrate this with our custom lead CRM?",
        answer: "Yes, our solution provides robust REST APIs and pre-built webhooks to trigger instant logs in CRM on every incoming or outgoing call."
      }
    ]
  },
  {
    name: "Bulk SMS",
    slug: "bulk-sms",
    description: "High-throughput transactional and promotional bulk SMS gateways with certified DLT compliance support, supporting real-time OTP delivery and campaign scheduling.",
    pricing: "₹0.12 to ₹0.18 per SMS",
    features: [
      "DLT Registration assistance & template pre-approval",
      "Direct carrier connections with 99.9% delivery rate",
      "Real-time OTP priority routing (under 5 seconds)",
      "Dynamic Excel / CSV upload for bulk campaigns",
      "Rich media landing pages embedded in SMS links"
    ],
    faqs: [
      {
        question: "What is DLT registration under TRAI guidelines?",
        answer: "DLT (Distributed Ledger Technology) is mandatory in India to prevent spam. Our support desk helps you upload your entity details and approve SMS headers and templates."
      },
      {
        question: "Is there an API for system-generated alerts?",
        answer: "Yes, we provide lightweight HTTP APIs in PHP, Python, Node.js, and Java to integrate alerts directly into your ERP or website."
      }
    ]
  },
  {
    name: "Bulk Email",
    slug: "bulk-email",
    description: "Enterprise mass emailing infrastructure with high-reputation dedicated IP addresses, SPF/DKIM validation, and real-time bounce and open-rate analytics.",
    pricing: "₹4,500 per month for 100,000 emails",
    features: [
      "Dedicated IP warm-up advisory & reputation monitoring",
      "Drag-and-drop newsletter builder & HTML template importing",
      "Full SPF, DKIM, and DMARC record set-up",
      "Real-time bounce, spam complaint, and unsubscribe tracking",
      "A/B testing for subject lines and body content"
    ],
    faqs: [
      {
        question: "How do we prevent emails from landing in the spam folder?",
        answer: "We ensure proper DNS verification (SPF, DKIM, DMARC) and assist with dedicated IP warming to build positive ISP trust ratings."
      }
    ]
  },
  {
    name: "WhatsApp Business API",
    slug: "whatsapp-business-api",
    description: "Official WhatsApp Business API platform for rich automated messaging, interactive quick-reply buttons, chatbots, and unified team inbox routing.",
    pricing: "₹3,000 platform fee + official Meta conversation charges",
    features: [
      "Green tick verification badge consulting",
      "Interactive templates with buttons, media, and carousels",
      "Shared multi-agent support inbox with custom routing",
      "Automated fallback to SMS for offline recipients",
      "Prebuilt CRM and Shopify checkout integrations"
    ],
    faqs: [
      {
        question: "What is the setup time for the WhatsApp Business API?",
        answer: "Approval typically takes 1-3 business days once your Facebook Business Manager is verified."
      }
    ]
  },
  {
    name: "CRM Software",
    slug: "crm-software",
    description: "Comprehensive Customer Relationship Management software featuring sales pipelines, automated email sequences, WhatsApp triggers, and executive KPI reporting dashboards.",
    pricing: "₹800 to ₹1,800 per user / month",
    features: [
      "Visual drag-and-drop deal pipeline boards",
      "Automated lead assignment (round-robin or weight-based)",
      "Omnichannel logs (Email, Calls, WhatsApp, Meetings)",
      "Intelligent pipeline forecasting with historical win-rates",
      "Deep customization of fields, modules, and workflows"
    ],
    faqs: [
      {
        question: "Can we set up custom access controls for our sales agents?",
        answer: "Yes, the platform supports role-based permissions (RBAC) so agents only see assigned leads, while managers view entire territories."
      }
    ]
  },
  {
    name: "ERP Software",
    slug: "erp-software",
    description: "Integrated Enterprise Resource Planning suites covering manufacturing, inventory, inventory-valuation, purchase pipelines, supply chains, and multi-branch accounting.",
    pricing: "Custom pricing based on modules and user-licenses",
    features: [
      "Real-time multi-warehouse inventory valuation & alerts",
      "Automated Bill of Materials (BOM) & factory schedules",
      "Double-entry bookkeeping compliance & GST integration",
      "Centralized HR management, attendance, and payroll",
      "Consolidated multi-entity financial statements"
    ],
    faqs: [
      {
        question: "Does the ERP support barcode scanning in warehouses?",
        answer: "Yes, our mobile ERP module operates natively with warehouse scanners and smartphones for real-time stock counting."
      }
    ]
  },
  {
    name: "Cloud Hosting",
    slug: "cloud-hosting",
    description: "Scalable virtual private cloud servers, Kubernetes orchestration, managed databases, and hybrid cloud solutions with ultra-low latency CDN edge servers.",
    pricing: "₹1,500 per month (Starter Node) to custom enterprise clusters",
    features: [
      "99.99% Uptime SLAs on high-performance compute nodes",
      "Automated daily snapshot backups with 1-click rollbacks",
      "DDoS protection & network level firewalls included",
      "ISO 27017, SOC2, and PCI-DSS compliance certified",
      "Expert 24/7 technical NOC standby support"
    ],
    faqs: [
      {
        question: "Do you offer migration support from on-premises servers?",
        answer: "Yes, our certified cloud engineers plan and execute zero-downtime database and asset migrations."
      }
    ]
  },
  {
    name: "Microsoft 365",
    slug: "microsoft-365",
    description: "Enterprise collaboration suites including Exchange Business Email, Microsoft Teams, OneDrive secure cloud storage, and legacy office application licenses.",
    pricing: "₹150 to ₹1,200 per user / month based on license plan",
    features: [
      "Professional custom domain email (name@company.com)",
      "Microsoft Teams premium video-conferencing & chat",
      "1 TB secure cloud storage per user on OneDrive",
      "Always-updated Word, Excel, PowerPoint, and Outlook",
      "Advanced Endpoint Threat Protection & Identity controls"
    ],
    faqs: [
      {
        question: "Can we mix and match different user licenses?",
        answer: "Absolutely. You can assign basic plans to operational staff and premium plans to executives."
      }
    ]
  },
  {
    name: "Google Workspace",
    slug: "google-workspace",
    description: "Official Google Workspace business solutions featuring professional Gmail, Google Meet, Drive, and comprehensive cloud storage under custom enterprise management.",
    pricing: "₹136 to ₹1,360 per user / month",
    features: [
      "Professional ad-free Gmail on custom corporate domain",
      "Shared calendars and high-definition Meet conferencing",
      "Starting from 30 GB up to 5 TB storage per user",
      "Real-time collaborative Docs, Sheets, Slides, and Forms",
      "Enterprise Admin panel with security keys and mobile controls"
    ],
    faqs: [
      {
        question: "Can BANTConfirm help migrate old emails from our current host?",
        answer: "Yes, our Google certified deployment specialists perform complete migrations of emails, calendars, and contacts with zero message loss."
      }
    ]
  },
  {
    name: "Internet Lease Line",
    slug: "internet-lease-line",
    description: "High-speed symmetric 1:1 dedicated internet lease lines with robust SLAs, multiple route redundancy, and round-the-clock enterprise support monitoring.",
    pricing: "₹12,000 per month (50 Mbps symmetric) onwards",
    features: [
      "Dedicated fiber connectivity with zero shared contention (1:1 ratio)",
      "99.5% Network latency and throughput performance SLA",
      "Static IP addresses pool for secure corporate VPN networks",
      "Proactive automated routing failover paths",
      "Real-time bandwidth utilization MRG graphs"
    ],
    faqs: [
      {
        question: "What is the typical delivery timeline for physical fiber laying?",
        answer: "Installation usually takes 10 to 15 working days depending on building permissions and local duct routes."
      }
    ]
  },
  {
    name: "SIP Trunk",
    slug: "sip-trunk",
    description: "Scalable SIP trunking services supporting high concurrent call capacities, virtual numbering, and compatibility with modern and legacy IP-PBX frameworks.",
    pricing: "Custom pricing based on concurrent channels",
    features: [
      "Unlimited simultaneous inward & outward call channels",
      "Native support for Asterisk, Cisco, Avaya, and 3CX PBXs",
      "Centralized DID pools for all pan-India branches",
      "Advanced encryption (TLS & SRTP) for corporate calls",
      "Flexible pay-per-second pulse pricing options"
    ],
    faqs: [
      {
        question: "Can we keep our existing PRI numbers when migrating to SIP?",
        answer: "Yes, we support complete PRI-to-SIP porting under standard telecom regulatory frameworks."
      }
    ]
  },
  {
    name: "PRI",
    slug: "pri",
    description: "Robust physical ISDN PRI lines offering 30 symmetric digital voice channels on a secure coaxial copper or optical link with high-volume DID blocks.",
    pricing: "₹8,000 to ₹15,000 per month base rental",
    features: [
      "30 clear high-definition voice channels per link",
      "Dedicated, reliable telecom hardware termination",
      "Includes a block of 100 to 500 Direct Inward Dialing numbers",
      "Detailed billing logs for call pattern audits",
      "Unmatched physical voice quality and hardware isolation"
    ],
    faqs: [
      {
        question: "When should we choose PRI over SIP?",
        answer: "PRI is ideal for legacy physical PBX setups in factories or remote facilities where modern fiber IP-SIP networks are not yet deployed."
      }
    ]
  },
  {
    name: "Toll Free Number",
    slug: "toll-free-number",
    description: "Brand boosting 1800-series toll-free numbers for India with intelligent cloud panels, call routing profiles, and advanced greeting management.",
    pricing: "₹1,200 base rental + inbound calling usage charges",
    features: [
      "Premium '1800' number series selection assistance",
      "Advanced cloud routing by geographic origin or time of day",
      "Professional custom voice greetings and holiday rules",
      "Comprehensive call logs & demographic analytics",
      "Interactive multi-agent cloud backup failover"
    ],
    faqs: [
      {
        question: "Who pays for calls made to a toll-free number?",
        answer: "The business hosting the toll-free number pays for all incoming calls, making it completely free for customers to reach you."
      }
    ]
  },
  {
    name: "Virtual Number",
    slug: "virtual-number",
    description: "Geographic and non-geographic virtual mobile and landline numbers for secure call masking, campaign tracking, and SMS OTP receiving capabilities.",
    pricing: "₹500 to ₹1,500 per number / month",
    features: [
      "Instant allocation of local STD code virtual numbers",
      "Complete caller ID masking to secure private details",
      "Dynamic campaign tracking to measure marketing ROI",
      "Automatic failover to multiple backup mobile numbers",
      "Integrated virtual receptionist greeting audio"
    ],
    faqs: [
      {
        question: "Can we use a virtual number to run marketing surveys?",
        answer: "Yes, you can route virtual numbers to an IVR flow to record customer feedback or survey answers instantly."
      }
    ]
  },
  {
    name: "Cloud Contact Center",
    slug: "cloud-contact-center",
    description: "High-capacity automated outbound dialing platforms, predictive call dialers, custom agent desks, and real-time live supervisor monitoring rooms.",
    pricing: "₹2,500 per seat / month onwards",
    features: [
      "Predictive, Progressive, and Auto-Dialing algorithms",
      "Real-time live call listening, whisper, and barge-in",
      "Customizable agent screens and wrap-up codes",
      "Voice & screen recording for compliance and training",
      "AI-powered speech sentiment analytics dashboard"
    ],
    faqs: [
      {
        question: "What bandwidth is required per contact center agent?",
        answer: "A minimum of 100 Kbps symmetric bandwidth per active call channel is recommended for HD voice."
      }
    ]
  },
  {
    name: "IVR Solution",
    slug: "ivr-solution",
    description: "Intelligent multi-level voice response solutions featuring visual flow builders, multi-lingual TTS voice prompts, and database dynamic routing lookups.",
    pricing: "₹1,999 per month base cloud setup",
    features: [
      "Visual drag-and-drop voice menu canvas builder",
      "Multi-lingual Text-to-Speech in English, Hindi, and regional languages",
      "Dynamic customer verification lookup in external databases",
      "Voicemail-to-Email alert forwarding",
      "Caller queue position announcements and holds"
    ],
    faqs: [
      {
        question: "Can the IVR look up customer status before routing?",
        answer: "Yes. The IVR can invoke external APIs to check a caller's invoice status and route VIP callers directly to senior agents."
      }
    ]
  },
  {
    name: "Call Recording",
    slug: "call-recording",
    description: "Secure, tamper-proof enterprise call recording servers with encrypted cloud storage, automatic backup policies, and advanced phrase-search metadata indexing.",
    pricing: "₹450 per agent seat / month",
    features: [
      "Military-grade AES-256 cloud encryption for voice files",
      "Tamper-proof hash logs for regulatory and judicial compliance",
      "Automated storage retention & backup scheduling policies",
      "Syllable & phrase-based transcript searching",
      "Detailed access audit logs tracking download requests"
    ],
    faqs: [
      {
        question: "How long are call recordings stored on the cloud?",
        answer: "Standard plans include 1 year of storage, which can be extended up to 7 years to meet compliance standards."
      }
    ]
  },
  {
    name: "AI Voice Bot",
    slug: "ai-voice-bot",
    description: "Next-generation generative AI-powered voice agents capable of carrying out natural, human-like voice conversations, qualifying leads, and resolving support issues.",
    pricing: "₹4.50 to ₹8.00 per conversation minute",
    features: [
      "Ultra-low latency conversational turns (under 1.2 seconds)",
      "Hyper-realistic emotional voice engines (male, female, various accents)",
      "Contextual database knowledge mapping using RAG solutions",
      "Instant calendar booking & CRM lead logging during calls",
      "Graceful routing transfer to live human agents"
    ],
    faqs: [
      {
        question: "Can the Voice Bot understand regional Indian accents?",
        answer: "Yes, our models are trained on diverse Indian voice datasets, understanding accents in English, Hindi, Hinglish, and major regional languages."
      }
    ]
  },
  {
    name: "AI Chatbot",
    slug: "ai-chatbot",
    description: "Enterprise conversational AI chatbots for web, mobile apps, and WhatsApp, designed to automate customer support and qualify BANT leads.",
    pricing: "₹8,000 base monthly license + conversational tokens",
    features: [
      "24/7 instant automated customer support across web & apps",
      "RAG-backed knowledge base answering with high accuracy",
      "Direct API hooks for product catalogs and pricing lookups",
      "Multi-lingual chat translation on the fly",
      "Warm-handoff triggers to live support desk agents"
    ],
    faqs: [
      {
        question: "How do we train the chatbot?",
        answer: "You simply upload your website links, FAQ documents, or product brochures. The AI processes these in minutes to begin answering."
      }
    ]
  },
  {
    name: "Email Marketing",
    slug: "email-marketing",
    description: "Cloud newsletters, automated trigger drip funnels, segment management, and analytics to scale enterprise customer outreach.",
    pricing: "₹3,500 per month for 50,000 contacts",
    features: [
      "Visual marketing automation canvas & drip schedules",
      "Advanced customer segment tags & list builders",
      "Built-in SPAM rating check prior to sending",
      "A/B testing for subject lines, images, and content",
      "Dynamic personalization merge tags"
    ],
    faqs: [
      {
        question: "Can we connect our signup forms directly to the email software?",
        answer: "Yes, we provide widgets, embeds, and REST APIs to capture leads instantly into marketing lists."
      }
    ]
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "Result-driven digital marketing campaigns spanning Google PPC, Meta Ads, LinkedIn lead generation, and performance marketing optimizations.",
    pricing: "Custom retainer basis starting from ₹35,000 / month",
    features: [
      "Multi-channel digital ad campaign design & management",
      "High-converting landing page optimization and heatmapping",
      "Rigorous ROAS and performance auditing reporting",
      "Competitor digital ad spend tracking audits",
      "Weekly creative and copy optimization"
    ],
    faqs: [
      {
        question: "What is the minimum recommended monthly ad budget?",
        answer: "We recommend a minimum ad spend of ₹40,000 per month on platforms like Google/Meta to ensure statistically significant results."
      }
    ]
  },
  {
    name: "SEO Services",
    slug: "seo-services",
    description: "Enterprise technical, content, and local SEO services with continuous page auditing, search query keyword planning, and authoritative backlink strategies.",
    pricing: "₹30,000 per month onwards (minimum 6 months commitment)",
    features: [
      "Deep technical site speed and Core Web Vitals audit",
      "Strategic keyword grouping and high-authority search plans",
      "Rich snippet and schema markup implementations",
      "Quality editorial backlink building & guest posts",
      "Monthly search keyword rank and organic traffic tracking"
    ],
    faqs: [
      {
        question: "How long does it take to rank on Google's first page?",
        answer: "SME/local terms take 3-4 months, while highly competitive national terms typically require 6-12 months of consistent optimization."
      }
    ]
  },
  {
    name: "Website Development",
    slug: "website-development",
    description: "Modern, responsive, ultra-fast websites built with React, Next.js, and custom CMS systems with integrated leads optimization and SEO configurations.",
    pricing: "₹45,000 to ₹1,50,000 one-time based on scope",
    features: [
      "Stunning, custom designs tailored to your corporate brand",
      "Optimized for high-performance Core Web Vitals (100% scores)",
      "Completely responsive for smartphones, tablets, and desktops",
      "Secure hosting configurations with free SSL & DDoS guards",
      "Self-manageable CMS system to easily update posts and pages"
    ],
    faqs: [
      {
        question: "Do you build e-commerce stores?",
        answer: "Yes, we build robust, secure custom e-commerce web applications with payment and shipping gateways."
      }
    ]
  },
  {
    name: "Mobile App Development",
    slug: "mobile-app-development",
    description: "Sleek, high-performance native and cross-platform (Flutter / React Native) Android and iOS mobile applications for consumer and B2B services.",
    pricing: "Custom quote based on detailed wireframe designs",
    features: [
      "Custom UX/UI wireframe mapping and active prototyping",
      "Cross-platform Flutter / React Native compilation",
      "Native device sensor integration (GPS, Camera, Push notifications)",
      "Secure backend API architecture & database linking",
      "App Store & Google Play Store launching support"
    ],
    faqs: [
      {
        question: "Do you provide app maintenance after launch?",
        answer: "Yes, we offer monthly maintenance SLA packages to update SDKs, fix bugs, and ensure OS compatibility."
      }
    ]
  }
];

export const CITIES: SEOLocation[] = [
  { name: "Delhi", slug: "delhi", type: "city", parentState: "Delhi" },
  { name: "Mumbai", slug: "mumbai", type: "city", parentState: "Maharashtra" },
  { name: "Pune", slug: "pune", type: "city", parentState: "Maharashtra" },
  { name: "Bengaluru", slug: "bengaluru", type: "city", parentState: "Karnataka" },
  { name: "Hyderabad", slug: "hyderabad", type: "city", parentState: "Telangana" },
  { name: "Chennai", slug: "chennai", type: "city", parentState: "Tamil Nadu" },
  { name: "Ahmedabad", slug: "ahmedabad", type: "city", parentState: "Gujarat" },
  { name: "Kolkata", slug: "kolkata", type: "city", parentState: "West Bengal" },
  { name: "Noida", slug: "noida", type: "city", parentState: "Uttar Pradesh" },
  { name: "Gurugram", slug: "gurugram", type: "city", parentState: "Haryana" },
  { name: "Ghaziabad", slug: "ghaziabad", type: "city", parentState: "Uttar Pradesh" },
  { name: "Chandigarh", slug: "chandigarh", type: "city", parentState: "Punjab" },
  { name: "Indore", slug: "indore", type: "city", parentState: "Madhya Pradesh" },
  { name: "Jaipur", slug: "jaipur", type: "city", parentState: "Rajasthan" },
  { name: "Lucknow", slug: "lucknow", type: "city", parentState: "Uttar Pradesh" },
  { name: "Surat", slug: "surat", type: "city", parentState: "Gujarat" },
  { name: "Nagpur", slug: "nagpur", type: "city", parentState: "Maharashtra" },
  { name: "Coimbatore", slug: "coimbatore", type: "city", parentState: "Tamil Nadu" },
  { name: "Kochi", slug: "kochi", type: "city", parentState: "Kerala" },
  { name: "Visakhapatnam", slug: "visakhapatnam", type: "city", parentState: "Andhra Pradesh" }
];

export const STATES: SEOLocation[] = [
  { name: "Maharashtra", slug: "maharashtra", type: "state" },
  { name: "Gujarat", slug: "gujarat", type: "state" },
  { name: "Karnataka", slug: "karnataka", type: "state" },
  { name: "Tamil Nadu", slug: "tamil-nadu", type: "state" },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", type: "state" },
  { name: "Rajasthan", slug: "rajasthan", type: "state" },
  { name: "Punjab", slug: "punjab", type: "state" },
  { name: "Haryana", slug: "haryana", type: "state" },
  { name: "Madhya Pradesh", slug: "madhya-pradesh", type: "state" },
  { name: "Telangana", slug: "telangana", type: "state" }
];

export const INDUSTRIAL_AREAS: SEOLocation[] = [
  { name: "MIDC Pune", slug: "midc-pune", type: "industrial_area", parentCity: "Pune", parentState: "Maharashtra" },
  { name: "Bhosari", slug: "bhosari", type: "industrial_area", parentCity: "Pune", parentState: "Maharashtra" },
  { name: "Chakan", slug: "chakan", type: "industrial_area", parentCity: "Pune", parentState: "Maharashtra" },
  { name: "Hinjewadi", slug: "hinjewadi", type: "industrial_area", parentCity: "Pune", parentState: "Maharashtra" },
  { name: "Noida Sector 62", slug: "noida-sector-62", type: "industrial_area", parentCity: "Noida", parentState: "Uttar Pradesh" },
  { name: "Electronic City Bengaluru", slug: "electronic-city-bengaluru", type: "industrial_area", parentCity: "Bengaluru", parentState: "Karnataka" },
  { name: "Gurugram Cyber City", slug: "gurugram-cyber-city", type: "industrial_area", parentCity: "Gurugram", parentState: "Haryana" },
  { name: "Udyog Vihar", slug: "udyog-vihar", type: "industrial_area", parentCity: "Gurugram", parentState: "Haryana" },
  { name: "Okhla Industrial Area", slug: "okhla-industrial-area", type: "industrial_area", parentCity: "Delhi", parentState: "Delhi" },
  { name: "Naraina Industrial Area", slug: "naraina-industrial-area", type: "industrial_area", parentCity: "Delhi", parentState: "Delhi" },
  { name: "Bawana", slug: "bawana", type: "industrial_area", parentCity: "Delhi", parentState: "Delhi" },
  { name: "Peenya", slug: "peenya", type: "industrial_area", parentCity: "Bengaluru", parentState: "Karnataka" },
  { name: "GIDC Ahmedabad", slug: "gidc-ahmedabad", type: "industrial_area", parentCity: "Ahmedabad", parentState: "Gujarat" },
  { name: "MIDC Nashik", slug: "midc-nashik", type: "industrial_area", parentCity: "Nashik", parentState: "Maharashtra" },
  { name: "MIDC Nagpur", slug: "midc-nagpur", type: "industrial_area", parentCity: "Nagpur", parentState: "Maharashtra" }
];

// Helper to find match in pathname
export function matchSourcingRoute(pathname: string): { product: SEOProduct; location: SEOLocation } | null {
  const cleanPath = pathname.toLowerCase().replace(/\/$/, "");
  
  if (!cleanPath.startsWith("/sourcing/")) {
    return null;
  }
  
  const slug = cleanPath.substring("/sourcing/".length);
  if (!slug) return null;
  
  // Parse by matching products and locations
  // We look for any combination of product slug and location slug in the string
  // Try exact split by "-in-" first, then check combinations
  let prodMatch: SEOProduct | undefined;
  let locMatch: SEOLocation | undefined;
  
  if (slug.includes("-in-")) {
    const parts = slug.split("-in-");
    const pSlug = parts[0];
    const lSlug = parts[1];
    
    prodMatch = PRODUCTS.find(p => p.slug === pSlug);
    locMatch = [...CITIES, ...STATES, ...INDUSTRIAL_AREAS].find(l => l.slug === lSlug);
  }
  
  // Fallback: look for product slug and location slug containing or matching
  if (!prodMatch || !locMatch) {
    // Sort products by slug length descending to match longest first
    const sortedProds = [...PRODUCTS].sort((a, b) => b.slug.length - a.slug.length);
    for (const prod of sortedProds) {
      if (slug.startsWith(prod.slug)) {
        const remaining = slug.substring(prod.slug.length).replace(/^-in-|^_in-|^_|^_in_|^_in_|-/, "");
        const matchedLoc = [...CITIES, ...STATES, ...INDUSTRIAL_AREAS].find(l => l.slug === remaining || remaining.includes(l.slug));
        if (matchedLoc) {
          prodMatch = prod;
          locMatch = matchedLoc;
          break;
        }
      }
    }
  }
  
  // Last resort: search for substring matches
  if (!prodMatch || !locMatch) {
    for (const prod of PRODUCTS) {
      if (slug.includes(prod.slug)) {
        prodMatch = prod;
        break;
      }
    }
    for (const loc of [...CITIES, ...STATES, ...INDUSTRIAL_AREAS]) {
      if (slug.includes(loc.slug)) {
        locMatch = loc;
        break;
      }
    }
  }
  
  if (prodMatch && locMatch) {
    return { product: prodMatch, location: locMatch };
  }
  
  return null;
}

export function generateSourcingSEO(product: SEOProduct, location: SEOLocation) {
  const title = `${product.name} in ${location.name} | Certified B2B Sourcing | BANTConfirm`;
  const description = `Looking for ${product.name} in ${location.name}? BANTConfirm pre-qualifies local vendors across Budget, Authority, Need, and Timeline constraints. Compare quotes from verified providers in ${location.name}.`;
  const canonical = `https://www.bantconfirm.com/sourcing/${product.slug}-in-${location.slug}`;
  
  // Dynamic customized FAQs based on product and location
  const faqs = [
    {
      question: `How are ${product.name} vendors in ${location.name} verified?`,
      answer: `Every vendor on the BANTConfirm platform undergoes rigorous pre-qualification check. We audit corporate registries, test service latency, and verify business operations in ${location.name} to ensure strict B2B delivery SLAs.`
    },
    {
      question: `What is the average sourcing timeline for ${product.name} in ${location.name}?`,
      answer: `Using BANTConfirm's structured sourcing platform, businesses typical receive qualified bids within 48 hours and complete vendor selection in under 12 working days, compared to the traditional 2-month cycle.`
    },
    ...product.faqs
  ];
  
  // Structured schema.org markup
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.bantconfirm.com/#website",
        "url": "https://www.bantconfirm.com/",
        "name": "BANTConfirm",
        "description": "Pre-Qualified B2B Enterprise IT Sourcing Marketplace"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.bantconfirm.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Sourcing",
            "item": "https://www.bantconfirm.com/categories"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${product.name} in ${location.name}`,
            "item": canonical
          }
        ]
      },
      {
        "@type": "Product",
        "@id": `${canonical}#product`,
        "name": `${product.name} Solutions in ${location.name}`,
        "description": `${product.description} Sourced and pre-qualified for companies located in ${location.name} and surrounding corporate belts.`,
        "brand": {
          "@type": "Brand",
          "name": "BANTConfirm Verified Providers"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "999",
          "highPrice": "500000",
          "offerCount": "12",
          "price": product.pricing
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${canonical}#localbusiness`,
        "name": `BANTConfirm Sourcing Desk ${location.name}`,
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format",
        "telephone": "+91-120-4005000",
        "url": canonical,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location.name,
          "addressRegion": location.parentState || location.name,
          "addressCountry": "IN"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };
  
  return {
    title,
    description,
    canonical,
    faqs,
    schema
  };
}
