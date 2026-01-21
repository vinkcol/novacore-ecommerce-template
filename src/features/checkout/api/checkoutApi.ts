import { CheckoutFormValues } from "../checkout.schema";
import { createOrderApi } from "@/features/orders/api/ordersApi";
import { Order } from "@/features/orders/types";

// Simulating API call
// Delegate to orders API
export async function submitOrderApi(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  try {
    const order = await createOrderApi(orderData);
    return {
      success: true,
      orderId: order.id,
      data: order
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
}
