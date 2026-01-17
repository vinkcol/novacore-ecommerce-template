"use client";

import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, TextAreaField, CheckboxField } from "@/components/atoms/Form";
import { X, Loader2, Tag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Category } from "../../types/category.types";
import {
    createCategoryStart,
    updateCategoryStart,
    resetCategoryStatus
} from "../../redux/categoriesSlice";
import {
    selectCategoriesCreating,
    selectCategoriesCreateSuccess,
    selectCategoriesUpdating,
    selectCategoriesUpdateSuccess
} from "../../redux/categoriesSelectors";
import { useToast } from "@/hooks/useToast";

const categorySchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    description: Yup.string(),
    slug: Yup.string().required("El slug es obligatorio"),
    isActive: Yup.boolean(),
});

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
    const dispatch = useDispatch();
    const toast = useToast();
    const isEdit = !!category;

    const creating = useSelector(selectCategoriesCreating);
    const createSuccess = useSelector(selectCategoriesCreateSuccess);
    const updating = useSelector(selectCategoriesUpdating);
    const updateSuccess = useSelector(selectCategoriesUpdateSuccess);

    useEffect(() => {
        if (createSuccess || updateSuccess) {
            toast.vink(isEdit ? 'Categoría actualizada' : 'Categoría creada', {
                description: isEdit ? 'Los cambios se han guardado.' : 'La nueva categoría ya está disponible.'
            });
            dispatch(resetCategoryStatus());
            onClose();
        }
    }, [createSuccess, updateSuccess, dispatch, onClose, toast, isEdit]);

    if (!isOpen) return null;

    const initialValues = {
        name: category?.name || "",
        description: category?.description || "",
        slug: category?.slug || "",
        isActive: category?.isActive ?? true,
    };

    const handleSubmit = (values: any) => {
        if (isEdit && category) {
            dispatch(updateCategoryStart({ id: category.id, data: values }));
        } else {
            dispatch(createCategoryStart(values));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-[500px] bg-card border rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <Tag size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                {isEdit ? "Editar Categoría" : "Nueva Categoría"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={categorySchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ handleSubmit: formikSubmit }) => (
                            <Form className="space-y-6">
                                <TextField
                                    name="name"
                                    label="Nombre de la Categoría"
                                    placeholder="Ej: Electrónica"
                                    required
                                />
                                <TextField
                                    name="slug"
                                    label="Slug (URL)"
                                    placeholder="ej-electronica"
                                    required
                                />
                                <TextAreaField
                                    name="description"
                                    label="Descripción"
                                    placeholder="Describe brevemente esta categoría..."
                                />
                                <CheckboxField
                                    name="isActive"
                                    label="Categoría activa"
                                />

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-6 py-3 rounded-2xl border font-bold hover:bg-muted transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating || updating}
                                        className="flex-1 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {creating || updating ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : null}
                                        {isEdit ? "Guardar Cambios" : "Crear Categoría"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
