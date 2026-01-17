"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, TextAreaField, PhoneField } from "@/components/atoms/Form";
import { Save, Loader2, Store, Palette, Upload, Image as ImageIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/useToast";
import { ThemeSelector } from "./ThemeSelector";
import {
    selectConfiguration,
    selectConfigurationLoading,
    selectConfigurationUpdating,
    selectConfigurationUpdateSuccess,
    selectConfigurationUpdateError
} from "../redux/configurationSelectors";
import {
    fetchConfigurationStart,
    updateConfigurationStart,
    resetUpdateStatus
} from "../redux/configurationSlice";
import { CommerceConfig, DEFAULT_THEME_CONFIG } from "../types/configuration.types";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre del comercio es obligatorio"),
    description: Yup.string(),
    email: Yup.string().email("Email inválido").required("El email es obligatorio"),
    phone: Yup.string(),
    address: Yup.string(),
    city: Yup.string(),
    theme: Yup.object().shape({
        primaryColor: Yup.string().required(),
    })
});

export function ConfigurationForm() {
    const dispatch = useDispatch();
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);

    const config = useSelector(selectConfiguration);
    const loading = useSelector(selectConfigurationLoading);
    const updating = useSelector(selectConfigurationUpdating);
    const updateSuccess = useSelector(selectConfigurationUpdateSuccess);
    const updateError = useSelector(selectConfigurationUpdateError);

    useEffect(() => {
        dispatch(fetchConfigurationStart());
    }, [dispatch]);

    useEffect(() => {
        if (updateSuccess) {
            toast.vink("Configuración guardada", {
                description: "Los cambios se han aplicado correctamente."
            });
            dispatch(resetUpdateStatus());
        }
    }, [updateSuccess, dispatch, toast]);

    useEffect(() => {
        if (updateError) {
            toast.error("Error al guardar", {
                description: updateError
            });
            dispatch(resetUpdateStatus());
        }
    }, [updateError, dispatch, toast]);

    useEffect(() => {
        if (config?.logoUrl) {
            setPreviewLogo(config.logoUrl);
        }
    }, [config]);

    const initialValues: CommerceConfig = config || {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        logoUrl: "",
        theme: DEFAULT_THEME_CONFIG
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreviewLogo(previewUrl);

            // In a real app, upload here or convert to base64
            // For now, we simulate setting the URL
            setFieldValue("logoUrl", previewUrl);
        }
    };

    const handleSubmit = (values: CommerceConfig) => {
        dispatch(updateConfigurationStart(values));
    };

    if (loading && !config) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, setFieldValue }) => (
                <Form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Commerce Info */}
                        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Store size={20} />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">Información del Comercio</h2>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Logo Upload */}
                                <div className="flex-shrink-0">
                                    <div
                                        className="w-32 h-32 rounded-2xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden relative group bg-muted/30"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {previewLogo ? (
                                            <img src={previewLogo} alt="Logo Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <div className="p-2 bg-background rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                    <Upload size={16} className="text-muted-foreground" />
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground">Subir Logo</span>
                                            </>
                                        )}
                                        {previewLogo && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ImageIcon className="text-white" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setFieldValue)}
                                    />
                                </div>

                                <div className="flex-1 w-full space-y-4">
                                    <TextField
                                        name="name"
                                        label="Nombre de la Tienda"
                                        placeholder="Ej: Mi Tienda Online"
                                        required
                                    />
                                    <TextAreaField
                                        name="description"
                                        label="Descripción"
                                        placeholder="Describe tu negocio..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <TextField
                                    name="email"
                                    label="Correo Electrónico"
                                    placeholder="contacto@mitienda.com"
                                    required
                                />
                                <PhoneField
                                    name="phone"
                                    label="Teléfono / WhatsApp"
                                    placeholder="+57 300 000 0000"
                                />
                                <TextField
                                    name="address"
                                    label="Dirección Física"
                                    placeholder="Calle 123 # 45 - 67"
                                />
                                <TextField
                                    name="city"
                                    label="Ciudad"
                                    placeholder="Bogotá, Colombia"
                                />
                            </div>
                        </div>

                        {/* Theme Settings */}
                        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Palette size={20} />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">Apariencia y Tema</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Color Principal
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Selecciona el color que identificará tu marca en toda la aplicación.
                                </p>
                                <ThemeSelector
                                    value={values.theme.primaryColor}
                                    onChange={(color) => setFieldValue("theme.primaryColor", color)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="space-y-6">
                        <div className="sticky top-24 rounded-[32px] border bg-card p-8 shadow-sm space-y-4 bg-primary/5 border-primary/10">
                            <h3 className="text-lg font-bold tracking-tight mb-2">Publicar Cambios</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Guarda la configuración para actualizar la apariencia y los datos de tu comercio instantáneamente.
                            </p>

                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Guardar Configuración
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
