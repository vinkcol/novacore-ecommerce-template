import { Metadata } from "next";
import { CollectionsTemplate } from "@/features/collections/components/templates/CollectionsTemplate";

export const metadata: Metadata = {
    title: "Colecciones | Vink Admin",
    description: "Gestión de colecciones de productos",
};

export default function CollectionsPage() {
    return <CollectionsTemplate />;
}
