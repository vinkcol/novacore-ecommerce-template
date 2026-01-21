"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DeliveryStatusChartProps {
    data: { name: string; value: number; color: string }[];
    title?: string;
    description?: string;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    if (percent < 0.05) return null;

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function DeliveryStatusChart({ data = [], title = "Estado de Entregas", description = "Distribución de pedidos por estado" }: DeliveryStatusChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-1 border-none shadow-none bg-transparent">
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
        <Card className="col-span-1 border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                labelLine={false}
                                label={renderCustomizedLabel}
                                dataKey="value"
                                animationDuration={1500}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    border: '1px solid hsl(var(--border))',
                                    padding: '12px'
                                }}
                                itemStyle={{ fontWeight: 'bold' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value: number | undefined) => {
                                    if (value === undefined) return [0, "Órdenes"];
                                    return [value, "Órdenes"];
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
