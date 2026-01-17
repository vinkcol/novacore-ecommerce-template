import { takeLatest, call, put } from "redux-saga/effects";
import { productsApi } from "../api/productsApi";
import {
    fetchProductsRequest,
    setProducts,
    setError
} from "./productsSlice";
import { Product } from "../types";

function* handleFetchProducts(): Generator<any, void, any> {
    console.log("=== SAGA handleFetchProducts START ===");
    try {
        console.log("[Saga] Calling productsApi.getAll()...");
        const products: Product[] = yield call(productsApi.getAll);
        console.log("[Saga] productsApi.getAll() returned:", products?.length || 0, "products");
        console.log("[Saga] Products:", products);
        console.log("[Saga] Dispatching setProducts...");
        yield put(setProducts(products));
        console.log("=== SAGA handleFetchProducts END (success) ===");
    } catch (error: any) {
        console.error("=== SAGA handleFetchProducts ERROR ===", error);
        yield put(setError(error.message || "No se pudieron cargar los productos"));
    }
}

export function* watchProducts() {
    console.log("[Saga] watchProducts initialized, listening for fetchProductsRequest");
    yield takeLatest(fetchProductsRequest.type, handleFetchProducts);
}
