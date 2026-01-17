"use client";

import React from "react";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { ProductList } from "../admin/ProductList";

export function ProductsTemplate() {
    return (
        <AdminLayout title="Catálogo de Productos">
            <ProductList />
        </AdminLayout>
    );
}
