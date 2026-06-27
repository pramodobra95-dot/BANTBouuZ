-- ====================================================================
-- BANTCONFIRM SUPABASE DATABASE INITIALIZATION SCRIPT
-- ====================================================================
-- This script creates the entire schema required for the BANTConfirm platform.
-- It includes Tables, Constraints, Default values, Row-Level Security (RLS)
-- Policies, and complete real-world seed data for testing and deployment.
-- Run this script inside the Supabase SQL Editor.

-- DROP TABLES IF THEY ALREADY EXIST (SAFE FOR RESET)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;


-- ==========================================
-- 1. TABLE: categories
-- ==========================================
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  "productsCount" INTEGER DEFAULT 0
);

-- ==========================================
-- 2. TABLE: vendors
-- ==========================================
CREATE TABLE public.vendors (
  id TEXT PRIMARY KEY,
  "companyName" TEXT NOT NULL,
  name TEXT,
  logo TEXT,
  "gstNumber" TEXT,
  "panNumber" TEXT,
  website TEXT,
  "businessCategory" TEXT,
  "productsOffered" JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  location TEXT,
  approved BOOLEAN DEFAULT false,
  "docVerified" BOOLEAN DEFAULT false,
  plan TEXT DEFAULT 'Free',
  "productsCount" INTEGER DEFAULT 0,
  "leadsCount" INTEGER DEFAULT 0,
  revenue NUMERIC(12, 2) DEFAULT 0.00,
  "viewsCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. TABLE: products
-- ==========================================
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  pricing TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(3, 2) DEFAULT 4.50,
  category TEXT,
  "vendorId" TEXT REFERENCES public.vendors(id) ON DELETE CASCADE,
  "vendorName" TEXT,
  "isFeatured" BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  "brochureUrl" TEXT DEFAULT '#',
  "videoUrl" TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. TABLE: leads
-- ==========================================
CREATE TABLE public.leads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  budget TEXT,
  "companyName" TEXT,
  "contactName" TEXT,
  mobile TEXT,
  email TEXT,
  city TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'Submitted',
  bant JSONB DEFAULT '{}'::jsonb,
  "assignedVendors" JSONB DEFAULT '[]'::jsonb,
  "assignedVendorId" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. TABLE: blogs
-- ==========================================
CREATE TABLE public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  author TEXT,
  "readTime" TEXT,
  slug TEXT,
  likes INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. TABLE: banners
-- ==========================================
CREATE TABLE public.banners (
  id TEXT PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  image TEXT,
  active BOOLEAN DEFAULT true,
  type TEXT,
  "linkUrl" TEXT
);

-- ==========================================
-- 7. TABLE: testimonials
-- ==========================================
CREATE TABLE public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT,
  company TEXT,
  role TEXT,
  rating INTEGER DEFAULT 5,
  feedback TEXT,
  avatar TEXT
);

-- ==========================================
-- 8. TABLE: settings (Key-Value Schema)
-- ==========================================
CREATE TABLE public.settings (
  id TEXT PRIMARY KEY,
  key TEXT,
  value TEXT
);

-- ==========================================
-- 9. TABLE: notifications
-- ==========================================
CREATE TABLE public.notifications (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- 10. TABLE: profiles
-- ==========================================
CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  "companyName" TEXT,
  mobile TEXT,
  city TEXT,
  role TEXT DEFAULT 'buyer',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- ====================================================================
-- Enable RLS on all tables to secure but keep fully open for client read operations
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Create Public Read Policies for all tables
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on vendors" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Allow public read access on testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);

-- 2. Create Write Policies for public insertions and edits (Client-Side actions)
CREATE POLICY "Allow anyone to insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to insert vendors" ON public.vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to update vendors" ON public.vendors FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete vendors" ON public.vendors FOR DELETE USING (true);
CREATE POLICY "Allow anyone to insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete products" ON public.products FOR DELETE USING (true);
CREATE POLICY "Allow anyone to insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to update notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to delete categories" ON public.categories FOR DELETE USING (true);
CREATE POLICY "Allow anyone to insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow anyone to delete profiles" ON public.profiles FOR DELETE USING (true);


-- ====================================================================
-- TRIGGER FOR AUTOMATIC ADMIN ASSIGNMENTS IN AUTH
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_admin_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(new.email) IN ('info.bouuz@gmail.com', 'info.bouuz@gmail.co', 'admin@bantconfirm.com', 'pramodobra95@gmail.com') THEN
    new.raw_user_meta_data := COALESCE(new.raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb;
  ELSE
    IF NOT (new.raw_user_meta_data ? 'role') OR (new.raw_user_meta_data->>'role' = 'admin') THEN
      new.raw_user_meta_data := COALESCE(new.raw_user_meta_data, '{}'::jsonb) || '{"role": "buyer"}'::jsonb;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_assign_admin_role ON auth.users;
CREATE TRIGGER trigger_assign_admin_role
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_admin_role_assignment();


-- ====================================================================
-- SEED DATA: POPULATING PLATFORM DEMO DATABASE
-- ====================================================================

-- categories
INSERT INTO public.categories (id, name, icon, description, "productsCount") VALUES
('cat-crm', 'CRM Software', 'Users', 'Manage customer relationships, sales pipelines, and support tickets in one centralized hub.', 3),
('cat-erp', 'ERP Software', 'Layers', 'Streamline operations, inventory, finance, and supply chain for mid to large enterprises.', 2),
('cat-accounting', 'Accounting Software', 'Calculator', 'Automate invoicing, expense tracking, tax preparation, and financial reporting.', 2),
('cat-whatsapp-api', 'WhatsApp Business API', 'MessageSquare', 'Direct chat capabilities, customer service automation, and broadcast campaigns.', 2),
('cat-telephony', 'Cloud Telephony', 'PhoneCall', 'Virtual phone systems, call routing, SMS integrations, and analytics for teams.', 2),
('cat-contact-center', 'Contact Center', 'Headphones', 'Omnichannel customer interaction suite supporting voice, chat, email, and social.', 1),
('cat-m365', 'Microsoft 365', 'FileText', 'Collaboration suite with Outlook, Teams, Word, Excel, and secure cloud storage.', 1),
('cat-gworkspace', 'Google Workspace', 'Mail', 'Gmail, Google Drive, Docs, Sheets, and Meet optimized for modern businesses.', 1),
('cat-aws', 'AWS Services', 'Cloud', 'Amazon Web Services cloud hosting, compute power, databases, and serverless architectures.', 1),
('cat-azure', 'Azure Services', 'Server', 'Microsoft Azure cloud services, virtual machines, and Active Directory integration.', 1),
('cat-security', 'Cyber Security', 'ShieldAlert', 'Endpoint protection, firewalls, threat detection, and digital identity management.', 2),
('cat-ai', 'AI Solutions', 'Brain', 'Custom LLMs, customer support bots, data analytics, and automation algorithms.', 1);

-- vendors
INSERT INTO public.vendors (id, "companyName", name, logo, "gstNumber", "panNumber", website, "businessCategory", "productsOffered", rating, location, approved, "docVerified", plan, "productsCount", "leadsCount", revenue, "viewsCount", "createdAt") VALUES
('ven-1', 'SaaSify Solutions Pvt Ltd', 'Rajesh Kumar', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=60', '27AAAAA1111A1Z1', 'AAAAA1111A', 'https://saasify.co.in', 'CRM & ERP Software', '["cat-crm", "cat-erp", "cat-accounting"]'::jsonb, 4.8, 'Mumbai, Maharashtra', true, true, 'Gold', 3, 14, 450000.00, 1250, '2026-05-27T08:35:24.544Z'),
('ven-2', 'CloudConnect Telecom', 'Vikram Mehta', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60', '24BBBBB2222B2Z2', 'BBBBB2222B', 'https://cloudconnect.net', 'Cloud Telephony & Contact Center', '["cat-telephony", "cat-contact-center", "cat-whatsapp-api"]'::jsonb, 4.6, 'Bengaluru, Karnataka', true, true, 'Silver', 2, 9, 210000.00, 890, '2026-06-01T08:35:24.544Z'),
('ven-3', 'Enterprise Systems India', 'Amit Patel', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60', '29CCCCC3333C3Z3', 'CCCCC3333C', 'https://entsystems.com', 'ERP & Accounting', '["cat-erp", "cat-accounting"]'::jsonb, 4.5, 'Delhi NCR', true, true, 'Gold', 2, 18, 580000.00, 1620, '2026-05-17T08:35:24.544Z'),
('ven-4', 'CyberShield IT Labs', 'Neha Sharma', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&auto=format&fit=crop&q=60', '07DDDDD4444D4Z4', 'DDDDD4444D', 'https://cybershieldlabs.com', 'Cyber Security & Cloud Hosting', '["cat-security", "cat-aws", "cat-azure"]'::jsonb, 4.9, 'Pune, Maharashtra', true, true, 'Enterprise', 3, 22, 940000.00, 2100, '2026-06-11T08:35:24.544Z'),
('ven-pending', 'Aesthetic Business Software', 'Suresh Raina', 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=120&auto=format&fit=crop&q=60', '27EEEEE5555E5Z5', 'EEEEE5555E', 'https://aestheticbiz.com', 'AI Solutions', '["cat-ai"]'::jsonb, 3.5, 'Chennai, Tamil Nadu', false, false, 'Free', 1, 0, 0.00, 120, '2026-06-26T08:35:24.544Z');

-- products
INSERT INTO public.products (id, name, description, images, pricing, features, rating, category, "vendorId", "vendorName", "isFeatured", approved, views, "brochureUrl", "videoUrl", faqs, "createdAt") VALUES
('prod-1', 'Salesforce CRM Cloud Customizer', 'Highly customized Salesforce CRM solution tailored for SME sales, service, and marketing automation. Gain a 360-degree view of customers, predict lead scoring with integrated AI analytics, and construct visual pipeline dashboards easily.', '["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹1,500 / user / month onwards', '["Custom Pipeline Automation", "Advanced Lead and Contact Management", "Mobile App with Offline Mode", "Email and WhatsApp Integration Modules", "Real-time Analytics Dashboard"]'::jsonb, 4.80, 'CRM Software', 'ven-1', 'SaaSify Solutions Pvt Ltd', true, true, 340, '#', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '[{"question": "Is there a minimum user requirement?", "answer": "Yes, our packages generally start from 5 users upwards."}, {"question": "Do you offer integration assistance?", "answer": "We provide full implementation support and custom REST API integrations."}]'::jsonb, '2026-05-29T08:35:24.544Z'),
('prod-2', 'Zoho CRM Plus Implementation', 'A comprehensive customer experience platform. Seamlessly connect your sales, marketing, and customer support activities with customizable workflows, multi-channel support, and artificial intelligence helper ''Zia''.', '["https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹950 / user / month', '["Omnichannel support (Email, Phone, Chat, Social)", "Zia AI Assistant for Sales Prediction", "Interactive Blueprint Builder for processes", "Multi-currency support and localized GST", "Comprehensive reports builder"]'::jsonb, 4.60, 'CRM Software', 'ven-1', 'SaaSify Solutions Pvt Ltd', true, true, 280, '#', '', '[{"question": "Can we migrate data from spreadsheets?", "answer": "Absolutely. We provide import templates and verify integrity during upload."}]'::jsonb, '2026-05-31T08:35:24.544Z'),
('prod-3', 'Odoo ERP Enterprise Suite', 'A suite of business applications covering all your company needs: CRM, eCommerce, Accounting, Inventory, Point of Sale, Project Management, and manufacturing in a unified secure ecosystem.', '["https://images.unsplash.com/photo-1507206130007-be9de7134247?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹1,200 / user / month (all apps included)', '["Fully integrated inventory & warehousing", "Comprehensive HR management and attendance", "Double-entry bookkeeping and accounting sync", "Custom studio for codeless modifications", "Multi-company consolidated accounts"]'::jsonb, 4.50, 'ERP Software', 'ven-3', 'Enterprise Systems India', true, true, 450, '#', '', '[{"question": "Can Odoo run on our local server?", "answer": "Yes, Odoo supports both cloud hosting (Odoo.sh / AWS) and on-premise deployments."}]'::jsonb, '2026-05-22T08:35:24.544Z'),
('prod-4', 'SAP Business One SME Edition', 'Affordable ERP designed specifically for growing businesses. SAP Business One integrates your entire business operations from financials, purchasing, stock, sales, and manufacturing, backed by SAP''s world-class database performance.', '["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹45,000 / year / license', '["Real-time Inventory tracking & valuation", "MRP (Material Requirements Planning) engine", "In-depth BI dashboards with SAP HANA engine", "GST compliance & electronic invoice generation", "Automated procurement control"]'::jsonb, 4.70, 'ERP Software', 'ven-3', 'Enterprise Systems India', true, true, 520, '#', '', '[{"question": "Is SAP Business One suitable for a trading company?", "answer": "It is extremely popular in trading, wholesale distribution, and discrete manufacturing."}]'::jsonb, '2026-05-19T08:35:24.544Z'),
('prod-5', 'CloudConnect Virtual PBX System', 'State-of-the-art cloud telephony for remote and hybrid teams. Keep your business running with an interactive voice response (IVR) menu, virtual mobile numbers, call recording, and seamless browser-based dialer.', '["https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹1,999 / channel / month', '["Multi-level Interactive Voice Response (IVR)", "High quality call recording & log archiving", "Real-time call center performance dashboards", "CRM integrations with API triggers", "Mobile softphone app (iOS and Android)"]'::jsonb, 4.40, 'Cloud Telephony', 'ven-2', 'CloudConnect Telecom', false, true, 195, '#', '', '[{"question": "Do we need physical handsets?", "answer": "No, you can receive/make calls entirely on your laptop or smartphone softphone apps."}]'::jsonb, '2026-06-06T08:35:24.544Z'),
('prod-6', 'Tally Prime ERP Implementation', 'The ultimate accounting, inventory, banking and payroll software trusted by millions of enterprises. Get immediate compliance reporting, GST filing, audit logs, and simplified ledger setups.', '["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹18,000 one-time (Silver) / ₹54,000 one-time (Gold)', '["E-Invoicing and E-Way Bill instant creation", "Consolidated Balance Sheets & P&L statements", "Comprehensive multi-currency cashflows", "Multi-user concurrent network licenses", "Secure remote access features"]'::jsonb, 4.80, 'Accounting Software', 'ven-1', 'SaaSify Solutions Pvt Ltd', true, true, 610, '#', '', '[{"question": "Can multiple users access the same data?", "answer": "Yes, the Tally Prime Gold multi-user edition supports parallel network access."}]'::jsonb, '2026-06-16T08:35:24.544Z'),
('prod-7', 'CrowdStrike Threat Hunter Suite', 'Modern cloud-native next-generation endpoint security. Protect your enterprise machines from malware, ransomware, and zero-day exploits using machine learning behavioral threat analysis and live telemetry.', '["https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹3,200 / endpoint / year onwards', '["Single-agent architecture (zero lag on endpoint)", "24/7 Managed Detection and Response (MDR)", "Instant quarantine & attack chain maps", "Threat intelligence and search capabilities", "Ransomware prevention and automated rollback"]'::jsonb, 4.90, 'Cyber Security', 'ven-4', 'CyberShield IT Labs', true, true, 400, '#', '', '[{"question": "Is this heavy on laptop batteries?", "answer": "CrowdStrike runs a tiny lightweight micro-sensor in kernel-space, consuming less than 1% CPU."}]'::jsonb, '2026-06-14T08:35:24.544Z'),
('prod-pending', 'SmartBiz AI Agent Hub', 'Advanced AI conversational platform to handle inbound support calls, automate email replies, and qualify leads synchronously.', '["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"]'::jsonb, '₹15,000 / month', '["Multi-agent workflow orchestrator", "Prebuilt CRM connectors", "Natural-sounding speech synthesis"]'::jsonb, 3.50, 'AI Solutions', 'ven-pending', 'Aesthetic Business Software', false, false, 120, '', '', '[]'::jsonb, '2026-06-26T08:35:24.544Z');

-- leads
INSERT INTO public.leads (id, title, category, description, budget, "companyName", "contactName", mobile, email, city, timeline, status, bant, "assignedVendors", "createdAt") VALUES
('lead-1', 'Requires Omnichannel CRM with WhatsApp API integration', 'CRM Software', 'We are an edtech company with 45 sales executives. We need a CRM that records lead source from Meta ads, triggers auto-WhatsApp followups, assigns leads in round-robin format, and logs telephone recordings. Must offer dashboard to review response speeds.', '₹50,000 - ₹80,000 per month', 'Zenith EduTech solutions', 'Siddharth Sen', '+91 98765 43210', 'siddharth@zenithedu.com', 'Delhi', 'Within 15 Days', 'Assigned', '{"budget": "Sufficient - ₹60k to ₹100k approved budget", "authority": "Decision maker - Head of Operations & Sales", "need": "High - Facing 40% lead leakage in manual workflows", "timeline": "Immediate - Needs deployment before July cohort starts"}'::jsonb, '["ven-1", "ven-2"]'::jsonb, '2026-06-22T08:35:24.544Z'),
('lead-2', 'Cloud Telephony Setup & SIP Trunking for Call Center', 'Cloud Telephony', 'Looking for an enterprise grade cloud telephony provider to setup an outbound call center with 25 agents. Need high call connectivity ratios, DID numbers in Maharashtra, and softphone integration for laptop users.', '₹25,000 - ₹40,000 per month', 'CareSource Health Systems', 'Dr. Ananya Roy', '+91 87654 32109', 'ananya.roy@caresource.in', 'Mumbai', '1 Month', 'Submitted', '{"budget": "Approved budget up to ₹40k/mo", "authority": "Evaluating committee of IT Director & Admin Manager", "need": "Critical for managing incoming patients patient desk support", "timeline": "Target launch by middle of next month"}'::jsonb, '[]'::jsonb, '2026-06-24T08:35:24.544Z'),
('lead-3', 'ERP & Accounting Migration from Manual Tally', 'ERP Software', 'We run a manufacturing factory of automotive components. Need to move from offline custom databases and manual ledgers to Odoo or SAP. Need Inventory Management, Bills of Materials, Invoicing, Purchase Orders and GST compliance.', '₹2,000,000 - ₹5,000,000 (one-time setup)', 'Autoforge Components Pvt Ltd', 'Ganesh Hegde', '+91 76543 21098', 'g.hegde@autoforge.com', 'Pune', '2-3 Months', 'Proposal Received', '{"budget": "Board approved one-time capital up to ₹40L", "authority": "Managing Director and CFO are the final approvers", "need": "Inventory leakages and audit remarks are forcing digital ERP", "timeline": "Target implementation complete within 90 days"}'::jsonb, '["ven-3"]'::jsonb, '2026-06-19T08:35:24.544Z');

-- blogs
INSERT INTO public.blogs (id, title, content, image, category, tags, author, "readTime", slug, likes, "createdAt") VALUES
('blog-1', 'How to Choose the Right CRM Software for Your Growing SME', 'Selecting the correct CRM is critical. Many companies overpay for heavy software like Salesforce before their teams are ready. Alternatively, they select cheap applications that do not scale. Learn the step-by-step framework including BANT score qualifications to evaluate solutions.

### 1. Understand Your Needs
Before comparing, map out your customer journey. Do you need marketing auto-responders or simple sales pipelining?

### 2. Verify Mobile Capabilities
Your field agents require direct visual pipeline tracking, click-to-call, and local GST logging on-the-go.

### 3. API Integrations
Ensure your selected CRM seamlessly connects with Google Workspace, WhatsApp API, and cloud telephony channels.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60', 'CRM & Sales', '["CRM", "SME Growth", "Software Guide"]'::jsonb, 'Prasanna Nair (IT Analyst)', '5 mins read', 'how-to-choose-crm', 0, '2026-06-21T08:35:24.544Z'),
('blog-2', 'Understanding BANT Leads: The Enterprise Sales Shortcut', 'BANT stands for Budget, Authority, Need, and Timeline. In modern enterprise procurement, standard contact forms lead to massive sales noise. By qualifying buyers on all 4 components beforehand, platform leads ensure 3x higher conversion ratios.

### Why Budget Matters
Knowing if the customer has an allocated budget saves countless demonstration hours. If their expectation is 5x lower than the entry licensing, qualification suggests an immediate alternative.

### Tracking Authority & Timeline
Always confirm if you are discussing with the direct system owner, IT decision maker, or external consultants, and target delivery timelines strictly.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60', 'B2B Strategy', '["BANT", "Sales Pipeline", "Lead Generation"]'::jsonb, 'Rohan Das (Founder, BANTConfirm)', '4 mins read', 'understanding-bant-leads', 0, '2026-06-23T08:35:24.544Z');

-- banners
INSERT INTO public.banners (id, title, subtitle, image, active, type, "linkUrl") VALUES
('ban-1', 'Accelerate Your Sales Pipeline', 'Get BANT Qualified Hot Software Leads Delivered Real-time to Your Dashboard', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80', true, 'image', '#vendor-plans'),
('ban-2', 'Cloud Migration Made Simple', 'Compare AWS, Azure & GCP Solutions Offered by Premium Certified Consultants', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', true, 'image', '#categories');

-- testimonials
INSERT INTO public.testimonials (id, name, company, role, rating, feedback, avatar) VALUES
('test-1', 'Arun Alagappan', 'Metro Retailers', 'VP Information Technology', 5, 'We needed to procure an ERP solution for our 12 outlets. We posted our BANT requirement on BANTConfirm and within 48 hours, we were put in touch with three gold-verified Odoo implementation partners. Outstanding experience!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'),
('test-2', 'Meenakshi Iyer', 'Zeta Healthcare', 'Chief Operating Officer', 5, 'The BANT qualification on this platform is a game changer. We received exact technical matches matching our budget constraints without having to filter 100s of cold spam sales calls.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60'),
('test-3', 'Karan Malhotra', 'Vanguard Logistics', 'Sourcing Director', 5, 'Procured custom fleet tracking SaaS with automated billing. The BANT verification of budget and timeline kept proposals targeted and saved us 3 months of negotiation.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60'),
('test-4', 'Ananya Sen', 'Apex Edutech', 'Head of Procurement', 5, 'Finding Cloud Telephony with custom IVR was painless. BANTConfirm''s matchmaker filtered out low-tier brokers and linked us directly with certified telecom vendors.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'),
('test-5', 'Vikram Malhotra', 'TechNova Solutions', 'VP of Infrastructure', 5, 'Sourced unified endpoint cybersecurity for 800+ nodes. BANTConfirm confirmed our technical authority layer before introducing partners, ensuring extreme precision.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60');

-- settings
INSERT INTO public.settings (id, key, value) VALUES
('featuredListingPrice', 'featuredListingPrice', '4999'),
('leadCreditPrice', 'leadCreditPrice', '1500'),
('commissionRate', 'commissionRate', '5'),
('stripeEnabled', 'stripeEnabled', 'false'),
('about', 'about', 'BANTConfirm is India''s leading B2B enterprise software and IT solutions sourcing marketplace.

Our platform connects business buyers with pre-qualified, certified technology vendors. Traditional procurement takes months of endless cold calling, untargeted pitches, and budget mismatches. We solve this by introducing absolute clarity and architectural precision to the B2B tech discovery journey.

We utilize the globally recognized BANT (Budget, Authority, Need, Timeline) framework to verify every procurement requirement before it is passed to our certified IT partners.

- BUDGET VERIFICATION: We ensure the enterprise buyer has a defined, active budget matching market solutions.
- AUTHORITY LAYER: We verify that the evaluator or team holds direct decision-making or key advisory roles.
- NEED DEFINITION: We document the exact technical constraints, user-load requirements, and functional challenges.
- TIMELINE CONFIRMATION: We confirm active purchase cycles ranging from immediate to a maximum of 90 days.

Headquartered in Noida, Uttar Pradesh, BANTConfirm serves over 500+ enterprises and connects them with India''s most reliable SaaS, ERP, Cloud, Security, and Custom Software developers. We make technology procurement transparent, lightning-fast, and completely hassle-free.'),
('terms', 'terms', 'Welcome to BANTConfirm Sourcing Marketplace.

These terms and conditions govern your use of the BANTConfirm platform as a business buyer, certified vendor, or system administrator.

1. SOURCING ACCURACY: Buyers agree to provide accurate, truthful, and authorized procurement details including contact information, active budgets, and deployment timelines.

2. VENDOR ENGAGEMENT: Vendors agree to respond to claimed leads in a timely, professional manner, adhering to industry compliance standards.

3. BANT AUDITING: BANTConfirm reserves the right to audit, modify, or reject any sourcing request that does not meet our high-quality verification standards.'),
('privacy', 'privacy', 'Your corporate and personal privacy is of paramount importance to us.

1. INFORMATION COLLECTION: We collect business-profile details, verified email addresses, mobile numbers, and software procurement requirements strictly to facilitate secure matchmaking.

2. DATA SHARING: Sourcing details are only shared with certified software partners once they successfully purchase or claim the corresponding lead credit under strict confidentiality.

3. COMPLIANCE: Our platform maintains industry-standard security encryption protocols to ensure secure data transfers at all times.');

-- notifications
INSERT INTO public.notifications (id, "userId", title, message, read, "createdAt") VALUES
('not-1', 'buyer-demo', 'Requirement Submitted Successfully', 'Your requirement for Omnichannel CRM with WhatsApp integration has been received and verified by our BANT auditing team.', false, '2026-06-26T08:35:24.544Z'),
('not-2', 'vendor-demo', 'New Matching Lead Alert', 'A high quality qualified Lead matching ''CRM Software'' has been assigned to your panel. Purchase credentials now.', false, '2026-06-26T08:35:24.544Z');
