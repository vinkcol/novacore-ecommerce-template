import { Metadata } from "next";
import { ReportsTemplate } from "@/features/reports/components/templates/ReportsTemplate";

export const metadata: Metadata = {
    title: "Reportes | Foodie Admin",
    description: "Analíticas y reportes de Foodie",
};

export default function ReportsPage() {
    return <ReportsTemplate />;
}
