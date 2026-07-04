"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

interface CheckoutFormProps {
  initialCartItems: CartItem[];
}

export default function CheckoutForm({ initialCartItems }: CheckoutFormProps) {
  const router = useRouter();
  const [cartItems] = useState<CartItem[]>(initialCartItems);

  // Shipping Form State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  // Card Info State
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal + shipping;

  // Real-time Credit Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardInfo((prev) => ({ ...prev, cardNumber: formatted }));
  };

  // Real-time Expiry formatting (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    let formatted = value;
    if (value.length >= 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardInfo((prev) => ({ ...prev, expiryDate: formatted }));
  };

  // CVC formatting
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardInfo((prev) => ({ ...prev, cvc: value }));
  };

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { fullName, email, address, city, postalCode } = shippingInfo;
    if (!fullName || !email || !address || !city || !postalCode) {
      setError("Please fill out all shipping information fields.");
      return false;
    }

    if (paymentMethod === "card") {
      const { cardNumber, expiryDate, cvc } = cardInfo;
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Please enter a valid 16-digit card number.");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        setError("Please enter expiration date in MM/YY format.");
        return false;
      }
      if (cvc.length < 3) {
        setError("Please enter a valid CVC code.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing delay (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const shippingAddressStr = `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
      const paymentMethodStr =
        paymentMethod === "card" ? "Credit Card" : "PayPal";

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: shippingAddressStr,
          paymentMethod: paymentMethodStr,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderSuccess(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete payment."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto glass p-12 text-center animate-scale-in">
        {/* Success Glow Ring */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 bg-[var(--success-soft)] border border-[var(--success)]/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
          <svg className="w-12 h-12 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold mb-3 gradient-text-subtle">
          Payment Successful!
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully
          and is being processed.
        </p>

        <div className="glass p-6 mb-10 max-w-md mx-auto text-left">
          <div className="flex justify-between border-b border-[var(--border)] pb-3 mb-3 text-sm text-[var(--text-secondary)]">
            <span>Order ID</span>
            <span className="font-bold text-[var(--text-primary)]">
              #{orderSuccess.id.slice(0, 12)}
            </span>
          </div>
          <div className="flex justify-between border-b border-[var(--border)] pb-3 mb-3 text-sm text-[var(--text-secondary)]">
            <span>Total Paid</span>
            <span className="font-extrabold gradient-text text-base">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-[var(--text-secondary)]">
            <span>Payment Method</span>
            <span className="font-bold text-[var(--text-primary)]">
              {paymentMethod === "card" ? "Credit Card" : "PayPal"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="btn-gradient px-8 py-3.5 text-center"
          >
            View My Orders
          </Link>
          <Link href="/" className="btn-ghost px-8 py-3.5 text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 glass-input text-sm font-medium";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Checkout Forms (Cols 7) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        {error && (
          <div className="p-4 bg-[var(--error-soft)] border border-[var(--error)]/20 rounded-xl text-sm text-[var(--error)] animate-fade-in">
            <p className="font-bold">Error</p>
            <p className="mt-1 opacity-90">{error}</p>
          </div>
        )}

        {/* Shipping Address Box */}
        <div className="glass p-6 animate-fade-in-up">
          <h2 className="text-lg font-extrabold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_var(--accent-glow-soft)]">
              1
            </span>
            Shipping Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                disabled={isProcessing}
                value={shippingInfo.fullName}
                onChange={handleShippingChange}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isProcessing}
                value={shippingInfo.email}
                onChange={handleShippingChange}
                placeholder="jane.doe@example.com"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                required
                disabled={isProcessing}
                value={shippingInfo.address}
                onChange={handleShippingChange}
                placeholder="123 Main St, Apt 4B"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                disabled={isProcessing}
                value={shippingInfo.city}
                onChange={handleShippingChange}
                placeholder="Springfield"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                required
                disabled={isProcessing}
                value={shippingInfo.postalCode}
                onChange={handleShippingChange}
                placeholder="12345"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Country
              </label>
              <select
                name="country"
                disabled={isProcessing}
                value={shippingInfo.country}
                onChange={handleShippingChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>France</option>
                <option>Australia</option>
                <option>India</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Method Box */}
        <div className="glass p-6 animate-fade-in-up stagger-2">
          <h2 className="text-lg font-extrabold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_var(--accent-glow-soft)]">
              2
            </span>
            Payment Method
          </h2>

          {/* Payment tabs */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setPaymentMethod("card")}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 font-bold border ${
                paymentMethod === "card"
                  ? "border-[var(--accent)] bg-[var(--accent-glow-soft)] text-[var(--accent-light)] shadow-[0_0_20px_var(--accent-glow-soft)]"
                  : "border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
              }`}
            >
              <span className="text-2xl">💳</span>
              <span className="text-sm">Credit Card</span>
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => setPaymentMethod("paypal")}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 font-bold border ${
                paymentMethod === "paypal"
                  ? "border-[var(--accent)] bg-[var(--accent-glow-soft)] text-[var(--accent-light)] shadow-[0_0_20px_var(--accent-glow-soft)]"
                  : "border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
              }`}
            >
              <span className="text-2xl">📱</span>
              <span className="text-sm">PayPal</span>
            </button>
          </div>

          {paymentMethod === "card" ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={cardInfo.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 2222 3333 4444"
                    className={`${inputClass} pl-12`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">
                    🔒
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={cardInfo.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    CVC Code
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={cardInfo.cvc}
                    onChange={handleCvcChange}
                    placeholder="123"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 glass rounded-xl text-center text-sm text-[var(--text-secondary)] animate-fade-in">
              <span className="text-3xl mb-3 block">📱</span>
              You will be redirected to PayPal to complete your payment securely
              after clicking &quot;Place Order&quot;.
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isProcessing || cartItems.length === 0}
          className={`w-full btn-gradient py-4 text-lg flex items-center justify-center gap-3 animate-fade-in-up stagger-3 ${
            !isProcessing ? "animate-pulse-glow" : ""
          }`}
        >
          {isProcessing ? (
            <>
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
              Processing Secure Payment...
            </>
          ) : (
            <span>Place Order (${total.toFixed(2)})</span>
          )}
        </button>
      </form>

      {/* Order Summary Sidebar (Cols 5) */}
      <div className="lg:col-span-5">
        <div className="glass p-6 sticky top-24 animate-fade-in-up stagger-4">
          <h2 className="text-lg font-extrabold mb-6">Order Summary</h2>

          {/* Product list */}
          <div className="divide-y divide-[var(--border)] max-h-96 overflow-y-auto mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[var(--text-primary)]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-secondary)]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[var(--text-primary)]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={shipping === 0 ? "font-bold text-[var(--success)]" : ""}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-[var(--border)] pt-4 flex justify-between items-baseline">
              <span className="font-extrabold text-base text-[var(--text-primary)]">
                Total
              </span>
              <span className="font-extrabold text-xl gradient-text">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
