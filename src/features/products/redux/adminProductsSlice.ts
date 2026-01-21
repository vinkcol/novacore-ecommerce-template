import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types/product.types";

interface AdminProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
    creating: boolean;
    createSuccess: boolean;
    createError: string | null;
    updating: boolean;
    updateSuccess: boolean;
    updateError: string | null;
    deleting: boolean;
    deleteSuccess: boolean;
    deleteError: string | null;
    selectedProduct: Product | null;
    bulkCreating: boolean;
    bulkCreateSuccess: boolean;
    bulkCreateError: string | null;
}

const initialState: AdminProductsState = {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
    creating: false,
    createSuccess: false,
    createError: null,
    updating: false,
    updateSuccess: false,
    updateError: null,
    deleting: false,
    deleteSuccess: false,
    deleteError: null,
    selectedProduct: null,
    bulkCreating: false,
    bulkCreateSuccess: false,
    bulkCreateError: null,
};

const adminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {
        fetchProductsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.lastUpdated = new Date().toISOString();
        },
        fetchProductsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Create Product
        createProductStart: (state, _action: PayloadAction<Partial<Product>>) => {
            state.creating = true;
            state.createSuccess = false;
            state.createError = null;
        },
        createProductSuccess: (state, action: PayloadAction<Product>) => {
            state.items.unshift(action.payload);
            state.creating = false;
            state.createSuccess = true;
        },
        createProductFailure: (state, action: PayloadAction<string>) => {
            state.creating = false;
            state.createError = action.payload;
        },
        // Update Product
        updateProductStart: (state, _action: PayloadAction<{ id: string; data: Partial<Product> }>) => {
            state.updating = true;
            state.updateSuccess = false;
            state.updateError = null;
        },
        updateProductSuccess: (state, action: PayloadAction<Product>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
            state.updating = false;
            state.updateSuccess = true;
            state.selectedProduct = null;
        },
        updateProductFailure: (state, action: PayloadAction<string>) => {
            state.updating = false;
            state.updateError = action.payload;
        },
        // Delete Product
        deleteProductStart: (state, _action: PayloadAction<string>) => {
            state.deleting = true;
            state.deleteSuccess = false;
            state.deleteError = null;
        },
        deleteProductSuccess: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.deleting = false;
            state.deleteSuccess = true;
        },
        deleteProductFailure: (state, action: PayloadAction<string>) => {
            state.deleting = false;
            state.deleteError = action.payload;
        },
        // Bulk Create
        bulkCreateProductsStart: (state, _action: PayloadAction<Partial<Product>[]>) => {
            state.bulkCreating = true;
            state.bulkCreateSuccess = false;
            state.bulkCreateError = null;
        },
        bulkCreateProductsSuccess: (state, action: PayloadAction<Product[]>) => {
            state.items = [...action.payload, ...state.items];
            state.bulkCreating = false;
            state.bulkCreateSuccess = true;
        },
        bulkCreateProductsFailure: (state, action: PayloadAction<string>) => {
            state.bulkCreating = false;
            state.bulkCreateError = action.payload;
        },
        // Selection
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
        resetCreateStatus: (state) => {
            state.creating = false;
            state.createSuccess = false;
            state.createError = null;
            state.updating = false;
            state.updateSuccess = false;
            state.updateError = null;
            state.deleting = false;
            state.deleteSuccess = false;
            state.deleteError = null;
            state.bulkCreating = false;
            state.bulkCreateSuccess = false;
            state.bulkCreateError = null;
        },
    },
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    createProductStart,
    createProductSuccess,
    createProductFailure,
    updateProductStart,
    updateProductSuccess,
    updateProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
    bulkCreateProductsStart,
    bulkCreateProductsSuccess,
    bulkCreateProductsFailure,
    setSelectedProduct,
    resetCreateStatus,
} = adminProductsSlice.actions;

export default adminProductsSlice.reducer;
