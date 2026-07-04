"use client";

import { Product } from "@/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
  justAdded?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  justAdded,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    setQuantity(1);
  };

  // Generate star rating visual
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg
            key={`full-${i}`}
            className="w-3.5 h-3.5 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalf && (
          <svg
            className="w-3.5 h-3.5 text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-${product.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${product.id})`}
              stroke="currentColor"
              strokeWidth="0.5"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-3.5 h-3.5 text-[var(--text-muted)]/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-[11px] text-[var(--text-muted)] ml-1 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Category icon mapping
  const categoryIcons: Record<string, string> = {
    Electronics: "⚡",
    Clothing: "👕",
    Books: "📚",
    Sports: "🏃",
    Home: "🏠",
  };

  return (
    <div className="glass glass-hover group flex flex-col h-full overflow-hidden">
      {/* Product Image */}
      <div className="relative w-full h-52 overflow-hidden">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-dark)]/10">
            <span className="text-5xl opacity-60">
              {categoryIcons[product.category] || "📦"}
            </span>
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 left-3 badge-accent text-[10px] backdrop-blur-sm">
          {categoryIcons[product.category] || "📦"} {product.category}
        </span>

        {/* Stock Indicator */}
        <span
          className={`absolute top-3 right-3 badge text-[10px] backdrop-blur-sm ${
            product.stock > 0 ? "badge-success" : "badge-error"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.stock > 0
                ? "bg-[var(--success)] animate-pulse"
                : "bg-[var(--error)]"
            }`}
          />
          {product.stock > 0 ? "In Stock" : "Sold Out"}
        </span>

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5 line-clamp-1 group-hover:gradient-text transition-all duration-300">
          {product.name}
        </h3>

        <p className="text-[var(--text-muted)] text-sm mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating Stars */}
        {product.rating > 0 && (
          <div className="mb-3">{renderStars(product.rating)}</div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-4 mt-auto">
          <span className="text-2xl font-extrabold gradient-text">
            ${product.price}
          </span>
        </div>

        {/* Add to Cart */}
        {product.stock > 0 && (
          <div className="flex gap-2">
            <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors text-sm font-bold"
              >
                −
              </button>
              <span className="px-3 py-2 text-sm font-bold text-[var(--text-primary)] min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-2.5 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors text-sm font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                justAdded
                  ? "bg-[var(--success)] text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "btn-gradient"
              }`}
            >
              {justAdded ? "✓ Added!" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
