import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

const selectShippingState = (state: RootState) => state.shipping;

export const selectShippingConfig = createSelector(
    selectShippingState,
    (shipping) => shipping.config
);

export const selectShippingLoading = createSelector(
    selectShippingState,
    (shipping) => shipping.loading
);

export const selectShippingUpdating = createSelector(
    selectShippingState,
    (shipping) => shipping.updating
);

export const selectShippingUpdateSuccess = createSelector(
    selectShippingState,
    (shipping) => shipping.updateSuccess
);

export const selectShippingError = createSelector(
    selectShippingState,
    (shipping) => shipping.error
);
