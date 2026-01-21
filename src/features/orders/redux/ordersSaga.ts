import { call, put, takeLatest } from "redux-saga/effects";
import { fetchOrdersApi, updateOrderStatusApi, deleteOrderApi } from "../api/ordersApi";
import {
    fetchOrdersRequest,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    updateOrderStatusRequest,
    updateOrderStatusSuccess,
    updateOrderStatusFailure,
    deleteOrderRequest,
    deleteOrderSuccess,
    deleteOrderFailure
} from "./ordersSlice";
import { Order, OrderStatus } from "../types";
import { PayloadAction } from "@reduxjs/toolkit";

function* fetchOrdersSaga(): Generator<any, void, any> {
    try {
        const orders: Order[] = yield call(fetchOrdersApi);
        yield put(fetchOrdersSuccess(orders));
    } catch (error: any) {
        yield put(fetchOrdersFailure(error.message || "Failed to fetch orders"));
    }
}

function* updateOrderStatusSaga(action: PayloadAction<{ orderId: string, status: OrderStatus }>): Generator<any, void, any> {
    try {
        yield call(updateOrderStatusApi, action.payload.orderId, action.payload.status);
        yield put(updateOrderStatusSuccess(action.payload));
    } catch (error: any) {
        yield put(updateOrderStatusFailure(error.message || "Failed to update order status"));
    }
}

function* deleteOrderSaga(action: PayloadAction<string>): Generator<any, void, any> {
    try {
        yield call(deleteOrderApi, action.payload);
        yield put(deleteOrderSuccess(action.payload));
    } catch (error: any) {
        yield put(deleteOrderFailure(error.message || "Failed to delete order"));
    }
}

export function* watchOrders() {
    yield takeLatest(fetchOrdersRequest.type, fetchOrdersSaga);
    yield takeLatest(updateOrderStatusRequest.type, updateOrderStatusSaga);
    yield takeLatest(deleteOrderRequest.type, deleteOrderSaga);
}
