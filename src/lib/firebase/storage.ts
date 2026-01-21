import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { compressImage, CompressionOptions } from "@/lib/imageOptimizer";

export interface UploadResult {
    url: string;
    path: string;
}

/**
 * Uploads an image to Firebase Storage with automatic compression.
 * 
 * @param file The original image File.
 * @param bucketPath The directory path.
 * @param compressionOptions Options for compression (optional).
 * @param customName Optional custom filename.
 */
export async function uploadImage(
    file: File,
    bucketPath: string,
    compressionOptions?: CompressionOptions,
    customName?: string
): Promise<UploadResult> {
    try {
        // Optimize Image
        const compressedFile = await compressImage(file, compressionOptions);

        // Upload
        return await uploadFile(compressedFile, bucketPath, customName);
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}


/**
 * Uploads a file to Firebase Storage.
 * 
 * @param file The File object to upload.
 * @param bucketPath The directory path in the bucket (e.g., 'products/123').
 * @param customName Optional custom filename. If provided, it will be sanitized. If not, the original filename is used.
 * @returns Promise resolving to the download URL and full storage path.
 */
export async function uploadFile(
    file: File,
    bucketPath: string,
    customName?: string
): Promise<UploadResult> {
    try {
        // Sanitize filename
        const originalName = customName || file.name;
        const sanitizedName = originalName
            .toLowerCase()
            .replace(/[^a-z0-9.]/g, "-") // Replace non-alphanumeric chars (except dot) with dash
            .replace(/-+/g, "-");        // Replace multiple dashes with single dash

        // Create unique filename with timestamp to prevent overwrites/caching issues
        const uniqueName = `${Date.now()}_${sanitizedName}`;
        const fullPath = `${bucketPath}/${uniqueName}`.replace(/\/+/g, "/"); // Ensure no double slashes

        const storageRef = ref(storage, fullPath);

        // Upload
        const snapshot = await uploadBytes(storageRef, file);

        // Get URL
        const url = await getDownloadURL(snapshot.ref);

        return {
            url,
            path: fullPath
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

/**
 * Deletes a file from Firebase Storage.
 * 
 * @param identifier The full download URL or the internal storage path.
 */
export async function deleteFile(identifier: string): Promise<void> {
    try {
        let storageRef;

        if (identifier.startsWith("http")) {
            // Extract path from URL is complex due to tokens, so we rely on the user passing the path usually.
            // However, Firebase SDK ref() can sometimes handle full HTTPS URLs for the same bucket.
            storageRef = ref(storage, identifier);
        } else {
            storageRef = ref(storage, identifier);
        }

        await deleteObject(storageRef);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
}
