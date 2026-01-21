"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface ProductFilterSidebarProps {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    initialFilters: {
        category?: string;
        minPrice?: string;
        maxPrice?: string;
    };
}

export function ProductFilterSidebar({
    categories,
    minPrice: globalMin,
    maxPrice: globalMax,
    initialFilters,
}: ProductFilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [minPriceInput, setMinPriceInput] = useState(initialFilters.minPrice || "");
    const [maxPriceInput, setMaxPriceInput] = useState(initialFilters.maxPrice || "");

    // Update local state when URL params change (e.g. clear filters)
    useEffect(() => {
        setMinPriceInput(searchParams.get("minPrice") || "");
        setMaxPriceInput(searchParams.get("maxPrice") || "");
    }, [searchParams]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const updateFilters = (name: string, value: string) => {
        router.push(pathname + "?" + createQueryString(name, value));
    };

    const handlePriceApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (minPriceInput) params.set("minPrice", minPriceInput);
        else params.delete("minPrice");

        if (maxPriceInput) params.set("maxPrice", maxPriceInput);
        else params.delete("maxPrice");

        router.push(pathname + "?" + params.toString());
    };

    const clearAllFilters = () => {
        router.push(pathname);
        setMinPriceInput("");
        setMaxPriceInput("");
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filtros</h3>
                {(searchParams.toString().length > 0) && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto p-0 text-muted-foreground hover:text-primary">
                        Limpiar
                    </Button>
                )}
            </div>
            <Separator />

            {/* Categories */}
            <div className="space-y-4">
                <h4 className="font-medium">Categorías</h4>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => updateFilters("category", "")}
                        className={`text-left text-sm transition-colors hover:text-primary ${!searchParams.get("category") ? "font-medium text-primary" : "text-muted-foreground"
                            }`}
                    >
                        Todas
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => updateFilters("category", category)}
                            className={`text-left text-sm transition-colors hover:text-primary ${searchParams.get("category") === category
                                    ? "font-medium text-primary"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium">Precio</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="minPrice" className="text-xs">
                            Mínimo
                        </Label>
                        <Input
                            id="minPrice"
                            type="number"
                            placeholder={globalMin.toString()}
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            className="h-8"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPrice" className="text-xs">
                            Máximo
                        </Label>
                        <Input
                            id="maxPrice"
                            type="number"
                            placeholder={globalMax.toString()}
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            className="h-8"
                        />
                    </div>
                </div>
                <Button onClick={handlePriceApply} className="w-full" size="sm">
                    Aplicar Precio
                </Button>
            </div>
        </div>
    );
}
