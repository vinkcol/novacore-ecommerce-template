import { createAsyncThunk } from "@reduxjs/toolkit";
import { productsApi } from "../api";
import { setProducts, setSelectedProduct, setLoading, setError } from "./productsSlice";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading("pending"));
      const products = await productsApi.getAll();
      dispatch(setProducts(products));
      return products;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch products";
      dispatch(setError(message));
      throw error;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { dispatch }) => {
    try {
      dispatch(setLoading("pending"));
      const product = await productsApi.getById(id);
      dispatch(setSelectedProduct(product));
      dispatch(setLoading("succeeded"));
      return product;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch product";
      dispatch(setError(message));
      throw error;
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeatured",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading("pending"));
      const products = await productsApi.getFeatured();
      dispatch(setProducts(products));
      return products;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch featured products";
      dispatch(setError(message));
      throw error;
    }
  }
);
