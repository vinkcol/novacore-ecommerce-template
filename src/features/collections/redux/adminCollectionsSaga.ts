import { call, put, takeLatest, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    fetchCollectionsStart,
    fetchCollectionsSuccess,
    fetchCollectionsFailure,
    createCollectionStart,
    createCollectionSuccess,
    createCollectionFailure,
    updateCollectionStart,
    updateCollectionSuccess,
    updateCollectionFailure,
    deleteCollectionStart,
    deleteCollectionSuccess,
    deleteCollectionFailure
} from "./adminCollectionsSlice";
import {
    fetchCollectionsApi,
    createCollectionApi,
    updateCollectionApi,
    deleteCollectionApi
} from "../api/adminCollectionsApi";
import { Collection } from "../types/collection.types";

function* fetchCollectionsSaga() {
    try {
        const collections: Collection[] = yield call(fetchCollectionsApi);
        yield put(fetchCollectionsSuccess(collections));
    } catch (error: any) {
        yield put(fetchCollectionsFailure(error.message || "Error al cargar colecciones"));
    }
}

function* createCollectionSaga(action: PayloadAction<Partial<Collection>>) {
    try {
        const collection: Collection = yield call(createCollectionApi, action.payload);
        yield put(createCollectionSuccess(collection));
    } catch (error: any) {
        yield put(createCollectionFailure(error.message || "Error al crear colección"));
    }
}

function* updateCollectionSaga(action: PayloadAction<{ id: string; data: Partial<Collection> }>) {
    try {
        const collection: Collection = yield call(updateCollectionApi, action.payload.id, action.payload.data);
        yield put(updateCollectionSuccess(collection));
    } catch (error: any) {
        yield put(updateCollectionFailure(error.message || "Error al actualizar colección"));
    }
}

function* deleteCollectionSaga(action: PayloadAction<string>) {
    try {
        const id: string = yield call(deleteCollectionApi, action.payload);
        yield put(deleteCollectionSuccess(id));
    } catch (error: any) {
        yield put(deleteCollectionFailure(error.message || "Error al eliminar colección"));
    }
}

export function* watchAdminCollections() {
    yield all([
        takeLatest(fetchCollectionsStart.type, fetchCollectionsSaga),
        takeLatest(createCollectionStart.type, createCollectionSaga),
        takeLatest(updateCollectionStart.type, updateCollectionSaga),
        takeLatest(deleteCollectionStart.type, deleteCollectionSaga),
    ]);
}
