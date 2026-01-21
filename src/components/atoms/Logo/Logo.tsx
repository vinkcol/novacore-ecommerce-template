import React, { useMemo } from "react";
import Image from "next/image";
import { useCommerceConfig } from "@/hooks/useCommerceConfig";

/**
 * Checks if the URL is from Firebase Storage.
 * Firebase Storage URLs should skip Next.js optimization on Netlify
 * to avoid 412 Precondition Failed errors.
 */
function isFirebaseStorageUrl(url: string | undefined): boolean {
  if (typeof url !== "string") return false;
  return (
    url.toLowerCase().includes("firebasestorage.googleapis.com") ||
    url.toLowerCase().includes("storage.googleapis.com")
  );
}

const Logo = () => {
  const { config } = useCommerceConfig();

  // Memoize the logo source
  const logoSrc = useMemo(() => {
    return config?.logoUrl;
  }, [config?.logoUrl]);

  // Skip optimization for Firebase Storage URLs to avoid 412 errors on Netlify
  const shouldSkipOptimization = useMemo(
    () => isFirebaseStorageUrl(logoSrc),
    [logoSrc]
  );

  // Memoize store name
  const storeName = useMemo(() => {
    return config?.name || "Foodie"; // Use "Foodie" as default if absolutely nothing is there
  }, [config?.name]);

  const initial = useMemo(() => {
    return (storeName || "F").charAt(0).toUpperCase();
  }, [storeName]);

  if (!logoSrc) {
    return (
      <div className="flex items-center gap-3 h-[60px] w-full px-2 select-none">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-xl flex-shrink-0 border border-primary/20 shadow-sm">
          {initial}
        </div>
        <span className="text-lg font-bold text-foreground truncate max-w-[130px]" title={storeName}>
          {storeName}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-[60px] w-[180px]">
      <Image
        src={logoSrc}
        alt={`${storeName} Logo`}
        fill
        className="object-contain"
        priority
        unoptimized={shouldSkipOptimization}
      />
    </div>
  );
};

// Memoize the entire component to prevent re-renders in parents (Sidebar/Card) if props don't change
export default React.memo(Logo);
