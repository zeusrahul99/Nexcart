"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        window.scrollTo(0, 0);
        router.push(callbackUrl);
        router.refresh();
        setTimeout(() => {
          window.scrollTo({ top: 0 });
        }, 100);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 glass-input text-sm font-medium";

  return (
    <div className="w-full max-w-md glass p-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_var(--accent-glow-soft)]">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2 gradient-text-subtle">
          Welcome Back
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Sign in to access your cart and manage your orders
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[var(--error-soft)] border border-[var(--error)]/20 rounded-xl text-sm text-[var(--error)] animate-fade-in">
          <p className="font-bold">Error</p>
          <p className="mt-1 opacity-90">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-gradient py-3 text-base disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-[var(--border)] pt-6">
        <p className="text-sm text-[var(--text-muted)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-violet w-[400px] h-[400px] -top-20 -left-20 animate-float-slow" />
      <div className="orb orb-indigo w-[350px] h-[350px] bottom-0 right-0 animate-float-slow" style={{ animationDelay: "4s" }} />
      <div className="orb orb-pink w-[200px] h-[200px] top-1/2 right-1/4 animate-float-slow" style={{ animationDelay: "8s" }} />

      <Suspense
        fallback={
          <div className="text-center py-12 text-[var(--text-secondary)]">
            Loading...
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
