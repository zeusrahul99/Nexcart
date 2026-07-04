"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (response.status === 401) {
        setError("You must be an admin to add products");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      setSuccess("Product created successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 glass-input text-sm font-medium";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Background Orbs */}
      <div className="orb orb-violet w-[450px] h-[450px] -top-20 -left-20 opacity-30" />
      <div className="orb orb-indigo w-[350px] h-[350px] bottom-10 right-10 opacity-20" />

      <h1 className="text-3xl font-extrabold mb-2 animate-fade-in-up gradient-text-subtle">
        Admin Dashboard
      </h1>
      <p className="text-[var(--text-secondary)] mb-8 animate-fade-in-up stagger-1">
        Manage your product catalog and store inventory
      </p>

      <div className="grid md:grid-cols-12 gap-8 relative z-10">
        {/* Add Product Form */}
        <div className="md:col-span-7 glass p-8 animate-fade-in-up stagger-2">
          <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
            <span className="text-2xl">✨</span> Add New Product
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-[var(--error-soft)] border border-[var(--error)]/20 text-[var(--error)] rounded-xl text-sm animate-fade-in">
              <p className="font-bold">Error</p>
              <p className="mt-1 opacity-90">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-[var(--success-soft)] border border-[var(--success)]/20 text-[var(--success)] rounded-xl text-sm animate-fade-in">
              <p className="font-bold">Success</p>
              <p className="mt-1 opacity-90">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Premium Wireless Headphones"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className={`${inputClass} min-h-[100px] resize-y`}
                placeholder="Provide a detailed description of the product features..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className={inputClass}
                  placeholder="249.99"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                  Initial Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Select a category</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-3.5 text-base font-extrabold shadow-md disabled:opacity-50 mt-2"
            >
              {loading ? "Creating Product..." : "Add Product to Store"}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="md:col-span-5 space-y-6 animate-fade-in-up stagger-3">
          <div className="glass p-6 border-l-4 border-l-[var(--accent)]">
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <span>🔧</span> Store Admin Control
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Welcome to the catalog administration panel. Products created here are instantly saved in the SQLite database and made available to all shoppers.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Ensure image URLs point to high-quality assets to preserve the premium aesthetics of the storefront.
            </p>
          </div>

          <div className="glass p-6">
            <h3 className="font-bold text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-4">
              Tips for Best Results
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-light)]">◆</span>
                <span className="text-[var(--text-muted)]">
                  Use clear, high-resolution product photography URLs (e.g. Unsplash).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-light)]">◆</span>
                <span className="text-[var(--text-muted)]">
                  Write descriptive copy containing key features (helps the AI recommendations match keywords!).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-light)]">◆</span>
                <span className="text-[var(--text-muted)]">
                  Assign logical categories so filtering, pricing constraints, and the AI Shopping Assistant function seamlessly.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
