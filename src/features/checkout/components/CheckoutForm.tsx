import React, { useEffect, useMemo } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { User, MapPin, Mail, MessageCircle, Truck, AlertCircle } from "lucide-react";
import { TextField, PhoneField, SelectField, CheckboxField } from "@/components/atoms/Form";
import { checkoutValidationSchema, initialCheckoutValues, CheckoutFormValues } from "../checkout.schema";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { submitOrderRequest } from "../redux/checkoutSaga";
import locationData from "@/data/colombia.location.json";
import shippingRules from "@/data/shipping-coverage.json";
import { setShippingCost, setShippingLabel, setShippingPromise, setIsCODAvailable } from "../redux/checkoutSlice";
import { Price } from "@/components/atoms/Price";

interface CheckoutFormProps {
    onSubmitSuccess?: () => void;
}

// Extract departments and sort them
const departments = locationData.map(d => ({
    label: d.departamento,
    value: d.departamento
})).sort((a, b) => a.label.localeCompare(b.label));

// Shipping Logic Handler Component
const ShippingLogicHandler = () => {
    const { values, setFieldValue } = useFormikContext<CheckoutFormValues>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Clear shipping cost if location is incomplete
        if (!values.city || !values.department) {
            dispatch(setShippingCost(null));
            dispatch(setShippingLabel(null));
            dispatch(setShippingPromise(null));
            dispatch(setIsCODAvailable(true)); // Reset to true
            return;
        }

        // Calculate Shipping Cost & COD Availability
        let cost = shippingRules.default.cost;
        let label = shippingRules.default.label;
        let promise = shippingRules.default.deliveryDays;
        let allowCOD = shippingRules.default.allowCOD;

        // Check rules
        console.log("DEBUG: Checking location:", values.city, values.department);
        console.log("DEBUG: Default allowCOD:", shippingRules.default.allowCOD);

        for (const rule of shippingRules.rules) {
            // Rule 1: Specific City
            if (rule.type === "city" && rule.values.includes(values.city)) {
                console.log("DEBUG: Matched City Rule:", rule);
                cost = rule.cost;
                label = rule.label;
                if (rule.deliveryDays) promise = rule.deliveryDays;
                if (rule.allowCOD !== undefined) allowCOD = rule.allowCOD;
                break;
            }
            // Rule 2: Department (excluding specific cities)
            if (rule.type === "department" &&
                values.department &&
                rule.values.includes(values.department) &&
                (!rule.excludeCities || !rule.excludeCities.includes(values.city))
            ) {
                console.log("DEBUG: Matched Dept Rule:", rule);
                cost = rule.cost;
                label = rule.label;
                if (rule.deliveryDays) promise = rule.deliveryDays;
                if (rule.allowCOD !== undefined) allowCOD = rule.allowCOD;
                break;
            }
        }

        console.log("DEBUG: Final allowCOD Result:", allowCOD);

        dispatch(setShippingCost(cost));
        dispatch(setShippingLabel(label));
        dispatch(setShippingPromise(promise));
        dispatch(setIsCODAvailable(allowCOD ?? false));

        // If COD is not allowed, uncheck the commitment checkbox
        if (!allowCOD) {
            setFieldValue("commitment", false);
        }

    }, [values.city, values.department, dispatch, setFieldValue]);

    return null;
};

// Utility to calculate delivery date text
const getDeliveryPromiseText = (min: number, max: number) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/Bogota'
    };

    // Helper to add days
    const addDays = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    };

    const minDate = addDays(min);
    const maxDate = addDays(max);
    const formatter = new Intl.DateTimeFormat('es-CO', options);

    // Capitalize first letter helper
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    if (min === 1 && max === 1) {
        return `Llega mañana, ${capitalize(formatter.format(minDate))}`;
    }

    if (min === max) {
        return `Llega el ${capitalize(formatter.format(minDate))}`;
    }

    // Range
    return `Llega entre el ${capitalize(formatter.format(minDate))} y el ${capitalize(formatter.format(maxDate))}`;
};

// Shipping Display Component
const ShippingDisplay = () => {
    const { shippingCost, shippingLabel, shippingPromise, isCODAvailable } = useAppSelector(state => state.checkout);

    if (shippingCost === null) return null;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">Método de envío calculado</h3>
            <div className="flex items-center justify-between rounded-xl border-2 border-primary bg-primary/5 p-4 transition-all">
                <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm leading-tight">{shippingLabel}</span>

                        {shippingPromise && (
                            <span className="text-xs font-medium text-green-600 flex items-center gap-1 mt-0.5">
                                <Truck className="h-3 w-3" />
                                {getDeliveryPromiseText(shippingPromise.min, shippingPromise.max)}
                            </span>
                        )}

                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-1">
                            {isCODAvailable ? "Contraentrega disponible" : "Solo pago anticipado"}
                        </span>
                    </div>
                </div>
                {shippingCost === 0 ? (
                    <span className="text-sm font-bold uppercase tracking-tighter text-green-600">Gratis</span>
                ) : (
                    <Price amount={shippingCost} className="text-sm font-bold text-primary" />
                )}
            </div>
        </div>
    );
};

const LocationFields = () => {
    const { values, setFieldValue } = useFormikContext<CheckoutFormValues>();

    // Filter cities based on selected department using React.useMemo
    const cityOptions = useMemo(() => {
        if (!values.department) return [];
        const deptData = locationData.find(d => d.departamento === values.department);
        return deptData
            ? deptData.ciudades.map(c => ({ label: c, value: c })).sort((a, b) => a.label.localeCompare(b.label))
            : [];
    }, [values.department]);

    // Effect to clear city when department changes
    useEffect(() => {
        if (values.department && values.city) {
            const deptData = locationData.find(d => d.departamento === values.department);
            if (deptData && !deptData.ciudades.includes(values.city)) {
                setFieldValue('city', '');
            }
        }
    }, [values.department, values.city, setFieldValue]);

    return (
        <div className="space-y-4">
            <SelectField
                name="department"
                label="Departamento"
                options={departments}
                placeholder="Selecciona tu departamento..."
                required
            />

            <SelectField
                name="city"
                label="Ciudad / Municipio"
                options={cityOptions}
                placeholder="Selecciona tu ciudad..."
                disabled={!values.department}
                required
            />
        </div>
    );
};

export function CheckoutForm({ }: CheckoutFormProps) {
    const dispatch = useAppDispatch();
    const { isCODAvailable } = useAppSelector(state => state.checkout);

    const handleSubmit = (values: CheckoutFormValues) => {
        dispatch(submitOrderRequest(values));
    };

    return (
        <Formik
            initialValues={initialCheckoutValues}
            validationSchema={checkoutValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ values }) => {
                return (
                    <Form id="checkout-form" className="space-y-6">
                        <ShippingLogicHandler />

                        <div className="space-y-4">
                            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">Datos personales</h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <TextField
                                    name="firstName"
                                    label="Nombre"
                                    placeholder="Ej: Daniel"
                                    icon={User}
                                    required
                                />
                                <TextField
                                    name="lastName"
                                    label="Apellido"
                                    placeholder="Ej: Gonzalez"
                                    icon={User}
                                    required
                                />
                            </div>

                            <PhoneField
                                name="whatsapp"
                                label="WhatsApp"
                                placeholder="Número para coordinar entrega"
                                icon={MessageCircle}
                                required
                            />

                            <PhoneField
                                name="backupPhone"
                                label="Número de respaldo (Opcional)"
                            />

                            <TextField
                                name="email"
                                label="Correo electrónico"
                                type="email"
                                icon={Mail}
                                placeholder="Para enviar tu factura"
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">Dirección de entrega</h3>

                            <LocationFields />

                            <TextField
                                name="address"
                                label="Dirección exacta"
                                placeholder="Ej: Calle 127 # 44-21 apto 301"
                                icon={MapPin}
                                required
                            />

                            <TextField
                                name="landmark"
                                label="Punto de referencia"
                                placeholder="Ej: Frente al parque principal / Portón rojo"
                                icon={MapPin}
                                required
                            />
                        </div>

                        <ShippingDisplay />

                        <div className="space-y-3">
                            {isCODAvailable ? (
                                <CheckboxField
                                    name="commitment"
                                    label="Me comprometo a pagar al recibir el pedido cuando llegue a casa"
                                    required
                                />
                            ) : (
                                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex gap-3 text-yellow-900">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-semibold">Pago contraentrega no disponible</p>
                                        <p className="mt-1 text-yellow-800/80">
                                            Lo sentimos, para la ubicación seleccionada ({values.city}) solo aceptamos pagos anticipados. Por favor contacta soporte para continuar.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                                <CheckboxField
                                    name="priorityShipping"
                                    label={
                                        <span className="text-sm font-medium text-blue-900">
                                            Agrega envío prioritario ✅ por solo $3.99
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );
}
