"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TopProductsChartProps {
    data?: { name: string; ventas: number }[];
    title?: string;
    description?: string;
}

const defaultData = [
    { name: "Producto A", ventas: 0 },
    { name: "Producto B", ventas: 0 },
    { name: "Producto C", ventas: 0 },
    { name: "Producto D", ventas: 0 },
    { name: "Producto E", ventas: 0 },
];

export function TopProductsChart({ data = defaultData, title = "Productos Más Vendidos", description = "Top 5 productos por volumen de ventas" }: TopProductsChartProps) {
    const hasData = data && data.some(d => d.ventas > 0);

    return (
        <Card className="col-span-1 border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <div className="h-[300px] w-full">
                    {!hasData ? (
                        <div className="h-full w-full flex items-center justify-center border-dashed border-2 rounded-[32px] text-muted-foreground/50 font-bold">
                            Sin datos disponibles
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 40,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    className="text-[10px] font-bold uppercase tracking-wider"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        border: '1px solid hsl(var(--border))',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                                    formatter={(value: number | undefined) => {
                                        if (value === undefined) return [0, "Ventas"];
                                        return [value, "Ventas"];
                                    }}
                                />
                                <Bar dataKey="ventas" radius={[0, 4, 4, 0]} animationDuration={1500}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={1 - (index * 0.15)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
