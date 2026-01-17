"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/templates/Admin/AdminLayout";
import { ProductForm } from "@/features/products/components/admin/ProductForm";
import { fetchAdminProductByIdApi } from "@/features/products/api/adminProductsApi";
import { Product } from "@/features/products/types/product.types";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProduct() {
            try {
                const data = await fetchAdminProductByIdApi(id);
                if (data) {
                    setProduct(data);
                } else {
                    setError("Producto no encontrado");
                }
            } catch (err) {
                setError("Error al cargar el producto");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadProduct();
        }
    }, [id]);

    return (
        <AdminLayout title="Editar Producto">
            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive font-bold">
                    {error}
                </div>
            ) : product ? (
                <ProductForm initialProduct={product} />
            ) : null}
        </AdminLayout>
    );
}
