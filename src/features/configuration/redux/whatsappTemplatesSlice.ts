import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WhatsAppTemplate } from "../api/whatsappTemplatesApi";

interface WhatsAppTemplatesState {
    items: WhatsAppTemplate[];
    loading: boolean;
    error: string | null;
}

const initialState: WhatsAppTemplatesState = {
    items: [],
    loading: false,
    error: null,
};

const whatsappTemplatesSlice = createSlice({
    name: "whatsappTemplates",
    initialState,
    reducers: {
        // Fetch
        fetchTemplatesRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchTemplatesSuccess(state, action: PayloadAction<WhatsAppTemplate[]>) {
            state.loading = false;
            state.items = action.payload;
        },
        fetchTemplatesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Create
        createTemplateRequest(state, _action: PayloadAction<Omit<WhatsAppTemplate, "id">>) {
            state.loading = true;
        },
        createTemplateSuccess(state, action: PayloadAction<WhatsAppTemplate>) {
            state.loading = false;
            state.items.push(action.payload);
        },
        createTemplateFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Update
        updateTemplateRequest(state, _action: PayloadAction<{ id: string; updates: Partial<WhatsAppTemplate> }>) {
            state.loading = true;
        },
        updateTemplateSuccess(state, action: PayloadAction<WhatsAppTemplate>) {
            state.loading = false;
            const index = state.items.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },
        updateTemplateFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        // Delete
        deleteTemplateRequest(state, _action: PayloadAction<string>) {
            state.loading = true;
        },
        deleteTemplateSuccess(state, action: PayloadAction<string>) {
            state.loading = false;
            state.items = state.items.filter(t => t.id !== action.payload);
        },
        deleteTemplateFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
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
    deleteTemplateFailure,
} = whatsappTemplatesSlice.actions;

export default whatsappTemplatesSlice.reducer;
