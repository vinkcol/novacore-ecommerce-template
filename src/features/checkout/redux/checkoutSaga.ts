import { takeLatest, call, put, select } from "redux-saga/effects";
import { submitOrderApi } from "../api/checkoutApi";
import { setOrderStatus, setOrder, setError } from "./checkoutSlice";
import { clearCart } from "@/features/cart/redux/cartSlice";
import { selectCartItems, selectCartTotals } from "@/features/cart/redux/cartSelectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { CheckoutFormValues } from "../checkout.schema";

// Action type for the saga to listen to
export const SUBMIT_ORDER_REQUEST = "checkout/submitOrderRequest";

// Action creator
export const submitOrderRequest = (payload: CheckoutFormValues) => ({
    type: SUBMIT_ORDER_REQUEST,
    payload,
});

function* handleCheckOutSaga(action: PayloadAction<CheckoutFormValues>): Generator<any, void, any> {
    try {
        yield put(setOrderStatus("submitting"));

        const items = yield select(selectCartItems);
        const totals = yield select(selectCartTotals);

        const orderData = {
            ...action.payload,
            items,
            totals,
            createdAt: new Date().toISOString(),
        };

        const response = yield call(submitOrderApi, orderData);

        if (response.success) {
            yield put(setOrder(response.data));
            yield put(setOrderStatus("success"));
            yield put(clearCart());
            // You can add more logic here, like redirecting or showing a success toast
        } else {
            throw new Error(response.message || "Error al procesar el pedido");
        }
    } catch (error: any) {
        yield put(setError(error.message));
        yield put(setOrderStatus("error"));
    }
}

export function* watchCheckout() {
    yield takeLatest(SUBMIT_ORDER_REQUEST, handleCheckOutSaga);
}
