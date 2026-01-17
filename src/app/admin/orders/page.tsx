import { Metadata } from "next";
import { OrdersTemplate } from "@/features/orders/components/templates/OrdersTemplate";

export const metadata: Metadata = {
    title: "Ordenes | Vink Admin",
    description: "Gestión de pedidos realizados en Vink Shop",
};

export default function OrdersPage() {
    return <OrdersTemplate />;
}
