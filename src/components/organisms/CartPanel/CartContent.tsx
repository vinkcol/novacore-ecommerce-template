"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/molecules/CartItem";
import { Price } from "@/components/atoms/Price";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    selectCartItems,
    selectCartTotals,
} from "@/features/cart/redux/cartSelectors";
import {
    removeFromCart,
    updateQuantity,
} from "@/features/cart/redux/cartSlice";
import { cn } from "@/lib/utils";

interface CartContentProps {
    onClose?: () => void;
    className?: string;
    isSidebar?: boolean;
}

import { useState, useEffect } from "react";
import { CheckoutModal } from "@/features/checkout/components/CheckoutModal";

export function CartContent({ onClose, className, isSidebar = false }: CartContentProps) {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectCartItems);
    const totals = useAppSelector(selectCartTotals);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const handleQuantityChange = (id: string, quantity: number) => {
        dispatch(updateQuantity({ id, quantity }));
    };

    const handleCheckoutOpen = () => {
        setIsCheckoutOpen(true);
    };

    if (!isMounted) return null;

    return (
        <div className={cn("flex h-full flex-col", className)}>
            {/* Header (Optional for sidebar) */}
            {!isSidebar && (
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        🧾 Tu pedido ({totals.itemCount})
                    </h2>
                </div>
            )}

            {/* Items */}
            <div className={cn("flex-1 overflow-y-auto overflow-x-hidden pt-4", isSidebar ? "px-0" : "px-6")}>
                {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center py-10">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
                        <div>
                            <h3 className="mb-1 font-semibold text-muted-foreground">Tu pedido está vacío</h3>
                            <p className="text-sm text-muted-foreground/60">
                                Agrega platos del menú para pedir
                            </p>
                        </div>
                        {onClose && <Button variant="outline" onClick={onClose} className="rounded-xl">Ver Menú</Button>}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className={cn("border-t pt-4 mt-auto", isSidebar ? "px-0 pb-0" : "px-6 pb-6")}>
                    <div className="mb-4 space-y-2">
                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <Price amount={totals.total} />
                        </div>
                    </div>
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl h-14 font-bold shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                        size="lg"
                        onClick={handleCheckoutOpen}
                    >
                        Continuar
                    </Button>
                </div>
            )}

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
        </div>
    );
}
