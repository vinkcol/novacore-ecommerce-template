"use client";

import React, { useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { TextField, TextAreaField, CheckboxField } from "@/components/atoms/Form";
import { X, Loader2, Library, Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Collection } from "../../types/collection.types";
import {
    createCollectionStart,
    updateCollectionStart,
    resetCollectionStatus
} from "../../redux/adminCollectionsSlice";
import {
    selectCollectionsCreating,
    selectCollectionsCreateSuccess,
    selectCollectionsUpdating,
    selectCollectionsUpdateSuccess
} from "../../redux/adminCollectionsSelectors";
import { selectAdminProducts, selectAdminProductsLastUpdated, selectAdminProductsLoading } from "@/features/products/redux/adminProductsSelectors";
import { fetchProductsStart } from "@/features/products/redux/adminProductsSlice";
import { useToast } from "@/hooks/useToast";

const collectionSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    description: Yup.string(),
    slug: Yup.string().required("El slug es obligatorio"),
    isActive: Yup.boolean(),
    productIds: Yup.array().of(Yup.string()),
});

interface CollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    collectionItem?: Collection | null;
}

export function CollectionModal({ isOpen, onClose, collectionItem }: CollectionModalProps) {
    const dispatch = useDispatch();
    const toast = useToast();
    const isEdit = !!collectionItem;

    const creating = useSelector(selectCollectionsCreating);
    const createSuccess = useSelector(selectCollectionsCreateSuccess);
    const updating = useSelector(selectCollectionsUpdating);
    const updateSuccess = useSelector(selectCollectionsUpdateSuccess);

    const products = useSelector(selectAdminProducts);
    const productsLoading = useSelector(selectAdminProductsLoading);
    const productsLastUpdated = useSelector(selectAdminProductsLastUpdated);

    useEffect(() => {
        if (isOpen && !productsLastUpdated) {
            dispatch(fetchProductsStart());
        }
    }, [isOpen, productsLastUpdated, dispatch]);

    useEffect(() => {
        if (createSuccess || updateSuccess) {
            toast.vink(isEdit ? 'Colección actualizada' : 'Colección creada', {
                description: isEdit ? 'Los cambios se han guardado.' : 'La nueva colección ya está disponible.'
            });
            dispatch(resetCollectionStatus());
            onClose();
        }
    }, [createSuccess, updateSuccess, dispatch, onClose, toast, isEdit]);

    if (!isOpen) return null;

    const initialValues = {
        name: collectionItem?.name || "",
        description: collectionItem?.description || "",
        slug: collectionItem?.slug || "",
        isActive: collectionItem?.isActive ?? true,
        productIds: collectionItem?.productIds || [],
    };

    const activeProducts = products.filter(p => p.inStock);

    const handleSubmit = (values: any) => {
        if (isEdit && collectionItem) {
            dispatch(updateCollectionStart({ id: collectionItem.id, data: values }));
        } else {
            dispatch(createCollectionStart(values));
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-[800px] bg-card border rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <Library size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                {isEdit ? "Editar Colección" : "Nueva Colección"}
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
                        validationSchema={collectionSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ handleSubmit: formikSubmit, values, setFieldValue }) => (
                            <Form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <TextField
                                            name="name"
                                            label="Nombre de la Colección"
                                            placeholder="Ej: Temporada 2026"
                                            required
                                        />
                                        <TextField
                                            name="slug"
                                            label="Slug (URL)"
                                            placeholder="ej-temporada-2026"
                                            required
                                        />
                                        <TextAreaField
                                            name="description"
                                            label="Descripción"
                                            placeholder="Describe brevemente esta colección..."
                                        />
                                        <CheckboxField
                                            name="isActive"
                                            label="Colección activa"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-2">
                                            <Package size={16} />
                                            <span>Productos Activos ({activeProducts.length})</span>
                                        </div>

                                        <div className="border rounded-2xl overflow-hidden bg-muted/30">
                                            <div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
                                                {productsLoading && activeProducts.length === 0 ? (
                                                    <div className="flex flex-col items-center py-10 gap-2">
                                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                        <span className="text-xs font-medium text-muted-foreground">Cargando productos...</span>
                                                    </div>
                                                ) : activeProducts.length === 0 ? (
                                                    <div className="text-center py-10">
                                                        <span className="text-xs font-medium text-muted-foreground">No hay productos activos disponibles.</span>
                                                    </div>
                                                ) : (
                                                    activeProducts.map((product) => (
                                                        <div
                                                            key={product.id}
                                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border cursor-pointer group"
                                                            onClick={() => {
                                                                const productIds = values.productIds || [];
                                                                if (productIds.includes(product.id)) {
                                                                    setFieldValue("productIds", productIds.filter(id => id !== product.id));
                                                                } else {
                                                                    setFieldValue("productIds", [...productIds, product.id]);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex-shrink-0 relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={values.productIds?.includes(product.id)}
                                                                    readOnly
                                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                />
                                                            </div>
                                                            <div className="h-10 w-10 rounded-lg overflow-hidden border bg-background flex-shrink-0">
                                                                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-sm font-bold truncate">{product.name}</span>
                                                                <span className="text-[10px] text-muted-foreground font-mono truncate">{product.sku}</span>
                                                            </div>
                                                            <div className="ml-auto text-xs font-bold">
                                                                ${product.price.toLocaleString('es-CO')}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-[11px] text-muted-foreground italic px-1">
                                            Selecciona los productos que formarán parte de esta colección.
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
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
                                        {isEdit ? "Guardar Cambios" : "Crear Colección"}
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
