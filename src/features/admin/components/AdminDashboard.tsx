"use client";

import React, { useEffect, useState, useMemo } from "react";
import { TrendingUp, Users, ShoppingBag, CreditCard, Crosshair, BarChart3, Ban, Calendar, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrdersRequest } from "../../orders/redux/ordersSlice";
import { selectOrders } from "../../orders/redux/ordersSelectors";
import { Price } from "@/components/atoms/Price";
import { SalesChart } from "../../reports/components/charts/SalesChart";
import { DeliveryStatusChart } from "../../reports/components/charts/DeliveryStatusChart";
import { StoreStatusToggle } from "./StoreStatusToggle";

export function AdminDashboard() {
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
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            return orderDate >= startDate && orderDate <= endDate;
        });
    }, [orders, startDate, endDate]);

    // Computed metrics from filtered data
    const metrics = useMemo(() => {
        const total = filteredOrders.length;
        const delivered = filteredOrders.filter(o => o.status === "delivered").length;
        const pending = filteredOrders.filter(o => o.status === "pending").length;
        const cancelled = filteredOrders.filter(o => o.status === "cancelled").length;
        // Only count sales for delivered orders as per user request
        const sales = filteredOrders
            .filter(o => o.status === "delivered")
            .reduce((sum, o) => sum + (o.total || 0), 0);
        const conversion = total > 0 ? (delivered / total) * 100 : 0;

        return { total, delivered, pending, cancelled, sales, conversion };
    }, [filteredOrders]);

    // Data for Sales Chart (Grouped by date)
    const salesData = useMemo(() => {
        const dailySales: Record<string, number> = {};

        filteredOrders.forEach(order => {
            // Only chart revenue for delivered orders
            if (order.status !== "delivered") return;

            const date = new Date(order.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
            dailySales[date] = (dailySales[date] || 0) + (order.total || 0);
        });

        return Object.entries(dailySales).map(([name, ventas]) => ({
            name,

            ventas
        })).sort((a, b) => {
            // Very basic sort, assuming the data is already somewhat ordered by the filter
            return 0;
        });
    }, [filteredOrders]);

    // Data for Operations Chart
    const operationsData = useMemo(() => {
        return [
            { name: "Entregadas", value: metrics.delivered, color: "hsl(var(--primary))" },
            { name: "Pendientes", value: metrics.pending, color: "#f59e0b" },
            { name: "Canceladas", value: metrics.cancelled, color: "#ef4444" },
        ];
    }, [metrics]);

    const stats = [
        {
            label: "Ventas Totales",
            value: <Price amount={metrics.sales} className="text-3xl font-extrabold" />,
            description: "En el rango seleccionado",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            label: "Órdenes Totales",
            value: metrics.total.toString(),
            description: "Pedidos recibidos",
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            label: "Entregadas",
            value: metrics.delivered.toString(),
            description: "Pedidos finalizados",
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100"
        },
        {
            label: "Pendientes",
            value: metrics.pending.toString(),
            description: "Atención inmediata",
            icon: BarChart3,
            color: "text-orange-600",
            bg: "bg-orange-100"
        },
        {
            label: "Canceladas",
            value: metrics.cancelled.toString(),
            description: "Pedidos descartados",
            icon: Ban,
            color: "text-red-600",
            bg: "bg-red-100"
        },
        {
            label: "Efectividad",
            value: `${metrics.conversion.toFixed(1)}%`,
            description: "Tasa de entrega",
            icon: Crosshair,
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Store Status Toggle */}
            <StoreStatusToggle />

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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="group relative overflow-hidden rounded-[24px] border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className={stat.bg + " p-3 rounded-2xl " + stat.color}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <div className="mt-1">
                                {typeof stat.value === "string" ? (
                                    <h3 className="text-2xl font-extrabold tracking-tight">{stat.value}</h3>
                                ) : (
                                    stat.value
                                )}
                            </div>
                            <p className="mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                                {stat.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 bg-card border p-8 rounded-[40px] shadow-sm">
                <div className="lg:col-span-2">
                    <SalesChart data={salesData} />
                </div>
                <div className="lg:col-span-1">
                    <DeliveryStatusChart data={operationsData} />
                </div>
            </div>
        </div>
    );
}
