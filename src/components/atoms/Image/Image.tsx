"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGES } from "@/lib/constants";

const MAX_RETRIES = 2;


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
}: ImageProps) {

  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
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

  const Wrapper = fill ? "div" : "div";
  // For 'fill' usage, the parent is usually the container. 
  // But to overlay the skeleton, we need a common parent if we want to be strictly inside.
  // Actually, 'fill' images render absolute.
  // We can render the skeleton as absolute covering the same area.

  const commonProps = {
    src: imgSrc,
    alt: alt,
    onError: handleError,
    onLoad: handleLoad,
    priority: priority,
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

