import { ContentLayout } from "@/components/templates/ContentLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { getProducts } from "@/features/products/api/products.server";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ContentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Todos los Productos</h1>
          <p className="mt-2 text-muted-foreground">
            Explora nuestra colección completa
          </p>
        </div>
        <ProductGrid products={products} />
      </div>
    </ContentLayout>
  );
}
