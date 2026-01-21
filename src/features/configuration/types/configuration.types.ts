export interface CommerceConfig {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    logoUrl?: string; // URL of the uploaded logo
    bannerUrl?: string; // URL of the store banner
    heroTitle?: string;
    heroSubtitle?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    theme: {
        primaryColor: string;
        primaryForeground: string;
        radius: string;
    };
    isOpen?: boolean;
    currency?: string;
    timezone?: string;
    location?: {
        department?: string;
        city?: string;
        locality?: string; // For Bogota
        neighborhood?: string; // Barrio
        lat?: number;
        lng?: number;
    };
    schedule?: ScheduleConfig;
    orderRules?: OrderRulesConfig;
    paymentMethods?: PaymentMethodsConfig;
}

export interface ScheduleConfig {
    days: {
        [key: string]: { // mon, tue, wed, thu, fri, sat, sun
            isOpen: boolean;
            openTime: string; // HH:mm
            closeTime: string; // HH:mm
        };
    };
}

export interface OrderRulesConfig {
    minOrderAmount: number;
    minOrderMessage: string;
}

export interface PaymentMethodsConfig {
    nequi: boolean;
    daviplata: boolean;
    cash: boolean; // Efectivo
    dataphone: boolean; // Datafono
}

export interface ConfigurationState {
    config: CommerceConfig | null;
    loading: boolean;
    error: string | null;
    updating: boolean;
    updateSuccess: boolean;
    updateError: string | null;
}

export const DEFAULT_THEME_CONFIG: CommerceConfig['theme'] = {
    primaryColor: '354 76% 39%', // Default Red
    primaryForeground: '0 0% 100%',
    radius: '0.5rem',
};

export const THEME_STORAGE_KEY = "vink-theme";
