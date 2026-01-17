import { NextResponse } from "next/server";
import { getStorefrontCollections } from "@/features/collections/api/collections.server";

export async function GET() {
    try {
        const collections = await getStorefrontCollections();
        return NextResponse.json({
            success: true,
            collections
        });
    } catch (error: any) {
        console.error("API: Collections Fetch Error", error);
        return NextResponse.json(
            { success: false, error: error.message || "Error al obtener colecciones" },
            { status: 500 }
        );
    }
}
