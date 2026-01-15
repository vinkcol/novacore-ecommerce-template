import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { calculateTax, calculateShipping } from "@/lib/utils";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  [selectCartState],
  (cart) => cart.items
);

export const selectIsCartOpen = createSelector(
  [selectCartState],
  (cart) => cart.isOpen
);

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartTax = createSelector([selectCartSubtotal], (subtotal) =>
  calculateTax(subtotal, TAX_RATE)
);

export const selectCartShipping = createSelector(
  [selectCartSubtotal, (state: RootState) => state.checkout.shippingCost],
  (subtotal, shippingCost) => {
    if (typeof shippingCost === "number") return shippingCost;
    return calculateShipping(subtotal, FREE_SHIPPING_THRESHOLD);
  }
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartTax, selectCartShipping],
  (subtotal, tax, shipping) => subtotal + tax + shipping
);

export const selectCartTotals = createSelector(
  [
    selectCartSubtotal,
    selectCartTax,
    selectCartShipping,
    selectCartTotal,
    selectCartItemCount,
  ],
  (subtotal, tax, shipping, total, itemCount) => ({
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  })
);
