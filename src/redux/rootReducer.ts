import { combineReducers } from "@reduxjs/toolkit";
import productsReducer from "@/features/products/redux/productsSlice";
import cartReducer from "@/features/cart/redux/cartSlice";
import checkoutReducer from "@/features/checkout/redux/checkoutSlice";

export const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
});
