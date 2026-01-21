"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { selectConfiguration } from "../redux/configurationSelectors";
import { updateConfigurationStart, resetUpdateStatus } from "../redux/configurationSlice";
import { PaymentMethodsConfig } from "../types/configuration.types";

const paymentOptions = [
    { id: "nequi" as const, label: "Nequi", icon: "💳", color: "bg-purple-100 text-purple-700" },
    { id: "daviplata" as const, label: "Daviplata", icon: "💳", color: "bg-red-100 text-red-700" },
    { id: "cash" as const, label: "Efectivo", icon: "💵", color: "bg-green-100 text-green-700" },
    { id: "dataphone" as const, label: "Datafono", icon: "💳", color: "bg-blue-100 text-blue-700" },
];

const DisplayPaymentMethods = ({ methods }: { methods: PaymentMethodsConfig }) => {
    const activePaymentOptions = paymentOptions.filter(opt => methods[opt.id]);

    if (activePaymentOptions.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-4">
                No hay métodos de pago configurados
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {activePaymentOptions.map(option => (
                <div key={option.id} className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
                    <div className={`p-2 rounded-lg ${option.color}`}>
                        <span className="text-xl">{option.icon}</span>
                    </div>
                    <span className="text-sm font-semibold">{option.label}</span>
                </div>
            ))}
        </div>
    );
};

export function PaymentMethodsCard() {
    const dispatch = useDispatch();
    const toast = useToast();
    const config = useSelector(selectConfiguration);
    const updating = useSelector((state: any) => state.configuration.updating);
    const updateSuccess = useSelector((state: any) => state.configuration.updateSuccess);

    const [isEditing, setIsEditing] = useState(false);
    const [methods, setMethods] = useState({
        nequi: false,
        daviplata: false,
        cash: false,
        dataphone: false,
    });

    useEffect(() => {
        if (config?.paymentMethods) {
            setMethods(config.paymentMethods);
        }
    }, [config]);

    useEffect(() => {
        if (updateSuccess) {
            toast.vink("Métodos de pago actualizados", {
                description: "Los cambios se han guardado correctamente.",
            });
            dispatch(resetUpdateStatus());
        }
    }, [updateSuccess, toast, dispatch]);

    const handleToggle = (method: keyof typeof methods) => {
        setMethods(prev => ({
            ...prev,
            [method]: !prev[method],
        }));
    };

    const handleSave = () => {
        dispatch(updateConfigurationStart({
            paymentMethods: methods,
        }));
        setIsEditing(false);
    };

    return (
        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <CreditCard size={20} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Métodos de Pago</h2>
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
                    <p className="text-sm text-muted-foreground">
                        Selecciona los métodos de pago que aceptas en tu tienda. Los clientes solo verán las opciones activas.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {paymentOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleToggle(option.id)}
                                className={`
                                    flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all
                                    ${methods[option.id]
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-muted hover:border-primary/30"
                                    }
                                `}
                            >
                                <div className={`p-3 rounded-xl ${option.color}`}>
                                    <span className="text-2xl">{option.icon}</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-sm">{option.label}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {methods[option.id] ? "Activo" : "Inactivo"}
                                    </p>
                                </div>
                                <div className={`
                                    h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
                                    ${methods[option.id] ? "border-primary bg-primary" : "border-muted"}
                                `}>
                                    {methods[option.id] && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={updating}
                        className="w-full h-12 rounded-2xl font-bold"
                    >
                        {updating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Métodos de Pago"
                        )}
                    </Button>
                </>
            ) : (
                <DisplayPaymentMethods methods={methods} />
            )}
        </div>
    );
}
