"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/atoms/Image";
import { Price } from "@/components/atoms/Price";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductById } from "@/features/products/redux/productsThunks";
import { selectSelectedProduct } from "@/features/products/redux/productsSelectors";
import { addToCart } from "@/features/cart/redux/cartSlice";
import { toast } from "sonner";
import type { ProductVariant } from "@/features/products/types";

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectSelectedProduct);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (product && !selectedVariant) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [product, selectedVariant]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        id: `${product.id}-${selectedVariant?.id || "default"}`,
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        price: selectedVariant?.price || product.price,
        image: product.images[0],
        quantity: 1,
        variant: selectedVariant
          ? {
            name: selectedVariant.name,
            value: selectedVariant.name,
          }
          : undefined,
        maxQuantity: product.stockQuantity,
      })
    );

    toast.success("Agregado al carrito", {
      description: product.name,
    });
  };

  if (!product) {
    return (
      <ContentLayout>
        <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4">
          <p>Cargando...</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 ${selectedImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                      }`}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex gap-2">
                {product.isNew && <Badge variant="secondary">Nuevo</Badge>}
                {product.isSale && <Badge variant="destructive">Oferta</Badge>}
                {!product.inStock && <Badge>Agotado</Badge>}
              </div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <Price
                amount={product.price}
                compareAtPrice={product.compareAtPrice}
                showDiscount
                className="text-2xl"
              />
            </div>

            {product.longDescription ? (
              <div
                className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />
            ) : (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold">
                  Seleccionar Variante
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stockQuantity <= 0}
                      className={`flex items-center gap-2 rounded-md border-2 px-4 py-2 transition-colors ${selectedVariant?.id === variant.id
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary"
                        } ${variant.stockQuantity <= 0 && "cursor-not-allowed opacity-50"}`}
                    >

                      <span className="text-sm">{variant.name}</span>
                      {selectedVariant?.id === variant.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? "Agregar al Carrito" : "Agotado"}
            </Button>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h3 className="mb-3 font-semibold">Especificaciones</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <dt className="font-medium text-muted-foreground">{key}</dt>
                      <dd className="mt-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
