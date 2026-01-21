"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectConfiguration } from "@/features/configuration/redux/configurationSelectors";
import { Card } from "@/components/ui/card";

export const DateTimeCard = () => {
    const config = useAppSelector(selectConfiguration);
    const [dateTime, setDateTime] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateTime = () => {
            const now = new Date();
            if (config?.timezone) {
                try {
                    const formatter = new Intl.DateTimeFormat("es-CO", {
                        timeZone: config.timezone,
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    });
                    setDateTime(formatter.format(now));
                } catch (error) {
                    console.error("Invalid timezone:", config.timezone);
                    setDateTime(now.toLocaleString());
                }
            } else {
                setDateTime(now.toLocaleString());
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [config?.timezone]);

    if (!mounted) return null;

    return (
        <Card className="hidden flex-row items-center gap-2 border-none bg-transparent px-3 py-1 text-xs font-medium text-muted-foreground shadow-none md:flex">
            <Clock className="h-3.5 w-3.5" />
            <span className="capitalize">{dateTime}</span>
        </Card>
    );
};
