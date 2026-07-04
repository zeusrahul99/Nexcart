"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserNavProps {
  session: any;
}

export default function UserNav({ session }: UserNavProps) {
  const user = session?.user;

  return (
    <div className="flex items-center gap-5">
      {/* Cart Link with icon */}
      <Link
        href="/cart"
        className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors duration-300 group"
      >
        <svg
          className="w-4 h-4 group-hover:text-[var(--accent-light)] transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        Cart
      </Link>

      {user ? (
        <>
          <Link
            href="/orders"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors duration-300"
          >
            Orders
          </Link>

          {user.isAdmin && (
            <Link
              href="/admin"
              className="text-xs font-bold px-3 py-1.5 rounded-full badge-accent transition-all duration-300 hover:shadow-[0_0_15px_var(--accent-glow-soft)]"
            >
              ✦ Admin
            </Link>
          )}

          <div className="flex items-center gap-3 border-l border-[var(--border)] pl-5">
            {/* Avatar initial */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_var(--accent-glow-soft)]">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)] hidden sm:inline">
              {user.name || user.email?.split("@")[0]}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 border-l border-[var(--border)] pl-5">
          <Link
            href="/auth/signin"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="btn-gradient text-sm px-4 py-2"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
