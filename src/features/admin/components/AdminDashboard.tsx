"use client";

import React from "react";
import { TrendingUp, Users, ShoppingBag, CreditCard } from "lucide-react";

export function AdminDashboard() {
    const stats = [
        {
            label: "Ventas Totales",
            value: "$12.450.000",
            description: "+20.1% respecto al mes anterior",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-100",
            trend: "up"
        },
        {
            label: "Nuevos Clientes",
            value: "142",
            description: "+12 desde ayer",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            label: "Órdenes Pendientes",
            value: "24",
            description: "8 requieren atención inmediata",
            icon: ShoppingBag,
            color: "text-orange-600",
            bg: "bg-orange-100"
        },
        {
            label: "Ticket Promedio",
            value: "$85.000",
            description: "Estable",
            icon: CreditCard,
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="group relative overflow-hidden rounded-[24px] border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className={stat.bg + " p-3 rounded-2xl " + stat.color}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-3xl font-extrabold tracking-tight mt-1">{stat.value}</h3>
                            <p className="mt-2 text-xs text-muted-foreground font-medium">
                                {stat.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-[32px] border bg-card p-8 font-bold text-lg flex items-center justify-center min-h-[300px] border-dashed text-muted-foreground/50">
                    Estadísticas de Ventas
                </div>
                <div className="rounded-[32px] border bg-card p-8 font-bold text-lg flex items-center justify-center min-h-[300px] border-dashed text-muted-foreground/50">
                    Resumen de Operaciones
                </div>
            </div>
        </div>
    );
}
