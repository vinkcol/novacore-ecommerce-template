"use client";

import React from "react";
import { Product } from "@/features/products/types";
import { Price } from "@/components/atoms/Price";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/features/cart/redux/cartSlice";
import { Plus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CheckoutUpsellCardProps {
    product: Product;
}

export function CheckoutUpsellCard({ product }: CheckoutUpsellCardProps) {
    const dispatch = useAppDispatch();

    const handleAdd = () => {
        const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
        dispatch(addToCart({
            id: `${product.id}-${variant?.id || 'default'}`,
            productId: product.id,
            variantId: variant?.id || 'default',
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            maxQuantity: product.stockQuantity,
            variant: variant ? {
                name: "Variante",
                value: variant.name
            } : undefined
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-all hover:bg-primary/10"
        >
            <div className="flex items-center gap-4 relative z-10">
                {/* Product Image */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white p-2 shadow-sm">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform group-hover:scale-110"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] px-1.5 h-4 uppercase font-bold tracking-wider">
                            <Sparkles className="mr-1 h-2.5 w-2.5" />
                            Recomendado
                        </Badge>
                        {product.compareAtPrice && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] px-1.5 h-4 font-bold">
                                Ahorra {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                            </Badge>
                        )}
                    </div>

                    <h4 className="text-sm font-bold truncate text-foreground/90">{product.name}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2">Ideal para complementar tu compra</p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            {product.compareAtPrice && (
                                <Price amount={product.compareAtPrice} className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50" />
                            )}
                            <Price amount={product.price} className="text-sm font-extrabold text-primary" />
                        </div>

                        <div className="relative flex items-center justify-center">
                            {/* Optimized Ripple Effects with blur - GPU accelerated */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                                <div
                                    className="absolute left-1/2 top-1/2 h-8 w-8 rounded-full border border-primary/20 bg-[radial-gradient(circle,_hsl(var(--primary)_/_0.15)_0%,_hsl(var(--primary)_/_0.05)_70%,_transparent_100%)] will-change-[transform,opacity,filter] [backface-visibility:hidden] animate-ripple-pulse"
                                />
                                <div
                                    className="absolute left-1/2 top-1/2 h-8 w-8 rounded-full border border-primary/20 bg-[radial-gradient(circle,_hsl(var(--primary)_/_0.15)_0%,_hsl(var(--primary)_/_0.05)_70%,_transparent_100%)] will-change-[transform,opacity,filter] [backface-visibility:hidden] animate-ripple-pulse-delayed-1"
                                />
                                <div
                                    className="absolute left-1/2 top-1/2 h-8 w-8 rounded-full border border-primary/20 bg-[radial-gradient(circle,_hsl(var(--primary)_/_0.15)_0%,_hsl(var(--primary)_/_0.05)_70%,_transparent_100%)] will-change-[transform,opacity,filter] [backface-visibility:hidden] animate-ripple-pulse-delayed-2"
                                />
                            </div>

                            <Button
                                onClick={handleAdd}
                                size="sm"
                                className="relative z-10 h-8 rounded-full px-5 text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(177,24,39,0.3)] transition-all active:scale-95"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Agregar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
