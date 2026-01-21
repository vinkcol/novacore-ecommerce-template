import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

const selectOrdersState = (state: RootState) => state.orders;

export const selectOrders = createSelector(
    [selectOrdersState],
    (state) => state.items
);

export const selectOrdersStatus = createSelector(
    [selectOrdersState],
    (state) => state.status
);

export const selectOrdersError = createSelector(
    [selectOrdersState],
    (state) => state.error
);

export const selectOrdersActionStatus = createSelector(
    [selectOrdersState],
    (state) => state.actionStatus
);

export const selectTotalOrdersCount = createSelector(
    [selectOrders],
    (orders) => orders.length
);

export const selectDeliveredOrdersCount = createSelector(
    [selectOrders],
    (orders) => orders.filter(o => o.status === "delivered").length
);

export const selectPendingOrdersCount = createSelector(
    [selectOrders],
    (orders) => orders.filter(o => o.status === "pending").length
);

export const selectCancelledOrdersCount = createSelector(
    [selectOrders],
    (orders) => orders.filter(o => o.status === "cancelled").length
);

export const selectTotalSalesAmount = createSelector(
    [selectOrders],
    (orders) => orders.reduce((sum, order) => sum + (order.total || 0), 0)
);

export const selectDeliveryConversionRate = createSelector(
    [selectTotalOrdersCount, selectDeliveredOrdersCount],
    (total, delivered) => total > 0 ? (delivered / total) * 100 : 0
);
