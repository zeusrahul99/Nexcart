"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-48 skeleton rounded-lg mb-8" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass p-6 space-y-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-5 skeleton rounded-full w-32" />
                  <div className="h-3 skeleton rounded-full w-24" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-6 skeleton rounded-full w-20" />
                  <div className="h-4 skeleton rounded-full w-16" />
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <div className="h-4 skeleton rounded-full w-40" />
                <div className="h-4 skeleton rounded-full w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center animate-float">
          <span className="text-5xl">📦</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3">No Orders Yet</h1>
        <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-md mx-auto">
          You haven&apos;t placed any orders yet. Discover our premium products and complete your first purchase!
        </p>
        <Link href="/" className="btn-gradient px-8 py-3 text-base inline-block animate-pulse-glow">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Helper to color-code statuses
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <span className="badge badge-success">✓ Delivered</span>;
      case "PROCESSING":
        return <span className="badge badge-info">⚡ Processing</span>;
      case "PENDING":
        return <span className="badge badge-warning">⏰ Pending</span>;
      default:
        return <span className="badge badge-accent">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status.toUpperCase() === "PAID") {
      return <span className="badge badge-success">Paid</span>;
    }
    return <span className="badge badge-error">{status}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Background Orbs */}
      <div className="orb orb-violet w-[350px] h-[350px] -top-20 right-10 opacity-30" />

      <h1 className="text-3xl font-extrabold mb-2 animate-fade-in-up">My Orders</h1>
      <p className="text-[var(--text-secondary)] mb-8 animate-fade-in-up stagger-1">
        Manage and track your recent orders
      </p>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="glass glass-hover p-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <p className="font-extrabold text-lg text-[var(--text-primary)]">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-[var(--text-muted)] text-sm mt-1 font-medium">
                  Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-start gap-2">
                <span className="text-2xl font-extrabold gradient-text">
                  ${order.totalAmount.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-5">
              <h3 className="font-bold text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                Items Ordered
              </h3>
              <ul className="space-y-3.5">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-xs font-bold text-[var(--accent-light)] border border-[var(--border)]">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.product.name}
                      </span>
                    </div>
                    <span className="font-extrabold text-[var(--text-secondary)]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--border)] flex flex-wrap justify-between items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] font-medium">Payment Status:</span>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
              <div className="text-xs text-[var(--text-muted)] font-medium">
                Ref ID: <span className="font-mono">{order.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
