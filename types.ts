export interface LineItem {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  price: number;
}

export interface Section {
  id: string;
  title: string; // e.g., "WEBSITE & HẠ TẦNG"
  romanIndex: string; // e.g., "I", "II"
  items: LineItem[];
}

export interface CompanyInfo {
  name: string;
  address: string; // Registered Address
  officeAddress: string; // New Office Address
  phone: string;
  email: string;
  taxId: string;
  logoUrl: string;
}

export interface CustomerInfo {
  companyName: string;
  contactPerson: string;
  projectName: string;
}

export interface MetaInfo {
  quoteNumber: string;
  date: string;
  validityDays: number;
}

export interface Terms {
  payment: string;
  notes: string;
}

export interface QuotationData {
  language: 'vi' | 'en';
  company: CompanyInfo;
  customer: CustomerInfo;
  meta: MetaInfo;
  sections: Section[];
  vatRate: number; // Percentage, e.g., 8 or 10
  terms: Terms;
}

// Database Types
export interface DBUser {
  id: string; // The 'sub' from JWT
  email: string;
  name?: string;
  picture?: string;
}

export interface DBQuotation {
  id: number;
  user_id: string; // Owner of the quotation
  title: string;
  customer_name: string;
  data: QuotationData;
  created_at: string;
  updated_at: string;
}