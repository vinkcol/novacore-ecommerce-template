import { takeLatest, put, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    fetchShippingConfigStart,
    fetchShippingConfigSuccess,
    fetchShippingConfigFailure,
    updateShippingConfigStart,
    updateShippingConfigSuccess,
    updateShippingConfigFailure
} from "./shippingSlice";
import { ShippingConfig } from "../types/shipping.types";
import { shippingApi } from "../api/shippingApi";

function* fetchShippingConfigSaga() {
    try {
        const config: ShippingConfig = yield call(shippingApi.fetchShippingConfig);
        yield put(fetchShippingConfigSuccess(config));
    } catch (error: any) {
        yield put(fetchShippingConfigFailure(error.message || "Error fetching shipping config"));
    }
}

function* updateShippingConfigSaga(action: PayloadAction<ShippingConfig>) {
    try {
        const config: ShippingConfig = yield call(shippingApi.updateShippingConfig, action.payload);
        yield put(updateShippingConfigSuccess(config));
    } catch (error: any) {
        yield put(updateShippingConfigFailure(error.message || "Error updating shipping config"));
    }
}

export function* shippingSaga() {
    yield takeLatest(fetchShippingConfigStart.type, fetchShippingConfigSaga);
    yield takeLatest(updateShippingConfigStart.type, updateShippingConfigSaga);
}
