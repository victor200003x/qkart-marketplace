'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoImage, setLogoImage] = useState('');

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('supermarket_settings') || '{"logoImage":""}');
    setLogoImage(settings.logoImage);
  }, []);

  return (
    <header className="fixed inset-x-0 top-6 z-40 px-4">
      <div className="mx-auto flex max-w-7xl items-center gap-6 rounded-full border border-white/18 bg-white/15 px-6 py-3 shadow-[0_40px_120px_-80px_rgba(255,255,255,0.9)] backdrop-blur-3xl">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-3 shadow-inner shadow-white/10">
            {logoImage ? (
              <img src={logoImage} alt="Logo" className="w-6 h-6 object-cover rounded" />
            ) : (
              <span className="text-lg font-semibold text-white">Q</span>
            )}
          </div>
          <Link href="/" className="text-lg font-semibold text-white tracking-tight">
            QKart
          </Link>
        </div>

        <div className="relative flex-1 max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center opacity-70">
            <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/25 bg-slate-100/10 py-3 pl-12 pr-4 text-sm text-white shadow-inner shadow-black/10 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20"
          />
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium text-white">
          <Link href="/" className="transition hover:text-white/80">Home</Link>
          <Link href="/faq" className="transition hover:text-white/80">FAQ</Link>
          <Link href="/cart" className="relative transition hover:text-white/80">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white shadow-lg">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/admin" className="hidden md:block transition hover:text-white/80">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
