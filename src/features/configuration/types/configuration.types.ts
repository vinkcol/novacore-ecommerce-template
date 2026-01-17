export interface CommerceConfig {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    logoUrl?: string; // URL of the uploaded logo
    theme: {
        primaryColor: string;
        primaryForeground: string;
        radius: string;
    };
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
