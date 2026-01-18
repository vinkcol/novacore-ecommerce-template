import { combineReducers } from "@reduxjs/toolkit";
import productsReducer from "@/features/products/redux/productsSlice";
import adminProductsReducer from "@/features/products/redux/adminProductsSlice";
import categoriesReducer from "@/features/categories/redux/categoriesSlice";
import collectionsReducer from "@/features/collections/redux/collectionsSlice";
import adminCollectionsReducer from "@/features/collections/redux/adminCollectionsSlice";
import cartReducer from "@/features/cart/redux/cartSlice";
import checkoutReducer from "@/features/checkout/redux/checkoutSlice";
import configurationReducer from "@/features/configuration/redux/configurationSlice";
import { shippingReducer } from "@/features/shipping/redux/shippingSlice";

export const rootReducer = combineReducers({
  products: productsReducer,
  adminProducts: adminProductsReducer,
  categories: categoriesReducer,
  collections: collectionsReducer,
  adminCollections: adminCollectionsReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  configuration: configurationReducer,
  shipping: shippingReducer,
});
