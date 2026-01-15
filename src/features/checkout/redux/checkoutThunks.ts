import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { setOrderStatus, setOrder, setError } from "./checkoutSlice";
import { clearCart } from "@/features/cart/redux/cartSlice";
import { v4 as uuidv4 } from "uuid";
import type { Order } from "../types";
import { calculateTax, calculateShipping } from "@/lib/utils";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export const submitOrder = createAsyncThunk(
  "checkout/submitOrder",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setOrderStatus("submitting"));

      const state = getState() as RootState;
      const { shippingInfo, paymentInfo, selectedShippingMethod } =
        state.checkout;
      const { items } = state.cart;

      // Calculate totals
      const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
      const tax = calculateTax(subtotal, TAX_RATE);
      const shipping = selectedShippingMethod?.price || calculateShipping(subtotal, FREE_SHIPPING_THRESHOLD);
      const total = subtotal + tax + shipping;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const order: Order = {
        id: uuidv4(),
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shipping: shippingInfo as Order["shipping"],
        payment: paymentInfo as Order["payment"],
        shippingMethod: selectedShippingMethod!,
        subtotal,
        tax,
        shippingCost: shipping,
        total,
        createdAt: new Date().toISOString(),
        status: "completed",
      };

      dispatch(setOrder(order));
      dispatch(setOrderStatus("success"));
      dispatch(clearCart());

      return order;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit order";
      dispatch(setError(message));
      dispatch(setOrderStatus("error"));
      throw error;
    }
  }
);
