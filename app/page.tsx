'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from './components/ProductCard';
import Hero from './components/Hero';
import { Product, Shop, ShopProduct } from './types';
import {
  STORAGE_KEY_PRODUCTS,
  STORAGE_KEY_SHOPS,
  STORAGE_KEY_SHOP_PRODUCTS,
  defaultProducts,
  defaultShops,
  defaultShopProducts,
} from './lib/marketplace';

const STORAGE_PRODUCTS_KEY = STORAGE_KEY_PRODUCTS;
const STORAGE_SHOPS_KEY = STORAGE_KEY_SHOPS;
const STORAGE_SHOP_PRODUCTS_KEY = STORAGE_KEY_SHOP_PRODUCTS;

const defaultProductsData: Product[] = defaultProducts;
const defaultShopsData: Shop[] = defaultShops;
const defaultShopProductsData: ShopProduct[] = defaultShopProducts;

function loadShops(): Shop[] {
  if (typeof window === 'undefined') return defaultShopsData;
  const stored = window.localStorage.getItem(STORAGE_SHOPS_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_SHOPS_KEY, JSON.stringify(defaultShopsData));
    return defaultShopsData;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultShopsData;
  }
}

function loadShopProducts(): ShopProduct[] {
  if (typeof window === 'undefined') return defaultShopProductsData;
  const stored = window.localStorage.getItem(STORAGE_SHOP_PRODUCTS_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_SHOP_PRODUCTS_KEY, JSON.stringify(defaultShopProductsData));
    return defaultShopProductsData;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultShopProductsData;
  }
}

function loadProducts(): Product[] {
  if (typeof window === 'undefined') return defaultProductsData;
  const stored = window.localStorage.getItem(STORAGE_PRODUCTS_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(defaultProductsData));
    return defaultProductsData;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultProductsData;
  }
}

function saveProducts(products: Product[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  }
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProductsData);
  const [shops, setShops] = useState<Shop[]>(defaultShopsData);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>(defaultShopProductsData);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setProducts(loadProducts());
    setShops(loadShops());
    setShopProducts(loadShopProducts());
  }, []);

  const offersByProduct = useMemo(() => {
    const grouped: Record<string, ShopProduct[]> = {};
    shopProducts.forEach(offer => {
      grouped[offer.productId] = grouped[offer.productId] || [];
      grouped[offer.productId].push(offer);
    });
    return grouped;
  }, [shopProducts]);

  const productsByAisle = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach(product => {
      const aisle = product.aisle?.trim() || 'General';
      groups[aisle] = groups[aisle] || [];
      groups[aisle].push(product);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([aisle, items]) => ({ aisle, items }));
  }, [products]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_30%),#0f172a] font-sf-pro">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="mb-10 rounded-[2rem] border border-white/15 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
          <p className="text-center text-sm uppercase tracking-[0.3em] text-slate-400">Crystal market picks</p>
          <h2 className="mt-4 text-3xl font-semibold text-center text-white tracking-tight">Featured Products</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-300">Fresh discounts on pantry staples, produce, and daily essentials — all ready to add to your bag.</p>
        </div>

        {productsByAisle.map(section => (
          <section key={section.aisle} className="mb-10 rounded-[2rem] border border-white/10 bg-slate-950/30 p-6 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Aisle</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{section.aisle}</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">{section.items.length} product{section.items.length === 1 ? '' : 's'}</span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {section.items.map(product => (
                <ProductCard key={product.id} product={product} offers={offersByProduct[product.id] || []} shops={shops} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
