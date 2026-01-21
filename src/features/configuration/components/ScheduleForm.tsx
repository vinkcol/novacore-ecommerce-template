"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, Save, Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    selectConfiguration,
    selectConfigurationUpdating
} from "../redux/configurationSelectors";
import { updateConfigurationStart } from "../redux/configurationSlice";
import { ScheduleConfig } from "../types/configuration.types";

const DAYS = [
    { key: "mon", label: "Lunes" },
    { key: "tue", label: "Martes" },
    { key: "wed", label: "Miércoles" },
    { key: "thu", label: "Jueves" },
    { key: "fri", label: "Viernes" },
    { key: "sat", label: "Sábado" },
    { key: "sun", label: "Domingo" },
];

const DEFAULT_DAY_SCHEDULE = {
    isOpen: true,
    openTime: "12:00",
    closeTime: "22:00",
};

const DisplaySchedule = ({ schedule }: { schedule: ScheduleConfig }) => {
    return (
        <div className="space-y-3">
            {DAYS.map(day => {
                const dayConfig = schedule.days[day.key] || DEFAULT_DAY_SCHEDULE;
                return (
                    <div key={day.key} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="font-medium text-sm">{day.label}</span>
                        {dayConfig.isOpen ? (
                            <span className="text-sm text-muted-foreground">
                                {dayConfig.openTime} - {dayConfig.closeTime}
                            </span>
                        ) : (
                            <span className="text-sm font-medium text-destructive">Cerrado</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export function ScheduleForm() {
    const dispatch = useDispatch();
    const config = useSelector(selectConfiguration);
    const updating = useSelector(selectConfigurationUpdating);


    const [isEditing, setIsEditing] = useState(false);
    const [schedule, setSchedule] = useState<ScheduleConfig>({ days: {} });

    useEffect(() => {
        if (config?.schedule) {
            setSchedule(config.schedule);
        } else {
            // Initialize with defaults if empty
            const initialSchedule: ScheduleConfig = { days: {} };
            DAYS.forEach(day => {
                initialSchedule.days[day.key] = { ...DEFAULT_DAY_SCHEDULE };
            });
            setSchedule(initialSchedule);
        }
    }, [config]);

    const handleDayChange = (dayKey: string, field: string, value: any) => {
        setSchedule(prev => ({
            ...prev,
            days: {
                ...prev.days,
                [dayKey]: {
                    ...(prev.days[dayKey] || DEFAULT_DAY_SCHEDULE),
                    [field]: value
                }
            }
        }));
    };

    const handleSave = () => {
        if (!config) return;

        dispatch(updateConfigurationStart({
            ...config,
            schedule: schedule
        }));
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Horarios de Atención</h2>
                            <p className="text-sm text-muted-foreground">Configura los días y horas que tu negocio está abierto.</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(!isEditing)}
                        className="rounded-full"
                    >
                        {isEditing ? <X size={18} /> : <Pencil size={18} />}
                    </Button>
                </div>

                {isEditing ? (
                    <>
                        <div className="space-y-4 divide-y">
                            {DAYS.map((day) => {
                                const dayConfig = schedule.days[day.key] || DEFAULT_DAY_SCHEDULE;

                                return (
                                    <div key={day.key} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-[150px]">
                                            <Switch
                                                checked={dayConfig.isOpen}
                                                onCheckedChange={(checked) => handleDayChange(day.key, "isOpen", checked)}
                                            />
                                            <Label className={!dayConfig.isOpen ? "text-muted-foreground" : "font-medium"}>
                                                {day.label}
                                            </Label>
                                        </div>

                                        <div className={`flex items-center gap-2 ${!dayConfig.isOpen ? "opacity-50 pointer-events-none" : ""}`}>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    value={dayConfig.openTime}
                                                    onChange={(e) => handleDayChange(day.key, "openTime", e.target.value)}
                                                    className="w-32"
                                                />
                                                <span className="text-muted-foreground">-</span>
                                                <Input
                                                    type="time"
                                                    value={dayConfig.closeTime}
                                                    onChange={(e) => handleDayChange(day.key, "closeTime", e.target.value)}
                                                    className="w-32"
                                                />
                                            </div>
                                        </div>

                                        {!dayConfig.isOpen && (
                                            <span className="text-sm font-medium text-destructive hidden sm:block">
                                                Cerrado
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t">
                            <Button
                                onClick={handleSave}
                                disabled={updating}
                                className="w-full sm:w-auto h-12 rounded-xl text-base font-bold"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Horarios
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <DisplaySchedule schedule={schedule} />
                )}
            </div>
        </div>
    );
}
