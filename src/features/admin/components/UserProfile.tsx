"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Bell, Lock } from "lucide-react";

export function UserProfile() {
    return (
        <div className="space-y-6">
            {/* Header / Banner */}
            <div className="relative h-48 w-full rounded-xl bg-gradient-to-r from-primary/80 to-primary/40 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            </div>

            {/* Profile Info overlaps Banner */}
            <div className="relative px-6 -mt-16 flex flex-col md:flex-row gap-6 items-end md:items-start">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src="/avatars/01.png" alt="@admin" />
                    <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold">SA</AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-2 md:pt-16 space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Super Admin</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Administrador Global
                    </p>
                </div>
                <div className="pt-2 md:pt-16">
                    <Button>Editar Perfil</Button>
                </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información Personal
                        </CardTitle>
                        <CardDescription>
                            Detalles principales de tu cuenta administrativa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" defaultValue="Super Admin" readOnly className="bg-muted/50" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="email" defaultValue="admin@vink.com" className="pl-9 bg-muted/50" readOnly />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Input id="role" defaultValue="super_admin" readOnly className="uppercase bg-muted/50" />
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences / Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Preferencias
                        </CardTitle>
                        <CardDescription>
                            Configuración de tu cuenta y notificaciones.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Notificaciones por Correo</Label>
                                <p className="text-sm text-muted-foreground">
                                    Recibir alertas de nuevas órdenes.
                                </p>
                            </div>
                            <Button variant="outline" size="sm">Activado</Button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Autenticación de 2 Factores</Label>
                                <p className="text-sm text-muted-foreground">
                                    Mayor seguridad para tu cuenta.
                                </p>
                            </div>
                            <Button variant="outline" size="sm">Configurar</Button>
                        </div>
                        <div className="pt-4">
                            <Button variant="destructive" className="w-full">
                                <Lock className="mr-2 h-4 w-4" />
                                Cambiar Contraseña
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
