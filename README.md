# NexCart

A full-stack Next.js ecommerce platform with user authentication, product catalog, shopping cart, payment processing, order management, and admin dashboard.

## Tech Stack

- **Frontend**: Next.js 16+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Features

- ✅ User Authentication (Sign up, Sign in)
- ✅ Product Catalog & Listing
- ✅ Shopping Cart Management
- ✅ Order Management
- ✅ Payment Processing (Stripe integration ready)
- ✅ Admin Dashboard (scaffold ready)
- ✅ Product Reviews & Ratings
- ✅ Responsive Design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (products, cart, orders, auth)
│   ├── admin/            # Admin dashboard pages
│   ├── auth/             # Authentication pages
│   └── page.tsx          # Home page
├── components/
│   ├── products/         # Product components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   └── admin/            # Admin components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
prisma/
└── schema.prisma         # Database schema
```

## API Routes

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

## Next Steps

1. **Setup PostgreSQL**: Configure your database connection
2. **Add Environment Variables**: Set up Stripe keys
3. **Run Migrations**: `npx prisma migrate dev`
4. **Create Sample Products**: Use the admin API
5. **Customize Branding**: Update styles and content
6. **Deploy**: Push to production
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
