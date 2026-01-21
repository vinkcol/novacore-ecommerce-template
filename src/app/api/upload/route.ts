import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string || "uploads";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Determine basic resource type from mime type
        // But 'auto' usually works well for image/video
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const shopSlug = process.env.NEXT_PUBLIC_SHOP_SLUG || "default-shop";
        // Construct path: foodie-store/products/filename
        const fullFolder = `${shopSlug}/${folder}`;

        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: fullFolder,
                    resource_type: "auto", // Auto-detect image or video
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
            { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
