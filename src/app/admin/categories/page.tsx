import { Metadata } from "next";
import { CategoriesTemplate } from "@/features/categories/components/templates/CategoriesTemplate";

export const metadata: Metadata = {
    title: "Categorías | Vink Admin",
    description: "Gestión de categorías de productos",
};

export default function CategoriesPage() {
    return <CategoriesTemplate />;
}
