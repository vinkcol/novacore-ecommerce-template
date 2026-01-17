import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StorefrontCollection } from "../api/collections.server";

interface CollectionsState {
    items: StorefrontCollection[];
    loading: boolean;
    error: string | null;
}

const initialState: CollectionsState = {
    items: [],
    loading: false,
    error: null,
};

const collectionsSlice = createSlice({
    name: "collections",
    initialState,
    reducers: {
        fetchCollectionsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCollectionsSuccess: (state, action: PayloadAction<StorefrontCollection[]>) => {
            state.items = action.payload;
            state.loading = false;
        },
        fetchCollectionsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchCollectionsRequest,
    fetchCollectionsSuccess,
    fetchCollectionsFailure,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
