"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/atoms/Image";
import { Price } from "@/components/atoms/Price";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  className,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all hover:shadow-md border-none bg-card/50 hover:bg-card p-3 flex flex-row gap-4 h-[140px] rounded-[24px]",
          className
        )}
      >
        {/* Left Side: Info */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <h3 className="text-base font-bold text-foreground uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <Price
              amount={product.price}
              compareAtPrice={product.compareAtPrice}
              showDiscount={false}
              className="text-lg font-black text-primary"
            />

            {/* Direct Add Button (Small) */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="icon"
              className="h-8 w-8 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="relative h-full aspect-square flex-shrink-0 overflow-hidden rounded-[20px] bg-muted">
          <Image
            src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder-product.png"}
            alt={product.name}
            fill
            unoptimized={product.images && product.images.length > 0 && (product.images[0].includes("firebase") || product.images[0].includes("storage"))}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlays */}
          <div className="absolute left-1 top-1 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 text-[10px] px-1.5 py-0 border-none h-5">
                NUEVO
              </Badge>
            )}
            {product.isSale && product.salePercentage && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                -{product.salePercentage}%
              </Badge>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Agotado</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
