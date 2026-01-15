import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

const selectProductsState = (state: RootState) => state.products;

export const selectAllProducts = createSelector(
  [selectProductsState],
  (state) => state.products
);

export const selectSelectedProduct = createSelector(
  [selectProductsState],
  (state) => state.selectedProduct
);

export const selectProductsLoading = createSelector(
  [selectProductsState],
  (state) => state.loading
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (state) => state.error
);

export const selectFilters = createSelector(
  [selectProductsState],
  (state) => state.filters
);

export const selectSearch = createSelector(
  [selectProductsState],
  (state) => state.search
);

export const selectSortBy = createSelector(
  [selectProductsState],
  (state) => state.sortBy
);

// Filter and search products
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectFilters, selectSearch],
  (products, filters, search) => {
    let filtered = [...products];

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((p) =>
        p.categories.some(
          (c) => c.toLowerCase() === filters.category?.toLowerCase()
        )
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (p) =>
          p.price >= filters.priceRange!.min &&
          p.price <= filters.priceRange!.max
      );
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      filtered = filtered.filter((p) => p.inStock === filters.inStock);
    }

    // Apply new filter
    if (filters.isNew) {
      filtered = filtered.filter((p) => p.isNew);
    }

    // Apply sale filter
    if (filters.isSale) {
      filtered = filtered.filter((p) => p.isSale);
    }

    return filtered;
  }
);

// Sort products
export const selectSortedProducts = createSelector(
  [selectFilteredProducts, selectSortBy],
  (products, sortBy) => {
    const sorted = [...products];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return sorted.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
      default:
        return sorted;
    }
  }
);

// Get product by ID
export const selectProductById = (id: string) =>
  createSelector([selectAllProducts], (products) =>
    products.find((p) => p.id === id || p.slug === id)
  );

// Get all unique categories
export const selectCategories = createSelector(
  [selectAllProducts],
  (products) => {
    const categories = new Set<string>();
    products.forEach((p) => p.categories.forEach((c) => categories.add(c)));
    return Array.from(categories).sort();
  }
);

// Get all unique tags
export const selectTags = createSelector([selectAllProducts], (products) => {
  const tags = new Set<string>();
  products.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
});

export const selectUpsellProducts = createSelector(
  [selectAllProducts, (state: RootState) => state.cart.items],
  (products, cartItems) => {
    const cartProductIds = new Set(cartItems.map((item) => item.productId));
    return products.filter(
      (p) => p.isCheckoutUpsell && !cartProductIds.has(p.id)
    );
  }
);
