import ProductList from "@/components/products/ProductList";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* Compact Premium Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 badge-accent text-[11px] mb-3">
                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
                AI-Powered Shopping
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Discover <span className="gradient-text">Premium Products</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl leading-relaxed">
                Explore our handpicked collection of high-quality products with intelligent recommendations powered by AI.
              </p>
            </div>

            {/* Micro Stats (Pills) */}
            <div className="flex gap-3">
              {[
                { value: "500+", label: "Items" },
                { value: "24/7", label: "AI Help" },
              ].map((stat) => (
                <div key={stat.label} className="glass px-4 py-2 text-center min-w-[80px]">
                  <div className="text-sm font-extrabold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-[var(--accent)]/30 via-transparent to-transparent w-full" />
        </div>

        {/* Product Grid directly at the top */}
        <ProductList />
      </main>
    </div>
  );
}
