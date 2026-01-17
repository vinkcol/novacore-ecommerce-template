"use client";

import React from "react";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { CollectionList } from "../admin/CollectionList";

export function CollectionsTemplate() {
    return (
        <AdminLayout title="Colecciones">
            <CollectionList />
        </AdminLayout>
    );
}
