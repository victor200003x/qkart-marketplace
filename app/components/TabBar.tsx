'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function TabBar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 px-4">
      <div className="rounded-full border border-white/20 bg-white/15 px-6 py-3 shadow-[0_40px_120px_-80px_rgba(15,23,42,0.4)] backdrop-blur-3xl">
        <nav className="flex items-center justify-between text-slate-800">
          <Link href="/" className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-[0.25em] transition hover:text-slate-950">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm">🏠</span>
            Home
          </Link>
          <Link href="/cart" className="relative flex flex-col items-center gap-1 text-[11px] uppercase tracking-[0.25em] transition hover:text-slate-950">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm">🛒</span>
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white shadow-lg">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/faq" className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-[0.25em] transition hover:text-slate-950">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm">❓</span>
            FAQ
          </Link>
        </nav>
      </div>
    </div>
  );
}
