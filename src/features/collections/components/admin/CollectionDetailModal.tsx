"use client";

import React from "react";
import { X, Library, Tag, Calendar, Package, ArrowRight } from "lucide-react";
import { Collection } from "../../types/collection.types";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { selectAdminProducts } from "@/features/products/redux/adminProductsSelectors";

interface CollectionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    collection: Collection | null;
}

export function CollectionDetailModal({ isOpen, onClose, collection }: CollectionDetailModalProps) {
    const products = useSelector(selectAdminProducts);

    if (!isOpen || !collection) return null;

    // Filter products that belong to this collection
    const collectionProducts = products.filter(p => collection.productIds?.includes(p.id));

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl bg-card border rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative p-8 bg-primary/5 border-b flex-shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-primary/10 rounded-[28px] text-primary">
                            <Library size={40} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge
                                    variant={collection.isActive ? "outline" : "destructive"}
                                    className={collection.isActive ? "border-green-400 text-green-500 bg-green-400/10" : ""}
                                >
                                    {collection.isActive ? "Activa" : "Inactiva"}
                                </Badge>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                                    SLUG: {collection.slug}
                                </span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-foreground leading-tight">
                                {collection.name}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-muted hover:bg-muted-foreground/10 rounded-full text-foreground transition-all border"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-8 custom-scrollbar">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Tag size={18} />
                                <h3 className="font-bold uppercase tracking-widest text-[11px]">Descripción</h3>
                            </div>
                            <p className="text-sm font-bold text-foreground leading-relaxed">
                                {collection.description || "Sin descripción disponible."}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <StatCard icon={Calendar} label="Actualizado" value={new Date(collection.updatedAt || "").toLocaleDateString()} />
                            <StatCard icon={Package} label="Total Productos" value={`${collection.productIds?.length || 0} vinculados`} />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="space-y-6 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-primary">
                                <Package size={18} />
                                <h3 className="font-bold uppercase tracking-widest text-[11px]">Productos en esta Colección</h3>
                            </div>
                            <span className="text-[10px] font-bold px-3 py-1 bg-muted rounded-full text-muted-foreground">
                                {collectionProducts.length} PRODUCTOS
                            </span>
                        </div>

                        {collectionProducts.length === 0 ? (
                            <div className="bg-muted/20 border border-dashed rounded-[32px] p-12 text-center">
                                <Package className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
                                <p className="text-sm font-bold text-muted-foreground">No hay productos seleccionados para esta colección.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {collectionProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group bg-card border rounded-[28px] p-4 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4 relative">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {!product.inStock && (
                                                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                                                    <Badge variant="destructive" className="font-bold">AGOTADO</Badge>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-muted-foreground font-mono truncate">{product.sku}</span>
                                                <span className="text-xs font-extrabold text-primary">
                                                    ${product.price.toLocaleString('es-CO')}
                                                </span>
                                            </div>
                                            <h4 className="font-extrabold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t bg-muted/10 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-muted hover:bg-muted-foreground/10 text-foreground font-bold px-10 py-4 rounded-[20px] transition-all flex items-center gap-2 group"
                    >
                        Cerrar detalle
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
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
