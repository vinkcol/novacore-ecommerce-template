"use client";

import React from "react";
import { Price } from "@/components/atoms/Price";
import { QuantitySelector } from "@/components/molecules/QuantitySelector";
import { useAppDispatch } from "@/redux/hooks";
import { updateQuantity, removeFromCart } from "@/features/cart/redux/cartSlice";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutItemProps {
    item: {
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        maxQuantity: number;
    };
}

export function CheckoutItem({ item }: CheckoutItemProps) {
    const dispatch = useAppDispatch();

    const handleQuantityChange = (newQuantity: number) => {
        dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    };

    const handleRemove = () => {
        dispatch(removeFromCart(item.id));
    };

    return (
        <div className="flex items-center gap-3 py-2">
            <div className="h-16 w-16 overflow-hidden rounded-xl bg-white p-1 flex-shrink-0 border shadow-sm">
                <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold truncate leading-none">{item.name}</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        onClick={handleRemove}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <QuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={handleQuantityChange}
                        max={item.maxQuantity}
                        className="scale-90 origin-left"
                    />
                    <Price amount={item.price * item.quantity} className="text-sm font-bold text-primary" />
                </div>
            </div>
        </div>
    );
}
