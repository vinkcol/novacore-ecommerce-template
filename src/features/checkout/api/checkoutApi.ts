import { CheckoutFormValues } from "../checkout.schema";

// Simulating API call
export async function submitOrderApi(orderData: CheckoutFormValues) {
  // In a real scenario, this would be:
  // const response = await fetch('/api/orders', { ... })
  // return response.json()

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    success: true,
    orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
    data: orderData
  };
}
