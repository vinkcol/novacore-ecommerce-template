"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/Price";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCartItems, selectCartTotals } from "@/features/cart/redux/cartSelectors";
import { CheckoutItem } from "./CheckoutItem";
import { selectUpsellProducts, selectAllProducts } from "@/features/products/redux/productsSelectors";
import { CheckoutUpsellCard } from "./CheckoutUpsellCard";
import { fetchProducts } from "@/features/products/redux/productsThunks";

interface CheckoutSummaryProps {
    maxRecommendations?: number;
}

export function CheckoutSummary({ maxRecommendations = 1 }: CheckoutSummaryProps) {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCartItems);
    const totals = useAppSelector(selectCartTotals);
    const upsellProducts = useAppSelector(selectUpsellProducts);
    const allProducts = useAppSelector(selectAllProducts);

    // Get limited recommendations
    const visibleRecommendations = upsellProducts.slice(0, maxRecommendations);

    React.useEffect(() => {
        if (allProducts.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, allProducts.length]);

    if (items.length === 0) return null;

    return (
        <div className="rounded-2xl bg-muted/30 p-4 ring-1 ring-inset ring-muted mt-2">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground/80 lowercase first-letter:uppercase">Resumen del pedido</h3>
                <Badge variant="outline" className="font-bold border-muted-foreground/30">{items.length} productos</Badge>
            </div>

            <div className="space-y-1 pr-2 divide-y divide-border/50">
                {items.map((item) => (
                    <CheckoutItem key={item.id} item={item} />
                ))}
            </div>

            {visibleRecommendations.length > 0 && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border/50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Complementa tu pedido</span>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>
                    <div className="space-y-3">
                        {visibleRecommendations.map(product => (
                            <CheckoutUpsellCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 space-y-2 border-t pt-4 text-xs">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <Price amount={totals.subtotal} />
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    {totals.shipping === 0 ? (
                        <span className="text-green-600 font-medium">Gratis</span>
                    ) : (
                        <Price amount={totals.shipping} className="font-medium" />
                    )}
                </div>
                <div className="flex justify-between text-base font-bold pt-1">
                    <span>Total a pagar</span>
                    <Price amount={totals.total} className="text-primary" />
                </div>
            </div>
        </div>
    );
}
