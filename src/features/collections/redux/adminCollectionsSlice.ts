import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Collection } from "../types/collection.types";

interface CollectionsState {
    items: Collection[];
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

const initialState: CollectionsState = {
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

const collectionsSlice = createSlice({
    name: "adminCollections",
    initialState,
    reducers: {
        // Fetch
        fetchCollectionsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCollectionsSuccess: (state, action: PayloadAction<Collection[]>) => {
            state.items = action.payload;
            state.loading = false;
            state.lastUpdated = Date.now();
        },
        fetchCollectionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Create
        createCollectionStart: (state, _action: PayloadAction<Partial<Collection>>) => {
            state.creating = true;
            state.createSuccess = false;
            state.error = null;
        },
        createCollectionSuccess: (state, action: PayloadAction<Collection>) => {
            state.items.unshift(action.payload);
            state.creating = false;
            state.createSuccess = true;
        },
        createCollectionFailure: (state, action: PayloadAction<string>) => {
            state.creating = false;
            state.error = action.payload;
        },

        // Update
        updateCollectionStart: (state, _action: PayloadAction<{ id: string; data: Partial<Collection> }>) => {
            state.updating = true;
            state.updateSuccess = false;
            state.error = null;
        },
        updateCollectionSuccess: (state, action: PayloadAction<Collection>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
            state.updating = false;
            state.updateSuccess = true;
        },
        updateCollectionFailure: (state, action: PayloadAction<string>) => {
            state.updating = false;
            state.error = action.payload;
        },

        // Delete
        deleteCollectionStart: (state, _action: PayloadAction<string>) => {
            state.deleting = true;
            state.deleteSuccess = false;
            state.error = null;
        },
        deleteCollectionSuccess: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.deleting = false;
            state.deleteSuccess = true;
        },
        deleteCollectionFailure: (state, action: PayloadAction<string>) => {
            state.deleting = false;
            state.error = action.payload;
        },

        // Reset
        resetCollectionStatus: (state) => {
            state.createSuccess = false;
            state.updateSuccess = false;
            state.deleteSuccess = false;
            state.error = null;
        },
    },
});

export const {
    fetchCollectionsStart,
    fetchCollectionsSuccess,
    fetchCollectionsFailure,
    createCollectionStart,
    createCollectionSuccess,
    createCollectionFailure,
    updateCollectionStart,
    updateCollectionSuccess,
    updateCollectionFailure,
    deleteCollectionStart,
    deleteCollectionSuccess,
    deleteCollectionFailure,
    resetCollectionStatus,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
