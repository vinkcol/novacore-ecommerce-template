import { Metadata } from "next";
import { OrdersTemplate } from "@/features/orders/components/templates/OrdersTemplate";

export const metadata: Metadata = {
    title: "Ordenes | Foodie Admin",
    description: "Gestión de pedidos realizados en Foodie",
};

export default function OrdersPage() {
    return <OrdersTemplate />;
}
