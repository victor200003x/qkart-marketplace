'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, CustomerInfo, Order, PaymentMethod, Product, ShopProduct } from '../types';

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addItem: (product: Product, shopProduct: ShopProduct) => void;
  removeItem: (shopProductId: string) => void;
  updateQuantity: (shopProductId: string, quantity: number) => void;
  clearCart: () => void;
  submitOrder: (customer: CustomerInfo, paymentMethods: Record<string, PaymentMethod>) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedOrders = window.localStorage.getItem('supermarket_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const saveOrders = (nextOrders: Order[] | ((prevOrders: Order[]) => Order[])) => {
    setOrders(prev => {
      const ordersToSave = typeof nextOrders === 'function' ? nextOrders(prev) : nextOrders;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('supermarket_orders', JSON.stringify(ordersToSave));
      }
      return ordersToSave;
    });
  };

  const addItem = (product: Product, shopProduct: ShopProduct) => {
    console.log('addItem called with', product.name, shopProduct.id);
    setItems(prev => {
      const existing = prev.find(item => item.shopProduct.id === shopProduct.id);
      if (existing) {
        return prev.map(item =>
          item.shopProduct.id === shopProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, shopProduct, quantity: 1 }];
    });
  };

  const removeItem = (shopProductId: string) => {
    setItems(prev => prev.filter(item => item.shopProduct.id !== shopProductId));
  };

  const updateQuantity = (shopProductId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(shopProductId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.shopProduct.id === shopProductId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const submitOrder = (customer: CustomerInfo, paymentMethods: Record<string, PaymentMethod>) => {
    const grouped = items.reduce<Record<string, CartItem[]>>((groups, item) => {
      const key = item.shopProduct.shopId;
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {});

    const newOrders: Order[] = Object.entries(grouped).map(([shopId, shopItems]) => {
      const paymentMethod = paymentMethods[shopId] ?? 'online';
      const isPaidOnline = paymentMethod === 'online';
      return {
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : Date.now().toString() + '-' + shopId,
        customer,
        items: shopItems,
        total: shopItems.reduce((sum, item) => sum + (item.shopProduct.discountPrice ?? item.shopProduct.price) * item.quantity, 0),
        createdAt: new Date().toISOString(),
        status: isPaidOnline ? 'Confirmed' : 'Pending',
        paymentStatus: isPaidOnline ? 'Paid' : 'Pending',
        paymentMethod,
        paymentReference: '',
        deliveryZone: customer.city,
        shopId,
      };
    });

    saveOrders(prev => [...prev, ...newOrders]);
    clearCart();
  };

  const total = items.reduce((sum, item) => sum + (item.shopProduct.discountPrice ?? item.shopProduct.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, orders, addItem, removeItem, updateQuantity, clearCart, submitOrder, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}