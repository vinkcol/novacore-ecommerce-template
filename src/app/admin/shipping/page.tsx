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
import { ConfirmationModal } from "@/components/molecules/ConfirmationModal";

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

    const handleCreateRule = (rules: Partial<ShippingRule>[]) => {
        if (!config) return;

        const newRules: ShippingRule[] = rules.map(val => ({
            id: uuidv4(),
            type: val.type || 'city',
            value: val.value || '',
            cost: Number(val.cost),
            deliveryDays: val.deliveryDays || { min: 2, max: 5 },
            allowCOD: val.allowCOD !== undefined ? val.allowCOD : true,
            isActive: true
        }));

        // Filter out duplicates based on value if desired, or just append.
        // For now, we append. Backend should handle validation if needed.

        const updatedConfig = {
            ...config,
            rules: [...config.rules, ...newRules]
        };

        dispatch(updateShippingConfigStart(updatedConfig));
    };

    const handleUpdateRule = (rules: Partial<ShippingRule>[]) => {
        if (!config || !editingRule || rules.length === 0) return;
        // In edit mode we technically only edit one rule at a time via the list,
        // but the modal now returns an array.
        // If we are editing a single rule, rules[0] contains the data.
        // However, if the user selected multiple locations in Edit mode (if logic allowed), we'd have issues.
        // Assuming we force "Single Edit" logic:

        const updatedValues = rules[0];

        const updatedRules = config.rules.map(rule =>
            rule.id === editingRule.id
                ? { ...rule, ...updatedValues, id: rule.id } as ShippingRule
                : rule
        );

        dispatch(updateShippingConfigStart({
            ...config,
            rules: updatedRules
        }));
        setEditingRule(null);
    };

    const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);

    const handleDeleteRule = (ruleId: string) => {
        setDeleteRuleId(ruleId);
    };

    const confirmDeleteRule = () => {
        if (!config || !deleteRuleId) return;

        const updatedRules = config.rules.filter(r => r.id !== deleteRuleId);
        dispatch(updateShippingConfigStart({
            ...config,
            rules: updatedRules
        }));
        setDeleteRuleId(null);
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
                    unavailableLocations={config?.rules.map(r => ({ type: r.type, value: r.value })) || []}
                />

                <ConfirmationModal
                    isOpen={!!deleteRuleId}
                    onClose={() => setDeleteRuleId(null)}
                    onConfirm={confirmDeleteRule}
                    title="¿Eliminar regla de envío?"
                    description="Esta acción eliminará permanentemente esta regla de envío. No se puede deshacer."
                    confirmText="Eliminar Regla"
                    variant="destructive"
                />
            </div>
        </AdminLayout>
    );
}
