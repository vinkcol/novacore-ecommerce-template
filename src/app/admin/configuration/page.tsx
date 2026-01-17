"use client";

import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { ConfigurationForm } from "@/features/configuration/components/ConfigurationForm";

export default function ConfigurationPage() {
    return (
        <AdminLayout title="Configuración del Comercio">
            <ConfigurationForm />
        </AdminLayout>
    );
}
