"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter, Loader2, Eye, RefreshCw, Trash2, Download, Calendar } from "lucide-react";
import * as XLSX from 'xlsx';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchOrdersRequest,
    updateOrderStatusRequest,
    deleteOrderRequest,
    resetActionStatus
} from "../../redux/ordersSlice";
import {
    selectOrders,
    selectOrdersStatus,
    selectOrdersActionStatus
} from "../../redux/ordersSelectors";
import { Price } from "@/components/atoms/Price";
import { OrderDetailModal } from "./OrderDetailModal";
import { OrderStatusModal } from "./OrderStatusModal";
import { OrderDeleteModal } from "./OrderDeleteModal";
import { Order, OrderStatus } from "../../types";
import { useToast } from "@/hooks/useToast";

export function AdminOrdersTable() {
    const dispatch = useAppDispatch();
    const toast = useToast();
    const orders = useAppSelector(selectOrders);
    const status = useAppSelector(selectOrdersStatus);
    const actionStatus = useAppSelector(selectOrdersActionStatus);

    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Filter states
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today);
    const [searchQuery, setSearchQuery] = useState("");

    // Filtered orders logic
    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        return orders.filter(order => {
            // Date filter
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            const matchesDate = orderDate >= startDate && orderDate <= endDate;

            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                order.id.toLowerCase().includes(searchLower) ||
                `${order.shipping.firstName} ${order.shipping.lastName}`.toLowerCase().includes(searchLower) ||
                order.shipping.phone.includes(searchQuery) ||
                (order.shipping.whatsapp && order.shipping.whatsapp.includes(searchQuery));

            return matchesDate && matchesSearch;
        });
    }, [orders, startDate, endDate, searchQuery]);

    useEffect(() => {
        dispatch(fetchOrdersRequest());
    }, [dispatch]);

    useEffect(() => {
        if (actionStatus === "succeeded") {
            if (isStatusOpen) {
                toast.vink("Estado actualizado", { description: "La orden ha sido actualizada correctamente." });
                setIsStatusOpen(false);
            }
            if (isDeleteOpen) {
                toast.vink("Orden eliminada", { description: "El registro ha sido borrado permanentemente." });
                setIsDeleteOpen(false);
            }
            dispatch(resetActionStatus());
        }
    }, [actionStatus, isStatusOpen, isDeleteOpen, dispatch, toast]);

    // Handlers
    const handleView = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    const handleStatusUpdate = (order: Order) => {
        setSelectedOrder(order);
        setIsStatusOpen(true);
    };

    const handleDelete = (order: Order) => {
        setSelectedOrder(order);
        setIsDeleteOpen(true);
    };

    const confirmStatusUpdate = (newStatus: OrderStatus) => {
        if (selectedOrder) {
            dispatch(updateOrderStatusRequest({ orderId: selectedOrder.id, status: newStatus }));
        }
    };

    const confirmDelete = () => {
        if (selectedOrder) {
            dispatch(deleteOrderRequest(selectedOrder.id));
        }
    };

    const exportToCSV = () => {
        const headers = [
            "ID",
            "Nombre",
            "Celular",
            "Departamento",
            "Ciudad",
            "Localidad",
            "Fecha Agendamiento",
            "Fecha Esperada Entrega",
            "Metodo Pago",
            "Comentarios Adicionales",
            "Total",
            "Estado"
        ];

        const data = filteredOrders.map((order: Order) => {
            const date = new Date(order.createdAt);
            const expectedDate = new Date(date);
            // Default 3 days if not specified or range
            // Default 3 days if not specified or range
            const daysToAdd = order.shippingMethod
                ? parseInt(order.shippingMethod.estimatedDays.split('-').pop() || "3")
                : 3;
            expectedDate.setDate(date.getDate() + daysToAdd);


            return [
                order.id.toUpperCase(),
                `"${order.shipping.firstName} ${order.shipping.lastName}"`,
                `"${order.shipping.whatsapp || order.shipping.phone}"`,
                `"${order.shipping.department}"`,
                `"${order.shipping.city}"`,
                `"${order.shipping.locality || ""}"`,
                `"${date.toLocaleString('es-CO')}"`,
                `"${expectedDate.toLocaleDateString('es-CO')}"`,
                order.payment.method === 'cod' ? 'Contraentrega' : 'Anticipado',
                `"${order.shipping.landmark || ""}"`,
                order.total,
                getStatusLabel(order.status)
            ];
        });

        const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `pedidos_detallado_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.vink("Exportación CSV", { description: "El archivo detallado se ha descargado correctamente." });
    };

    const exportToExcel = () => {
        const data = filteredOrders.map((order: Order) => {
            const date = new Date(order.createdAt);
            const expectedDate = new Date(date);
            const daysToAdd = order.shippingMethod
                ? parseInt(order.shippingMethod.estimatedDays.split('-').pop() || "3")
                : 3;
            expectedDate.setDate(date.getDate() + daysToAdd);


            return {
                "ID": order.id.toUpperCase(),
                "Nombre": `${order.shipping.firstName} ${order.shipping.lastName}`,
                "Celular": order.shipping.whatsapp || order.shipping.phone,
                "Departamento": order.shipping.department,
                "Ciudad": order.shipping.city,
                "Localidad": order.shipping.locality || "",
                "Fecha Agendamiento": date.toLocaleString('es-CO'),
                "Fecha Esperada Entrega": expectedDate.toLocaleDateString('es-CO'),
                "Metodo Pago": order.payment.method === 'cod' ? 'Contraentrega' : 'Anticipado',
                "Comentarios Adicionales": order.shipping.landmark || "",
                "Total": order.total,
                "Estado": getStatusLabel(order.status)
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos Detallados");
        XLSX.writeFile(workbook, `pedidos_detallado_${new Date().toISOString().slice(0, 10)}.xlsx`);
        toast.vink("Exportación Excel", { description: "El archivo detallado se ha descargado correctamente." });
    };

    // Simple relative time formatter
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Hace un momento";
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} mins`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        return date.toLocaleDateString("es-CO");
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "pending": return "destructive";
            case "processing": return "warning";
            case "shipped": return "default";
            case "delivered": return "success";
            case "cancelled": return "outline";
            default: return "secondary";
        }
    };

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: "Pendiente",
            processing: "Procesando",
            shipped: "Enviado",
            delivered: "Entregado",
            cancelled: "Cancelado"
        };
        return map[status] || status;
    };

    if (status === "loading" && orders.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border p-4 rounded-[28px] shadow-sm">
                <div className="flex items-center gap-3 text-muted-foreground ml-2">
                    <Calendar size={20} className="text-primary" />
                    <span className="text-sm font-bold uppercase tracking-wider">Filtrar por Fecha</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted/50 rounded-2xl px-4 py-2 border border-transparent focus-within:border-primary/20 transition-all">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground mr-3">Desde</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold focus:outline-none cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center bg-muted/50 rounded-2xl px-4 py-2 border border-transparent focus-within:border-primary/20 transition-all">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground mr-3">Hasta</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold focus:outline-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        className="w-full bg-muted/50 border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Buscar ordenes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold hover:bg-muted transition-colors bg-card">
                                <Download size={16} />
                                Exportar
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] rounded-2xl p-2">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 py-1">Seleccionar Formato</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={exportToExcel} className="rounded-xl cursor-pointer font-bold py-2">
                                Excel (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={exportToCSV} className="rounded-xl cursor-pointer font-bold py-2">
                                CSV (.csv)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold hover:bg-muted transition-colors">
                        <Filter size={16} />
                        Filtros
                    </button>
                </div>
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
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm font-medium">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                    No se encontraron ordenes con los filtros seleccionados
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order: Order) => (
                                <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-primary">#{order.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{order.shipping.firstName} {order.shipping.lastName}</span>
                                            <span className="text-xs text-muted-foreground">{order.shipping.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={getStatusVariant(order.status) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}
                                            className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase"
                                        >
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        <Price amount={order.total} />
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {getRelativeTime(order.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleView(order)}
                                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                                                title="Ver detalle"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(order)}
                                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-amber-600"
                                                title="Cambiar estado"
                                            >
                                                <RefreshCw size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order)}
                                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-destructive"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <OrderDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                order={selectedOrder}
            />

            <OrderStatusModal
                isOpen={isStatusOpen}
                onClose={() => setIsStatusOpen(false)}
                onConfirm={confirmStatusUpdate}
                order={selectedOrder}
                isUpdating={actionStatus === "loading"}
            />

            <OrderDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                orderId={selectedOrder?.id || ""}
                isDeleting={actionStatus === "loading"}
            />
        </div>
    );
}
