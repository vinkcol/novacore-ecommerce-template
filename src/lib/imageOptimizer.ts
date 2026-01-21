export interface CompressionOptions {
    maxWidth?: number;
    quality?: number;
    format?: "image/webp" | "image/jpeg" | "image/png";
}

/**
 * Compresses and resizes an image file using the browser's Canvas API.
 * 
 * @param file The original File object.
 * @param options Compression options (maxWidth, quality, format).
 * @returns Promise resolving to the compressed File object.
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    // Default options
    const {
        maxWidth = 1920,
        quality = 0.8,
        format = "image/webp"
    } = options;

    return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(file);

        image.onload = () => {
            URL.revokeObjectURL(url);

            // Calculate new dimensions
            let width = image.width;
            let height = image.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            // Create canvas
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            // Draw image
            ctx.drawImage(image, 0, 0, width, height);

            // Convert to Blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a new File from the Blob
                        // Change extension for WebP
                        const newName = file.name.replace(/\.[^/.]+$/, "") + (format === "image/webp" ? ".webp" : ".jpg");

                        const compressedFile = new File([blob], newName, {
                            type: format,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error("Image compression failed"));
                    }
                },
                format,
                quality
            );
        };

        image.onerror = (error) => {
            URL.revokeObjectURL(url);
            reject(error);
        };

        image.src = url;
    });
}
