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
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');

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

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('Getting location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Check if within Lilongwe, Malawi (approximate bounds)
          const inLilongwe = latitude >= -14.5 && latitude <= -13.5 && longitude >= 33.0 && longitude <= 34.0;
          if (inLilongwe) {
            setDeliveryFee(500); // MWK 500 delivery fee
            setLocationStatus('Location confirmed: Lilongwe, Malawi. Delivery fee: MWK 500');
          } else {
            setDeliveryFee(0);
            setLocationStatus('Location outside Lilongwe. No delivery fee.');
          }
          setFormData(prev => ({
            ...prev,
            address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          }));
        },
        (error) => {
          setLocationStatus('Error getting location: ' + error.message);
        }
      );
    } else {
      setLocationStatus('Geolocation not supported');
    }
  };

  const offersByShop = items.reduce<Record<string, CartItem[]>>((groups, item) => {
    const key = item.shopProduct.shopId;
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
          <div className="space-y-6">
            {Object.entries(offersByShop).map(([shopId, shopItems]) => (
              <div key={shopId} className="rounded-3xl border border-slate-700/50 bg-slate-950/90 p-4 shadow-sm">
                <p className="font-semibold text-white">Vendor: {shopId}</p>
                <div className="mt-4 space-y-4">
                  <label className="block text-sm font-medium text-slate-300">Payment method</label>
                  <select
                    value={paymentSelections[shopId] ?? 'online'}
                    onChange={e => setPaymentSelections(prev => ({ ...prev, [shopId]: e.target.value as PaymentMethod }))}
                    className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="online">Pay Now (online)</option>
                    <option value="cash_on_delivery">Pay on Delivery 🚚</option>
                    <option value="mobile_money_manual">Pay via Mobile Money (manual)</option>
                    <option value="pickup">Pay on Pickup</option>
                  </select>
                  {paymentSelections[shopId] === 'mobile_money_manual' && (
                    <div className="rounded-2xl border border-blue-200/30 bg-blue-50/10 p-3 text-sm text-slate-100">
                      <p className="font-semibold text-white">Mobile money instructions</p>
                      <p className="mt-2">Send payment to <strong>Airtel Money 999-000</strong> with reference <strong>{shopId}</strong>.</p>
                      <p className="mt-1 text-slate-400">Admin will verify this payment manually.</p>
                    </div>
                  )}
                  {paymentSelections[shopId] === 'pickup' && (
                    <div className="rounded-2xl border border-slate-700/30 bg-slate-800/80 p-3 text-sm text-slate-100">
                      <p className="font-semibold text-white">Pickup instructions</p>
                      <p className="mt-2">You'll pay when collecting your order from the vendor.</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {shopItems.map(item => (
                      <div key={item.shopProduct.id} className="flex justify-between text-sm text-slate-200">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>MWK {((item.shopProduct.discountPrice ?? item.shopProduct.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 text-sm font-semibold text-white">
                    <div className="flex justify-between">
                      <span>Vendor subtotal</span>
                      <span>MWK {shopItems.reduce((sum, item) => sum + (item.shopProduct.discountPrice ?? item.shopProduct.price) * item.quantity, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-3xl border border-slate-700/50 bg-slate-950/90 p-4 shadow-sm">
              <div className="flex justify-between font-bold text-white">
                <span>Subtotal</span>
                <span>MWK {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white mt-2">
                <span>Delivery Fee</span>
                <span>MWK {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white mt-2 border-t pt-2">
                <span>Total</span>
                <span>MWK {(total + deliveryFee).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/90 px-3 py-2 text-slate-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/90 px-3 py-2 text-slate-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-300">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/90 px-3 py-2 text-slate-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="mt-2 bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 text-sm"
              >
                📍 Use Current Location
              </button>
              {locationStatus && <p className="mt-2 text-sm text-slate-400">{locationStatus}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-300">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/90 px-3 py-2 text-slate-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-slate-300">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/90 px-3 py-2 text-slate-100 shadow-sm focus:ring-blue-500 focus:border-blue-500"
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