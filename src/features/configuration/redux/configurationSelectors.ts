import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

const selectConfigurationState = (state: RootState) => state.configuration;

export const selectConfiguration = createSelector(
    [selectConfigurationState],
    (state) => state.config
);

export const selectConfigurationLoading = createSelector(
    [selectConfigurationState],
    (state) => state.loading
);

export const selectConfigurationError = createSelector(
    [selectConfigurationState],
    (state) => state.error
);

export const selectConfigurationUpdating = createSelector(
    [selectConfigurationState],
    (state) => state.updating
);

export const selectConfigurationUpdateSuccess = createSelector(
    [selectConfigurationState],
    (state) => state.updateSuccess
);

export const selectConfigurationUpdateError = createSelector(
    [selectConfigurationState],
    (state) => state.updateError
);
