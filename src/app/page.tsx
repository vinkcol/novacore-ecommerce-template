"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/features/products/redux/productsThunks";
import {
  selectAllProducts,
  selectProductsLoading,
} from "@/features/products/redux/productsSelectors";
import shopContent from "@/data/shop-content.json";

const iconMap = {
  Truck,
  Shield,
  RotateCcw,
  Headphones,
};

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const loading = useAppSelector(selectProductsLoading);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const { hero, benefits } = shopContent.homepage;

  return (
    <ContentLayout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">{hero.title}</h1>
          <p className="mb-8 text-xl md:text-2xl">{hero.subtitle}</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href={hero.ctaLink}>
              {hero.ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-b bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = iconMap[benefit.icon as keyof typeof iconMap];
              return (
                <div
                  key={benefit.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Productos Destacados</h2>
              <p className="mt-2 text-muted-foreground">
                Descubre nuestros artículos más populares
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">Ver Todos</Link>
            </Button>
          </div>
          <ProductGrid
            products={featuredProducts}
            loading={loading === "pending"}
          />
        </div>
      </section>
    </ContentLayout>
  );
}
