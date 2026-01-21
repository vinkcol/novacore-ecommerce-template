"use client";

import React, { useState, useEffect } from "react";
import { useFormikContext, FieldArray } from "formik";
import { Plus, Trash2, Camera, ChevronRight, Settings2, Sparkles } from "lucide-react";
import { TextField, NumberField, CurrencyField } from "@/components/atoms/Form";
import { Image } from "@/components/atoms/Image";
import { Product, ProductVariant, ProductAttribute } from "../../../types/product.types";
import { Button } from "@/components/ui/button";

export function VariantManager() {
    const { values, setFieldValue } = useFormikContext<Product>();
    const [attributes, setAttributes] = useState<{ name: string; values: string[]; rawValue: string }[]>([]);

    // Hydrate attributes from existing variants if they exist
    useEffect(() => {
        if (values.variants && values.variants.length > 0 && attributes.length === 0) {
            const recovered: Record<string, Set<string>> = {};

            values.variants.forEach(variant => {
                variant.attributes.forEach(attr => {
                    if (!recovered[attr.name]) {
                        recovered[attr.name] = new Set();
                    }
                    recovered[attr.name].add(attr.value);
                });
            });

            const initialAttrs = Object.entries(recovered).map(([name, valSet]) => {
                const vals = Array.from(valSet);
                return {
                    name,
                    values: vals,
                    rawValue: vals.join(", ")
                };
            });

            if (initialAttrs.length > 0) {
                setAttributes(initialAttrs);
            }
        }
    }, [values.variants, attributes.length]);

    // Function to generate variants from attributes
    const generateVariants = () => {
        if (attributes.length === 0) return;

        // Cartesian product logic
        const combinations = attributes.reduce((acc, attr) => {
            const result: ProductAttribute[][] = [];
            attr.values.forEach(val => {
                if (acc.length === 0) {
                    result.push([{ name: attr.name, value: val }]);
                } else {
                    acc.forEach(prev => {
                        result.push([...prev, { name: attr.name, value: val }]);
                    });
                }
            });
            return result;
        }, [] as ProductAttribute[][]);

        const newVariants: ProductVariant[] = combinations.map((combo, index) => {
            const name = combo.map(a => a.value).join(" / ");
            // Try to find existing variant to preserve data if possible (optional enhancement)
            const existing = values.variants?.find(v => v.name === name);

            return {
                id: existing?.id || `new-${index}-${Date.now()}`,
                name,
                sku: existing?.sku || `${values.sku || "COD"}-${name.replace(/\s+\/\s+/g, "-")}`,
                price: (existing?.price !== undefined && existing?.price !== 0) ? existing.price : Number(values.price) || 0,
                stockQuantity: existing?.stockQuantity || 0,
                images: existing?.images || [],
                attributes: combo,
                isActive: existing?.isActive ?? true
            };
        });

        setFieldValue("variants", newVariants);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { name: "", values: [], rawValue: "" }]);
    };

    const removeAttribute = (index: number) => {
        const newAttrs = attributes.filter((_, i) => i !== index);
        setAttributes(newAttrs);
    };

    const updateAttributeName = (index: number, name: string) => {
        const newAttrs = [...attributes];
        newAttrs[index].name = name;
        setAttributes(newAttrs);
    };

    const updateAttributeValues = (index: number, valueStr: string) => {
        const newAttrs = [...attributes];
        newAttrs[index].rawValue = valueStr;
        newAttrs[index].values = valueStr.split(",").map(v => v.trim()).filter(v => v !== "");
        setAttributes(newAttrs);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Attribute Builder */}
            <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600">
                            <Settings2 size={20} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">Opciones de Preparación / Tamaño</h2>
                    </div>
                    <Button
                        type="button"
                        onClick={addAttribute}
                        variant="outline"
                        className="rounded-xl font-bold border-2"
                    >
                        <Plus size={16} className="mr-2" />
                        Añadir Opción
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground font-medium">
                    Define las opciones de tu plato (ej: Término de carne, Tamaño, Porción) y sus valores separados por comas.
                </p>

                <div className="space-y-4">
                    {attributes.map((attr, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-muted/30 border border-dashed animate-in slide-in-from-left-2 duration-300">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nombre de la Opción</label>
                                <input
                                    type="text"
                                    value={attr.name || ""}
                                    onChange={(e) => updateAttributeName(index, e.target.value)}
                                    placeholder="Ej: Término de carne"
                                    className="w-full bg-background border-2 rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <div className="flex-[2] space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Valores (separados por coma)</label>
                                <input
                                    type="text"
                                    value={attr.rawValue || ""}
                                    onChange={(e) => updateAttributeValues(index, e.target.value)}
                                    placeholder="Ej: Azul, Término medio, Tres cuartos, Bien asado"
                                    className="w-full bg-background border-2 rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeAttribute(index)}
                                className="self-end md:mb-1 p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {attributes.length > 0 && (
                    <Button
                        type="button"
                        onClick={generateVariants}
                        className="w-full h-12 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
                    >
                        <Sparkles size={18} className="mr-2" />
                        Generar Variantes
                    </Button>
                )}
            </div>

            {/* Variant List */}
            {values.variants && values.variants.length > 0 && (
                <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6 overflow-x-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
                            <Plus size={20} />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">Lista de Variantes ({values.variants.length})</h2>
                    </div>

                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                                <th className="px-4 pb-2 w-16">Foto</th>
                                <th className="px-4 pb-2">Variante</th>
                                <th className="px-4 pb-2">Código</th>
                                <th className="px-4 pb-2">Precio</th>
                                <th className="px-4 pb-2"></th>
                            </tr>
                        </thead>
                        <FieldArray name="variants">
                            {() => (
                                <tbody>
                                    {values.variants?.map((variant, index) => (
                                        <tr key={variant.id} className="bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl overflow-hidden group">
                                            {/* Image Column */}
                                            <td className="px-4 py-4 first:rounded-l-[24px]">
                                                <div className="relative h-14 w-14 rounded-2xl bg-background border-2 border-dashed border-muted-foreground/20 overflow-hidden group/thumb transition-all hover:border-primary/40">
                                                    {variant.images && variant.images.length > 0 ? (
                                                        <>
                                                            <Image
                                                                src={variant.images[0]}
                                                                alt={variant.name}
                                                                fill
                                                                unoptimized={variant.images[0].includes("firebase") || variant.images[0].includes("storage")}
                                                                className="object-cover transition-transform group-hover/thumb:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex flex-col items-center justify-center transition-opacity z-10 gap-1">
                                                                <span className="text-[10px] font-bold text-white leading-none">{variant.images.length}</span>
                                                                <Camera size={12} className="text-white" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground/40 group-hover/thumb:text-primary/40">
                                                            <Camera size={20} />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            const files = e.target.files;
                                                            if (files) {
                                                                // In a real app, upload to Cloudinary/Firebase here
                                                                // For now, let's simulate with data URLs for preview
                                                                const newUrls: string[] = [];
                                                                Array.from(files).forEach(file => {
                                                                    const url = URL.createObjectURL(file);
                                                                    newUrls.push(url);
                                                                });
                                                                setFieldValue(`variants.${index}.images`, [...(variant.images || []), ...newUrls]);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 min-w-[140px]">
                                                <div className="font-bold text-xs text-foreground tracking-tight">{variant.name}</div>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {variant.attributes.map((a, i) => (
                                                        <span key={i} className="text-[9px] px-2 py-0.5 bg-primary/5 text-primary/70 font-bold rounded-lg border border-primary/10">
                                                            {a.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 min-w-[160px]">
                                                <input
                                                    type="text"
                                                    value={values.variants?.[index]?.sku || ""}
                                                    placeholder="COD-XXXX"
                                                    onChange={(e) => setFieldValue(`variants.${index}.sku`, e.target.value)}
                                                    className="w-full h-11 bg-background border-2 border-transparent rounded-xl px-4 text-xs font-bold focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-sm group-hover:bg-background"
                                                />
                                            </td>

                                            <td className="px-4 py-4 min-w-[140px]">
                                                <CurrencyField
                                                    name={`variants.${index}.price`}
                                                    className="w-full text-xs font-black"
                                                />
                                            </td>

                                            <td className="px-4 py-4 last:rounded-r-[24px] text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {variant.images.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setFieldValue(`variants.${index}.images`, [])}
                                                            className="p-2 text-muted-foreground/40 hover:text-destructive transition-colors"
                                                            title="Limpiar fotos"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setFieldValue(`variants.${index}.isActive`, !variant.isActive)}
                                                        className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all border-2 ${variant.isActive
                                                            ? "bg-green-500/5 text-green-500 border-green-500/10 hover:bg-green-500/10"
                                                            : "bg-red-500/5 text-red-500 border-red-500/10 hover:bg-red-500/10"
                                                            }`}
                                                    >
                                                        <ChevronRight size={18} className={variant.isActive ? "" : "rotate-180"} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </FieldArray>
                    </table>
                </div>
            )}
        </div>
    );
}
