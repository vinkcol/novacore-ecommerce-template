export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
  maxQuantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}
