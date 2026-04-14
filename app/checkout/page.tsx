'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import type { CartItem, PaymentMethod } from '../types';

export default function Checkout() {
  const { items, total, submitOrder } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [paymentSelections, setPaymentSelections] = useState<Record<string, PaymentMethod>>({});

  useEffect(() => {
    const groups = items.reduce<Record<string, CartItem[]>>((groups, item) => {
      const key = item.shopProduct.shopId;
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {});
    const defaults = Object.keys(groups).reduce<Record<string, PaymentMethod>>((map, shopId) => {
      map[shopId] = map[shopId] || 'online';
      return map;
    }, {});
    setPaymentSelections(prev => ({ ...defaults, ...prev }));
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrder({
      name: formData.name,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
    }, paymentSelections);
    alert('Order placed successfully! The admin will receive it.');
    window.location.href = '/';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const offersByShop = items.reduce<Record<string, CartItem[]>>((groups, item) => {
    const key = item.shopProduct.shopId;
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-6">
            {Object.entries(offersByShop).map(([shopId, shopItems]) => (
              <div key={shopId} className="rounded-3xl border border-slate-200/10 bg-white/95 p-4 shadow-sm">
                <p className="font-semibold text-slate-800">Vendor: {shopId}</p>
                <div className="mt-4 space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Payment method</label>
                  <select
                    value={paymentSelections[shopId] ?? 'online'}
                    onChange={e => setPaymentSelections(prev => ({ ...prev, [shopId]: e.target.value as PaymentMethod }))}
                    className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-800"
                  >
                    <option value="online">Pay Now (online)</option>
                    <option value="cash_on_delivery">Pay on Delivery 🚚</option>
                    <option value="mobile_money_manual">Pay via Mobile Money (manual)</option>
                    <option value="pickup">Pay on Pickup</option>
                  </select>
                  {paymentSelections[shopId] === 'mobile_money_manual' && (
                    <div className="rounded-2xl border border-blue-200/30 bg-blue-50/80 p-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Mobile money instructions</p>
                      <p className="mt-2">Send payment to <strong>Airtel Money 999-000</strong> with reference <strong>{shopId}</strong>.</p>
                      <p className="mt-1 text-slate-500">Admin will verify this payment manually.</p>
                    </div>
                  )}
                  {paymentSelections[shopId] === 'pickup' && (
                    <div className="rounded-2xl border border-slate-200/30 bg-slate-50/80 p-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Pickup instructions</p>
                      <p className="mt-2">You'll pay when collecting your order from the vendor.</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {shopItems.map(item => (
                      <div key={item.shopProduct.id} className="flex justify-between text-sm text-slate-700">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>${((item.shopProduct.discountPrice ?? item.shopProduct.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 text-sm font-semibold text-slate-900">
                    <div className="flex justify-between">
                      <span>Vendor subtotal</span>
                      <span>${shopItems.reduce((sum, item) => sum + (item.shopProduct.discountPrice ?? item.shopProduct.price) * item.quantity, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-3xl border border-slate-200/10 bg-white/95 p-4 shadow-sm">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}