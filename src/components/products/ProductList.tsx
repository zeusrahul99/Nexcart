"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { useRouter } from "next/navigation";

const CATEGORIES = ["All", "Fashion", "Electronics", "Books & Stationery"];

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      window.scrollTo({ top: 0 });
    }
  }, [loading, products]);

  useEffect(() => {
    if (!mounted) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [mounted]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.status === 401) {
        router.push("/auth/signin");
        return;
      }

      if (response.ok) {
        setAddedId(productId);
        setTimeout(() => setAddedId(null), 2000);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  if (!mounted || loading) {
    return (
      <div className="space-y-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-[var(--bg-elevated)] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`skeleton animate-fade-in-up stagger-${i + 1}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="h-48 bg-[var(--bg-card)]" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[var(--bg-elevated)] rounded-full w-3/4" />
                <div className="h-3 bg-[var(--bg-elevated)] rounded-full w-full" />
                <div className="h-3 bg-[var(--bg-elevated)] rounded-full w-1/2" />
                <div className="flex justify-between pt-2">
                  <div className="h-6 bg-[var(--bg-elevated)] rounded-full w-20" />
                  <div className="h-6 bg-[var(--bg-elevated)] rounded-full w-16" />
                </div>
                <div className="h-10 bg-[var(--bg-elevated)] rounded-xl w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter Section */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-md"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center animate-float">
            <span className="text-4xl">🏷️</span>
          </div>
          <p className="text-[var(--text-secondary)] text-lg font-medium">
            No products found in {selectedCategory}
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            Try selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                justAdded={addedId === product.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
