import { Metadata } from "next";
import { ProductsTemplate } from "@/features/products/components/templates/ProductsTemplate";

export const metadata: Metadata = {
    title: "Gestión de Productos | Vink Admin",
    description: "Administra el inventario, precios y categorías de tus productos",
};

export default function AdminProductsPage() {
    return <ProductsTemplate />;
}
