import { takeLatest, call, put } from "redux-saga/effects";
import {
    fetchAdminProductsApi,
    createAdminProductApi,
    updateAdminProductApi,
    deleteAdminProductApi
} from "../api/adminProductsApi";
import {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    createProductStart,
    createProductSuccess,
    createProductFailure,
    updateProductStart,
    updateProductSuccess,
    updateProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
} from "./adminProductsSlice";
import { Product } from "../types/product.types";
import { PayloadAction } from "@reduxjs/toolkit";

function* handleFetchProducts(): Generator<any, void, any> {
    try {
        const products: Product[] = yield call(fetchAdminProductsApi);
        yield put(fetchProductsSuccess(products));
    } catch (error: any) {
        yield put(fetchProductsFailure(error.message || "Error al cargar productos"));
    }
}

function* handleCreateProduct(action: PayloadAction<Partial<Product>>): Generator<any, void, any> {
    try {
        console.log("SAGA: Starting handleCreateProduct with payload:", action.payload);
        const newProduct: Product = yield call(createAdminProductApi, action.payload);
        console.log("SAGA: API returned new product:", newProduct);
        yield put(createProductSuccess(newProduct));
        console.log("SAGA: Dispatched createProductSuccess");
    } catch (error: any) {
        console.error("SAGA: Error in handleCreateProduct:", error);
        yield put(createProductFailure(error.message || "Error al crear el producto"));
    }
}

function* handleUpdateProduct(action: PayloadAction<{ id: string; data: Partial<Product> }>): Generator<any, void, any> {
    try {
        const updatedProduct: Product = yield call(updateAdminProductApi, action.payload.id, action.payload.data);
        yield put(updateProductSuccess(updatedProduct));
    } catch (error: any) {
        yield put(updateProductFailure(error.message || "Error al actualizar el producto"));
    }
}

function* handleDeleteProduct(action: PayloadAction<string>): Generator<any, void, any> {
    try {
        yield call(deleteAdminProductApi, action.payload);
        yield put(deleteProductSuccess(action.payload));
    } catch (error: any) {
        yield put(deleteProductFailure(error.message || "Error al eliminar el producto"));
    }
}

export function* watchAdminProducts() {
    yield takeLatest(fetchProductsStart.type, handleFetchProducts);
    yield takeLatest(createProductStart.type, handleCreateProduct);
    yield takeLatest(updateProductStart.type, handleUpdateProduct);
    yield takeLatest(deleteProductStart.type, handleDeleteProduct);
}
