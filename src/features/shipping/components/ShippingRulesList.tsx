"use client";

import React from "react";
import { ShippingRule } from "../types/shipping.types";
import { Edit2, Trash2, Truck, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ShippingRulesListProps {
    rules: ShippingRule[];
    onEdit: (rule: ShippingRule) => void;
    onDelete: (ruleId: string) => void;
}

export function ShippingRulesList({ rules, onEdit, onDelete }: ShippingRulesListProps) {
    if (rules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-muted-foreground bg-muted/10 rounded-3xl border border-dashed">
                <Truck className="h-10 w-10 mb-2 opacity-20" />
                <p>No hay reglas de envío configuradas.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {rules.map((rule) => (
                <div key={rule.id} className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className={`p-2 rounded-lg ${rule.type === 'city' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                <MapPin size={18} />
                            </span>
                            <div>
                                <h3 className="font-bold text-lg leading-none">{rule.value}</h3>
                                <span className="text-xs text-muted-foreground capitalize">{rule.type === 'department' ? 'Departamento' : 'Ciudad'}</span>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(rule)}>
                                <Edit2 size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(rule.id)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flexjustify-between items-center py-1 border-t border-dashed pt-2">
                            <div className="text-2xl font-black text-foreground">
                                ${rule.cost.toLocaleString()}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={14} />
                            <span>{rule.deliveryDays.min} - {rule.deliveryDays.max} días hábiles</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {rule.allowCOD ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle size={12} className="mr-1" /> COD Habilitado
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-none dark:bg-red-900/30 dark:text-red-400">
                                    <XCircle size={12} className="mr-1" /> Sin Contraentrega
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
