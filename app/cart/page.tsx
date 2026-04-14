'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="text-slate-300">Your cart is empty.</p>
        <Link href="/" className="text-sky-400 hover:text-sky-300 mt-4 inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.shopProduct.id} className="flex flex-col rounded-lg border border-slate-700/60 bg-slate-950/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-white">{item.product.name}</h3>
                <p className="text-sm text-slate-400">Vendor: {item.shopProduct.shopId}</p>
                <p className="text-sm text-slate-400">SKU: {item.shopProduct.sku ?? item.product.sku}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 md:mt-0 md:items-end">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.shopProduct.id, item.quantity - 1)}
                  className="bg-slate-800 px-2 py-1 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.shopProduct.id, item.quantity + 1)}
                  className="bg-slate-800 px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
              <span className="font-semibold">MWK {((item.shopProduct.discountPrice ?? item.shopProduct.price) * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => removeItem(item.shopProduct.id)}
                className="text-rose-400 hover:text-rose-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-slate-950/80 p-4 rounded-lg shadow-lg border border-slate-700/60">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <span className="text-xl font-bold">Total: MWK {total.toFixed(2)}</span>
          <Link
            href="/checkout"
            className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-400"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}