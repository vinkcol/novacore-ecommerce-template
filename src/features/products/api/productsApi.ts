import productsData from "@/data/products.json";
import type { Product, ProductsData } from "../types";

const data = productsData as unknown as ProductsData;

export const productsApi = {
  async getAll(): Promise<Product[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return data.products;
  },

  async getById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const product = data.products.find(
      (p) => p.id === id || p.slug === id
    );
    return product || null;
  },

  async getByCategory(category: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return data.products.filter((p) =>
      p.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  },

  async getFeatured(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return data.products.filter((p) => p.isFeatured);
  },

  async getNew(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return data.products.filter((p) => p.isNew);
  },

  async getOnSale(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return data.products.filter((p) => p.isSale);
  },
};
