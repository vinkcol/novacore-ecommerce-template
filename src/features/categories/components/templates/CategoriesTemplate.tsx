"use client";

import React from "react";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { CategoryList } from "../admin/CategoryList";

export function CategoriesTemplate() {
    return (
        <AdminLayout title="Categorías">
            <CategoryList />
        </AdminLayout>
    );
}
