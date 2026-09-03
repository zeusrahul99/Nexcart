import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const initialProducts = [
  {
    name: "Classic White T-Shirt",
    description: "Premium organic cotton t-shirt with a relaxed fit. Perfect for everyday wear.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 100,
    rating: 4.5,
  },
  {
    name: "Minimalist Leather Backpack",
    description: "Handcrafted from full-grain leather, featuring a padded laptop sleeve and water-resistant lining.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 25,
    rating: 4.8,
  },
  {
    name: "Classic Canvas Sneakers",
    description: "Comfortable and durable canvas sneakers with rubber sole. A timeless classic.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 80,
    rating: 4.6,
  },
  {
    name: "Polarized Sunglasses",
    description: "Lightweight matte black frames with UV400 polarized lenses for maximum protection.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 60,
    rating: 4.9,
  },
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Experience premium sound quality with active noise cancellation and 30-hour battery life.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 50,
    rating: 4.8,
  },
  {
    name: "Smart Watch Series 5",
    description: "Track your workouts and stay connected with cellular connectivity and an always-on display.",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 30,
    rating: 4.6,
  },
  {
    name: "Ultra-Thin Laptop",
    description: "Powerful performance in a sleek aluminum chassis. 16GB RAM, 512GB SSD.",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 15,
    rating: 4.9,
  },
  {
    name: "Mechanical Keyboard",
    description: "Tactile switches, RGB backlighting, and a compact 75% layout for ultimate productivity.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 40,
    rating: 4.7,
  },
  {
    name: "The Pragmatic Programmer",
    description: "One of the most significant books on software development, filled with practical advice.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 40,
    rating: 4.9,
  },
  {
    name: "Atomic Habits",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 75,
    rating: 4.9,
  }
];

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    let products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
      await prisma.product.createMany({
        data: initialProducts,
      });
      products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, image, category, stock } = body;

    if (!name || !description || price === undefined || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock) || 0,
        rating: 0,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

