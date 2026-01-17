import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import type { Product } from "../types";

export const productsApi = {
  async getAll(): Promise<Product[]> {
    console.log("=== productsApi.getAll() START ===");
    try {
      console.log("[productsApi] Fetching /api/products...");
      const response = await fetch("/api/products");
      console.log("[productsApi] Response status:", response.status, response.statusText);

      if (!response.ok) {
        console.error("[productsApi] Response not OK:", response.status);
        throw new Error("Error al obtener productos");
      }

      const data = await response.json();
      console.log("[productsApi] Response data:", data);
      console.log("[productsApi] Products count:", data.products?.length || 0);
      console.log("=== productsApi.getAll() END ===");
      return data.products as Product[];
    } catch (error) {
      console.error("=== productsApi.getAll() ERROR ===", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as unknown as Product;
      }
      return null;
    } catch (error) {
      console.error("SHOP API: Error fetching product by ID", error);
      throw error;
    }
  },

  async getFeatured(): Promise<Product[]> {
    console.log("SHOP API: Fetching featured products via API route");
    try {
      const response = await fetch("/api/products?featured=true");
      if (!response.ok) {
        throw new Error("Error al obtener productos destacados");
      }
      const data = await response.json();
      return data.products as Product[];
    } catch (error) {
      console.error("SHOP API: Error fetching featured products", error);
      throw error;
    }
  }
};
