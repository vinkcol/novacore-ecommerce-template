"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, TextAreaField, PhoneField, SelectField } from "@/components/atoms/Form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Save, Loader2, Store, Palette, Facebook, Instagram, Twitter, Linkedin, Share2, Settings2, Pencil, X, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
import locations from "@/data/colombia.location.json";
import localities from "@/data/bogota.localities.json";
import { uploadImage } from "@/lib/cloudinary/upload";

import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/useToast";
import { ThemeSelector } from "./ThemeSelector";
import { EditableLogo } from "./EditableLogo";
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

const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false });


const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre del comercio es obligatorio"),
    description: Yup.string(),
    email: Yup.string().email("Email inválido").required("El email es obligatorio"),
    phone: Yup.string(),
    address: Yup.string(),
    city: Yup.string(),
    social: Yup.object().shape({
        facebook: Yup.string().url("URL inválida"),
        instagram: Yup.string().url("URL inválida"),
        twitter: Yup.string().url("URL inválida"),
        linkedin: Yup.string().url("URL inválida"),
    }),
    theme: Yup.object().shape({
        primaryColor: Yup.string().required(),
    }),
    currency: Yup.string(),
    timezone: Yup.string(),
    location: Yup.object().shape({
        department: Yup.string(),
        city: Yup.string(),
        locality: Yup.string(),
        neighborhood: Yup.string(),
        lat: Yup.number(),
        lng: Yup.number()
    })
});

export function ConfigurationForm() {
    const dispatch = useDispatch();
    const toast = useToast();

    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const config = useSelector(selectConfiguration);
    const loading = useSelector(selectConfigurationLoading);
    const updating = useSelector(selectConfigurationUpdating);
    const updateSuccess = useSelector(selectConfigurationUpdateSuccess);
    const updateError = useSelector(selectConfigurationUpdateError);

    const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});

    const toggleEditing = (section: string) => {
        setEditingSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const DisplayField = ({ label, value }: { label: string, value?: string }) => (
        <div className="space-y-1.5 grayscale-[0.5] opacity-80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{label}</span>
            <p className="text-sm font-semibold text-foreground/90 min-h-[1.5rem] break-words">{value || "—"}</p>
        </div>
    );

    useEffect(() => {
        dispatch(fetchConfigurationStart());
    }, [dispatch]);

    useEffect(() => {
        if (updateSuccess) {
            toast.vink("Configuración guardada", {
                description: "Los cambios se han aplicado correctamente."
            });
            setEditingSections({}); // Close all edit modes on success
            setLogoFile(null); // Clear pending file
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
        // Only set preview from config if we are NOT currently holding a pending file
        if (config?.logoUrl && !logoFile) {
            setPreviewLogo(config.logoUrl);
        }
    }, [config, logoFile]);

    const initialValues: CommerceConfig = {
        name: config?.name || "",
        description: config?.description || "",
        email: config?.email || "",
        phone: config?.phone || "",
        address: config?.address || "",
        city: config?.city || "",
        logoUrl: config?.logoUrl || "",
        social: {
            facebook: config?.social?.facebook || "",
            instagram: config?.social?.instagram || "",
            twitter: config?.social?.twitter || "",
            linkedin: config?.social?.linkedin || "",
        },
        theme: config?.theme || DEFAULT_THEME_CONFIG,
        isOpen: config?.isOpen ?? true,
        currency: config?.currency || "COP",
        timezone: config?.timezone || "America/Bogota",
        location: {
            department: config?.location?.department || "",
            city: config?.location?.city || "",
            locality: config?.location?.locality || "",
            neighborhood: config?.location?.neighborhood || "",
            lat: config?.location?.lat || 4.6097,
            lng: config?.location?.lng || -74.0817
        }
    };



    const handleSubmit = async (values: CommerceConfig) => {
        const finalValues = { ...values };

        if (logoFile) {
            try {
                // Determine path or filename logic if needed, but 'store-logos' is good
                const downloadUrl = await uploadImage(logoFile, 'store-logos');
                finalValues.logoUrl = downloadUrl;
            } catch (error) {
                console.error("Upload failed", error);
                toast.error("Error al subir el logo", {
                    description: "No se pudo guardar la imagen. Intenta de nuevo."
                });
                return; // Stop submission
            }
        }

        dispatch(updateConfigurationStart(finalValues));
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
            enableReinitialize={!logoFile} // Stop reinitializing if we have a pending file to avoid resetting the preview/form
        >
            {({ values, setFieldValue }) => (
                <Form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Commerce Info */}
                        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6 relative group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Store size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Información del Comercio</h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleEditing('info')}
                                    className={cn(
                                        "rounded-xl gap-2",
                                        editingSections['info'] ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"
                                    )}
                                >
                                    {editingSections['info'] ? <><X size={16} /> Cancelar</> : <><Pencil size={16} /> Editar</>}
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Logo Upload */}
                                <div className="flex-shrink-0">
                                    <EditableLogo
                                        currentLogoUrl={previewLogo}
                                        isEditing={!!editingSections['info']}
                                        storeName={values.name}
                                        onLogoChange={(file) => {
                                            const previewUrl = URL.createObjectURL(file);
                                            setPreviewLogo(previewUrl);
                                            setLogoFile(file);
                                            // We keep logoUrl in form values as the blob url just so it's not empty, 
                                            // but we will override it in handleSubmit
                                            setFieldValue("logoUrl", previewUrl);
                                        }}
                                        onDelete={() => {
                                            setPreviewLogo(null);
                                            setLogoFile(null);
                                            setFieldValue("logoUrl", "");
                                        }}
                                    />
                                </div>

                                <div className="flex-1 w-full space-y-4">
                                    {editingSections['info'] ? (
                                        <>
                                            <TextField
                                                name="name"
                                                label="Nombre de la Tienda"
                                                placeholder="Ej: Restaurante Delicias"
                                                required
                                            />
                                            <TextAreaField
                                                name="description"
                                                label="Descripción"
                                                placeholder="Describe tu negocio..."
                                            />
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <DisplayField label="Nombre de la Tienda" value={values.name} />
                                            <DisplayField label="Descripción" value={values.description} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {editingSections['info'] ? (
                                    <>
                                        <TextField
                                            name="email"
                                            label="Correo Electrónico"
                                            placeholder="pedidos@restaurante.com"
                                            required
                                        />
                                        <PhoneField
                                            name="phone"
                                            label="Teléfono / WhatsApp"
                                            placeholder="+57 300 000 0000"
                                        />
                                    </>

                                ) : (
                                    <>
                                        <DisplayField label="Correo Electrónico" value={values.email} />
                                        <DisplayField label="Teléfono / WhatsApp" value={values.phone} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Location Settings */}
                        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <MapPin size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Ubicación Detallada</h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleEditing('location')}
                                    className={cn(
                                        "rounded-xl gap-2",
                                        editingSections['location'] ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"
                                    )}
                                >
                                    {editingSections['location'] ? <><X size={16} /> Cancelar</> : <><Pencil size={16} /> Editar</>}
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Define la ubicación exacta de tu comercio para calcular costos de envío y mostrarla a tus clientes.
                            </p>

                            <div className="space-y-6 pt-2">
                                {editingSections['location'] ? (
                                    <>
                                        <div className="mb-6">
                                            <TextField
                                                name="address"
                                                label="Dirección Exacta"
                                                placeholder="Calle 123 # 45 - 67"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <SelectField
                                                name="location.department"
                                                label="Departamento"
                                                options={locations.map(d => ({ value: d.departamento, label: d.departamento }))}
                                                onChange={(value) => {
                                                    setFieldValue("location.department", value);
                                                    setFieldValue("location.city", ""); // Reset city
                                                }}
                                            />
                                            <SelectField
                                                name="location.city"
                                                label="Ciudad"
                                                options={
                                                    values.location?.department
                                                        ? locations.find(d => d.departamento === values.location?.department)?.ciudades.map(c => ({ value: c, label: c })) || []
                                                        : []
                                                }
                                                disabled={!values.location?.department}
                                            />
                                        </div>

                                        {(values.location?.city === "Bogotá" || values.location?.city === "Bogota") && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                                <SelectField
                                                    name="location.locality"
                                                    label="Localidad"
                                                    options={localities.map(l => ({ value: l.localidad, label: l.localidad }))}
                                                />
                                                <TextField
                                                    name="location.neighborhood"
                                                    label="Barrio"
                                                    placeholder="Ej: Cedritos"
                                                />
                                            </div>
                                        )}

                                        {!(values.location?.city === "Bogotá" || values.location?.city === "Bogota") && (
                                            <div className="mt-6">
                                                <TextField
                                                    name="location.neighborhood"
                                                    label="Barrio"
                                                    placeholder="Ej: Centro"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Ubicación en Mapa</label>
                                            <p className="text-xs text-muted-foreground mb-2">Haz clic para ajustar la posición exacta.</p>
                                            <LocationMap
                                                latitude={values.location?.lat || 4.6097}
                                                longitude={values.location?.lng || -74.0817}
                                                onLocationSelect={(lat, lng) => {
                                                    setFieldValue("location.lat", lat);
                                                    setFieldValue("location.lng", lng);
                                                }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <DisplayField label="Dirección Física" value={values.address} />
                                        </div>
                                        <DisplayField label="Departamento" value={values.location?.department} />
                                        <DisplayField label="Ciudad" value={values.location?.city} />
                                        {(values.location?.city === "Bogotá" || values.location?.city === "Bogota") && (
                                            <DisplayField label="Localidad" value={values.location?.locality} />
                                        )}
                                        <DisplayField label="Barrio" value={values.location?.neighborhood} />
                                        <div className="md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1 block">Coordenadas</label>
                                            <p className="text-sm font-semibold text-foreground/90">
                                                {values.location?.lat ? `${values.location.lat.toFixed(6)}, ${values.location.lng?.toFixed(6)}` : "No definidas"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Regional Settings */}
                        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Settings2 size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Configuración Regional</h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleEditing('regional')}
                                    className={cn(
                                        "rounded-xl gap-2",
                                        editingSections['regional'] ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"
                                    )}
                                >
                                    {editingSections['regional'] ? <><X size={16} /> Cancelar</> : <><Pencil size={16} /> Editar</>}
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Define la moneda y zona horaria principal de tu comercio.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {editingSections['regional'] ? (
                                    <>
                                        <SelectField
                                            name="currency"
                                            label="Moneda Principal"
                                            options={[
                                                { value: "COP", label: "Peso Colombiano (COP)" },
                                                { value: "USD", label: "Dólar Estadounidense (USD)" },
                                                { value: "MXN", label: "Peso Mexicano (MXN)" },
                                                { value: "EUR", label: "Euro (EUR)" },
                                            ]}
                                        />
                                        <SelectField
                                            name="timezone"
                                            label="Zona Horaria"
                                            options={[
                                                { value: "America/Bogota", label: "Bogotá, Lima, Quito (GMT-5)" },
                                                { value: "America/Mexico_City", label: "Ciudad de México (GMT-6)" },
                                                { value: "America/New_York", label: "Nueva York (GMT-5)" },
                                                { value: "UTC", label: "UTC (GMT+0)" },
                                            ]}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <DisplayField label="Moneda Principal" value={values.currency} />
                                        <DisplayField label="Zona Horaria" value={values.timezone} />
                                    </>
                                )}
                            </div>
                        </div>


                        {/* Social Media Settings */}
                        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Share2 size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Redes Sociales</h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleEditing('social')}
                                    className={cn(
                                        "rounded-xl gap-2",
                                        editingSections['social'] ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"
                                    )}
                                >
                                    {editingSections['social'] ? <><X size={16} /> Cancelar</> : <><Pencil size={16} /> Editar</>}
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Configura los enlaces a las redes sociales que aparecerán en el pie de página de tu tienda.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {editingSections['social'] ? (
                                    <>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Facebook size={16} className="text-muted-foreground" />
                                                <span className="text-sm font-medium">Facebook</span>
                                            </div>
                                            <TextField
                                                name="social.facebook"
                                                placeholder="https://facebook.com/tu-tienda"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Instagram size={16} className="text-muted-foreground" />
                                                <span className="text-sm font-medium">Instagram</span>
                                            </div>
                                            <TextField
                                                name="social.instagram"
                                                placeholder="https://instagram.com/tu-tienda"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Twitter size={16} className="text-muted-foreground" />
                                                <span className="text-sm font-medium">Twitter / X</span>
                                            </div>
                                            <TextField
                                                name="social.twitter"
                                                placeholder="https://twitter.com/tu-tienda"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Linkedin size={16} className="text-muted-foreground" />
                                                <span className="text-sm font-medium">LinkedIn</span>
                                            </div>
                                            <TextField
                                                name="social.linkedin"
                                                placeholder="https://linkedin.com/company/tu-tienda"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <DisplayField label="Facebook" value={values.social?.facebook} />
                                        <DisplayField label="Instagram" value={values.social?.instagram} />
                                        <DisplayField label="Twitter" value={values.social?.twitter} />
                                        <DisplayField label="LinkedIn" value={values.social?.linkedin} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Theme Settings */}
                        <div className="rounded-[32px] border bg-card p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Palette size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight">Apariencia y Tema</h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleEditing('theme')}
                                    className={cn(
                                        "rounded-xl gap-2",
                                        editingSections['theme'] ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-primary hover:bg-primary/10"
                                    )}
                                >
                                    {editingSections['theme'] ? <><X size={16} /> Cancelar</> : <><Pencil size={16} /> Editar</>}
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {editingSections['theme'] ? (
                                    <>
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
                                    </>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-full border-4 border-white shadow-md"
                                            style={{ backgroundColor: `hsl(${values.theme.primaryColor})` }}
                                        />
                                        <div>
                                            <DisplayField label="Color Principal (HSL)" value={values.theme.primaryColor} />
                                        </div>
                                    </div>
                                )}
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
            )
            }
        </Formik >
    );
}
