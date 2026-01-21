"use client";

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Logo from "@/components/atoms/Logo/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextField, PasswordField } from "@/components/atoms/Form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

import { useAuth } from "@/features/auth/context/AuthContext";
import { FirebaseError } from "firebase/app";
import { useSelector } from "react-redux";
import { selectConfiguration } from "@/features/configuration/redux/configurationSelectors";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().required("Requerido"),
});

export default function LoginPage() {
    const router = useRouter();
    const toast = useToast();
    const { login } = useAuth();
    const config = useSelector(selectConfiguration);

    const storeName = config?.name || "Admin Panel";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-sm border-0 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="text-center pb-2 pt-10">
                    <div className="mx-auto mb-6 scale-125 transform transition-transform hover:scale-110 duration-500">
                        <Logo />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {storeName}
                    </h1>
                    <p className="text-sm text-muted-foreground px-6">
                        Ingresa tus credenciales para administrar {config?.name ? `tu ${config.name}` : "la tienda"}
                    </p>
                </CardHeader>

                <CardContent className="p-8 pt-6">
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                await login(values.email, values.password);
                                toast.success("Bienvenido de nuevo");
                                router.push("/admin/dashboard");
                            } catch (error) {
                                console.error("Login error:", error);
                                if (error instanceof FirebaseError) {
                                    switch (error.code) {
                                        case "auth/user-not-found":
                                        case "auth/wrong-password":
                                        case "auth/invalid-credential":
                                            toast.error("Credenciales incorrectas");
                                            break;
                                        case "auth/too-many-requests":
                                            toast.error("Demasiados intentos. Intenta más tarde.");
                                            break;
                                        default:
                                            toast.error("Ocurrió un error al iniciar sesión");
                                    }
                                } else {
                                    toast.error("Error inesperado");
                                }
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting, isValid, dirty }) => (
                            <Form className="space-y-4">
                                <TextField
                                    name="email"
                                    label="Correo Electrónico"
                                    placeholder="ejemplo@correo.com"
                                    autoComplete="email"
                                />

                                <div className="pt-2">
                                    <PasswordField
                                        name="password"
                                        label="Contraseña"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !dirty || !isValid}
                                        className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Iniciando...
                                            </>
                                        ) : (
                                            "Iniciar Sesión"
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>

            <div className="fixed bottom-6 text-xs text-muted-foreground/50">
                © {new Date().getFullYear()} {config?.name || "Vink Shop"}. Panel Administrativo.
            </div>
        </div>
    );
}
