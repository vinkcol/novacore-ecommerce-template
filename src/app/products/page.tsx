"use client";

import { useEffect } from "react";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/features/products/redux/productsThunks";
import {
  selectSortedProducts,
  selectProductsLoading,
} from "@/features/products/redux/productsSelectors";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectSortedProducts);
  const loading = useAppSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <ContentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Todos los Productos</h1>
          <p className="mt-2 text-muted-foreground">
            Explora nuestra colección completa
          </p>
        </div>
        <ProductGrid products={products} loading={loading === "pending"} />
      </div>
    </ContentLayout>
  );
}
