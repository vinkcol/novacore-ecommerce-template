import { Metadata } from "next";
import { DashboardTemplate } from "@/features/admin/components/templates/DashboardTemplate";

export const metadata: Metadata = {
    title: "Dashboard | Vink Admin",
    description: "Panel de control de administración de Vink Shop",
};

export default function DashboardPage() {
    return <DashboardTemplate />;
}
