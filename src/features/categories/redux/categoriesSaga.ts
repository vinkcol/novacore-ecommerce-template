import { call, put, takeLatest, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailure,
    updateCategoryStart,
    updateCategorySuccess,
    updateCategoryFailure,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailure
} from "./categoriesSlice";
import {
    fetchCategoriesApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi
} from "../api/categoriesApi";
import { Category } from "../types/category.types";

function* fetchCategoriesSaga() {
    try {
        const categories: Category[] = yield call(fetchCategoriesApi);
        yield put(fetchCategoriesSuccess(categories));
    } catch (error: any) {
        yield put(fetchCategoriesFailure(error.message || "Error al cargar categorías"));
    }
}

function* createCategorySaga(action: PayloadAction<Partial<Category>>) {
    try {
        const category: Category = yield call(createCategoryApi, action.payload);
        yield put(createCategorySuccess(category));
    } catch (error: any) {
        yield put(createCategoryFailure(error.message || "Error al crear categoría"));
    }
}

function* updateCategorySaga(action: PayloadAction<{ id: string; data: Partial<Category> }>) {
    try {
        const category: Category = yield call(updateCategoryApi, action.payload.id, action.payload.data);
        yield put(updateCategorySuccess(category));
    } catch (error: any) {
        yield put(updateCategoryFailure(error.message || "Error al actualizar categoría"));
    }
}

function* deleteCategorySaga(action: PayloadAction<string>) {
    try {
        const id: string = yield call(deleteCategoryApi, action.payload);
        yield put(deleteCategorySuccess(id));
    } catch (error: any) {
        yield put(deleteCategoryFailure(error.message || "Error al eliminar categoría"));
    }
}

export function* watchCategories() {
    yield all([
        takeLatest(fetchCategoriesStart.type, fetchCategoriesSaga),
        takeLatest(createCategoryStart.type, createCategorySaga),
        takeLatest(updateCategoryStart.type, updateCategorySaga),
        takeLatest(deleteCategoryStart.type, deleteCategorySaga),
    ]);
}
