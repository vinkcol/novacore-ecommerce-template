"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { SalesChart } from "../charts/SalesChart";
import { DeliveryStatusChart } from "../charts/DeliveryStatusChart";
import { TopProductsChart } from "../charts/TopProductsChart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrdersRequest } from "../../../orders/redux/ordersSlice";
import { selectOrders } from "../../../orders/redux/ordersSelectors";
import { Order } from "../../../orders/types";

export function ReportsTemplate() {
    const dispatch = useAppDispatch();
    const orders = useAppSelector(selectOrders);

    // Default dates: Start of current month to today
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(today);

    useEffect(() => {
        dispatch(fetchOrdersRequest());
    }, [dispatch]);

    // Filtered orders based on date range
    const filteredOrders = useMemo(() => {
        if (!orders) return [];
        const ordersArray = orders as Order[];
        if (!Array.isArray(ordersArray)) return [];
        return ordersArray.filter(order => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            return orderDate >= startDate && orderDate <= endDate;
        });
    }, [orders, startDate, endDate]);

    // Data for Sales Chart (Grouped by date)
    const salesData = useMemo(() => {
        const dailySales: Record<string, number> = {};

        filteredOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
            dailySales[date] = (dailySales[date] || 0) + (order.total || 0);
        });

        return Object.entries(dailySales).map(([name, ventas]) => ({
            name,
            ventas
        }));
    }, [filteredOrders]);

    // Data for Operations Chart
    const operationsData = useMemo(() => {
        const delivered = filteredOrders.filter(o => o.status === "delivered").length;
        const pending = filteredOrders.filter(o => o.status === "pending").length;
        const cancelled = filteredOrders.filter(o => o.status === "cancelled").length;

        return [
            { name: "Entregadas", value: delivered, color: "hsl(var(--primary))" },
            { name: "Pendientes", value: pending, color: "#f59e0b" },
            { name: "Canceladas", value: cancelled, color: "#ef4444" },
        ];
    }, [filteredOrders]);

    return (
        <AdminLayout title="Reportes">
            <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground font-medium">
                        Visualiza el rendimiento de tu tienda en tiempo real.
                    </p>
                </div>

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

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="bg-card border p-8 rounded-[40px] shadow-sm">
                        <SalesChart data={salesData} />
                    </div>
                    <div className="bg-card border p-8 rounded-[40px] shadow-sm">
                        <DeliveryStatusChart data={operationsData} />
                    </div>
                    <div className="lg:col-span-2 bg-card border p-8 rounded-[40px] shadow-sm">
                        <TopProductsChart />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
