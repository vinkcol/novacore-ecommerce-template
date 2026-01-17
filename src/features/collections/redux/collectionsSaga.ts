import { call, put, takeLatest } from "redux-saga/effects";
import { collectionsApi } from "../api/collectionsApi";
import {
    fetchCollectionsRequest,
    fetchCollectionsSuccess,
    fetchCollectionsFailure
} from "./collectionsSlice";
import { StorefrontCollection } from "../api/collections.server";

function* handleFetchCollections() {
    try {
        const collections: StorefrontCollection[] = yield call(collectionsApi.getStorefront);
        yield put(fetchCollectionsSuccess(collections));
    } catch (error: any) {
        yield put(fetchCollectionsFailure(error.message || "Error al cargar colecciones"));
    }
}

export function* watchCollections() {
    yield takeLatest(fetchCollectionsRequest.type, handleFetchCollections);
}
