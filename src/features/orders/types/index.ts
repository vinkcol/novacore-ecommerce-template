export interface OrderItem {
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    notes?: string;
}

export interface OrderShippingInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    backupPhone?: string;
    address: string;
    department: string;
    city: string;
    locality?: string;
    landmark?: string;
    state: string;
    zipCode: string;
    country: string;

}

export interface OrderPaymentInfo {
    method: string; // 'cod' | 'card' etc.
    cashAmount?: number;
    // Add other fields as needed

}

export interface OrderShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
    id: string;
    items: OrderItem[];
    shipping: OrderShippingInfo;
    payment: OrderPaymentInfo;
    shippingMethod: OrderShippingMethod;
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    status: OrderStatus;
    currency: string;
    timezone: string;
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
}
