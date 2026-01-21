export const APP_NAME = "Foodie";
export const TAX_RATE = 0; // Taxes are included in price or not applied for COP

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

export const FALLBACK_IMAGES = {
  product: '/placeholder-product.png',
  logo: '/identity/logo.png',
  user: '/placeholder-user.png',
} as const;
