import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../types/category.types";

interface CategoriesState {
    items: Category[];
    loading: boolean;
    error: string | null;
    creating: boolean;
    createSuccess: boolean;
    updating: boolean;
    updateSuccess: boolean;
    deleting: boolean;
    deleteSuccess: boolean;
    lastUpdated: number | null;
}

const initialState: CategoriesState = {
    items: [],
    loading: false,
    error: null,
    creating: false,
    createSuccess: false,
    updating: false,
    updateSuccess: false,
    deleting: false,
    deleteSuccess: false,
    lastUpdated: null,
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        // Fetch
        fetchCategoriesStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.lastUpdated = Date.now();
        },
        fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Create
        createCategoryStart: (state, _action: PayloadAction<Partial<Category>>) => {
            state.creating = true;
            state.createSuccess = false;
            state.error = null;
        },
        createCategorySuccess: (state, action: PayloadAction<Category>) => {
            state.items.unshift(action.payload);
            state.creating = false;
            state.createSuccess = true;
        },
        createCategoryFailure: (state, action: PayloadAction<string>) => {
            state.creating = false;
            state.error = action.payload;
        },

        // Update
        updateCategoryStart: (state, _action: PayloadAction<{ id: string; data: Partial<Category> }>) => {
            state.updating = true;
            state.updateSuccess = false;
            state.error = null;
        },
        updateCategorySuccess: (state, action: PayloadAction<Category>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
            state.updating = false;
            state.updateSuccess = true;
        },
        updateCategoryFailure: (state, action: PayloadAction<string>) => {
            state.updating = false;
            state.error = action.payload;
        },

        // Delete
        deleteCategoryStart: (state, _action: PayloadAction<string>) => {
            state.deleting = true;
            state.deleteSuccess = false;
            state.error = null;
        },
        deleteCategorySuccess: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.deleting = false;
            state.deleteSuccess = true;
        },
        deleteCategoryFailure: (state, action: PayloadAction<string>) => {
            state.deleting = false;
            state.error = action.payload;
        },

        // Reset
        resetCategoryStatus: (state) => {
            state.createSuccess = false;
            state.updateSuccess = false;
            state.deleteSuccess = false;
            state.error = null;
        },
    },
});

export const {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailure,
    updateCategoryStart,
    updateCategorySuccess,
    updateCategoryFailure,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailure,
    resetCategoryStatus,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
