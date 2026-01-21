"use client";

import React from "react";
import { X, Trash2, AlertTriangle, AlertCircle } from "lucide-react";

interface OrderDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderId: string;
    isDeleting: boolean;
}

export function OrderDeleteModal({ isOpen, onClose, onConfirm, orderId, isDeleting }: OrderDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-card border border-destructive/20 rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-destructive/10 rounded-2xl text-destructive">
                                <Trash2 size={24} />
                            </div>
                            <h2 className="text-xl font-extrabold tracking-tight">Eliminar Orden</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-all text-muted-foreground">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-destructive/5 border border-destructive/10 p-6 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertTriangle size={18} />
                            <span className="font-bold text-sm uppercase tracking-wider">Acción Irreversible</span>
                        </div>
                        <p className="text-sm text-destructive-foreground/80 leading-relaxed font-medium">
                            ¿Estás completamente seguro de que deseas eliminar la orden <span className="font-extrabold text-destructive">#{orderId.slice(0, 8).toUpperCase()}</span>? Esta acción no se puede deshacer y borrará permanentemente todos los registros asociados.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-muted hover:bg-muted-foreground/10 text-foreground font-bold px-6 py-4 rounded-2xl transition-all"
                        >
                            No, mantener
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 bg-destructive text-destructive-foreground font-bold px-6 py-4 rounded-2xl shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                        </button>
                    </div>
                </div>
                <div className="bg-muted/30 p-4 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                        <AlertCircle size={10} />
                        Seguridad de Datos Vink Admin
                    </p>
                </div>
            </div>
        </div>
    );
}
