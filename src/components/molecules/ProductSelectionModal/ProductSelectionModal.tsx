"use client";

import React, { useState } from "react";
import { Plus, Minus, ShoppingCart, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "@/components/atoms/Image";
import { Price } from "@/components/atoms/Price";
import type { Product } from "@/features/products/types";

interface ProductSelectionModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number, notes: string) => void;
}

export function ProductSelectionModal({
    product,
    isOpen,
    onClose,
    onConfirm,
}: ProductSelectionModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState("");

    if (!product) return null;

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleConfirm = () => {
        onConfirm(quantity, notes);
        setQuantity(1);
        setNotes("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <div className="relative h-48 w-full bg-muted">
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder-product.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6">
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                            {product.name}
                        </h2>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Precio Unitario</p>
                            <Price amount={product.price} className="text-2xl font-black text-primary" />
                        </div>

                        <div className="flex flex-col items-end">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Cantidad</p>
                            <div className="flex items-center gap-4 bg-muted/50 p-1.5 rounded-2xl border border-border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-xl hover:bg-background"
                                    onClick={handleDecrease}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-lg font-black min-w-[20px] text-center">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-xl hover:bg-background"
                                    onClick={handleIncrease}

                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MessageSquare size={16} />
                            <label className="text-xs font-bold uppercase tracking-widest">Notas Adicionales</label>
                        </div>
                        <Textarea
                            placeholder="Ej: Sin cebolla, extra salsa, términos de la carne..."
                            className="min-h-[100px] rounded-2xl bg-muted/30 border-muted focus:ring-primary focus:border-primary resize-none p-4"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <Button
                        className="w-full h-14 rounded-2xl text-base font-bold gap-3 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                        onClick={handleConfirm}
                    >
                        <ShoppingCart size={20} />
                        Agregar al pedido — <Price amount={product.price * quantity} />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
