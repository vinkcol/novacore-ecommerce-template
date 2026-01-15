export const APP_NAME = "Vink Shop";
export const TAX_RATE = 0.08; // 8% tax
export const FREE_SHIPPING_THRESHOLD = 50;
export const DEFAULT_SHIPPING_COST = 5.99;
export const CURRENCY = "COP";
export const LOCALE = "es-CO";

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CHECKOUT: "/checkout",
  CART: "/cart",
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;
