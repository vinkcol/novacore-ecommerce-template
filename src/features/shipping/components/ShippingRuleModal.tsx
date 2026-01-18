"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, NumberField, SelectField, CheckboxField } from "@/components/atoms/Form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShippingRule } from "../types/shipping.types";
import colombiaData from "@/data/colombia.location.json";
import { Loader2, Save } from "lucide-react";

interface ShippingRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: Partial<ShippingRule>) => void;
    initialValues?: Partial<ShippingRule>;
    isEditing: boolean;
}

const ruleSchema = Yup.object().shape({
    type: Yup.string().required("Tipo es requerido").oneOf(['city', 'department']),
    value: Yup.string().required("Ubicación es requerida"),
    cost: Yup.number().min(0).required("Costo es requerido"),
    deliveryDays: Yup.object({
        min: Yup.number().min(0).required(),
        max: Yup.number().min(0).required()
    }),
    allowCOD: Yup.boolean()
});

export function ShippingRuleModal({
    isOpen,
    onClose,
    onSubmit,
    initialValues,
    isEditing
}: ShippingRuleModalProps) {
    // Determine departments options
    const departmentOptions = colombiaData.map(dep => ({
        label: dep.departamento,
        value: dep.departamento
    }));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-3xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Regla" : "Nueva Regla de Envío"}</DialogTitle>
                </DialogHeader>

                <Formik
                    initialValues={{
                        type: initialValues?.type || 'city', // Default to City usually
                        value: initialValues?.value || '',
                        cost: initialValues?.cost || 0,
                        deliveryDays: {
                            min: initialValues?.deliveryDays?.min || 2,
                            max: initialValues?.deliveryDays?.max || 5
                        },
                        allowCOD: initialValues?.allowCOD !== undefined ? initialValues.allowCOD : true
                    }}
                    validationSchema={ruleSchema}
                    onSubmit={(values) => {
                        onSubmit(values as unknown as Partial<ShippingRule>);
                        onClose();
                    }}
                    enableReinitialize
                >
                    {({ values, setFieldValue }) => {
                        // Cascading logic for Cities
                        const selectedDep = colombiaData.find(d =>
                            values.type === 'city' && d.ciudades.includes(values.value)
                        ) || (values.type === 'city' ? colombiaData[0] : null); // Fallback or handle better?

                        // Actually, better UI: Select Dep FIRST, then City.
                        // But data structure is plain: type + value.

                        // Refined UI Logic:
                        // If Type == Department: Show Department Select.
                        // If Type == City: Show Department Select (filtered out from payload?) AND City Select? OR just City Select with Grouped options?
                        // Let's go with Department + City selectors helper state.

                        return (
                            <Form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectField
                                        name="type"
                                        label="Tipo de Regla"
                                        options={[
                                            { label: "Departamento", value: "department" },
                                            { label: "Ciudad", value: "city" }
                                        ]}
                                    />

                                    <NumberField
                                        name="cost"
                                        label="Costo de Envío"
                                    />
                                </div>

                                {/* Dynamic Location Selector */}
                                {values.type === 'department' ? (
                                    <SelectField
                                        name="value"
                                        label="Departamento"
                                        placeholder="Selecciona departamento"
                                        options={departmentOptions}

                                    />
                                ) : (
                                    // For City, usually we want to filter by Department first for UX
                                    <CitySelector
                                        value={values.value}
                                        onChange={(val) => setFieldValue('value', val)}
                                    />
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <NumberField
                                        name="deliveryDays.min"
                                        label="Días Mínimos"
                                    />
                                    <NumberField
                                        name="deliveryDays.max"
                                        label="Días Máximos"
                                    />
                                </div>

                                <CheckboxField
                                    name="allowCOD"
                                    label="Permitir Pago Contraentrega"
                                />

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="rounded-xl">
                                        {isEditing ? "Guardar Cambios" : "Crear Regla"}
                                    </Button>
                                </DialogFooter>
                            </Form>
                        );
                    }}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}

// Helper component for City selection with Department filter
function CitySelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [selectedDep, setSelectedDep] = useState<string>("");

    // Initialize department based on existing city value
    useEffect(() => {
        if (value && !selectedDep) {
            const foundDep = colombiaData.find(d => d.ciudades.includes(value));
            if (foundDep) setSelectedDep(foundDep.departamento);
        }
    }, [value, selectedDep]);

    const depOptions = colombiaData.map(d => ({ label: d.departamento, value: d.departamento }));
    const cityOptions = selectedDep
        ? (colombiaData.find(d => d.departamento === selectedDep)?.ciudades.map(c => ({ label: c, value: c })) || [])
        : [];

    return (
        <div className="space-y-3 p-3 bg-muted/20 rounded-xl border border-dashed">
            <div className="text-xs font-semibold uppercase text-muted-foreground">Ubicación</div>
            <select
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                value={selectedDep}
                onChange={(e) => {
                    setSelectedDep(e.target.value);
                    onChange(""); // Reset city when dep changes
                }}
            >
                <option value="">Selecciona Departamento...</option>
                {depOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            <select
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!selectedDep}
            >
                <option value="">Selecciona Ciudad...</option>
                {cityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {/* Note: In a real app we would use our custom SelectField, but standard select is fine for this composite logic for speed. */}
        </div>
    );
}
