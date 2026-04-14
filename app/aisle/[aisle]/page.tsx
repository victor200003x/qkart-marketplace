'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { Product, Shop, ShopProduct } from '../../types';
import {
  STORAGE_KEY_PRODUCTS,
  STORAGE_KEY_SHOPS,
  STORAGE_KEY_SHOP_PRODUCTS,
  defaultProducts,
  defaultShops,
  defaultShopProducts,
} from '../../lib/marketplace';

interface AislePageProps {
  params: {
    aisle: string;
  };
}

const defaultProductsData: Product[] = defaultProducts;
const defaultShopsData: Shop[] = defaultShops;
const defaultShopProductsData: ShopProduct[] = defaultShopProducts;

function loadShops(): Shop[] {
  if (typeof window === 'undefined') return defaultShopsData;
  const stored = window.localStorage.getItem(STORAGE_KEY_SHOPS);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(defaultShopsData));
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
  const stored = window.localStorage.getItem(STORAGE_KEY_SHOP_PRODUCTS);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY_SHOP_PRODUCTS, JSON.stringify(defaultShopProductsData));
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
  const stored = window.localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(defaultProductsData));
    return defaultProductsData;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultProductsData;
  }
}

export default function AislePage({ params }: AislePageProps) {
  const [products, setProducts] = useState<Product[]>(defaultProductsData);
  const [shops, setShops] = useState<Shop[]>(defaultShopsData);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>(defaultShopProductsData);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setProducts(loadProducts());
    setShops(loadShops());
    setShopProducts(loadShopProducts());
  }, []);

  const aisleName = decodeURIComponent(params.aisle);

  const aisleProducts = useMemo(
    () => products.filter(product => (product.aisle || 'General').toLowerCase() === aisleName.toLowerCase()),
    [products, aisleName],
  );

  const offersByProduct = useMemo(() => {
    const grouped: Record<string, ShopProduct[]> = {};
    shopProducts.forEach(offer => {
      grouped[offer.productId] = grouped[offer.productId] || [];
      grouped[offer.productId].push(offer);
    });
    return grouped;
  }, [shopProducts]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_30%),#0f172a] font-sf-pro">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 rounded-[2rem] border border-white/15 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Aisle</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">{aisleName}</h1>
              <p className="mt-2 max-w-2xl text-slate-300">Browse the full aisle and discover every matching product in one place.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                Back to home
              </a>
            </div>
          </div>
        </div>

        {aisleProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 text-center text-slate-300 shadow-xl backdrop-blur-3xl">
            No products found for this aisle.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {aisleProducts.map(product => (
              <ProductCard key={product.id} product={product} offers={offersByProduct[product.id] || []} shops={shops} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
