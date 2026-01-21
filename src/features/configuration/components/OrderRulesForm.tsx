"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Receipt, Save, Loader2, AlertCircle, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    selectConfiguration,
    selectConfigurationUpdating
} from "../redux/configurationSelectors";
import { updateConfigurationStart } from "../redux/configurationSlice";
import { OrderRulesConfig } from "../types/configuration.types";

const DEFAULT_RULES: OrderRulesConfig = {
    minOrderAmount: 0,
    minOrderMessage: "El monto mínimo de compra es de {amount}",
};

const DisplayField = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1.5 grayscale-[0.5] opacity-80">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            {label}
        </span>
        <p className="text-sm font-semibold text-foreground/90 min-h-[1.5rem] break-words">
            {value || "—"}
        </p>
    </div>
);

export function OrderRulesForm() {
    const dispatch = useDispatch();
    const config = useSelector(selectConfiguration);
    const updating = useSelector(selectConfigurationUpdating);


    const [isEditing, setIsEditing] = useState(false);
    const [rules, setRules] = useState<OrderRulesConfig>(DEFAULT_RULES);

    useEffect(() => {
        if (config?.orderRules) {
            setRules(config.orderRules);
        }
    }, [config]);

    const handleSave = () => {
        if (!config) return;

        dispatch(updateConfigurationStart({
            ...config,
            orderRules: rules
        }));
        setIsEditing(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Reglas de Pedido</h2>
                            <p className="text-sm text-muted-foreground">Establece condiciones mínimas para recibir un pedido.</p>
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
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="minAmount">Monto Mínimo de Pedido</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                        $
                                    </span>
                                    <Input
                                        id="minAmount"
                                        type="number"
                                        min="0"
                                        className="pl-8 text-lg font-bold"
                                        value={rules.minOrderAmount}
                                        onChange={(e) => setRules(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Los clientes no podrán realizar pedidos inferiores a este monto. Deja en 0 para desactivar.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="minMessage">Mensaje de Error Personalizado</Label>
                                <Textarea
                                    id="minMessage"
                                    placeholder="Ej: Lo sentimos, el pedido mínimo es de $20.000"
                                    className="min-h-[100px]"
                                    value={rules.minOrderMessage}
                                    onChange={(e) => setRules(prev => ({ ...prev, minOrderMessage: e.target.value }))}
                                />
                                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>
                                        Puedes usar <strong>{`{amount}`}</strong> en el mensaje y será reemplazado automáticamente por el monto mínimo formateado.
                                    </p>
                                </div>
                            </div>
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
                                        Guardar Reglas
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <DisplayField
                            label="Monto Mínimo de Pedido"
                            value={rules.minOrderAmount > 0 ? formatCurrency(rules.minOrderAmount) : "Sin mínimo"}
                        />
                        <DisplayField
                            label="Mensaje Personalizado"
                            value={rules.minOrderMessage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
