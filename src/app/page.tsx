"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { StoreStatus } from "@/components/molecules/StoreStatus";
import { CartContent } from "@/components/organisms/CartPanel/CartContent";
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
import { useCommerceConfig } from "@/hooks/useCommerceConfig";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const productsLoading = useAppSelector(selectProductsLoading);

  const collections = useAppSelector(selectCollections);
  const collectionsLoading = useAppSelector(selectCollectionsLoading);



  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    dispatch(fetchProductsRequest());
    dispatch(fetchCollectionsRequest());


    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsHeroVisible(false);
      } else {
        setIsHeroVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Group filtered products by category
  const productsByCategory = useMemo(() => {
    const groups: Record<string, typeof products> = {};
    filteredProducts.forEach(p => {
      // Use the first category if it's an array, or the string category field
      const catName = Array.isArray(p.categories) && p.categories.length > 0
        ? p.categories[0]
        : (p.category || "General");

      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(p);
    });
    return groups;
  }, [filteredProducts]);

  // Extract all available categories from original products for the filter buttons
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      const catName = Array.isArray(p.categories) && p.categories.length > 0
        ? p.categories[0]
        : (p.category || "General");
      cats.add(catName);
    });
    return ["Todos", ...Array.from(cats)];
  }, [products]);

  const { hero } = shopContent.homepage;
  const { config } = useCommerceConfig(); // Fetch dynamic config

  // Include 'idle' state as loading since fetch hasn't started yet
  const isLoading = productsLoading === 'idle' || productsLoading === 'pending' || collectionsLoading;

  return (
    <ContentLayout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${config?.bannerUrl || hero.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl tracking-tight animate-in slide-in-from-top-4 duration-700">
            {config?.heroTitle || hero.title}
          </h1>
          <p className="mb-8 text-xl md:text-2xl animate-in slide-in-from-top-6 duration-700 delay-100 max-w-2xl mx-auto">
            {config?.heroSubtitle || hero.subtitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-in zoom-in-95 duration-500 delay-300">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl h-14 px-8 font-bold">
              <Link href="#menu">
                {hero.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <AnimatePresence>
              {isHeroVisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#25D366] text-white hover:bg-[#20ba5a] rounded-2xl h-14 px-8 font-bold border-none shadow-lg shadow-green-500/20"
                  >
                    <a href={`https://wa.me/${shopContent.homepage.hero.whatsappNumber || "573123456789"}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                      <FaWhatsapp className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Store Status Selection */}
      <StoreStatus />

      {/* Main Content & Sidebar Grid */}
      <div id="menu" className="container mx-auto px-4 py-16 scroll-mt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          {/* Dynamic Sections */}
          <div className="space-y-16 min-w-0">
            {/* Search and Filters */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar platos..."
                  className="pl-10 h-12 rounded-2xl bg-card border-2 border-primary/10 focus-visible:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {allCategories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={`rounded-full border-2 ${selectedCategory === cat ? 'font-bold' : 'font-medium text-muted-foreground border-transparent bg-muted/30 hover:bg-muted'}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            {isLoading && collections.length === 0 && products.length === 0 ? (
              <div className="space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div className="space-y-2">
                    <div className="h-10 w-48 bg-muted rounded-2xl animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded-xl animate-pulse" />
                  </div>
                  <div className="h-12 w-32 bg-muted rounded-2xl animate-pulse" />
                </div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div
                      key={i}
                      className="h-[140px] animate-pulse rounded-[24px] bg-card/50 border p-3 flex flex-row gap-4"
                    >
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                          <div className="h-3 w-full bg-muted rounded mb-1" />
                          <div className="h-3 w-5/6 bg-muted rounded" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="h-6 w-20 bg-muted rounded" />
                          <div className="h-8 w-8 bg-muted rounded-xl" />
                        </div>
                      </div>
                      <div className="h-full aspect-square flex-shrink-0 bg-muted rounded-[20px]" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* 1. Show Collections first if available */}
                {collections.length > 0 ? (
                  collections.map((collection) => (
                    <section key={collection.id}>
                      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <h2 className="text-4xl font-black tracking-tight">{collection.name}</h2>
                          <p className="mt-2 text-muted-foreground font-medium max-w-2xl">
                            {collection.description}
                          </p>
                        </div>
                        <Button asChild variant="outline" className="rounded-2xl border-2 font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all self-start md:self-auto">
                          <Link href={`/collections/${collection.slug}`}>Ver Platos</Link>
                        </Button>
                      </div>
                      <ProductGrid
                        products={collection.products.slice(0, 4)}
                      />
                    </section>
                  ))
                ) : Object.keys(productsByCategory).length > 0 ? (
                  /* 2. Fallback: Show Products by Categories (Ideal for Menu) */
                  Object.entries(productsByCategory)
                    .filter(([category]) => selectedCategory === "Todos" || selectedCategory === category)
                    .map(([category, catProducts]) => (
                      <section key={category}>
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                          <div>
                            <h2 className="text-4xl font-black tracking-tight">{category}</h2>
                            <p className="mt-2 text-muted-foreground font-medium max-w-2xl">
                              Nuestros mejores platos de {category.toLowerCase()}
                            </p>
                          </div>
                          <Button asChild variant="outline" className="rounded-2xl border-2 font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all self-start md:self-auto">
                            <Link href={`/products?category=${category}`}>Ver Todo</Link>
                          </Button>
                        </div>
                        <ProductGrid
                          products={catProducts.slice(0, 4)}
                        />
                      </section>
                    ))
                ) : (
                  /* 3. Empty State Global */
                  <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center p-8 border-2 border-dashed border-muted rounded-[32px] bg-card/30">
                    <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                      <svg className="w-12 h-12 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">¡Menú en mantenimiento!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Estamos preparando nuevos platos deliciosos para ti.
                      Por favor vuelve en unos momentos.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Desktop Cart Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[38px] border-2 bg-card p-8 shadow-sm min-h-[500px] flex flex-col border-primary/5">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter">Mi pedido</h2>
              </div>
              <CartContent isSidebar className="flex-1" />
            </div>
          </aside>
        </div>
      </div>
    </ContentLayout>
  );
}
