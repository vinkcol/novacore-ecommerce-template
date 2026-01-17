"use client";

import React, { useEffect } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Loader2, Tag, Library } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/useToast";
import { ProductDetailModal } from "./ProductDetailModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Product } from "../../types/product.types";
import {
    fetchProductsStart,
    deleteProductStart,
    setSelectedProduct,
    resetCreateStatus
} from "../../redux/adminProductsSlice";
import {
    selectAdminProducts,
    selectAdminProductsLoading,
    selectAdminProductsError,
    selectAdminProductsLastUpdated,
    selectAdminProductsDeleting,
    selectAdminProductsDeleteSuccess
} from "../../redux/adminProductsSelectors";

const ProductRow = React.memo(({
    product,
    onView,
    onEdit,
    onDelete
}: {
    product: Product;
    onView: (p: Product) => void;
    onEdit: (p: Product) => void;
    onDelete: (p: Product) => void;
}) => {
    return (
        <tr className="hover:bg-muted/20 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-muted overflow-hidden border shadow-sm group-hover:scale-105 transition-transform">
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-foreground leading-none mb-1">{product.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{product.sku}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-xs font-bold text-muted-foreground/80">{product.category}</td>
            <td className="px-6 py-4">
                <Badge
                    variant="secondary"
                    className={(product.type === "variable" || product.hasVariants)
                        ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200/60 transition-colors"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200/60 transition-colors"
                    }
                >
                    {(product.type === "variable" || product.hasVariants) ? "Variante" : "Unidad"}
                </Badge>
            </td>
            <td className="px-6 py-4 font-extrabold text-base">
                ${product.price ? product.price.toLocaleString('es-CO') : '0'}
            </td>
            <td className="px-6 py-4 font-bold text-muted-foreground">{product.stockQuantity} uds</td>
            <td className="px-6 py-4">
                <Badge
                    variant={product.inStock ? "outline" : "destructive"}
                    className={product.inStock ? "border-green-500 text-green-600 bg-green-50/50" : ""}
                >
                    {product.inStock ? "Activo" : "Agotado"}
                </Badge>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onView(product)}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-blue-600"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(product)}
                        className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
});

ProductRow.displayName = "ProductRow";

export function ProductList() {
    const router = useRouter();
    const dispatch = useDispatch();
    const toast = useToast();

    // Redux State
    const products = useSelector(selectAdminProducts);
    const loading = useSelector(selectAdminProductsLoading);
    const error = useSelector(selectAdminProductsError);
    const lastUpdated = useSelector(selectAdminProductsLastUpdated);
    const deleting = useSelector(selectAdminProductsDeleting);
    const deleteSuccess = useSelector(selectAdminProductsDeleteSuccess);

    // Local UI State
    const [selectedProduct, setLocalSelectedProduct] = React.useState<Product | null>(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    useEffect(() => {
        dispatch(fetchProductsStart());
    }, [dispatch]);

    useEffect(() => {
        if (deleteSuccess) {
            toast.vink('Producto eliminado', {
                description: 'El inventario se ha actualizado correctamente.'
            });
            setIsDeleteOpen(false);
            setLocalSelectedProduct(null);
            dispatch(resetCreateStatus());
        }
    }, [deleteSuccess, dispatch, toast]);

    // Handlers
    const handleView = (product: Product) => {
        setLocalSelectedProduct(product);
        setIsDetailOpen(true);
    };

    const handleEdit = (product: Product) => {
        router.push(`/admin/products/${product.id}/edit`);
    };

    const handleDelete = (product: Product) => {
        setLocalSelectedProduct(product);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedProduct?.id) {
            dispatch(deleteProductStart(selectedProduct.id));
        }
    };

    const tableContent = React.useMemo(() => {
        if ((loading && products.length === 0) || (!lastUpdated && !error)) {
            return (
                <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm font-bold text-muted-foreground animate-pulse">Cargando inventario...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                        <p className="font-bold text-destructive">{error}</p>
                        <button
                            onClick={() => dispatch(fetchProductsStart())}
                            className="mt-4 text-sm font-bold underline text-primary"
                        >
                            Reintentar carga
                        </button>
                    </td>
                </tr>
            );
        }

        if (products.length === 0) {
            return (
                <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground font-medium">
                        No se encontraron productos en el inventario.
                    </td>
                </tr>
            );
        }

        return products.map((product) => (
            <ProductRow
                key={product.id}
                product={product}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        ));
    }, [products, loading, error, lastUpdated, dispatch]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        className="w-full bg-background border rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Buscar productos..."
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => router.push("/admin/categories")}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-secondary/80 transition-all"
                    >
                        <Tag size={18} />
                        Categorías
                    </button>
                    <button
                        onClick={() => router.push("/admin/collections")}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-secondary/80 transition-all"
                    >
                        <Library size={18} />
                        Colecciones
                    </button>
                    <button
                        onClick={() => router.push("/admin/products/new")}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus size={18} />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border bg-card shadow-sm relative">
                {loading && products.length > 0 && (
                    <div className="absolute inset-0 z-10 bg-card/40 backdrop-blur-[1px] flex items-center justify-center transition-all">
                        <div className="bg-background/80 p-3 rounded-2xl shadow-xl border animate-in zoom-in-95 duration-200">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    </div>
                )}
                <table className="w-full border-collapse text-left">
                    <thead className="bg-muted/30 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        <tr>
                            <th className="px-6 py-5">Producto</th>
                            <th className="px-6 py-5">Categoría</th>
                            <th className="px-6 py-5">Tipo</th>
                            <th className="px-6 py-5">Precio</th>
                            <th className="px-6 py-5">Stock</th>
                            <th className="px-6 py-5">Estado</th>
                            <th className="px-6 py-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm font-medium">
                        {tableContent}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <ProductDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                product={selectedProduct}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                productName={selectedProduct?.name || ""}
                isDeleting={deleting}
            />
        </div>
    );
}
