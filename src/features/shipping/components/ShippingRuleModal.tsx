"use client";

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { NumberField, CheckboxField } from "@/components/atoms/Form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShippingRule } from "../types/shipping.types";
import { LocationTreeSelector, SelectedLocation } from "./LocationTreeSelector";

interface ShippingRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: Partial<ShippingRule>[]) => void;
    initialValues?: Partial<ShippingRule>;
    isEditing: boolean;
}

const ruleSchema = Yup.object().shape({
    locations: Yup.array().min(1, "Debes seleccionar al menos una ubicación"),
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
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl rounded-3xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>{isEditing ? "Editar Regla" : "Nueva Regla de Envío"}</DialogTitle>
                </DialogHeader>

                <Formik
                    initialValues={{
                        locations: initialValues ? [{ type: initialValues.type!, value: initialValues.value! } as SelectedLocation] : [],
                        cost: initialValues?.cost || 0,
                        deliveryDays: {
                            min: initialValues?.deliveryDays?.min || 2,
                            max: initialValues?.deliveryDays?.max || 5
                        },
                        allowCOD: initialValues?.allowCOD !== undefined ? initialValues.allowCOD : true
                    }}
                    validationSchema={ruleSchema}
                    onSubmit={(values) => {
                        const rules: Partial<ShippingRule>[] = values.locations.map(loc => ({
                            type: loc.type,
                            value: loc.value,
                            cost: values.cost,
                            deliveryDays: values.deliveryDays,
                            allowCOD: values.allowCOD
                        }));
                        onSubmit(rules);
                        onClose();
                    }}
                    enableReinitialize
                >
                    {({ values, setFieldValue, errors, touched }) => (
                        <Form className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            {/* Left: Location Tree (Scrollable) */}
                            <div className="flex-1 border-r bg-muted/10 p-4 overflow-y-auto">
                                <label className="text-sm font-semibold mb-2 block">
                                    Seleccionar Ubicaciones
                                    {touched.locations && errors.locations && (
                                        <span className="text-xs text-destructive ml-2 font-normal animate-pulse">
                                            {String(errors.locations)}
                                        </span>
                                    )}
                                </label>
                                <LocationTreeSelector
                                    selected={values.locations}
                                    onChange={(selected) => setFieldValue("locations", selected)}
                                />
                            </div>

                            {/* Right: Settings (Fixed) */}
                            <div className="w-full md:w-80 p-6 flex flex-col gap-6 bg-background overflow-y-auto">
                                <div>
                                    <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Configuración de Envío</h3>

                                    <div className="space-y-4">
                                        <NumberField
                                            name="cost"
                                            label="Costo de Envío"
                                            placeholder="0"
                                            className="text-lg font-bold"
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <NumberField
                                                name="deliveryDays.min"
                                                label="Mínimo de Días"
                                            />
                                            <NumberField
                                                name="deliveryDays.max"
                                                label="Máximo de Días"
                                            />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <CheckboxField
                                                name="allowCOD"
                                                label="Habilitar Pago Contraentrega"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6">
                                    <div className="flex gap-3">
                                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
                                            Cancelar
                                        </Button>
                                        <Button type="submit" className="flex-1 rounded-xl">
                                            {isEditing ? "Guardar" : "Crear Reglas"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}
