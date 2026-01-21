import React, { useEffect, useMemo, useState } from "react";

import { Formik, Form, useFormikContext } from "formik";
import { User, MapPin, Mail, MessageCircle, AlertCircle, DollarSign } from "lucide-react";

import { TextField, PhoneField, SelectField, CurrencyField } from "@/components/atoms/Form";

import { checkoutValidationSchema, initialCheckoutValues, CheckoutFormValues } from "../checkout.schema";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { submitOrderRequest } from "../redux/checkoutSaga";
import locationData from "@/data/colombia.location.json";
import bogotaLocalities from "@/data/bogota.localities.json";
import { selectConfiguration } from "@/features/configuration/redux/configurationSelectors";
import { selectCartTotals } from "@/features/cart/redux/cartSelectors";
import { Price } from "@/components/atoms/Price";



interface CheckoutFormProps {
    onSubmitSuccess?: () => void;
}

// Extract departments and sort them
const departments = locationData.map(d => ({
    label: d.departamento,
    value: d.departamento
})).sort((a, b) => a.label.localeCompare(b.label));

// Bogota localities options
const bogotaLocalitiesOptions = bogotaLocalities.map(l => ({
    label: l.localidad,
    value: l.localidad
})).sort((a, b) => a.label.localeCompare(b.label));



// Payment Method Selector Component
const PaymentMethodSelector = () => {
    const config = useAppSelector(selectConfiguration);
    const totals = useAppSelector(selectCartTotals);
    const { values, setFieldValue, setFieldError } = useFormikContext<CheckoutFormValues>();

    const isAmountInsufficient = useMemo(() => {
        if (values.paymentMethod === 'cash' && values.cashAmount) {
            return Number(values.cashAmount) < totals.total;
        }
        return false;
    }, [values.paymentMethod, values.cashAmount, totals.total]);

    // Update Formik error if insufficient
    useEffect(() => {
        if (isAmountInsufficient) {
            setFieldError('cashAmount', `El monto debe ser al menos ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totals.total)}`);
        }
    }, [isAmountInsufficient, setFieldError, totals.total]);


    const availableMethods = useMemo(() => {
        const methods = [];
        if (config?.paymentMethods?.nequi) methods.push({ id: 'nequi', label: 'Nequi', icon: '💳', color: 'bg-purple-100 text-purple-700' });
        if (config?.paymentMethods?.daviplata) methods.push({ id: 'daviplata', label: 'Daviplata', icon: '💳', color: 'bg-red-100 text-red-700' });
        if (config?.paymentMethods?.cash) methods.push({ id: 'cash', label: 'Efectivo', icon: '💵', color: 'bg-green-100 text-green-700' });
        if (config?.paymentMethods?.dataphone) methods.push({ id: 'dataphone', label: 'Datafono', icon: '💳', color: 'bg-blue-100 text-blue-700' });
        return methods;
    }, [config]);

    if (availableMethods.length === 0) {
        return (
            <div className="text-center text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl">
                No hay métodos de pago disponibles. Contacta al administrador.
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">Método de Pago</h3>
            <div className="grid grid-cols-2 gap-3">
                {availableMethods.map(method => (
                    <button
                        key={method.id}
                        type="button"
                        onClick={() => setFieldValue('paymentMethod', method.id)}
                        className={`
                            flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                            ${values.paymentMethod === method.id
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-muted hover:border-primary/30"
                            }
                        `}
                    >
                        <div className={`p-2 rounded-lg ${method.color}`}>
                            <span className="text-xl">{method.icon}</span>
                        </div>
                        <span className="text-sm font-semibold">{method.label}</span>
                        <div className={`
                            h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all
                            ${values.paymentMethod === method.id ? "border-primary bg-primary" : "border-muted"}
                        `}>
                            {values.paymentMethod === method.id && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {values.paymentMethod === 'cash' && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CurrencyField
                        name="cashAmount"
                        label="¿Con cuánto vas a pagar?"
                        placeholder="Ej: 50.000"
                        icon={DollarSign}
                        required
                    />
                    {isAmountInsufficient ? (
                        <p className="text-[10px] text-destructive font-semibold mt-1 px-1">
                            El valor ingresado es menor al total del pedido ({new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totals.total)}).
                        </p>
                    ) : (
                        <p className="text-[10px] text-muted-foreground mt-1 px-1">
                            Ingresa el valor para prepararte el cambio.
                        </p>
                    )}
                </div>
            )}

        </div>

    );
};


// Form Persistence Component
const FormPersistence = () => {
    const { values, setValues } = useFormikContext<CheckoutFormValues>();
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem("checkout_form_data");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Merge saved data with initial structure to ensure new fields (like cashAmount) are handled correctly
                // We exclude paymentMethod and cashAmount from persistence if desired, or keep them.
                // User said "datos de envio" mostly, but preserving payment info is usually fine too.
                // Let's preserve everything except maybe transient states if any.
                setValues((prev) => ({ ...prev, ...parsedData }));
            } catch (e) {
                console.error("Failed to load checkout data", e);
            }
        }
        setIsLoaded(true);
    }, [setValues]);

    // Save to LocalStorage on change (debounced could be better but simple stringify is fast enough for this size)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("checkout_form_data", JSON.stringify(values));
        }
    }, [values, isLoaded]);

    return null;
};


const LocationFields = () => {
    const { values, setFieldValue } = useFormikContext<CheckoutFormValues>();

    const isBogota = useMemo(() =>
        values.city?.toLowerCase() === "bogota" || values.city?.toLowerCase() === "bogotá",
        [values.city]
    );

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

    // Clear locality if city is no longer Bogota
    useEffect(() => {
        if (!isBogota && values.locality) {
            setFieldValue('locality', '');
        }
    }, [isBogota, values.locality, setFieldValue]);

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

            {isBogota && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <SelectField
                        name="locality"
                        label="Localidad"
                        options={bogotaLocalitiesOptions}
                        placeholder="Selecciona tu localidad..."
                        required
                    />
                </div>
            )}
        </div>
    );
};

export function CheckoutForm({ }: CheckoutFormProps) {
    const dispatch = useAppDispatch();


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
                        <FormPersistence />



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

                        <PaymentMethodSelector />

                    </Form>

                )
            }}
        </Formik>
    );
}
