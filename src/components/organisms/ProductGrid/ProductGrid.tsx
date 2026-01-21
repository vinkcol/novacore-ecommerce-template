"use client";

import { useState } from "react";
import { ProductCard } from "@/components/molecules/ProductCard";
import { ProductSelectionModal } from "@/components/molecules/ProductSelectionModal/ProductSelectionModal";
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmAdd = (quantity: number, notes: string) => {
    if (!selectedProduct) return;

    const defaultVariant = selectedProduct.variants ? selectedProduct.variants[0] : undefined;

    // Generate a consistent ID for the same product+variant+notes combination
    // Only add timestamp if there are notes to allow multiple entries with different notes
    const itemId = notes
      ? `${selectedProduct.id}-${defaultVariant?.id || "default"}-${Date.now()}`
      : `${selectedProduct.id}-${defaultVariant?.id || "default"}`;

    dispatch(
      addToCart({
        id: itemId,
        productId: selectedProduct.id,
        variantId: defaultVariant?.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0] : "/placeholder-product.png",
        quantity: quantity,
        notes: notes,
        variant: defaultVariant
          ? {
            name: "Opción",
            value: defaultVariant.name,
          }
          : undefined,
        maxQuantity: 999,
      })
    );

    toast.success("Plato agregado al pedido", {
      description: `${selectedProduct.name} x${quantity}`,
    });
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[140px] animate-pulse rounded-[24px] bg-card/50 border p-3 flex flex-row gap-4"
          >
            {/* Left side skeleton */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-full bg-muted rounded mb-1" />
                <div className="h-3 w-5/6 bg-muted rounded" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="h-6 w-20 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-xl" />
              </div>
            </div>
            {/* Right side skeleton (image) */}
            <div className="h-full aspect-square flex-shrink-0 bg-muted rounded-[20px]" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center p-8">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted-foreground/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">No hay platos disponibles</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            En este momento no tenemos platos en esta categoría. Vuelve pronto para ver nuestras deliciosas opciones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleOpenModal}
          />
        ))}
      </div>

      <ProductSelectionModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAdd}
      />
    </>
  );
}
