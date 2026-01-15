"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/atoms/Image";
import { Price } from "@/components/atoms/Price";
import { QuantitySelector } from "../QuantitySelector";
import type { CartItem as CartItemType } from "@/features/cart/types";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 border-b pb-4 last:border-0">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={item.image} alt={item.name} fill />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-medium">{item.name}</h4>
            {item.variant && (
              <p className="text-xs text-muted-foreground">
                {item.variant.name}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onRemove(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(qty) => onQuantityChange(item.id, qty)}
            max={item.maxQuantity}
          />
          <Price amount={item.price * item.quantity} className="text-sm" />
        </div>
      </div>
    </div>
  );
}
