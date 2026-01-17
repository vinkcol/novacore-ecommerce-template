"use client";

import React from "react";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { AdminDashboard } from "../AdminDashboard";

export function DashboardTemplate() {
    return (
        <AdminLayout title="Análisis General">
            <AdminDashboard />
        </AdminLayout>
    );
}
