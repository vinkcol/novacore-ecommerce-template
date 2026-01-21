"use client";

import React from "react";
import { Power } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import {
    selectConfiguration,
    selectConfigurationUpdating,
} from "../../configuration/redux/configurationSelectors";
import { updateConfigurationStart } from "../../configuration/redux/configurationSlice";

export function StoreStatusToggle() {
    const dispatch = useDispatch();
    const toast = useToast();
    const config = useSelector(selectConfiguration);
    const updating = useSelector(selectConfigurationUpdating);

    const isOpen = config?.isOpen ?? true;

    const handleToggle = (newStatus: boolean) => {
        if (!config) return;

        dispatch(updateConfigurationStart({
            ...config,
            isOpen: newStatus
        }));

        toast.vink(
            newStatus ? "Tienda Abierta" : "Tienda Cerrada",
            {
                description: newStatus
                    ? "Tu tienda está ahora abierta para recibir pedidos."
                    : "Tu tienda está ahora cerrada. Los clientes no podrán realizar pedidos."
            }
        );
    };

    return (
        <div className="rounded-2xl border bg-card p-4 shadow-sm bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                        <Power size={16} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            isOpen ? "bg-green-500" : "bg-destructive"
                        )} />
                        <span className="font-bold text-xs">
                            {isOpen ? "Abierta" : "Cerrada"}
                        </span>
                    </div>
                </div>

                <div className="bg-muted p-1 rounded-full flex shadow-inner">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={updating}
                        className={cn(
                            "rounded-full text-xs font-bold h-8 px-4 transition-all duration-300",
                            isOpen
                                ? "bg-white text-green-700 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:bg-white"
                                : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                        )}
                        onClick={() => handleToggle(true)}
                    >
                        Abierto
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={updating}
                        className={cn(
                            "rounded-full text-xs font-bold h-8 px-4 transition-all duration-300",
                            !isOpen
                                ? "bg-white text-destructive shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)] hover:bg-white"
                                : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                        )}
                        onClick={() => handleToggle(false)}
                    >
                        Cerrado
                    </Button>
                </div>
            </div>
        </div>
    );
}
