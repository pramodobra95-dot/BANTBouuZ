export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  mobile: string;
  city: string;
  gstNumber?: string;
  businessType?: string;
  role: 'buyer' | 'vendor' | 'admin';
  createdAt: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  name: string;
  logo: string;
  gstNumber: string;
  panNumber: string;
  website: string;
  businessCategory: string;
  productsOffered: string[];
  rating: number;
  location: string;
  approved: boolean;
  docVerified: boolean;
  plan: 'Free' | 'Silver' | 'Gold' | 'Enterprise';
  productsCount: number;
  leadsCount: number;
  revenue: number;
  viewsCount: number;
  createdAt: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  pricing: string;
  features: string[];
  brochureUrl?: string;
  videoUrl?: string;
  faqs: ProductFAQ[];
  rating: number;
  category: string;
  vendorId: string;
  vendorName: string;
  isFeatured: boolean;
  approved: boolean;
  views: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productsCount: number;
}

export interface BANTQualification {
  budget: string;
  authority: string;
  need: string;
  timeline: string;
}

export interface Lead {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  companyName: string;
  contactName: string;
  mobile: string;
  email: string;
  city: string;
  timeline: string;
  status: 'Submitted' | 'Assigned' | 'Vendor Contacted' | 'Proposal Received' | 'Closed Won' | 'Closed Lost';
  bant: BANTQualification;
  assignedVendors: string[]; // List of vendorIds assigned by Admin
  createdAt: string;
}

export interface LeadAssignment {
  id: string;
  leadId: string;
  vendorId: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost';
  purchased: boolean;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  slug: string;
  likes?: number;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeyword?: string;
  schemaMarkup?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  videoUrl?: string;
  active: boolean;
  type: 'image' | 'video';
  linkUrl: string;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  rating: number;
  feedback: string;
  avatar: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AppSettings {
  featuredListingPrice: number;
  leadCreditPrice: number;
  commissionRate: number;
  stripeEnabled: boolean;
}
