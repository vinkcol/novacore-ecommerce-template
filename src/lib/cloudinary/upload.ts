/**
 * Uploads a file to Cloudinary via our Next.js API route.
 * @param file The file to upload
 * @param folder The subfolder path (will be prefixed by NEXT_PUBLIC_SHOP_SLUG on server)
 * @returns Promise that resolves to the download URL
 */
export async function uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
    // Compress/Optimize? 
    // Cloudinary does auto-optimization on delivery (f_auto, q_auto).
    // We can skip client-side compression to simplify, or keep it if bandwidth is a concern.
    // For now, let's just upload raw and let Cloudinary handle storage.

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
    }

    const data = await response.json();
    return data.url;
}
