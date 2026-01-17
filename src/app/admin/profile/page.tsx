import { Metadata } from "next";
import { ProfileTemplate } from "@/features/admin/components/templates/ProfileTemplate";

export const metadata: Metadata = {
    title: "Mi Perfil | Vink Admin",
    description: "Administra tu perfil y preferencias.",
};

export default function ProfilePage() {
    return <ProfileTemplate />;
}
