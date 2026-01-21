import { Metadata } from "next";
import { DashboardTemplate } from "@/features/admin/components/templates/DashboardTemplate";

export const metadata: Metadata = {
    title: "Dashboard | Foodie Admin",
    description: "Panel de control de administración de Foodie",
};

export default function DashboardPage() {
    return <DashboardTemplate />;
}
