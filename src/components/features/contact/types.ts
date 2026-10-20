export interface ContactFormData {
  companyName: string;
  customerName: string;
  phone: string;
  message: string;
}

export interface ContactFormStatus {
  type: 'success' | 'error' | null;
  message: string;
  unconfigured?: boolean;
}

export interface ContactFeatureItem {
  id: string;
  title: string;
  description: string;
  icon: 'star' | 'support' | 'lightning';
}
