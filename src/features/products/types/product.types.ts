export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  images: string[];
  attributes: ProductAttribute[];
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  longDescription?: string;
  images: string[];
  category: string;
  subcategory?: string;
  categories: string[];
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  brand: string;
  rating?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  features?: string[];
  hasVariants: boolean;
  type: "simple" | "variable";
  isNew: boolean;
  isFeatured: boolean;
  isSale: boolean;
  salePercentage?: number;
  isCheckoutUpsell?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: string[];
}

export interface ProductsData {
  products: Product[];
  categories: Category[];
}

export interface ProductFilters {
  category?: string;
  tags?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
