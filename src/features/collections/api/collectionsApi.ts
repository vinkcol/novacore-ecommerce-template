import { StorefrontCollection } from "./collections.server";

export const collectionsApi = {
    async getStorefront(): Promise<StorefrontCollection[]> {
        try {
            const response = await fetch("/api/collections");
            if (!response.ok) {
                throw new Error("Error al obtener colecciones");
            }
            const data = await response.json();
            return data.collections || [];
        } catch (error) {
            console.error("Collections Storefront API Error:", error);
            throw error;
        }
    }
};
