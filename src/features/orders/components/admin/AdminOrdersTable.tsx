"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter } from "lucide-react";

export function AdminOrdersTable() {
    const orders = [
        { id: "ORD-001", customer: "Juan Perez", status: "Pendiente", total: "$120.000", date: "Hace 5 mins" },
        { id: "ORD-002", customer: "Maria Garcia", status: "Procesando", total: "$85.000", date: "Hace 12 mins" },
        { id: "ORD-003", customer: "Carlos Rodriguez", status: "Enviado", total: "$240.500", date: "Hace 45 mins" },
        { id: "ORD-004", customer: "Ana Martinez", status: "Pendiente", total: "$45.000", date: "Hace 1 hora" },
        { id: "ORD-005", customer: "Luis Lopez", status: "Completado", total: "$320.000", date: "Hace 2 horas" },
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        className="w-full bg-muted/50 border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Buscar ordenes..."
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold hover:bg-muted transition-colors">
                    <Filter size={16} />
                    Filtros
                </button>
            </div>

            <div className="overflow-hidden rounded-[24px] border bg-card">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-muted/50 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Orden</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm font-medium">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-bold">{order.id}</td>
                                <td className="px-6 py-4">{order.customer}</td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={order.status === "Pendiente" ? "destructive" : "outline"}
                                        className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase"
                                    >
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 font-bold">{order.total}</td>
                                <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
