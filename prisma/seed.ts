import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialProducts = [
  // --- FASHION ---
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

  // --- ELECTRONICS ---
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
    name: "4K Action Camera",
    description: "Capture your adventures in stunning 4K resolution. Waterproof up to 10 meters.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 25,
    rating: 4.5,
  },

  // --- BOOKS & STATIONERY ---
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
    name: "Fountain Pen Set",
    description: "Elegant metal fountain pen with 5 ink cartridges. Smooth writing experience.",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 35,
    rating: 4.7,
  },
  {
    name: "Atomic Habits",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 75,
    rating: 4.9,
  },
  {
    name: "Desk Organizer",
    description: "Wooden desk organizer with compartments for pens, notes, and a phone stand.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 50,
    rating: 4.6,
  },
  // --- ADDITIONAL FASHION ---
  {
    name: "Winter Knit Beanie",
    description: "Keep warm with this soft, stretchable knit beanie. Available in multiple colors.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 150,
    rating: 4.4,
  },
  {
    name: "Classic Aviator Sunglasses",
    description: "Timeless aviator design with gold frames and gradient lenses.",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 65,
    rating: 4.7,
  },
  {
    name: "Fleece Zip-Up Hoodie",
    description: "Cozy fleece interior with a sturdy metal zipper. Great for chilly evenings.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 85,
    rating: 4.5,
  },
  {
    name: "Running Shoes",
    description: "Lightweight and breathable running shoes with responsive cushioning.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 110,
    rating: 4.8,
  },
  {
    name: "Leather Belt",
    description: "Genuine full-grain leather belt with a classic silver buckle.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Fashion",
    stock: 200,
    rating: 4.6,
  },
  // --- ADDITIONAL ELECTRONICS ---
  {
    name: "Wireless Charging Pad",
    description: "Fast 15W wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 300,
    rating: 4.5,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with 360-degree sound and 12-hour playtime.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 90,
    rating: 4.8,
  },
  {
    name: "Smart Home Hub",
    description: "Control your entire home with this voice-activated smart home hub.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Electronics",
    stock: 60,
    rating: 4.7,
  },
  // --- ADDITIONAL BOOKS & STATIONERY ---
  {
    name: "Deep Work",
    description: "Rules for Focused Success in a Distracted World by Cal Newport.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 65,
    rating: 4.8,
  },
  {
    name: "Leather Journal",
    description: "Handmade leather bound journal with unlined vintage paper.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 40,
    rating: 4.9,
  },
  {
    name: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship by Robert C. Martin.",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Books & Stationery",
    stock: 80,
    rating: 4.9,
  }
];

async function main() {
  console.log("Start seeding products...");
  
  // Clear existing dependents to avoid foreign key constraint errors
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.review.deleteMany({});
  
  // Clear existing products
  await prisma.product.deleteMany({});
  
  for (const p of initialProducts) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }
  
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
