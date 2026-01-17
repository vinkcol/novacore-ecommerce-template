"use client";

import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, NumberField, SelectField, CheckboxField, TextAreaField } from "@/components/atoms/Form";
import { ArrowLeft, Save, Package, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../types/product.types";
import {
    createProductStart,
    updateProductStart,
    resetCreateStatus
} from "../../redux/adminProductsSlice";
import {
    selectAdminProductsCreating,
    selectAdminProductsCreateSuccess,
    selectAdminProductsCreateError,
    selectAdminProductsUpdating,
    selectAdminProductsUpdateSuccess,
    selectAdminProductsUpdateError
} from "../../redux/adminProductsSelectors";
import { fetchCategoriesStart } from "@/features/categories/redux/categoriesSlice";
import { selectCategories } from "@/features/categories/redux/categoriesSelectors";
import { VariantManager } from "./variants/VariantManager";

const productValidationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    sku: Yup.string().required("El SKU es obligatorio"),
    price: Yup.number().positive("El precio debe ser positivo").required("El precio es obligatorio"),
    compareAtPrice: Yup.number().positive("El precio debe ser positivo").nullable(),
    category: Yup.string().required("La categoría es obligatoria"),
    stockQuantity: Yup.number().min(0, "Mínimo 0").required("El stock es obligatorio"),
    description: Yup.string().required("La descripción corta es obligatoria"),
    longDescription: Yup.string().required("La descripción larga es obligatoria"),
    inStock: Yup.boolean(),
    hasVariants: Yup.boolean(),
    variants: Yup.array().when("hasVariants", {
        is: true,
        then: () => Yup.array().min(1, "Debe haber al menos una variante").required(),
        otherwise: () => Yup.array().optional()
    })
});

interface ProductFormProps {
    initialProduct?: Product;
}

// Hardcoded category options removed in favor of dynamic categories from Redux


export function ProductForm({ initialProduct }: ProductFormProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const toast = useToast();
    const isEditMode = !!initialProduct;

    const creating = useSelector(selectAdminProductsCreating);
    const createSuccess = useSelector(selectAdminProductsCreateSuccess);
    const createError = useSelector(selectAdminProductsCreateError);

    const updating = useSelector(selectAdminProductsUpdating);
    const updateSuccess = useSelector(selectAdminProductsUpdateSuccess);
    const updateError = useSelector(selectAdminProductsUpdateError);

    const initialValues = {
        name: initialProduct?.name || "",
        sku: initialProduct?.sku || "",
        price: initialProduct?.price || "",
        compareAtPrice: initialProduct?.compareAtPrice || "",
        category: initialProduct?.category || "",
        stockQuantity: initialProduct?.stockQuantity || 0,
        description: initialProduct?.description || "",
        longDescription: initialProduct?.longDescription || "",
        inStock: initialProduct?.inStock !== undefined ? initialProduct.inStock : true,
        hasVariants: initialProduct?.hasVariants || false,
        variants: initialProduct?.variants || []
    };

    useEffect(() => {
        if (createSuccess) {
            toast.vink('Producto creado con éxito', {
                description: 'El nuevo producto ya está disponible en tu inventario.'
            });
            dispatch(resetCreateStatus());
            setTimeout(() => {
                router.push("/admin/products");
            }, 500);
        }
    }, [createSuccess, dispatch, router, toast]);

    useEffect(() => {
        if (updateSuccess) {
            toast.vink('Producto actualizado', {
                description: 'Los cambios se han guardado correctamente.'
            });
            dispatch(resetCreateStatus());
            setTimeout(() => {
                router.push("/admin/products");
            }, 500);
        }
    }, [updateSuccess, dispatch, router, toast]);

    useEffect(() => {
        const error = createError || updateError;
        if (error) {
            toast.error('Ocurrió un error', {
                description: error
            });
            dispatch(resetCreateStatus());
        }
    }, [createError, updateError, toast, dispatch]);

    const categories = useSelector(selectCategories);

    useEffect(() => {
        dispatch(fetchCategoriesStart());
    }, [dispatch]);

    const categoryOptions = React.useMemo(() => {
        return categories.map(cat => ({
            value: cat.name,
            label: cat.name
        }));
    }, [categories]);

    useEffect(() => {
        return () => {
            dispatch(resetCreateStatus());
        };
    }, [dispatch]);

    const handleSubmit = (values: any, { setSubmitting }: any) => {
        const payload = {
            ...values,
            price: Number(values.price) || 0,
            compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : null,
            stockQuantity: Number(values.stockQuantity) || 0,
            images: initialProduct?.images || (
                values.hasVariants && values.variants?.[0]?.images?.length > 0
                    ? [values.variants[0].images[0]]
                    : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"]
            ),
            variants: values.hasVariants ? values.variants : [],
            type: values.hasVariants ? "variable" : "simple"
        };

        if (isEditMode && initialProduct?.id) {
            dispatch(updateProductStart({ id: initialProduct.id, data: payload }));
        } else {
            dispatch(createProductStart(payload));
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/products"
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Volver a Productos
                </Link>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={productValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Package size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Información General</h2>
                                </div>

                                <TextField
                                    name="name"
                                    label="Nombre del Producto"
                                    placeholder="Ej: Auriculares Bluetooth Pro"
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextField
                                        name="sku"
                                        label="SKU / Referencia"
                                        placeholder="Escribre el código del producto..."
                                        required
                                    />
                                    <SelectField
                                        name="category"
                                        label="Categoría"
                                        options={categoryOptions}
                                        placeholder="Selecciona categoría..."
                                        required
                                    />
                                </div>

                                <TextField
                                    name="description"
                                    label="Descripción Corta"
                                    placeholder="Un breve resumen que aparezca en los listados..."
                                    required
                                />

                                <TextAreaField
                                    name="longDescription"
                                    label="Descripción Larga"
                                    placeholder="Detalla todas las características del producto..."
                                />

                                <div className="pt-4">
                                    <CheckboxField
                                        name="hasVariants"
                                        label="Este producto tiene variantes (Talla, Color, etc.)"
                                    />
                                </div>

                                {values.hasVariants && (
                                    <div className="pt-6 border-t border-dashed mt-6">
                                        <VariantManager />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Form */}
                        <div className="space-y-6">
                            {/* Pricing & Stock */}
                            <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                                <h3 className="text-lg font-bold tracking-tight">Precios y Stock</h3>

                                {!values.hasVariants ? (
                                    <>
                                        <NumberField
                                            name="price"
                                            label="Precio de Venta (COP)"
                                            placeholder="0"
                                            required
                                        />

                                        <NumberField
                                            name="compareAtPrice"
                                            label="Precio anterior (Opcional)"
                                            placeholder="0"
                                        />

                                        <hr className="border-dashed" />

                                        <NumberField
                                            name="stockQuantity"
                                            label="Cantidad en Stock"
                                            placeholder="0"
                                            required
                                        />
                                    </>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                                            <Sparkles size={16} />
                                        </div>
                                        <p className="text-xs font-bold text-primary italic">
                                            Precios y stock gestionados por variantes
                                        </p>
                                    </div>
                                )}

                                <CheckboxField
                                    name="inStock"
                                    label="Producto disponible para la venta"
                                />
                            </div>

                            {/* Actions */}
                            <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-4 bg-primary/5 border-primary/10">
                                <button
                                    type="submit"
                                    disabled={creating || updating}
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {creating || updating ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            {isEditMode ? "Actualizando..." : "Guardando..."}
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {isEditMode ? "Guardar Cambios" : "Crear Producto"}
                                        </>
                                    )}
                                </button>
                                <p className="text-[11px] text-center text-muted-foreground font-medium px-4">
                                    {isEditMode
                                        ? "Al guardar los cambios, la información se actualizará instantáneamente en la tienda."
                                        : "Al crear el producto se publicará automáticamente en la tienda si tiene stock disponible."}
                                </p>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
