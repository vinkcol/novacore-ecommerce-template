"use client";

import React from "react";
import { X, Package, Tag, Layers, Database, Calendar } from "lucide-react";
import { Product } from "../../types/product.types";
import { Badge } from "@/components/ui/badge";

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
    if (!isOpen || !product) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-card border rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Image/Banner */}
                <div className="relative h-48 sm:h-64 bg-muted">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all border border-white/20"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-8 right-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                variant={product.inStock ? "outline" : "destructive"}
                                className={product.inStock ? "border-green-400 text-green-400 bg-green-400/10 backdrop-blur-md" : ""}
                            >
                                {product.inStock ? "Activo" : "Agotado"}
                            </Badge>
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest font-mono">
                                SKU: {product.sku}
                            </span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white leading-tight">
                            {product.name}
                        </h2>
                    </div>
                </div>

                <div className="p-8 sm:p-10 space-y-8">
                    {/* Price and Stock Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard icon={Tag} label="Precio" value={`$${product.price.toLocaleString('es-CO')}`} />
                        <StatCard icon={Layers} label="Categoría" value={product.category} />
                        <StatCard icon={Calendar} label="Actualizado" value={new Date(product.updatedAt || "").toLocaleDateString()} />
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Package size={18} />
                            <h3 className="font-bold uppercase tracking-widest text-[11px]">Descripción</h3>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-foreground leading-relaxed">
                                {product.description}
                            </p>
                            <div
                                className="text-sm text-muted-foreground leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar prose prose-sm prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: product.longDescription || "" }}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-muted hover:bg-muted-foreground/10 text-foreground font-bold px-8 py-3 rounded-2xl transition-all"
                        >
                            Cerrar detalle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-muted/30 border border-muted p-4 rounded-3xl">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Icon size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="font-extrabold text-sm truncate">{value}</p>
        </div>
    );
}
