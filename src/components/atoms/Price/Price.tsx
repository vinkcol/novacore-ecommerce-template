import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";

interface PriceProps {
  amount: number;
  currency?: string;
  className?: string;
  compareAtPrice?: number;
  showDiscount?: boolean;
}

export function Price({
  amount,
  currency = CURRENCY,
  className,
  compareAtPrice,
  showDiscount = false,
}: PriceProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > amount;
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - amount) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-lg font-bold text-foreground">
        {formatPrice(amount, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(compareAtPrice, currency)}
          </span>
          {showDiscount && (
            <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
              -{discountPercentage}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
