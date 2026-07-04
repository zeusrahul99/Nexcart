import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/lib/auth";
import UserNav from "@/components/UserNav";
import AiAssistant from "@/components/chat/AiAssistant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexCart — Premium Shopping Experience",
  description:
    "Discover curated premium products with AI-powered recommendations. A modern e-commerce platform built for the discerning shopper.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {/* ── Navbar ── */}
        <header className="glass-navbar sticky top-0 z-40">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight gradient-text hover:opacity-80 transition-opacity duration-300"
            >
              ◆ NexCart
            </Link>
            <div className="flex gap-6 items-center">
              <Link
                href="/"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors duration-300"
              >
                Home
              </Link>
              <UserNav session={session} />
            </div>
          </nav>
          {/* Subtle gradient bottom border */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
        </header>

        <main className="flex-1">{children}</main>

        <AiAssistant />

        {/* ── Footer ── */}
        <footer className="mt-20 border-t border-[var(--border)]">
          {/* Gradient separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand Column */}
              <div>
                <h3 className="text-lg font-extrabold gradient-text mb-3">
                  ◆ NexCart
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Premium products, curated for you. Experience shopping
                  reimagined with AI-powered recommendations.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: "Products", href: "/" },
                    { label: "Cart", href: "/cart" },
                    { label: "Orders", href: "/orders" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-light)] transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  Support
                </h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Have questions? Our AI assistant is available 24/7. Click the
                  chat icon in the bottom right corner.
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-[var(--text-muted)]">
                &copy; {new Date().getFullYear()} NexCart. All rights reserved.
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Built with Next.js &bull; Powered by AI
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
