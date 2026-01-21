"use client";

import React from "react";
import { X, Package, MapPin, User, Phone, CreditCard, Truck, Calendar, ShoppingBag } from "lucide-react";
import { Order } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/atoms/Price";
import { Image as ResilientImage } from "@/components/atoms/Image/Image";
import { WhatsAppTemplateSelector } from "./WhatsAppTemplateSelector";



interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
    if (!isOpen || !order) return null;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "pending": return "destructive";
            case "processing": return "warning";
            case "shipped": return "default";
            case "delivered": return "success";
            case "cancelled": return "outline";
            default: return "secondary";
        }
    };

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: "Pendiente",
            processing: "Procesando",
            shipped: "Enviado",
            delivered: "Entregado",
            cancelled: "Cancelado"
        };
        return map[status] || status;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl bg-card border rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-extrabold tracking-tight">Orden #{order.id.slice(0, 8).toUpperCase()}</h2>
                                <Badge variant={getStatusVariant(order.status) as any} className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase">
                                    {getStatusLabel(order.status)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(order.createdAt).toLocaleString('es-CO')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-all text-muted-foreground hover:text-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer & Shipping Info */}
                        <div className="space-y-6">
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <User size={18} />
                                    <h3 className="font-bold uppercase tracking-widest text-[11px]">Información del Cliente</h3>
                                </div>
                                <div className="bg-muted/30 border rounded-3xl p-6 space-y-3">
                                    <p className="font-bold text-lg">{order.shipping.firstName} {order.shipping.lastName}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                                        <Phone size={14} />
                                        <div className="flex items-center justify-between w-full">
                                            <span>{order.shipping.whatsapp || order.shipping.phone}</span>
                                            {(order.shipping.whatsapp || order.shipping.phone) && (
                                                <WhatsAppTemplateSelector
                                                    order={order}
                                                    phone={order.shipping.whatsapp || order.shipping.phone}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone size={14} />
                                        <span>{order.shipping.backupPhone || "No especificado"} (Respaldo)</span>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <MapPin size={18} />
                                    <h3 className="font-bold uppercase tracking-widest text-[11px]">Dirección de Entrega</h3>
                                </div>
                                <div className="bg-muted/30 border rounded-3xl p-6 space-y-2">
                                    <p className="font-bold">{order.shipping.address}</p>
                                    <p className="text-sm text-muted-foreground">{order.shipping.city}, {order.shipping.department}</p>
                                    {order.shipping.locality && <p className="text-sm text-muted-foreground">Localidad: {order.shipping.locality}</p>}
                                    <p className="text-sm italic text-muted-foreground">Ref: {order.shipping.landmark}</p>
                                </div>
                            </section>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Package size={18} />
                                    <h3 className="font-bold uppercase tracking-widest text-[11px]">Resumen del Pedido</h3>
                                </div>
                                <div className="bg-muted/30 border rounded-3xl overflow-hidden">
                                    <div className="divide-y divide-border">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, idx) => (
                                                <div key={idx} className="p-5 flex gap-5 items-center hover:bg-muted/20 transition-colors">
                                                    <div className="relative h-16 w-16 rounded-2xl bg-background border shadow-sm flex-shrink-0 overflow-hidden group">
                                                        {item.image ? (
                                                            <ResilientImage

                                                                src={item.image}
                                                                alt={item.name}
                                                                fill
                                                                sizes="64px"
                                                                className="transition-transform duration-500 group-hover:scale-110"
                                                            />

                                                        ) : (

                                                            <div className="h-full w-full flex items-center justify-center bg-muted">
                                                                <ShoppingBag size={20} className="text-muted-foreground/50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-extrabold text-sm mb-1 leading-tight">{item.name}</p>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold rounded-lg border-none bg-primary/5 text-primary">
                                                                CANT: {item.quantity}
                                                            </Badge>
                                                            <span className="text-[11px] font-medium text-muted-foreground">
                                                                <Price amount={item.price} className="inline text-muted-foreground" /> c/u
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <Price amount={item.price * item.quantity} className="text-sm font-black text-foreground" />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center">
                                                <p className="text-sm text-muted-foreground font-medium">No hay productos en esta orden</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-muted/50 p-6 space-y-2">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Subtotal</span>
                                            <Price amount={order.subtotal} />
                                        </div>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Envío</span>
                                            <Price amount={order.shippingCost} />
                                        </div>
                                        {order.tax > 0 && (
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Impuestos</span>
                                                <Price amount={order.tax} />
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-dashed">
                                            <span>Total</span>
                                            <Price amount={order.total} className="text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <CreditCard size={18} />
                                    <h3 className="font-bold uppercase tracking-widest text-[11px]">Método de Pago</h3>
                                </div>
                                <div className="bg-muted/30 border rounded-3xl p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={20} className="text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="font-bold uppercase tracking-wider text-sm">
                                                {order.payment.method === 'cash' ? 'Efectivo' :
                                                    order.payment.method === 'nequi' ? 'Nequi' :
                                                        order.payment.method === 'daviplata' ? 'Daviplata' :
                                                            order.payment.method === 'dataphone' ? 'Datafono' :
                                                                order.payment.method === 'cod' ? 'Contraentrega' : 'Anticipado'}
                                            </span>
                                            {order.payment.method === 'cash' && order.payment.cashAmount && (
                                                <div className="mt-1 space-y-1">
                                                    <p className="text-xs text-muted-foreground">
                                                        Paga con: <Price amount={order.payment.cashAmount} className="inline text-xs" />
                                                    </p>
                                                    <p className="text-xs font-bold text-success">
                                                        Cambio: <Price amount={order.payment.cashAmount - order.total} className="inline text-xs" />
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="border-primary/30 text-primary">
                                        {order.payment.method === 'cash' ? 'Pago en Casa' : 'Pagar al Recibir'}
                                    </Badge>

                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t bg-muted/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-muted hover:bg-muted-foreground/10 text-foreground font-bold px-8 py-3 rounded-2xl transition-all"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
