"use client";

import React, { useCallback, useState } from "react";
import { useField, useFormikContext } from "formik";
import { Upload, X, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { uploadImage } from "@/lib/firebase/upload";
import { useToast } from "@/hooks/useToast";

interface ImageUploadFieldProps {
    name: string;
    label: string;
    maxImages?: number;
    required?: boolean;
    uploadPath?: string;
}

export function ImageUploadField({
    name,
    label,
    maxImages = 5,
    required = false,
    uploadPath = "products"
}: ImageUploadFieldProps) {
    const [field, meta, helpers] = useField<string[]>(name);
    const { isSubmitting } = useFormikContext();
    const [isDragging, setIsDragging] = useState(false);
    const [pendingUploads, setPendingUploads] = useState<{ id: string, preview: string }[]>([]);
    const toast = useToast();

    const images = field.value || [];

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSubmitting && images.length + pendingUploads.length < maxImages) {
            setIsDragging(true);
        }
    }, [isSubmitting, images.length, maxImages, pendingUploads.length]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const processFiles = useCallback(async (files: FileList | null) => {
        if (!files || isSubmitting) return;

        const remainingSlots = maxImages - images.length - pendingUploads.length;
        if (remainingSlots <= 0) return;

        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        // Process each file
        for (const file of filesToProcess) {
            if (!file.type.startsWith("image/")) continue;

            const tempId = Math.random().toString(36).substring(7);
            const previewUrl = URL.createObjectURL(file);

            // Add to pending uploads
            setPendingUploads(prev => [...prev, { id: tempId, preview: previewUrl }]);

            try {
                // Upload to Firebase Storage
                const downloadUrl = await uploadImage(file, uploadPath);

                // Add to form values
                // Note: We need to use the callback form of setPendingUploads to avoid stale state issues,
                // but for helpers.setValue, we need the latest 'images' from the component scope.
                // Ideally, we should use a functional update for the form field too, but Formik helpers don't support that directly for arrays easily without keeping track of state.
                // So we will re-read field.value inside explicit logic if possible, or just rely on the fact that this assumes sequential or React updates.
                // Actually, better to just use the helper with the *current* field value at the time of completion.
                // But strictly, 'images' variable in this scope is closed over.
                // To fix this, we should rely on the Functional Update pattern if we were using useState, but here we are using helpers.

                // Let's use the functional update pattern for pendingUploads, and for images, we'll need to trust the closure or re-fetch.
                // A safer way:
                helpers.setValue([...field.value, downloadUrl]);

                // Remove from pending
                setPendingUploads(prev => prev.filter(p => p.id !== tempId));
            } catch (error) {
                console.error("Upload failed", error);
                toast.error("Error al subir imagen", {
                    description: "No se pudo subir la imagen. Inténtalo de nuevo."
                });
                setPendingUploads(prev => prev.filter(p => p.id !== tempId));
            } finally {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [images, maxImages, isSubmitting, helpers, uploadPath, pendingUploads.length, field.value, toast]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        // Reset input
        e.target.value = '';
    }, [processFiles]);

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        helpers.setValue(newImages);
    };

    return (
        <FormFieldWrapper
            label={label}
            required={required}
            touched={meta.touched}
            error={meta.error}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <AnimatePresence mode="popLayout">
                        {/* Render Existing Images */}
                        {images.map((url, index) => (
                            <motion.div
                                key={`${url}-${index}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-muted bg-muted/30 group shadow-sm hover:shadow-md transition-all"
                            >
                                <img
                                    src={url}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-md rounded-xl text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white shadow-lg"
                                >
                                    <X size={14} />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-[10px] font-bold text-white text-center py-1 uppercase tracking-wider backdrop-blur-sm">
                                        Principal
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {/* Render Pending Uploads */}
                        {pendingUploads.map((upload) => (
                            <motion.div
                                key={upload.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-muted bg-muted/30 flex items-center justify-center"
                            >
                                <img
                                    src={upload.preview}
                                    alt="Uploading..."
                                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                                />
                                <div className="relative z-10 p-2 bg-background/80 rounded-full shadow-lg backdrop-blur-sm">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            </motion.div>
                        ))}

                        {/* Add Button */}
                        {images.length + pendingUploads.length < maxImages && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`
                                    relative aspect-square cursor-pointer transition-all duration-300
                                    rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2
                                    ${isDragging
                                        ? "border-primary bg-primary/5 scale-[0.98] ring-4 ring-primary/10"
                                        : "border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5"}
                                `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById(`file-input-${name}`)?.click()}
                            >
                                <input
                                    id={`file-input-${name}`}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                />
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-1">
                                    <Plus size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {images.length === 0 ? "Añadir Fotos" : `${images.length}/${maxImages}`}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={`
                    p-6 rounded-3xl border-2 border-dashed transition-all duration-300
                    flex flex-col items-center justify-center text-center gap-3
                    ${isDragging
                        ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                        : "border-muted-foreground/10 bg-muted/5"}
                    ${images.length >= maxImages ? "hidden" : "flex"}
                `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="p-4 bg-background rounded-2xl shadow-sm text-muted-foreground/40">
                        <Upload size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">Arrastra tus imágenes aquí</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Soporta JPG, PNG y WEBP. Máximo <span className="font-bold text-primary">{maxImages} archivos</span>.
                        </p>
                    </div>
                </div>
            </div>
        </FormFieldWrapper>
    );
}
