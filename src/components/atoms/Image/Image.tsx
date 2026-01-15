import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
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
}: ImageProps) {
  if (fill) {
    return (
      <NextImage
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 400}
      className={cn(`object-${objectFit}`, className)}
      priority={priority}
    />
  );
}
