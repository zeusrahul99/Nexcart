"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

export default function AiAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Shopping Assistant. 🤖\n\nI can help you find products, check specs, or search within your budget. Try asking me:\n• _\"Recommend headphones under $250\"_\n• _\"Show me clothing items\"_\n• _\"What are your best rated products?\"_",
    },
  ]);

  // Track adding to cart state per product ID
  const [cartAdding, setCartAdding] = useState<Record<string, boolean>>({});
  const [cartSuccess, setCartSuccess] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            products: data.products,
          },
        ]);
      } else {
        throw new Error("Failed to chat");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    setCartAdding((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.status === 401) {
        router.push("/auth/signin?callbackUrl=" + window.location.pathname);
        return;
      }

      if (response.ok) {
        setCartSuccess((prev) => ({ ...prev, [productId]: true }));
        setTimeout(() => {
          setCartSuccess((prev) => ({ ...prev, [productId]: false }));
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCartAdding((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_var(--accent-glow)] transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_40px_var(--accent-glow)] relative border border-white/10"
      >
        {isOpen ? (
          <span className="text-xl font-bold">✕</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--bg-primary)] animate-pulse" />
        )}
      </button>

      {/* Chat Dialog Popup */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[380px] h-[550px] bg-[#0c0c14]/95 rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col overflow-hidden backdrop-blur-xl animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-lg border border-white/10">
                🤖
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">AI Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  <span className="text-[10px] text-gray-100 font-medium">Online & ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors text-sm p-1.5 hover:bg-white/10 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Text content bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm whitespace-pre-line leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white rounded-br-none"
                      : "bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Inline Recommended Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3 w-full max-w-[95%]">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm hover:border-[var(--border-hover)] transition-all duration-300 flex flex-col group"
                      >
                        <div className="w-full h-20 bg-gray-900/50 overflow-hidden relative flex items-center justify-center">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                          <span className="absolute top-1.5 right-1.5 badge-accent text-[8px] font-extrabold">
                            ${prod.price}
                          </span>
                        </div>
                        <div className="p-2 flex-1 flex flex-col justify-between">
                          <h4 className="text-[10px] font-bold text-[var(--text-primary)] truncate">
                            {prod.name}
                          </h4>
                          <button
                            onClick={() => handleAddToCart(prod.id)}
                            disabled={cartAdding[prod.id]}
                            className={`w-full mt-2 text-[9px] font-bold py-1.5 rounded-lg transition-all duration-300 ${
                              cartSuccess[prod.id]
                                ? "bg-[var(--success)] text-white"
                                : "bg-[var(--bg-elevated)] hover:bg-gradient-to-r hover:from-[var(--accent)] hover:to-[var(--accent-dark)] hover:text-white text-[var(--text-secondary)]"
                            }`}
                          >
                            {cartAdding[prod.id]
                              ? "Adding..."
                              : cartSuccess[prod.id]
                              ? "Added! ✓"
                              : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-sm max-w-[70px]">
                <span className="w-2 h-2 bg-[var(--accent-light)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[var(--accent-light)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[var(--accent-light)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2.5 border-t border-[var(--border)] flex gap-1.5 overflow-x-auto bg-[#0a0a0f] flex-shrink-0 scrollbar-none">
            <button
              onClick={() => handleSend("Show electronics")}
              className="text-[10px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow-soft)] text-[var(--text-secondary)] hover:text-[var(--accent-light)] font-bold px-2.5 py-1 rounded-full transition-all duration-300 flex-shrink-0"
            >
              💻 Electronics
            </button>
            <button
              onClick={() => handleSend("Recommend products under $100")}
              className="text-[10px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow-soft)] text-[var(--text-secondary)] hover:text-[var(--accent-light)] font-bold px-2.5 py-1 rounded-full transition-all duration-300 flex-shrink-0"
            >
              🏷️ Under $100
            </button>
            <button
              onClick={() => handleSend("What are the best rated items?")}
              className="text-[10px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-glow-soft)] text-[var(--text-secondary)] hover:text-[var(--accent-light)] font-bold px-2.5 py-1 rounded-full transition-all duration-300 flex-shrink-0"
            >
              ⭐ Top Rated
            </button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-[var(--border)] bg-[#0c0c14] flex gap-2 items-center flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask for recommendations..."
              className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-8 h-8 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] hover:from-[var(--accent-light)] hover:to-[var(--accent)] text-white rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 flex-shrink-0 text-sm"
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
