"use client";

import React from "react";
import { X, RefreshCw, AlertCircle, CheckCircle, Clock, Truck, Ban } from "lucide-react";
import { Order, OrderStatus } from "../../types";
import { Badge } from "@/components/ui/badge";

interface OrderStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (status: OrderStatus) => void;
    order: Order | null;
    isUpdating: boolean;
}

export function OrderStatusModal({ isOpen, onClose, onConfirm, order, isUpdating }: OrderStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus | null>(null);

    React.useEffect(() => {
        if (order) setSelectedStatus(order.status);
    }, [order]);

    if (!isOpen || !order) return null;

    const statuses: { value: OrderStatus; label: string; icon: any; color: string }[] = [
        { value: "pending", label: "Pendiente", icon: Clock, color: "text-red-500 bg-red-50 border-red-200" },
        { value: "processing", label: "Procesando", icon: RefreshCw, color: "text-amber-500 bg-amber-50 border-amber-200" },
        { value: "shipped", label: "Enviado", icon: Truck, color: "text-blue-500 bg-blue-50 border-blue-200" },
        { value: "delivered", label: "Entregado", icon: CheckCircle, color: "text-green-500 bg-green-50 border-green-200" },
        { value: "cancelled", label: "Cancelado", icon: Ban, color: "text-gray-500 bg-gray-50 border-gray-200" },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-card border rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                                <RefreshCw size={24} />
                            </div>
                            <h2 className="text-xl font-extrabold tracking-tight">Cambiar Estado</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-all text-muted-foreground">
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Estás actualizando el estado de la orden <span className="font-bold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>.
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        {statuses.map((status) => {
                            const Icon = status.icon;
                            const isSelected = selectedStatus === status.value;
                            return (
                                <button
                                    key={status.value}
                                    onClick={() => setSelectedStatus(status.value)}
                                    className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${isSelected
                                            ? `${status.color} ring-2 ring-primary ring-offset-2 ring-offset-background`
                                            : 'bg-muted/10 border-transparent hover:border-muted'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/50' : 'bg-muted/50'}`}>
                                            <Icon size={18} />
                                        </div>
                                        <span className={`font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    {isSelected && <CheckCircle size={18} className="text-primary" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-muted hover:bg-muted-foreground/10 text-foreground font-bold px-6 py-4 rounded-2xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => selectedStatus && onConfirm(selectedStatus)}
                            disabled={isUpdating || selectedStatus === order.status}
                            className="flex-1 bg-primary text-primary-foreground font-bold px-6 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isUpdating ? "Actualizando..." : "Confirmar Cambio"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
