"use client";

import React from "react";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { UserProfile } from "../UserProfile";

export function ProfileTemplate() {
    return (
        <AdminLayout title="Mi Perfil">
            <UserProfile />
        </AdminLayout>
    );
}
