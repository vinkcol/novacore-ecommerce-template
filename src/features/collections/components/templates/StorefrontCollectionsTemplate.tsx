"use client";

import React, { useEffect } from "react";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCollectionsRequest } from "@/features/collections/redux/collectionsSlice";
import { selectCollections, selectCollectionsLoading } from "@/features/collections/redux/collectionsSelectors";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface StorefrontCollectionsTemplateProps {
    slug: string;
}

export function StorefrontCollectionsTemplate({ slug }: StorefrontCollectionsTemplateProps) {
    const dispatch = useAppDispatch();
    const collections = useAppSelector(selectCollections);
    const loading = useAppSelector(selectCollectionsLoading);

    useEffect(() => {
        if (collections.length === 0) {
            dispatch(fetchCollectionsRequest());
        }
    }, [dispatch, collections.length]);

    const collection = collections.find((c) => c.slug === slug);

    if (loading && !collection) {
        return (
            <ContentLayout>
                <div className="container mx-auto px-4 py-12">
                    <Skeleton className="h-4 w-24 mb-6 rounded-xl" />
                    <Skeleton className="h-12 w-64 mb-4 rounded-2xl" />
                    <Skeleton className="h-6 w-96 mb-12 rounded-xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Skeleton key={i} className="aspect-[4/5] rounded-[32px]" />
                        ))}
                    </div>
                </div>
            </ContentLayout>
        );
    }

    if (!collection && !loading) {
        return (
            <ContentLayout>
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-muted p-6">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black mb-4">Colección no encontrada</h1>
                    <p className="text-muted-foreground mb-12 max-w-md mx-auto">
                        Lo sentimos, la colección que buscas no existe o no está disponible en este momento.
                    </p>
                    <Button asChild className="rounded-2xl h-12 px-8 font-bold">
                        <Link href="/">Volver al inicio</Link>
                    </Button>
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout>
            {/* Hero / Header Section */}
            <section className="bg-muted/30 py-16 border-b">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" className="mb-8 -ml-4 rounded-xl text-muted-foreground hover:text-primary">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-black tracking-tight mb-4 animate-in slide-in-from-top-4 duration-700">
                            {collection?.name}
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium animate-in slide-in-from-top-6 duration-700 delay-100 leading-relaxed">
                            {collection?.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="font-bold text-sm tracking-widest uppercase text-muted-foreground">
                            {collection?.products.length} Productos Encontrados
                        </span>
                    </div>
                </div>

                <ProductGrid
                    products={collection?.products || []}
                    loading={loading}
                />
            </section>
        </ContentLayout>
    );
}
