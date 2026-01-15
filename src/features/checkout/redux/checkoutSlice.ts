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
  selectedShippingMethod: null,
  shippingCost: null,
  shippingLabel: null,
  shippingPromise: null,
  isCODAvailable: true, // Default to true until calculated
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

    setShippingMethod: (state, action: PayloadAction<ShippingMethod>) => {
      state.selectedShippingMethod = action.payload;
    },

    setShippingCost: (state, action: PayloadAction<number | null>) => {
      state.shippingCost = action.payload;
    },

    setShippingLabel: (state, action: PayloadAction<string | null>) => {
      state.shippingLabel = action.payload;
    },

    setShippingPromise: (state, action: PayloadAction<{ min: number; max: number } | null>) => {
      state.shippingPromise = action.payload;
    },

    setIsCODAvailable: (state, action: PayloadAction<boolean>) => {
      state.isCODAvailable = action.payload;
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
  setShippingMethod,
  setShippingCost,
  setShippingLabel,
  setShippingPromise,
  setIsCODAvailable,
  setOrderStatus,
  setOrder,
  setError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
