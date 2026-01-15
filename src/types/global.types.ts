export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  email: string;
  phone: string;
  address: Address;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinks {
  shop: FooterLink[];
  company: FooterLink[];
  support: FooterLink[];
  legal: FooterLink[];
}

export type LoadingState = "idle" | "pending" | "succeeded" | "failed";

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
