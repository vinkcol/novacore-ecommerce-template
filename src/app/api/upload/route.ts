import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string || "uploads";
        const publicId = formData.get("publicId") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Determine basic resource type from mime type
        // But 'auto' usually works well for image/video
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const shopSlug = process.env.NEXT_PUBLIC_SHOP_SLUG || "default-shop";
        // Construct path: foodie/[shop-slug]/[folder]
        const fullFolder = `foodie/${shopSlug}/${folder}`;

        const uploadOptions: any = {
            folder: fullFolder,
            resource_type: "auto", // Auto-detect image or video
        };

        // If publicId is provided, use it as the filename
        if (publicId) {
            uploadOptions.public_id = publicId;
            uploadOptions.overwrite = true; // Allow overwriting existing files with same publicId
        }

        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
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
