"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { ScheduleForm } from "@/features/configuration/components/ScheduleForm";
import { OrderRulesForm } from "@/features/configuration/components/OrderRulesForm";
import { StoreQRCard } from "@/features/configuration/components/StoreQRCard";
import { BannerEditor } from "@/features/configuration/components/BannerEditor";
import { PaymentMethodsCard } from "@/features/configuration/components/PaymentMethodsCard";
import { fetchConfigurationStart } from "@/features/configuration/redux/configurationSlice";

export default function SchedulePage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchConfigurationStart());
    }, [dispatch]);

    return (
        <AdminLayout title="Tienda">
            <div className="mb-8">
                <BannerEditor />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <ScheduleForm />
                    <PaymentMethodsCard />
                </div>

                <div className="space-y-8">
                    <StoreQRCard />
                    <OrderRulesForm />
                </div>
            </div>
        </AdminLayout>
    );
}
