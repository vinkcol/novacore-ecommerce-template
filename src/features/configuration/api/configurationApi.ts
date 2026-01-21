import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { CommerceConfig, DEFAULT_THEME_CONFIG, THEME_STORAGE_KEY } from "../types/configuration.types";

function saveThemeToStorage(theme: CommerceConfig["theme"]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch {
        // Ignore localStorage errors
    }
}

const SETTINGS_COLLECTION = "settings";
const GENERAL_DOC_ID = "general";

export const configurationApi = {
    async fetchConfiguration(): Promise<CommerceConfig> {

        try {
            const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);

            const docSnap = await getDoc(docRef);



            if (docSnap.exists()) {
                const data = docSnap.data() as Partial<CommerceConfig>;

                // Ensure theme defaults if missing in DB
                const result = {
                    ...data,
                    theme: {
                        ...DEFAULT_THEME_CONFIG,
                        ...data.theme
                    }
                } as CommerceConfig;

                // Save theme to localStorage for instant load on next page visit
                saveThemeToStorage(result.theme);
                return result;
            } else {

                // If no config exists, return default (and potentially create it)
                const defaultConfig: CommerceConfig = {
                    name: "",
                    description: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    theme: DEFAULT_THEME_CONFIG
                };
                return defaultConfig;
            }
        } catch (error) {
            console.error("[ConfigAPI] Error fetching configuration:", error);
            throw error;
        }
    },

    async updateConfiguration(config: CommerceConfig): Promise<CommerceConfig> {

        try {
            const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);

            await setDoc(docRef, config, { merge: true });

            // Save theme to localStorage for instant load on next page visit
            if (config.theme) {
                saveThemeToStorage(config.theme);
            }
            return config;
        } catch (error) {
            console.error("[ConfigAPI] Error updating configuration:", error);
            throw error;
        }
    },

    subscribeToConfiguration(callback: (config: CommerceConfig) => void): () => void {
        const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_DOC_ID);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as Partial<CommerceConfig>;
                const result = {
                    ...data,
                    theme: {
                        ...DEFAULT_THEME_CONFIG,
                        ...data.theme
                    }
                } as CommerceConfig;
                // Update local storage only if theme changed (optional, but good for consistency)
                if (result.theme) saveThemeToStorage(result.theme);
                callback(result);
            }
        });
    }
};
