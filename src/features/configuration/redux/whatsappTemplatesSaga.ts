import { call, put, takeLatest, all } from "redux-saga/effects";
import {
    fetchTemplatesApi,
    createTemplateApi,
    updateTemplateApi,
    deleteTemplateApi,
    WhatsAppTemplate
} from "../api/whatsappTemplatesApi";
import {
    fetchTemplatesRequest,
    fetchTemplatesSuccess,
    fetchTemplatesFailure,
    createTemplateRequest,
    createTemplateSuccess,
    createTemplateFailure,
    updateTemplateRequest,
    updateTemplateSuccess,
    updateTemplateFailure,
    deleteTemplateRequest,
    deleteTemplateSuccess,
    deleteTemplateFailure
} from "./whatsappTemplatesSlice";
import { PayloadAction } from "@reduxjs/toolkit";

function* handleFetchTemplates() {
    try {
        const templates: WhatsAppTemplate[] = yield call(fetchTemplatesApi);
        yield put(fetchTemplatesSuccess(templates));
    } catch (error: any) {
        yield put(fetchTemplatesFailure(error.message));
    }
}

function* handleCreateTemplate(action: PayloadAction<Omit<WhatsAppTemplate, "id">>) {
    try {
        const newTemplate: WhatsAppTemplate = yield call(createTemplateApi, action.payload);
        yield put(createTemplateSuccess(newTemplate));
    } catch (error: any) {
        yield put(createTemplateFailure(error.message));
    }
}

function* handleUpdateTemplate(action: PayloadAction<{ id: string; updates: Partial<WhatsAppTemplate> }>) {
    try {
        const updatedTemplate: WhatsAppTemplate = yield call(updateTemplateApi, action.payload.id, action.payload.updates);
        yield put(updateTemplateSuccess(updatedTemplate));
    } catch (error: any) {
        yield put(updateTemplateFailure(error.message));
    }
}

function* handleDeleteTemplate(action: PayloadAction<string>) {
    try {
        yield call(deleteTemplateApi, action.payload);
        yield put(deleteTemplateSuccess(action.payload));
    } catch (error: any) {
        yield put(deleteTemplateFailure(error.message));
    }
}

export function* watchWhatsAppTemplates() {
    yield all([
        takeLatest(fetchTemplatesRequest.type, handleFetchTemplates),
        takeLatest(createTemplateRequest.type, handleCreateTemplate),
        takeLatest(updateTemplateRequest.type, handleUpdateTemplate),
        takeLatest(deleteTemplateRequest.type, handleDeleteTemplate),
    ]);
}
