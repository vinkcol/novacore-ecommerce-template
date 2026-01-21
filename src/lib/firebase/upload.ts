import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload
 * @param path The path in storage (e.g., 'products')
 * @returns Promise that resolves to the download URL
 */
export async function uploadImage(file: File, folder: string = 'uploads'): Promise<string> {
    try {
        let fileToUpload = file;

        // Compress if it's an image (PNG, JPEG, WebP) but NOT SVG/GIF
        // SVGs should remain as vector. GIFs might lose animation if compressed blindly.
        if (file.type.match(/image\/(png|jpeg|webp)/)) {
            try {
                const options = {
                    maxSizeMB: 1, // Target efficient size
                    maxWidthOrHeight: 1200, // Reasonable max dimension for web
                    useWebWorker: true,
                    initialQuality: 0.8
                };

                // Dynamic import to avoid SSR issues if this lib depends on browser APIs not in node
                const imageCompression = (await import("browser-image-compression")).default;
                const compressedFile = await imageCompression(file, options);

                // Only use compressed if it's actually smaller
                if (compressedFile.size < file.size) {
                    fileToUpload = compressedFile;
                }
            } catch (compressionError) {
                console.warn("Image compression failed, uploading original:", compressionError);
            }
        }
        // Create a unique filename to avoid overwrites
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const fullPath = `${folder}/${timestamp}_${cleanFileName}`;

        const storageRef = ref(storage, fullPath);

        // Upload the file with explicit metadata
        const metadata = {
            contentType: fileToUpload.type || 'image/jpeg',
        };

        const snapshot = await uploadBytes(storageRef, fileToUpload, metadata);

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
