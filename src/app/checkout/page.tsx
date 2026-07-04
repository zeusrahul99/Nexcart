import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const cartItems = cart?.items || [];

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  // Map to simple shape if needed, or pass directly
  const serializedItems = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image || undefined,
    },
  }));

  return (
    <div className="min-h-screen py-12 relative">
      {/* Background Orbs */}
      <div className="orb orb-violet w-[400px] h-[400px] -top-40 right-0 opacity-50" />
      <div className="orb orb-indigo w-[300px] h-[300px] bottom-0 left-0 opacity-40" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold tracking-tight gradient-text-subtle">
            Checkout
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Complete your order details below
          </p>
          <div className="h-1 w-12 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] rounded-full mt-3" />
        </div>
        <CheckoutForm initialCartItems={serializedItems} />
      </main>
    </div>
  );
}
