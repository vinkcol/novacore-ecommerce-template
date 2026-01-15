import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductFilters, SortOption } from "../types";
import type { LoadingState } from "@/types";

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  search: string;
  sortBy: SortOption;
  loading: LoadingState;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  filters: {},
  search: "",
  sortBy: "newest",
  loading: "idle",
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = "succeeded";
    },

    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },

    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },

    updateFilter: (
      state,
      action: PayloadAction<{ key: keyof ProductFilters; value: unknown }>
    ) => {
      state.filters = {
        ...state.filters,
        [action.payload.key]: action.payload.value,
      };
    },

    clearFilters: (state) => {
      state.filters = {};
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },

    setLoading: (state, action: PayloadAction<LoadingState>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = "failed";
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setFilters,
  updateFilter,
  clearFilters,
  setSearch,
  setSortBy,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
