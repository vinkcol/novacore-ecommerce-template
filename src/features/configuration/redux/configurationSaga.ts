import { takeLatest, put, call } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    fetchConfigurationStart,
    fetchConfigurationSuccess,
    fetchConfigurationFailure,
    updateConfigurationStart,
    updateConfigurationSuccess,
    updateConfigurationFailure
} from "./configurationSlice";
import { CommerceConfig } from "../types/configuration.types";
import { configurationApi } from "../api/configurationApi";

function* fetchConfigurationSaga() {
    console.log("[ConfigSaga] fetchConfigurationSaga started");
    try {
        const config: CommerceConfig = yield call(configurationApi.fetchConfiguration);
        console.log("[ConfigSaga] fetchConfiguration result:", config);
        yield put(fetchConfigurationSuccess(config));
    } catch (error: any) {
        console.error("[ConfigSaga] fetchConfiguration error:", error);
        yield put(fetchConfigurationFailure(error.message || "Error fetching configuration"));
    }
}

function* updateConfigurationSaga(action: PayloadAction<CommerceConfig>) {
    console.log("[ConfigSaga] updateConfigurationSaga started with:", action.payload);
    try {
        const config: CommerceConfig = yield call(configurationApi.updateConfiguration, action.payload);
        console.log("[ConfigSaga] updateConfiguration result:", config);
        yield put(updateConfigurationSuccess(config));
    } catch (error: any) {
        console.error("[ConfigSaga] updateConfiguration error:", error);
        yield put(updateConfigurationFailure(error.message || "Error updating configuration"));
    }
}

export function* configurationSaga() {
    yield takeLatest(fetchConfigurationStart.type, fetchConfigurationSaga);
    yield takeLatest(updateConfigurationStart.type, updateConfigurationSaga);
}
