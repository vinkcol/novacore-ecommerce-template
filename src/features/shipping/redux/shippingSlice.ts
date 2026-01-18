import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShippingState, ShippingConfig } from "../types/shipping.types";

const initialState: ShippingState = {
    config: null,
    loading: false,
    error: null,
    updating: false,
    updateSuccess: false
};

const shippingSlice = createSlice({
    name: "shipping",
    initialState,
    reducers: {
        fetchShippingConfigStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchShippingConfigSuccess: (state, action: PayloadAction<ShippingConfig>) => {
            state.loading = false;
            state.config = action.payload;
        },
        fetchShippingConfigFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateShippingConfigStart: (state, action: PayloadAction<ShippingConfig>) => {
            state.updating = true;
            state.updateSuccess = false;
            state.error = null;
        },
        updateShippingConfigSuccess: (state, action: PayloadAction<ShippingConfig>) => {
            state.updating = false;
            state.updateSuccess = true;
            state.config = action.payload;
        },
        updateShippingConfigFailure: (state, action: PayloadAction<string>) => {
            state.updating = false;
            state.error = action.payload;
        },
        resetShippingStatus: (state) => {
            state.updateSuccess = false;
            state.error = null;
        }
    }
});

export const {
    fetchShippingConfigStart,
    fetchShippingConfigSuccess,
    fetchShippingConfigFailure,
    updateShippingConfigStart,
    updateShippingConfigSuccess,
    updateShippingConfigFailure,
    resetShippingStatus
} = shippingSlice.actions;

export const shippingReducer = shippingSlice.reducer;
