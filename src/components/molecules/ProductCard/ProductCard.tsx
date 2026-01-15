"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Link href={`/products/${product.slug}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:shadow-lg",
          className
        )}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                Nuevo
              </Badge>
            )}
            {product.isSale && product.salePercentage && (
              <Badge variant="destructive">-{product.salePercentage}%</Badge>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-lg font-bold text-white">Agotado</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="mb-1 line-clamp-1 font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
          <Price
            amount={product.price}
            compareAtPrice={product.compareAtPrice}
            showDiscount={false}
          />
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar al Carrito
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
