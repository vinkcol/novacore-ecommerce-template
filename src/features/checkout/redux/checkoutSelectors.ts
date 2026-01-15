import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

const selectCheckoutState = (state: RootState) => state.checkout;

export const selectCurrentStep = createSelector(
  [selectCheckoutState],
  (state) => state.currentStep
);

export const selectShippingInfo = createSelector(
  [selectCheckoutState],
  (state) => state.shippingInfo
);

export const selectPaymentInfo = createSelector(
  [selectCheckoutState],
  (state) => state.paymentInfo
);

export const selectSelectedShippingMethod = createSelector(
  [selectCheckoutState],
  (state) => state.selectedShippingMethod
);

export const selectOrderStatus = createSelector(
  [selectCheckoutState],
  (state) => state.orderStatus
);

export const selectOrder = createSelector(
  [selectCheckoutState],
  (state) => state.order
);

export const selectCheckoutError = createSelector(
  [selectCheckoutState],
  (state) => state.error
);

export const selectIsShippingComplete = createSelector(
  [selectShippingInfo],
  (info) => {
    return !!(
      info.firstName &&
      info.lastName &&
      info.email &&
      info.address &&
      info.city &&
      info.state &&
      info.zipCode &&
      info.country
    );
  }
);

export const selectIsPaymentComplete = createSelector(
  [selectPaymentInfo],
  (info) => {
    return !!(info.method);
  }
);
