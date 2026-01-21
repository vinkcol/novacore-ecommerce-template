"use client";

import React, { useState, useRef } from "react";
import {
    X,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    Download,
    Loader2,
    Trash2
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { bulkCreateProductsStart, resetCreateStatus } from "../../redux/adminProductsSlice";
import { selectAdminProductsBulkCreating, selectAdminProductsBulkCreateSuccess } from "../../redux/adminProductsSelectors";
import { Product } from "../../types/product.types";
import { useToast } from "@/hooks/useToast";

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ExcelRow {
    Nombre: string;
    Precio: number | string;
    "Precio Oferta"?: number | string;
    Categoría: string;
    Descripción?: string;
    "Descripción Larga"?: string;
    Stock?: number | string;
    SKU?: string;
    "URL Imagen"?: string;
    Etiquetas?: string; // Comma separated
    "Tiempo Prep (min)"?: number | string;
    Picante?: string; // nada, poco, medio, mucho
    "Es Nuevo"?: string | boolean;
    "Es Destacado"?: string | boolean;
}

export function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
    const dispatch = useAppDispatch();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isUploading = useAppSelector(selectAdminProductsBulkCreating);
    const isSuccess = useAppSelector(selectAdminProductsBulkCreateSuccess);

    const [parsedData, setParsedData] = useState<Partial<Product>[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleDownloadTemplate = () => {
        const headers = [
            [
                "Nombre", "Precio", "Precio Oferta", "Categoría", "Descripción",
                "Descripción Larga", "Stock", "SKU", "URL Imagen", "Etiquetas",
                "Tiempo Prep (min)", "Picante", "Es Nuevo", "Es Destacado"
            ],
            [
                "Hamburguesa Especial", 25000, 22000, "Hamburguesas", "Doble carne, queso cheddar y tocineta",
                "Nuestra hamburguesa insignia con carne 100% de res, pan brioche artesanal...", 50, "HAM-001", "https://ejemplo.com/imagen.jpg", "popular, carnes",
                15, "medio", "SÍ", "SÍ"
            ]
        ];

        const ws = XLSX.utils.aoa_to_sheet(headers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Productos");
        XLSX.writeFile(wb, "Plantilla_Carga_Masiva_Foodie.xlsx");
    };

    const validateData = (data: ExcelRow[]): Partial<Product>[] => {
        const products: Partial<Product>[] = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            if (!row.Nombre || !row.Precio || !row.Categoría) {
                throw new Error(`Fila ${i + 2}: Nombre, Precio y Categoría son obligatorios.`);
            }

            const price = typeof row.Precio === "string"
                ? parseFloat(row.Precio.replace(/[^0-9.]/g, ""))
                : row.Precio;

            const compareAtPrice = row["Precio Oferta"]
                ? (typeof row["Precio Oferta"] === "string"
                    ? parseFloat(row["Precio Oferta"].replace(/[^0-9.]/g, ""))
                    : row["Precio Oferta"])
                : undefined;

            if (isNaN(price)) {
                throw new Error(`Fila ${i + 2}: El precio '${row.Precio}' no es válido.`);
            }

            // Map spicy level
            const spicyMap: Record<string, "none" | "mild" | "medium" | "hot"> = {
                "nada": "none",
                "poco": "mild",
                "medio": "medium",
                "mucho": "hot"
            };
            const spicyLevel = spicyMap[row.Picante?.toLowerCase() || "nada"] || "none";

            products.push({
                name: row.Nombre,
                price: price,
                compareAtPrice: compareAtPrice,
                category: row.Categoría,
                description: row.Descripción || "",
                longDescription: row["Descripción Larga"] || "",
                stockQuantity: parseInt(row.Stock?.toString() || "0") || 0,
                sku: row.SKU || `PROD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                images: row["URL Imagen"] ? row["URL Imagen"].split(",").map(url => url.trim()) : [],
                tags: row.Etiquetas ? row.Etiquetas.split(",").map(t => t.trim()) : [],
                prepTimeMinutes: parseInt(row["Tiempo Prep (min)"]?.toString() || "0") || 0,
                spicyLevel: spicyLevel,
                isNew: row["Es Nuevo"]?.toString().toLowerCase() === "sí" || row["Es Nuevo"] === true,
                isFeatured: row["Es Destacado"]?.toString().toLowerCase() === "sí" || row["Es Destacado"] === true,
                isSale: !!compareAtPrice && compareAtPrice < price,
                inStock: true,
                hasVariants: false,
                type: "simple"
            });
        }

        return products;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setValidationError(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

                if (jsonData.length === 0) {
                    throw new Error("El archivo está vacío.");
                }

                const validProducts = validateData(jsonData);
                setParsedData(validProducts);
            } catch (err: any) {
                setValidationError(err.message || "Error al leer el archivo.");
                setParsedData([]);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleConfirmUpload = () => {
        if (parsedData.length > 0) {
            dispatch(bulkCreateProductsStart(parsedData));
        }
    };

    const handleReset = () => {
        setParsedData([]);
        setFileName(null);
        setValidationError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        dispatch(resetCreateStatus());
    };

    React.useEffect(() => {
        if (isSuccess) {
            toast.vink("Carga masiva completada", {
                description: `Se han creado ${parsedData.length} productos correctamente.`
            });
            onClose();
            handleReset();
        }
    }, [isSuccess]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
                <div className="flex flex-col h-[85vh]">
                    <DialogHeader className="px-8 pt-8 pb-4 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Upload className="text-primary" size={28} />
                                Carga Masiva de Productos
                            </DialogTitle>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                <X size={20} />
                            </Button>
                        </div>
                        <p className="text-muted-foreground mt-2 font-medium">
                            Sube tus productos rápidamente usando nuestra plantilla de Excel.
                        </p>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                        {/* Step 1: Download Template */}
                        <div className="bg-primary/5 rounded-[24px] p-6 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Download size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">1. Descarga la plantilla</h4>
                                    <p className="text-sm text-muted-foreground">Usa este archivo para organizar tus productos.</p>
                                </div>
                            </div>
                            <Button onClick={handleDownloadTemplate} variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 font-bold">
                                Descargar (.xlsx)
                            </Button>
                        </div>

                        {/* Step 2: Upload File */}
                        {!fileName ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-muted-foreground/20 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 hover:bg-muted/10 transition-all cursor-pointer group"
                            >
                                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform text-muted-foreground">
                                    <Upload size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg">Haz clic o arrastra tu archivo aquí</p>
                                    <p className="text-sm text-muted-foreground mt-1">Soporta formatos .xlsx y .csv</p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* File Info */}
                                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-2xl border">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-primary" />
                                        <span className="font-bold">{fileName}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={handleReset} className="text-destructive hover:bg-destructive/10">
                                        <Trash2 size={18} />
                                    </Button>
                                </div>

                                {validationError ? (
                                    <div className="bg-destructive/5 text-destructive p-4 rounded-2xl border border-destructive/20 flex items-start gap-3">
                                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm font-bold">{validationError}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <CheckCircle2 className="text-green-500" size={20} />
                                                Vista Previa ({parsedData.length} productos)
                                            </h4>
                                        </div>
                                        <div className="border rounded-2xl overflow-hidden shadow-inner bg-card/50 max-h-[300px] overflow-y-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-muted text-[10px] uppercase tracking-wider font-bold text-muted-foreground sticky top-0 uppercase">
                                                    <tr>
                                                        <th className="px-4 py-3">Nombre</th>
                                                        <th className="px-4 py-3 text-right">Precio</th>
                                                        <th className="px-4 py-3">Categoría</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y font-medium">
                                                    {parsedData.map((p, idx) => (
                                                        <tr key={idx} className="hover:bg-muted/30">
                                                            <td className="px-4 py-3 truncate max-w-[200px]">{p.name}</td>
                                                            <td className="px-4 py-3 text-right font-bold text-primary">
                                                                ${p.price?.toLocaleString()}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className="bg-muted px-2 py-1 rounded-lg text-[10px]">{p.category}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="px-8 py-6 bg-muted/20 border-t flex items-center justify-end gap-3">
                        <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmUpload}
                            disabled={!parsedData.length || !!validationError || isUploading}
                            className="rounded-xl font-bold min-w-[150px] bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                "Cargar Productos"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
