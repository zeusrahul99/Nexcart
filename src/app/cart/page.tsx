"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

interface Cart {
  id?: string;
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          setCart(data);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [mounted]);

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Optimistically update UI
        setCart((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.product.id !== productId)
        }));
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  if (!mounted || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-48 skeleton rounded-lg mb-8" />
        <div className="glass p-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 p-6 border-b border-[var(--border)] animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-16 h-16 skeleton rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 skeleton rounded-full w-40" />
                <div className="h-3 skeleton rounded-full w-24" />
              </div>
              <div className="h-5 skeleton rounded-full w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center animate-float">
          <span className="text-5xl">🛒</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3">Your Cart is Empty</h1>
        <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added anything yet. Explore our products and find something you love.
        </p>
        <Link href="/" className="btn-gradient px-8 py-3 text-base inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-2 animate-fade-in-up">
        Shopping Cart
      </h1>
      <p className="text-[var(--text-secondary)] mb-8 animate-fade-in-up stagger-1">
        {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-3">
          {cart.items.map((item, index) => (
            <div
              key={item.id}
              className="glass glass-hover flex items-center gap-5 p-5 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--text-primary)] truncate">
                  {item.product.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  ${item.product.price.toFixed(2)} each
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                <span className="px-4 py-2 text-sm font-bold text-[var(--text-primary)] min-w-[48px] text-center">
                  {item.quantity}
                </span>
              </div>

              {/* Line Total & Remove Button */}
              <div className="flex items-center gap-4 text-right min-w-[120px] justify-end">
                <span className="font-extrabold text-lg text-[var(--text-primary)]">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.product.id)}
                  className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--error)] hover:border-[var(--error-soft)] hover:bg-[var(--error-soft)] transition-colors duration-200"
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass p-6 sticky top-24 animate-fade-in-up stagger-3">
            <h2 className="text-lg font-extrabold mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span className="font-bold text-[var(--text-primary)]">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Shipping</span>
                <span className="font-bold text-[var(--success)]">Free</span>
              </div>
              <div className="border-t border-[var(--border)] pt-4 flex justify-between items-baseline">
                <span className="font-extrabold text-lg">Total</span>
                <span className="font-extrabold text-2xl gradient-text">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-gradient w-full py-3.5 mt-6 text-center block text-base animate-pulse-glow"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/"
              className="btn-ghost w-full py-3 mt-3 text-center block text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
