"use client";

import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, NumberField, SelectField, CheckboxField, TextAreaField, RichTextField, ImageUploadField, CurrencyField } from "@/components/atoms/Form";
import { ArrowLeft, Save, Package, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
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
import { slugify } from "@/lib/utils/slugify";

const productValidationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    // sku: Yup.string().required("El SKU es obligatorio"), // Removed for restaurant
    price: Yup.number().required("El precio es obligatorio").min(0, "El precio no puede ser negativo"),
    compareAtPrice: Yup.number().positive("El precio debe ser positivo").nullable(),
    category: Yup.string().required("La categoría es obligatoria"),
    stockQuantity: Yup.number().min(0, "Mínimo 0"),
    description: Yup.string().required("La descripción corta es obligatoria"),
    longDescription: Yup.string().required("La descripción larga es obligatoria"),
    inStock: Yup.boolean(),
    hasVariants: Yup.boolean(),
    variants: Yup.array().when("hasVariants", {
        is: true,
        then: () => Yup.array().required("Debes añadir al menos una variante"),
        otherwise: () => Yup.array().notRequired()
    }),
    images: Yup.array().min(1, "Al menos una imagen es obligatoria").max(5, "Máximo 5 imágenes").required("Las imágenes son obligatorias"),
    prepTimeMinutes: Yup.number().min(0, "El tiempo no puede ser negativo"),
    extras: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Nombre requerido"),
            price: Yup.number().min(0, "Precio no negativo").required("Precio requerido")
        })
    )
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
        variants: initialProduct?.variants || [],
        images: initialProduct?.images || [],
        prepTimeMinutes: initialProduct?.prepTimeMinutes || "",
        spicyLevel: initialProduct?.spicyLevel || "none",
        allowNotes: initialProduct?.allowNotes ?? true,
        extras: initialProduct?.extras || [],
        isFeatured: initialProduct?.isFeatured || false,
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
            images: values.images,
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
                {({ values, setFieldValue }) => (
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
                                    label="Nombre del Plato"
                                    placeholder="Ej: Hamburguesa Doble con Queso"
                                    required
                                />

                                {/* Restaurant Specific Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Opciones del Plato</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Prep Time */}
                                        <div className="col-span-1">
                                            <TextField
                                                label="Tiempo de Preparación (minutos)"
                                                name="prepTimeMinutes"
                                                type="number"
                                                placeholder="Ej: 15"
                                            />
                                        </div>

                                        {/* Spicy Level */}
                                        <div className="col-span-1">
                                            <SelectField
                                                label="Nivel de Picante"
                                                name="spicyLevel"
                                                options={[
                                                    { value: "none", label: "🚫 Sin picante" },
                                                    { value: "mild", label: "🌶️ Bajo" },
                                                    { value: "medium", label: "🌶️🌶️ Medio" },
                                                    { value: "hot", label: "🔥 Picante" }
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 pt-2">
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <CheckboxField
                                                name="inStock"
                                                label="Disponible Hoy"
                                            // description="¿El plato se puede pedir ahora mismo?"
                                            />
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <CheckboxField
                                                name="allowNotes"
                                                label="Permitir Notas"
                                            // description="El cliente puede escribir 'sin cebolla', etc."
                                            />
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <CheckboxField
                                                name="isFeatured"
                                                label="Recomendado del Chef"
                                            // description="Aparecerá en la sección de destacados."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Extras Section using FieldArray would be better, but implementing simple UI for MVP */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h3 className="text-lg font-medium text-gray-900">Adicionales / Extras</h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentExtras = values.extras || [];
                                                setFieldValue("extras", [...currentExtras, { name: "", price: 0 }]);
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Añadir Extra
                                        </button>
                                    </div>

                                    {(values.extras || []).map((extra: any, index: number) => (
                                        <div key={index} className="flex gap-4 items-start bg-gray-50 p-3 rounded-md">
                                            <div className="flex-grow">
                                                <TextField
                                                    // label="Nombre"
                                                    name={`extras.${index}.name`}
                                                    placeholder="Ej: Tocineta Crocante"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <CurrencyField
                                                    // label="Precio"
                                                    name={`extras.${index}.price`}
                                                    placeholder="2.000"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newExtras = [...(values.extras || [])];
                                                    newExtras.splice(index, 1);
                                                    setFieldValue("extras", newExtras);
                                                }}
                                                className="mt-2 text-red-500 hover:text-red-700 p-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {(!values.extras || values.extras.length === 0) && (
                                        <p className="text-sm text-gray-500 italic">No hay extras configurados.</p>
                                    )}
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* <TextField
                                        name="sku"
                                        label="SKU / Referencia"
                                        placeholder="Escribre el código del producto..."
                                        required
                                    /> */}
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
                                    label="Descripción Corta del Menú"
                                    placeholder="Ej: 200g de carne, queso cheddar, lechuga y tomate."
                                    required
                                />

                                <RichTextField
                                    name="longDescription"
                                    label="Descripción Detallada (Ingredientes)"
                                    placeholder="Detalla los ingredientes, alérgenos y la historia del plato..."
                                />



                                <div className="pt-6 border-t border-dashed mt-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                            <ImageIcon size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold tracking-tight">Imágenes del Producto</h2>
                                    </div>
                                    <ImageUploadField
                                        name="images"
                                        label="Fotos del Producto"
                                        maxImages={5}
                                        required
                                        uploadPath={`products/${values.name ? slugify(values.name) : 'unnamed'}`}
                                    />

                                    <div className="pt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 mt-4">
                                        <CheckboxField
                                            name="hasVariants"
                                            label="Este plato tiene múltiples opciones (Tamaños, Términos de carne, etc.)"
                                        />
                                    </div>
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
                                <h3 className="text-lg font-bold tracking-tight">Precios y Disponibilidad</h3>

                                <CurrencyField
                                    name="price"
                                    label={values.hasVariants ? "Precio Base (COP)" : "Precio de Venta (COP)"}
                                    placeholder="Ej: 2.000.000"
                                    required
                                />

                                {values.hasVariants && (
                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center text-center gap-3 mt-2">
                                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                                            <Sparkles size={16} />
                                        </div>
                                        <p className="text-[10px] font-bold text-primary italic leading-tight">
                                            Este precio se usa como base para las nuevas variantes. Cada variante puede tener su propio precio.
                                        </p>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <CheckboxField
                                        name="inStock"
                                        label="¿Disponible hoy?"
                                    />
                                </div>
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
