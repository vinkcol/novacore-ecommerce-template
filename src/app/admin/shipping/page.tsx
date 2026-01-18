"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Truck, Loader2 } from "lucide-react";
import { fetchShippingConfigStart, updateShippingConfigStart, resetShippingStatus } from "@/features/shipping/redux/shippingSlice";
import { selectShippingConfig, selectShippingLoading, selectShippingUpdateSuccess } from "@/features/shipping/redux/shippingSelectors";
import { ShippingRulesList } from "@/features/shipping/components/ShippingRulesList";
import { ShippingRuleModal } from "@/features/shipping/components/ShippingRuleModal";
import { ShippingRule } from "@/features/shipping/types/shipping.types";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";

export default function ShippingPage() {
    const dispatch = useDispatch();
    const config = useSelector(selectShippingConfig);
    const loading = useSelector(selectShippingLoading);
    const updateSuccess = useSelector(selectShippingUpdateSuccess);
    const toast = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<ShippingRule | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchShippingConfigStart());
    }, [dispatch]);

    useEffect(() => {
        if (updateSuccess) {
            toast.success("Configuración actualizada correctamente");
            dispatch(resetShippingStatus());
        }
    }, [updateSuccess, dispatch, toast]);

    const handleCreateRule = (values: Partial<ShippingRule>) => {
        if (!config) return;

        const newRule: ShippingRule = {
            id: uuidv4(),
            type: values.type || 'city',
            value: values.value || '',
            cost: Number(values.cost),
            deliveryDays: values.deliveryDays || { min: 2, max: 5 },
            allowCOD: values.allowCOD !== undefined ? values.allowCOD : true,
            isActive: true
        };

        const updatedConfig = {
            ...config,
            rules: [...config.rules, newRule]
        };

        dispatch(updateShippingConfigStart(updatedConfig));
    };

    const handleUpdateRule = (values: Partial<ShippingRule>) => {
        if (!config || !editingRule) return;

        const updatedRules = config.rules.map(rule =>
            rule.id === editingRule.id
                ? { ...rule, ...values } as ShippingRule
                : rule
        );

        dispatch(updateShippingConfigStart({
            ...config,
            rules: updatedRules
        }));
        setEditingRule(null);
    };

    const handleDeleteRule = (ruleId: string) => {
        if (!config) return;
        if (!confirm("¿Estás seguro de eliminar esta regla?")) return;

        const updatedRules = config.rules.filter(r => r.id !== ruleId);
        dispatch(updateShippingConfigStart({
            ...config,
            rules: updatedRules
        }));
    };

    const filteredRules = config?.rules.filter(rule =>
        rule.value.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <AdminLayout title="Gestión de Envíos">
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-3xl border shadow-sm">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar ciudad o departamento..."
                            className="pl-9 rounded-xl border-0 bg-secondary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setEditingRule(null);
                            setIsModalOpen(true);
                        }}
                        className="rounded-xl shadow-lg shadow-primary/20"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nueva Regla
                    </Button>
                </div>

                {loading && !config ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ShippingRulesList
                        rules={filteredRules}
                        onEdit={(rule) => {
                            setEditingRule(rule);
                            setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteRule}
                    />
                )}

                <ShippingRuleModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingRule(null);
                    }}
                    onSubmit={editingRule ? handleUpdateRule : handleCreateRule}
                    isEditing={!!editingRule}
                    initialValues={editingRule || undefined}
                />
            </div>
        </AdminLayout>
    );
}
