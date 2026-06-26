"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import type { Category, Product, SortOption } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ShopContentProps {
  categories: Category[];
}

export function ShopContent({ categories }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) ?? "newest"
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const supabase = createClient();
      let query = supabase
        .from("products")
        .select("*, categories(*)")
        .eq("is_active", true);

      if (category) {
        const cat = categories.find((c) => c.slug === category);
        if (cat) {
          query = query.eq("category_id", cat.id);
        }
      }

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      switch (sort) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "name-asc":
          query = query.order("name", { ascending: true });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data } = await query;
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    }

    fetchProducts();
  }, [category, search, sort, categories]);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar Filters - Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="card sticky top-24 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold text-earth-900">
            Categories
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  setCategory("");
                  updateParams("category", "");
                }}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  !category
                    ? "bg-terracotta-100 font-medium text-terracotta-700"
                    : "text-earth-600 hover:bg-cream-100"
                )}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setCategory(cat.slug);
                    updateParams("category", cat.slug);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    category === cat.slug
                      ? "bg-terracotta-100 font-medium text-terracotta-700"
                      : "text-earth-600 hover:bg-cream-100"
                  )}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex-1">
        {/* Search & Sort Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-earth-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateParams("search", e.target.value);
              }}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost border border-earth-200 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortOption);
                updateParams("sort", e.target.value);
              }}
              className="input-field w-auto"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="mb-6 card p-4 lg:hidden">
            <h3 className="mb-3 font-semibold text-earth-900">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCategory("");
                  updateParams("category", "");
                  setShowFilters(false);
                }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  !category
                    ? "bg-terracotta-600 text-white"
                    : "bg-cream-200 text-earth-700"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.slug);
                    updateParams("category", cat.slug);
                    setShowFilters(false);
                  }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm transition-colors",
                    category === cat.slug
                      ? "bg-terracotta-600 text-white"
                      : "bg-cream-200 text-earth-700"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-cream-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/3 rounded bg-cream-200" />
                  <div className="h-5 w-2/3 rounded bg-cream-200" />
                  <div className="h-5 w-1/4 rounded bg-cream-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            emptyMessage="No products match your search. Try different filters."
          />
        )}
      </div>
    </div>
  );
}
