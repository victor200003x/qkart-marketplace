'use client';

import Link from 'next/link';
import { Product, Shop, ShopProduct } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  offers: ShopProduct[];
  shops: Shop[];
}

export default function ProductCard({ product, offers, shops }: ProductCardProps) {
  const { addItem } = useCart();
  const availableOffers = offers.filter(offer => offer.available);
  const bestOffer = [...availableOffers].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))[0] ?? offers[0];
  const bestShop = bestOffer ? shops.find(shop => shop.id === bestOffer.shopId) : undefined;
  const displayPrice = bestOffer ? (bestOffer.discountPrice ?? bestOffer.price) : product.price;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.4)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:backdrop-blur-[30px] hover:shadow-[0_30px_90px_-30px_rgba(15,23,42,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),transparent_25%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative overflow-hidden rounded-[1.5rem] mb-5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          {product.aisle && <span className="rounded-full bg-slate-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">{product.aisle}</span>}
          <span>{product.category} / {product.subcategory}</span>
        </div>
        <p className="text-sm text-slate-300 mb-4">{product.description}</p>
        <div className="mb-4 rounded-3xl border border-white/10 bg-slate-100/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">Best available offer</p>
          {bestOffer ? (
            <div className="mt-2 space-y-1">
              <p className="text-sm">{bestShop?.name ?? 'Marketplace'} • {bestOffer.status}</p>
              <p className="text-lg font-semibold text-white">MWK {displayPrice.toFixed(2)}</p>
              {bestOffer.discountPrice && <p className="text-sm text-emerald-300">Discount active</p>}
              <p className="text-sm text-slate-400">{bestOffer.stock} in stock</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No offers available right now.</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/product/${product.id}`} className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition">
          View offers
        </Link>
        <button
          type="button"
          disabled={!bestOffer || !bestOffer.available}
          onClick={() => bestOffer && addItem(product, bestOffer)}
          className="rounded-full border border-white/30 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          Add cheapest offer
        </button>
      </div>
    </div>
  );
}
