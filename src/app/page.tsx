"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductsRequest } from "@/features/products/redux/productsSlice";
import { fetchCollectionsRequest } from "@/features/collections/redux/collectionsSlice";
import {
  selectAllProducts,
  selectProductsLoading,
} from "@/features/products/redux/productsSelectors";
import {
  selectCollections,
  selectCollectionsLoading
} from "@/features/collections/redux/collectionsSelectors";
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
  const productsLoading = useAppSelector(selectProductsLoading);

  const collections = useAppSelector(selectCollections);
  const collectionsLoading = useAppSelector(selectCollectionsLoading);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProductsRequest());
    }
    dispatch(fetchCollectionsRequest());
  }, [dispatch, products.length]);

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
          <h1 className="mb-4 text-5xl font-bold md:text-6xl tracking-tight animate-in slide-in-from-top-4 duration-700">{hero.title}</h1>
          <p className="mb-8 text-xl md:text-2xl animate-in slide-in-from-top-6 duration-700 delay-100">{hero.subtitle}</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl h-14 px-8 font-bold animate-in zoom-in-95 duration-500 delay-300">
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
                  className="flex flex-col items-center text-center group transition-all"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 font-bold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Collections Sections */}
      <div className="space-y-16 py-16">
        {collectionsLoading && collections.length === 0 ? (
          <section className="container mx-auto px-4">
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-48 bg-muted rounded-2xl" />
                <div className="h-4 w-64 bg-muted rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 w-full">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-[4/5] bg-muted rounded-[32px]" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          collections.map((collection) => (
            <section key={collection.id} className="container mx-auto px-4">
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tight">{collection.name}</h2>
                  <p className="mt-2 text-muted-foreground font-medium max-w-2xl">
                    {collection.description}
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-2xl border-2 font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all self-start md:self-auto">
                  <Link href={`/collections/${collection.slug}`}>Explorar Colección</Link>
                </Button>
              </div>
              <ProductGrid
                products={collection.products.slice(0, 4)}
                loading={collectionsLoading}
              />
            </section>
          ))
        )}
      </div>
    </ContentLayout>
  );
}
