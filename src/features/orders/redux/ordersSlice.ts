import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderStatus } from "../types";

interface OrdersState {
    items: Order[];
    status: "idle" | "loading" | "succeeded" | "failed";
    actionStatus: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: OrdersState = {
    items: [],
    status: "idle",
    actionStatus: "idle",
    error: null,
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        fetchOrdersRequest: (state) => {
            state.status = "loading";
            state.error = null;
        },
        fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
            state.status = "succeeded";
            state.items = action.payload;
        },
        fetchOrdersFailure: (state, action: PayloadAction<string>) => {
            state.status = "failed";
            state.error = action.payload;
        },
        updateOrderStatusRequest: (state, _action: PayloadAction<{ orderId: string, status: OrderStatus }>) => {
            state.actionStatus = "loading";
        },
        updateOrderStatusSuccess: (state, action: PayloadAction<{ orderId: string, status: OrderStatus }>) => {
            state.actionStatus = "succeeded";
            const index = state.items.findIndex(o => o.id === action.payload.orderId);
            if (index !== -1) {
                state.items[index].status = action.payload.status;
            }
        },
        updateOrderStatusFailure: (state, action: PayloadAction<string>) => {
            state.actionStatus = "failed";
            state.error = action.payload;
        },
        deleteOrderRequest: (state, _action: PayloadAction<string>) => {
            state.actionStatus = "loading";
        },
        deleteOrderSuccess: (state, action: PayloadAction<string>) => {
            state.actionStatus = "succeeded";
            state.items = state.items.filter(o => o.id !== action.payload);
        },
        deleteOrderFailure: (state, action: PayloadAction<string>) => {
            state.actionStatus = "failed";
            state.error = action.payload;
        },
        resetActionStatus: (state) => {
            state.actionStatus = "idle";
            state.error = null;
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            state.items.unshift(action.payload);
        }
    },
});

export const {
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    updateOrderStatusRequest,
    updateOrderStatusSuccess,
    updateOrderStatusFailure,
    deleteOrderRequest,
    deleteOrderSuccess,
    deleteOrderFailure,
    resetActionStatus,
    addOrder
} = ordersSlice.actions;

export default ordersSlice.reducer;
