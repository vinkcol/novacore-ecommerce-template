import { Metadata } from "next";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { ProductForm } from "@/features/products/components/admin/ProductForm";

export const metadata: Metadata = {
    title: "Nuevo Producto | Vink Admin",
    description: "Crea un nuevo producto para tu catálogo de Vink Shop",
};

export default function NewProductPage() {
    return (
        <AdminLayout title="Crear Nuevo Producto">
            <ProductForm />
        </AdminLayout>
    );
}
