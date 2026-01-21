import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CheckoutState,
  CheckoutStep,
  ShippingInfo,
  PaymentInfo,
  ShippingMethod,
  Order,
} from "../types";

const initialState: CheckoutState = {
  currentStep: "shipping",
  shippingInfo: {},
  paymentInfo: {},

  orderStatus: "idle",
  order: null,
  error: null,
};


export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.currentStep = action.payload;
    },

    setShippingInfo: (state, action: PayloadAction<Partial<ShippingInfo>>) => {
      state.shippingInfo = {
        ...state.shippingInfo,
        ...action.payload,
      };
    },

    setPaymentInfo: (state, action: PayloadAction<Partial<PaymentInfo>>) => {
      state.paymentInfo = {
        ...state.paymentInfo,
        ...action.payload,
      };
    },





    setOrderStatus: (
      state,
      action: PayloadAction<"idle" | "submitting" | "success" | "error">
    ) => {
      state.orderStatus = action.payload;
    },

    setOrder: (state, action: PayloadAction<Order>) => {
      state.order = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetCheckout: () => initialState,
  },
});

export const {
  setCurrentStep,
  setShippingInfo,
  setPaymentInfo,

  setOrderStatus,

  setOrder,
  setError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
