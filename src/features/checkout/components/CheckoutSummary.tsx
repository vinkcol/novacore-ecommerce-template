"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/Price";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItems, selectCartTotals } from "@/features/cart/redux/cartSelectors";
import { CheckoutItem } from "./CheckoutItem";
import { selectUpsellProducts } from "@/features/products/redux/productsSelectors";
import { CheckoutUpsellCard } from "./CheckoutUpsellCard";

export function CheckoutSummary() {
    const items = useAppSelector(selectCartItems);
    const totals = useAppSelector(selectCartTotals);
    const upsellProducts = useAppSelector(selectUpsellProducts);

    // Show only the first upsell product available
    const featuredUpsell = upsellProducts[0];

    return (
        <div className="rounded-2xl bg-muted/30 p-4 ring-1 ring-inset ring-muted mt-2">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Resumen del pedido</h3>
                <Badge variant="outline">{items.length} productos</Badge>
            </div>

            <div className="space-y-1 pr-2 divide-y divide-border/50">
                {items.map((item) => (
                    <CheckoutItem key={item.id} item={item} />
                ))}
            </div>

            {featuredUpsell && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <CheckoutUpsellCard product={featuredUpsell} />
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
