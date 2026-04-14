# QKart - Online Supermarket Shopping

A modern online marketplace for groceries and daily essentials built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Multi-vendor marketplace with shop-specific pricing
- Product listing with images, aisle grouping, and descriptions
- Advanced shopping cart with vendor splitting
- Pay-now and pay-later checkout options
- Admin dashboard with order management
- Responsive design

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app directory
  - `page.tsx` - Home page with product listing
  - `cart/page.tsx` - Shopping cart page
  - `checkout/page.tsx` - Checkout page
  - `components/` - Reusable components
  - `context/` - React context for cart state
  - `types.ts` - TypeScript type definitions
- `admin/page.tsx` - CSV inventory import with aisle mapping for SKU updates and new product creation

## Technologies Used

- Next.js 16
- TypeScript
- Tailwind CSS
- React Context for state management

## Deploy on Vercel

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
