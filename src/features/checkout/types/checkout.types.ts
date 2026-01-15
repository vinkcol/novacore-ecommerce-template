export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  backupPhone?: string;
  address: string;
  department: string;
  city: string;
  landmark?: string;
  state: string;
  zipCode: string;
  country: string;
  priorityShipping?: boolean;
}

export interface PaymentInfo {
  method: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  shippingMethod: ShippingMethod;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  status: "pending" | "processing" | "completed" | "failed";
}

export type CheckoutStep = "shipping" | "payment" | "review";

export interface CheckoutState {
  currentStep: CheckoutStep;
  shippingInfo: Partial<ShippingInfo>;
  paymentInfo: Partial<PaymentInfo>;
  selectedShippingMethod: ShippingMethod | null;
  shippingCost: number | null;
  shippingLabel: string | null;
  shippingPromise: { min: number; max: number } | null;
  isCODAvailable: boolean;
  orderStatus: "idle" | "submitting" | "success" | "error";
  order: Order | null;
  error: string | null;
}
