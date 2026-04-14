'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import type { Product, Shop, ShopProduct } from '../../types';
import { defaultProducts, defaultShops, defaultShopProducts, STORAGE_KEY_PRODUCTS, STORAGE_KEY_SHOPS, STORAGE_KEY_SHOP_PRODUCTS } from '../../lib/marketplace';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [shops, setShops] = useState<Shop[]>(defaultShops);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>(defaultShopProducts);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const products = loadFromStorage<Product[]>(STORAGE_KEY_PRODUCTS, defaultProducts);
    const shopsData = loadFromStorage<Shop[]>(STORAGE_KEY_SHOPS, defaultShops);
    const offers = loadFromStorage<ShopProduct[]>(STORAGE_KEY_SHOP_PRODUCTS, defaultShopProducts);
    setProduct(products.find(item => item.id === productId) ?? null);
    setShops(shopsData);
    setShopProducts(offers);
  }, [productId]);

  const offers = useMemo(() => shopProducts.filter(offer => offer.productId === productId), [shopProducts, productId]);
  const shopMap = useMemo(() => shops.reduce<Record<string, Shop>>((map, shop) => ({ ...map, [shop.id]: shop }), {}), [shops]);
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
  const [vendorQuery, setVendorQuery] = useState('');
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'stockAsc' | 'stockDesc' | 'vendor'>('priceAsc');

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const shopName = shopMap[offer.shopId]?.name ?? '';
      const matchesAvailability =
        filterAvailability === 'all' ||
        (filterAvailability === 'available' ? offer.available : !offer.available);
      const matchesVendor = shopName.toLowerCase().includes(vendorQuery.trim().toLowerCase());
      return matchesAvailability && matchesVendor;
    });
  }, [offers, shopMap, filterAvailability, vendorQuery]);

  const sortedOffers = useMemo(() => {
    return [...filteredOffers].sort((a, b) => {
      if (sortBy === 'priceAsc') {
        return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
      }
      if (sortBy === 'priceDesc') {
        return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
      }
      if (sortBy === 'stockAsc') {
        return a.stock - b.stock;
      }
      if (sortBy === 'stockDesc') {
        return b.stock - a.stock;
      }
      const aShop = shopMap[a.shopId]?.name ?? '';
      const bShop = shopMap[b.shopId]?.name ?? '';
      return aShop.localeCompare(bShop);
    });
  }, [filteredOffers, sortBy, shopMap]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xl text-slate-300">Product not found.</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:text-blue-600">Return to store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">{product.name}</h1>
            <p className="mt-2 text-slate-400">{product.category} / {product.subcategory} • {product.aisle || 'General'}</p>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/10">Back to store</Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
            <img src={product.image} alt={product.name} className="w-full rounded-[1.5rem] object-cover" />
            <div className="mt-6 space-y-4">
              <p className="text-slate-300">{product.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Barcode</p>
                  <p className="mt-2 text-white">{product.barcode || 'N/A'}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">SKU</p>
                  <p className="mt-2 text-white">{product.sku}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Vendor offers</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Compare shops</h2>
              <p className="mt-2 text-slate-400">Choose the best price, stock and availability from shops selling this product.</p>
            </div>
            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-3xl sm:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-200">Filter by availability</label>
                <select
                  value={filterAvailability}
                  onChange={e => setFilterAvailability(e.target.value as 'all' | 'available' | 'unavailable')}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="all">All offers</option>
                  <option value="available">Available only</option>
                  <option value="unavailable">Unavailable only</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-200">Sort by</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'priceAsc' | 'priceDesc' | 'stockAsc' | 'stockDesc' | 'vendor')}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="priceAsc">Price: low to high</option>
                  <option value="priceDesc">Price: high to low</option>
                  <option value="stockDesc">Stock: high to low</option>
                  <option value="stockAsc">Stock: low to high</option>
                  <option value="vendor">Vendor name</option>
                </select>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-3xl">
              <label className="block text-sm font-semibold text-slate-200">Search vendor</label>
              <input
                type="text"
                value={vendorQuery}
                onChange={e => setVendorQuery(e.target.value)}
                placeholder="Enter vendor name"
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            {sortedOffers.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center text-slate-300 shadow-xl backdrop-blur-3xl">
                No shop offers match those filters.
              </div>
            ) : (
              <div className="space-y-4">
                {sortedOffers.map(offer => {
                  const shop = shopMap[offer.shopId];
                  const price = offer.discountPrice ?? offer.price;
                  return (
                    <div key={offer.id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-3xl">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{shop?.name ?? offer.shopId}</p>
                          <p className="mt-1 text-sm text-slate-400">{shop?.location || 'Unknown location'}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-2xl font-semibold text-white">MWK {price.toFixed(2)}</p>
                          <p className="text-sm text-slate-400">{offer.stock} in stock</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-2 text-sm ${offer.available ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'}`}>{offer.status}</span>
                        <span className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-200">Vendor SKU {offer.sku || '—'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(product, offer)}
                        disabled={!offer.available}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                      >
                        {offer.available ? 'Add to cart' : 'Unavailable'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
