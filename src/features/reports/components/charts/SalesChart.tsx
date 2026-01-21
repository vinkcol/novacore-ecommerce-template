"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesChartProps {
    data: { name: string; ventas: number }[];
    title?: string;
    description?: string;
}

export function SalesChart({ data = [], title = "Ventas Totales", description = "Resumen de ventas en el período seleccionado" }: SalesChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-1 lg:col-span-2 border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0 h-[300px] flex items-center justify-center border-dashed border-2 rounded-[32px] text-muted-foreground/50 font-bold">
                    Sin datos disponibles
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 lg:col-span-2 border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                            <XAxis
                                dataKey="name"
                                className="text-[10px] font-bold uppercase tracking-wider"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                className="text-[10px] font-bold"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    border: '1px solid hsl(var(--border))',
                                    padding: '12px'
                                }}
                                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                formatter={(value: number | undefined) => {
                                    if (value === undefined) return ["$0", "Ventas"];
                                    return [`$${value.toLocaleString()}`, "Ventas"];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="ventas"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorVentas)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
