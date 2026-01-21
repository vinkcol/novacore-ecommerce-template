"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/Price";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCartItems, selectCartTotals } from "@/features/cart/redux/cartSelectors";
import { CheckoutItem } from "./CheckoutItem";
import { selectAllProducts } from "@/features/products/redux/productsSelectors";
import { fetchProducts } from "@/features/products/redux/productsThunks";

export function CheckoutSummary() {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCartItems);
    const totals = useAppSelector(selectCartTotals);
    const allProducts = useAppSelector(selectAllProducts);

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
                {totals.tax > 0 && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Impuestos</span>
                        <Price amount={totals.tax} />
                    </div>
                )}
                <div className="flex justify-between text-base font-bold pt-1">
                    <span>Total a pagar</span>
                    <Price amount={totals.total} className="text-primary" />
                </div>
            </div>
        </div>
    );
}
