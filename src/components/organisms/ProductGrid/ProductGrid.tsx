"use client";

import { ProductCard } from "@/components/molecules/ProductCard";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/features/cart/redux/cartSlice";
import type { Product } from "@/features/products/types";
import { toast } from "sonner";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants[0];

    dispatch(
      addToCart({
        id: `${product.id}-${defaultVariant?.id || "default"}`,
        productId: product.id,
        variantId: defaultVariant?.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        variant: defaultVariant
          ? {
              name: defaultVariant.name,
              value: defaultVariant.value,
            }
          : undefined,
        maxQuantity: product.stockQuantity,
      })
    );

    toast.success("Producto agregado al carrito", {
      description: product.name,
    });
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 text-center">
        <h3 className="text-lg font-semibold">No se encontraron productos</h3>
        <p className="text-sm text-muted-foreground">
          Intenta ajustar los filtros o la búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
