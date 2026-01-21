import { takeLatest, put, call, take, cancelled, fork } from "redux-saga/effects";
import { eventChannel, SagaIterator } from "redux-saga";
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

const CONFIG_CACHE_KEY = "vink-shop-config";

function* fetchConfigurationSaga(): SagaIterator {


    // Load from cache first for immediate UI update
    try {
        const cachedConfig = localStorage.getItem(CONFIG_CACHE_KEY);
        if (cachedConfig) {

            yield put(fetchConfigurationSuccess(JSON.parse(cachedConfig)));
        }
    } catch (e) {
        console.warn("[ConfigSaga] Failed to load from cache", e);
    }

    try {
        const config: CommerceConfig = yield call(configurationApi.fetchConfiguration);


        // Update cache
        localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config));

        yield put(fetchConfigurationSuccess(config));
    } catch (error: any) {
        console.error("[ConfigSaga] fetchConfiguration error:", error);
        yield put(fetchConfigurationFailure(error.message || "Error fetching configuration"));
    }
}

function* updateConfigurationSaga(action: PayloadAction<CommerceConfig>): SagaIterator {

    try {
        const config: CommerceConfig = yield call(configurationApi.updateConfiguration, action.payload);


        // Update cache on success
        localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config));

        yield put(updateConfigurationSuccess(config));
    } catch (error: any) {
        console.error("[ConfigSaga] updateConfiguration error:", error);
        yield put(updateConfigurationFailure(error.message || "Error updating configuration"));
    }
}

function createConfigurationChannel() {
    return eventChannel(emit => {
        const unsubscribe = configurationApi.subscribeToConfiguration((config) => {
            emit(config);
        });
        return () => unsubscribe();
    });
}

function* watchConfigurationUpdates(): SagaIterator {
    const channel = yield call(createConfigurationChannel);
    try {
        while (true) {
            const config = yield take(channel);

            yield put(fetchConfigurationSuccess(config));

            // Update cache
            localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config));
        }
    } finally {
        if (yield cancelled()) {
            channel.close();
        }
    }
}

export function* configurationSaga(): SagaIterator {
    yield takeLatest(fetchConfigurationStart.type, fetchConfigurationSaga);
    yield takeLatest(updateConfigurationStart.type, updateConfigurationSaga);

    // Start watching for real-time updates immediately
    yield fork(watchConfigurationUpdates);
}
