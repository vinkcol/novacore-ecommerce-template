import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, CreditCard, ShoppingCart, Loader2, Store, Clock, Calendar } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectConfiguration } from "@/features/configuration/redux/configurationSelectors";
import { selectCartTotals } from "@/features/cart/redux/cartSelectors";
import { Price } from "@/components/atoms/Price";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutSummary } from "./CheckoutSummary";
import { setOrderStatus } from "../redux/checkoutSlice";

import { shopConfig } from "@/data/shop-config";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// MOCKED DATA - INTEGRATE LATER
const STORE_SCHEDULE = [
    { day: "Lunes - Jueves", hours: "12:00 PM - 10:00 PM" },
    { day: "Viernes - Sábado", hours: "12:00 PM - 11:30 PM" },
    { day: "Domingo", hours: "12:00 PM - 10:00 PM" },
];

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const dispatch = useAppDispatch();
    const config = useAppSelector(selectConfiguration);
    const cartTotals = useAppSelector(selectCartTotals);
    const orderStatus = useAppSelector((state) => state.checkout.orderStatus);
    const [mounted, setMounted] = useState(false);

    // Determine if store is closed (explicitly false means closed, undefined/null defaults to open if needed, but here let's assume strict check)
    const isStoreClosed = config?.isOpen === false;

    // Minimum Order Logic
    const minOrderAmount = config?.orderRules?.minOrderAmount || 0;
    const currentAmount = cartTotals.subtotal;
    const remainingAmount = Math.max(0, minOrderAmount - currentAmount);
    const isMinOrderMet = remainingAmount === 0;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const minOrderMessage = config?.orderRules?.minOrderMessage
        ? config.orderRules.minOrderMessage.replace("{amount}", formatCurrency(minOrderAmount))
        : `El monto mínimo de compra es de ${formatCurrency(minOrderAmount)}`;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleWhatsAppRedirect = () => {
        const message = "Hola, necesito ayuda con mi pedido en contraentrega.";
        const url = `https://wa.me/${shopConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

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

    if (!mounted) return null;

    if (orderStatus === "success") {
        return createPortal(
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
            </AnimatePresence>,
            document.body
        );
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
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
                            {isStoreClosed ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center relative">
                                        <Store className="h-10 w-10 text-muted-foreground" />
                                        <div className="absolute -bottom-1 -right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full border-4 border-background">
                                            <X size={16} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-w-sm">
                                        <h3 className="text-2xl font-black tracking-tight">¡La tienda está cerrada!</h3>
                                        <p className="text-muted-foreground font-medium">
                                            Lo sentimos, en este momento no estamos recibiendo pedidos. Nuestro equipo está recargando energías.
                                        </p>
                                    </div>

                                    <div className="w-full max-w-sm bg-muted/30 rounded-[24px] p-6 border border-muted-foreground/10">
                                        <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase tracking-widest text-xs">
                                            <Clock size={14} />
                                            Horarios de Atención
                                        </div>
                                        <div className="space-y-3">
                                            {STORE_SCHEDULE.map((schedule, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="font-medium text-foreground/80">{schedule.day}</span>
                                                    <span className="font-bold">{schedule.hours}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pb-6 h-full">
                                    {!isMinOrderMet && minOrderAmount > 0 && (
                                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center space-y-2 animate-in fade-in zoom-in duration-300">
                                            <p className="text-red-600 font-medium text-sm">
                                                {minOrderMessage}
                                            </p>
                                            <div className="text-red-700 font-bold">
                                                Faltan <Price amount={remainingAmount} className="inline" />
                                            </div>
                                        </div>
                                    )}
                                    <CheckoutSummary />
                                    <CheckoutForm onSubmitSuccess={() => { }} />
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t bg-muted/20 p-6 space-y-3">
                            {isStoreClosed ? (
                                <Button
                                    onClick={onClose}
                                    size="lg"
                                    className="h-14 w-full rounded-2xl bg-primary text-lg font-bold hover:bg-primary/90 transition-all active:scale-[0.98]"
                                >
                                    Ver Menú
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        form="checkout-form"
                                        type="submit"
                                        size="lg"
                                        disabled={orderStatus === "submitting" || !isMinOrderMet}
                                        className="h-14 w-full rounded-2xl bg-green-600 text-lg font-bold hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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

                                    <div className="grid grid-cols-1 gap-2">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="h-12 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50"
                                            onClick={handleWhatsAppRedirect}
                                        >
                                            <FaWhatsapp className="mr-2 h-5 w-5" />
                                            <span className="text-xs font-bold uppercase">PEDIR POR WHATSAPP</span>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
