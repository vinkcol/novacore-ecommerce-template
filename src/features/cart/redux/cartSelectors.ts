import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { calculateTax } from "@/lib/utils";
import { TAX_RATE } from "@/lib/constants";


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
  items.reduce((total, item) => {
    const price = typeof item.price === "string"
      ? parseFloat((item.price as string).replace(/\./g, "").replace(",", "."))
      : Number(item.price);
    return total + (price || 0) * item.quantity;
  }, 0)
);

export const selectCartTax = createSelector([selectCartSubtotal], (subtotal) =>
  calculateTax(subtotal, TAX_RATE)
);

export const selectCartShipping = createSelector(
  [(state: RootState) => state.checkout],
  () => 0 // Calculated shipping removed
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
