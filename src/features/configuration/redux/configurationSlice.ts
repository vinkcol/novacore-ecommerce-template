import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfigurationState, CommerceConfig } from "../types/configuration.types";

const initialState: ConfigurationState = {
    config: null, // Start with null - will be populated by Firestore fetch
    loading: true, // Start as loading to prevent applying defaults before fetch
    error: null,
    updating: false,
    updateSuccess: false,
    updateError: null
};

const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        fetchConfigurationStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchConfigurationSuccess: (state, action: PayloadAction<CommerceConfig>) => {
            state.loading = false;
            state.config = action.payload;
        },
        fetchConfigurationFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateConfigurationStart: (state, action: PayloadAction<Partial<CommerceConfig>>) => {
            state.updating = true;
            state.updateSuccess = false;
            state.updateError = null;
        },
        updateConfigurationSuccess: (state, action: PayloadAction<CommerceConfig>) => {
            state.updating = false;
            state.updateSuccess = true;
            state.config = action.payload;
        },
        updateConfigurationFailure: (state, action: PayloadAction<string>) => {
            state.updating = false;
            state.updateError = action.payload;
        },
        resetUpdateStatus: (state) => {
            state.updateSuccess = false;
            state.updateError = null;
        }
    }
});

export const {
    fetchConfigurationStart,
    fetchConfigurationSuccess,
    fetchConfigurationFailure,
    updateConfigurationStart,
    updateConfigurationSuccess,
    updateConfigurationFailure,
    resetUpdateStatus
} = configurationSlice.actions;

export default configurationSlice.reducer;
