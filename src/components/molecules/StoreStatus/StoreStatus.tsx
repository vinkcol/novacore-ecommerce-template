"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Clock, MapPin, Bike, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { selectConfiguration } from "@/features/configuration/redux/configurationSelectors";

const DAYS_MAP = [
    { key: "sun", label: "Domingo" },
    { key: "mon", label: "Lunes" },
    { key: "tue", label: "Martes" },
    { key: "wed", label: "Miércoles" },
    { key: "thu", label: "Jueves" },
    { key: "fri", label: "Viernes" },
    { key: "sat", label: "Sábado" },
];

export function StoreStatus() {
    const config = useSelector(selectConfiguration);
    const [mode, setMode] = useState<"delivery" | "pickup">("delivery");

    // Calculate today's schedule
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday
    const todayKey = DAYS_MAP[dayIndex].key;
    const todaySchedule = config?.schedule?.days[todayKey];

    const formatTime = (time: string) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":");
        const h = parseInt(hours);
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    }

    return (
        <section className="bg-background py-8 border-b">
            <div className="container mx-auto px-4 flex justify-center">
                <div className="flex flex-col items-center gap-6 w-full max-w-2xl">

                    {/* Toggle Container */}
                    <div className="bg-muted p-1.5 rounded-full flex w-full max-w-sm shadow-inner">
                        <Button
                            variant="ghost"
                            className={cn(
                                "flex-1 rounded-full text-sm font-bold h-10 transition-all duration-300",
                                mode === "delivery"
                                    ? "bg-white text-primary shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:bg-white"
                                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                            )}
                            onClick={() => setMode("delivery")}
                        >
                            <Bike className="mr-2 h-4 w-4" />
                            Delivery
                        </Button>
                        <Button
                            variant="ghost"
                            className={cn(
                                "flex-1 rounded-full text-sm font-bold h-10 transition-all duration-300",
                                mode === "pickup"
                                    ? "bg-white text-primary shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:bg-white"
                                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                            )}
                            onClick={() => setMode("pickup")}
                        >
                            <MapPin className="mr-2 h-4 w-4" />
                            Para retirar
                        </Button>
                    </div>

                    {/* Status Info */}
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {config?.isOpen === false ? (
                            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 px-3 py-1 gap-2 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                                </span>
                                <span className="font-semibold">Cerrado</span>
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 px-3 py-1 gap-2 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                                </span>
                                <span className="font-semibold">Abierto</span>
                            </Badge>
                        )}

                        <div className="h-4 w-px bg-border" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50 hover:bg-muted hover:text-foreground h-auto"
                                >
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>
                                        {todaySchedule?.isOpen
                                            ? `${formatTime(todaySchedule.openTime)} a ${formatTime(todaySchedule.closeTime)}`
                                            : "Cerrado Hoy"}
                                    </span>
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-[300px] p-4 rounded-xl">
                                <DropdownMenuLabel className="font-bold text-lg mb-2 text-center">Horarios de Atención</DropdownMenuLabel>
                                <DropdownMenuSeparator className="mb-2" />
                                <div className="space-y-3">
                                    {DAYS_MAP.map((day) => {
                                        // Adjust loop to start from Monday for display nicely? 
                                        // Or just map standard Sunday-starting order.
                                        // Let's reorder to start Monday for UI:
                                        // But the DAYS_MAP is fixed key->label. 
                                        // We can just iterate the order we want.

                                        const schedule = config?.schedule?.days[day.key];
                                        const isToday = day.key === todayKey;

                                        return (
                                            <div key={day.key} className={cn(
                                                "flex justify-between items-center text-sm",
                                                isToday ? "font-bold text-primary" : "text-muted-foreground"
                                            )}>
                                                <span className="w-24 capitalize">{day.label}</span>
                                                <span>
                                                    {schedule?.isOpen
                                                        ? `${formatTime(schedule.openTime)} - ${formatTime(schedule.closeTime)}`
                                                        : "Cerrado"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>
        </section>
    );
}
