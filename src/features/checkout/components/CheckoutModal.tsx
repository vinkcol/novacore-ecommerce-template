"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, CreditCard, MessageCircle, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutSummary } from "./CheckoutSummary";
import { setOrderStatus } from "../redux/checkoutSlice";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    maxRecommendations?: number;
}

export function CheckoutModal({ isOpen, onClose, maxRecommendations = 1 }: CheckoutModalProps) {
    const dispatch = useAppDispatch();
    const orderStatus = useAppSelector((state) => state.checkout.orderStatus);

    // Reset status and manage body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
            const timer = setTimeout(() => {
                dispatch(setOrderStatus("idle"));
            }, 300);
            return () => {
                clearTimeout(timer);
                document.body.classList.remove("no-scroll");
            };
        }
    }, [isOpen, dispatch]);

    if (orderStatus === "success") {
        return (
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative w-full max-w-sm rounded-[32px] bg-background p-8 text-center shadow-2xl"
                        >
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Truck className="h-10 w-10" />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold">¡Pedido Recibido!</h2>
                            <p className="mb-8 text-muted-foreground">
                                Tu pedido ha sido procesado con éxito. Pronto nos pondremos en contacto contigo por WhatsApp.
                            </p>
                            <Button onClick={onClose} className="w-full rounded-2xl h-12 text-lg">
                                Volver a la tienda
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] bg-background shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <ShoppingCart className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">PAGO CONTRAENTREGA</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
                            <div className="space-y-6 pb-6 h-full">
                                <CheckoutSummary maxRecommendations={maxRecommendations} />

                                <CheckoutForm onSubmitSuccess={() => { }} />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t bg-muted/20 p-6 space-y-3">
                            <Button
                                form="checkout-form"
                                type="submit"
                                size="lg"
                                disabled={orderStatus === "submitting"}
                                className="h-14 w-full rounded-2xl bg-green-600 text-lg font-bold hover:bg-green-700 transition-all active:scale-[0.98]"
                            >
                                {orderStatus === "submitting" ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        PROCESANDO...
                                    </>
                                ) : (
                                    <>
                                        <Truck className="mr-2 h-5 w-5" />
                                        PEDIR AHORA Y PAGAR EN CASA
                                    </>
                                )}
                            </Button>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <Button variant="outline" size="lg" className="h-12 rounded-xl border-2 bg-black text-white hover:bg-gray-900">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span className="text-xs font-bold">Pagar anticipado (10% OFF)</span>
                                </Button>

                                <Button variant="outline" size="lg" className="h-12 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    <span className="text-xs font-bold">WhatsApp</span>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
