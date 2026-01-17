"use client";

import React from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
    isDeleting: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName, isDeleting }: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-card border rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-destructive/10 rounded-2xl text-destructive">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold leading-tight">¿Eliminar producto?</h3>
                            <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-2xl mb-8 border">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Producto a eliminar:</p>
                        <p className="font-bold text-foreground">{productName}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 rounded-2xl border font-bold hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 rounded-2xl bg-destructive text-destructive-foreground font-bold shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 size={18} />
                            )}
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
