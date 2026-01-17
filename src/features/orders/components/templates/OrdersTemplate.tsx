"use client";

import React from "react";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { AdminOrdersTable } from "../admin/AdminOrdersTable";

export function OrdersTemplate() {
    return (
        <AdminLayout title="Gestión de Pedidos">
            <AdminOrdersTable />
        </AdminLayout>
    );
}
