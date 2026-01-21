"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGES } from "@/lib/constants";

const MAX_RETRIES = 2;

/**
 * Checks if the URL is from Firebase Storage.
 * Firebase Storage URLs should skip Next.js optimization on Netlify
 * to avoid 412 Precondition Failed errors.
 */
function isFirebaseStorageUrl(url: string): boolean {
  if (typeof url !== "string") return false;
  const isFirebase =
    url.toLowerCase().includes("firebasestorage.googleapis.com") ||
    url.toLowerCase().includes("storage.googleapis.com");

  if (isFirebase && process.env.NODE_ENV === "production") {
    // console.log("[ImageAtom] Detected Firebase URL, disabling optimization:", url);
  }
  return isFirebase;
}

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  fallbackSrc?: string;
  sizes?: string;
  /** Force unoptimized mode (bypass Next.js image optimization) */
  unoptimized?: boolean;
}

export function Image({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  objectFit = "cover",
  fallbackSrc = FALLBACK_IMAGES.product,
  sizes,
  unoptimized: unoptimizedProp,
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  // Auto-detect Firebase Storage URLs and skip optimization to avoid 412 errors on Netlify
  const shouldSkipOptimization =
    unoptimizedProp || isFirebaseStorageUrl(imgSrc);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
    setRetryCount(0);
    setIsRetrying(false);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  const handleError = () => {
    // Keep loading true while retrying to show placeholder
    setIsLoading(true);

    if (retryCount < MAX_RETRIES) {
      setIsRetrying(true);
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        if (typeof src === "string" && src.startsWith("http")) {
          const separator = src.includes("?") ? "&" : "?";
          setImgSrc(`${src}${separator}retry=${Date.now()}`);
        } else {
          setImgSrc(src);
        }
        setIsRetrying(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      if (!hasError) {
        setHasError(true);
        setImgSrc(fallbackSrc);
        // We will let the onload of the fallback image turn off loading
      }
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const commonProps = {
    src: imgSrc,
    alt: alt,
    onError: handleError,
    onLoad: handleLoad,
    priority: priority,
    unoptimized: shouldSkipOptimization,
    className: cn(
      "transition-opacity duration-300",
      isLoading ? "opacity-0" : "opacity-100",
      objectFit && !fill ? `object-${objectFit}` : "object-cover",
      className
    ),
  };

  return (
    <>
      {isLoading && (
        <div
          className={cn(
            "bg-muted animate-pulse absolute inset-0 z-10 flex items-center justify-center bg-gray-200",
            !fill && "w-full h-full", // If not fill, we assume parent sizes or we might default
            fill && "absolute inset-0"
          )}
          style={!fill ? { width: width || '100%', height: height || '100%' } : undefined}
        />
      )}

      {fill ? (
        <NextImage
          {...commonProps}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      ) : (
        <NextImage
          {...commonProps}
          width={width || 400}
          height={height || 400}
        />
      )}
    </>
  );
}

