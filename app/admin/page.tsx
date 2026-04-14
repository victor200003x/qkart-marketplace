'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { CustomerInfo, DeliveryPartner, Order, OrderStatus, PaymentMethod, PaymentStatus, Product, Shop, ShopProduct } from '../types';
import {
  defaultShops,
  defaultShopProducts,
} from '../lib/marketplace';

const ADMIN_USERNAME = 'admin@example.com';
const ADMIN_PASSWORD = 'Supermarket123';
const STORAGE_KEY_ORDERS = 'supermarket_orders';
const STORAGE_KEY_PRODUCTS = 'supermarket_products';
const STORAGE_KEY_PARTNERS = 'supermarket_partners';
const STORAGE_KEY_SHOPS = 'supermarket_shops';
const STORAGE_KEY_SHOP_PRODUCTS = 'supermarket_shop_products';
const SESSION_KEY = 'admin_logged_in';

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Apples',
    category: 'Produce',
    subcategory: 'Fruits',
    aisle: 'Produce',
    sku: 'APL-001',
    barcode: '1234567890123',
    price: 2.99,
    discountPrice: 2.49,
    stock: 18,
    expiryDate: '',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600',
    description: 'Fresh organic apples, 1 lb',
  },
  {
    id: '2',
    name: 'Whole Milk',
    category: 'Dairy',
    subcategory: 'Milk',
    aisle: 'Dairy',
    sku: 'MLK-002',
    barcode: '2345678901234',
    price: 3.49,
    discountPrice: 2.99,
    stock: 12,
    expiryDate: '2026-05-12',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600',
    description: 'Fresh whole milk, 1 gallon',
  },
  {
    id: '3',
    name: 'Bread Loaf',
    category: 'Bakery',
    subcategory: 'Bread',
    aisle: 'Bakery',
    sku: 'BRD-003',
    barcode: '3456789012345',
    price: 2.5,
    stock: 6,
    expiryDate: '2026-05-02',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    description: 'Fresh baked bread loaf',
  },
  {
    id: '4',
    name: 'Bananas',
    category: 'Produce',
    subcategory: 'Fruits',
    aisle: 'Produce',
    sku: 'BNA-004',
    barcode: '4567890123456',
    price: 1.99,
    stock: 4,
    expiryDate: '2026-05-01',
    image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600',
    description: 'Ripe bananas, 1 lb',
  },
  {
    id: '5',
    name: 'Chicken Breast',
    category: 'Meat',
    subcategory: 'Poultry',
    aisle: 'Meat',
    sku: 'CHK-005',
    barcode: '5678901234567',
    price: 7.99,
    discountPrice: 6.99,
    stock: 8,
    expiryDate: '2026-05-05',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600',
    description: 'Organic chicken breast, 1 lb',
  },
  {
    id: '6',
    name: 'Rice',
    category: 'Pantry',
    subcategory: 'Grains',
    aisle: 'Pantry',
    sku: 'RCE-006',
    barcode: '6789012345678',
    price: 4.99,
    stock: 24,
    expiryDate: '2027-03-15',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
    description: 'Long grain white rice, 5 lb bag',
  },
];

function normalizeOrders(rawOrders: any[]): Order[] {
  return rawOrders.map(order => {
    const normalizedStatus: OrderStatus =
      order.status === 'Paid' ? 'Confirmed' : (order.status as OrderStatus) ?? 'Pending';

    const normalizedPaymentStatus: PaymentStatus =
      order.paymentStatus === 'Refunded'
        ? 'Paid'
        : ((order.paymentStatus as PaymentStatus) ?? 'Pending');

    const normalizedPaymentMethod: PaymentMethod =
      (order.paymentMethod as PaymentMethod) ?? 'online';

    return {
      ...order,
      status: normalizedStatus,
      paymentStatus: normalizedPaymentStatus,
      paymentMethod: normalizedPaymentMethod,
      paymentReference: order.paymentReference ?? '',
      flagged: order.flagged ?? false,
      assignedRider: order.assignedRider ?? '',
      deliveryZone: order.deliveryZone ?? order.customer?.city ?? '',
    } as Order;
  });
}

function loadProducts(): Product[] {
  if (typeof window === 'undefined') return defaultProducts;
  const stored = window.localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultProducts;
  }
}

function saveProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

function loadShops(): Shop[] {
  if (typeof window === 'undefined') return defaultShops;
  const stored = window.localStorage.getItem(STORAGE_KEY_SHOPS);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(defaultShops));
    return defaultShops;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultShops;
  }
}

function saveShops(shops: Shop[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(shops));
}

function loadShopProducts(): ShopProduct[] {
  if (typeof window === 'undefined') return defaultShopProducts;
  const stored = window.localStorage.getItem(STORAGE_KEY_SHOP_PRODUCTS);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY_SHOP_PRODUCTS, JSON.stringify(defaultShopProducts));
    return defaultShopProducts;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultShopProducts;
  }
}

function saveShopProducts(shopProducts: ShopProduct[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_SHOP_PRODUCTS, JSON.stringify(shopProducts));
}

function loadOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(STORAGE_KEY_ORDERS);
  if (!stored) return [];
  try {
    return normalizeOrders(JSON.parse(stored));
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
}

const defaultDeliveryPartners: DeliveryPartner[] = [
  {
    id: 'partner-001',
    companyName: 'RapidLink Logistics',
    contactName: 'James Banda',
    phone: '+265 999 123 456',
    zones: ['Lilongwe Area 25', 'Area 18'],
    commissionRate: 12,
    baseFee: 3.5,
    active: true,
  },
  {
    id: 'partner-002',
    companyName: 'City Connect Couriers',
    contactName: 'Amina Nkhata',
    phone: '+265 888 234 567',
    zones: ['Lilongwe Area 10', 'Area 43'],
    commissionRate: 10,
    baseFee: 4.0,
    active: true,
  },
];

function loadPartners(): DeliveryPartner[] {
  if (typeof window === 'undefined') return defaultDeliveryPartners;
  const stored = window.localStorage.getItem(STORAGE_KEY_PARTNERS);
  if (!stored) {
    window.localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(defaultDeliveryPartners));
    return defaultDeliveryPartners;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultDeliveryPartners;
  }
}

function savePartners(partners: DeliveryPartner[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(partners));
}

const STORAGE_KEY_SETTINGS = 'supermarket_settings';

function loadSettings() {
  if (typeof window === 'undefined') return { primaryColor: '#3b82f6', logoImage: '', heroImage: '', backgroundColor: '#0f172a' };
  const stored = window.localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!stored) {
    const defaultSettings = { primaryColor: '#3b82f6', logoImage: '', heroImage: '', backgroundColor: '#0f172a' };
    window.localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { primaryColor: '#3b82f6', logoImage: '', heroImage: '', backgroundColor: '#0f172a' };
  }
}

function saveSettings(settings: any) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function getDaysAgoLabel(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

function getTrendBuckets(orders: Order[]) {
  const buckets: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const total = orders
      .filter(order => order.createdAt.slice(0, 10) === key)
      .reduce((sum, order) => sum + order.total, 0);
    buckets.push({ label: date.toLocaleDateString(undefined, { weekday: 'short' }), value: total });
  }
  return buckets;
}

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [products, setProductsState] = useState<Product[]>(defaultProducts);
  const [shops, setShopsState] = useState<Shop[]>(defaultShops);
  const [shopProducts, setShopProductsState] = useState<ShopProduct[]>(defaultShopProducts);
  const [partners, setPartnersState] = useState<DeliveryPartner[]>(defaultDeliveryPartners);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'products' | 'shops' | 'orders' | 'customers' | 'delivery' | 'settings'>('overview');
  const [settings, setSettings] = useState({
    primaryColor: '#3b82f6',
    logoImage: '',
    heroImage: '',
    backgroundColor: '#0f172a',
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: '',
    subcategory: '',
    aisle: '',
    sku: '',
    barcode: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    expiryDate: '',
    image: '',
    description: '',
  });
  const [partnerForm, setPartnerForm] = useState<Partial<DeliveryPartner>>({
    companyName: '',
    contactName: '',
    phone: '',
    zones: [],
    commissionRate: 10,
    baseFee: 0,
    active: true,
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [editingShopId, setEditingShopId] = useState<string | null>(null);
  const [editingShopProductId, setEditingShopProductId] = useState<string | null>(null);
  const [shopForm, setShopForm] = useState<Partial<Shop>>({
    name: '',
    location: '',
    logo: '',
    email: '',
    phone: '',
    status: 'active',
    rating: 4.5,
    active: true,
    deliveryNote: '',
  });
  const [shopProductForm, setShopProductForm] = useState<Partial<ShopProduct>>({
    shopId: '',
    productId: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    available: true,
    sku: '',
    status: 'Available',
  });
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [partnerFilter, setPartnerFilter] = useState<'All' | string>('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'All' | PaymentMethod>('All');
  const [csvError, setCsvError] = useState('');
  const [csvUpdateMessage, setCsvUpdateMessage] = useState('');
  const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);
  const [csvFileName, setCsvFileName] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAdmin = window.sessionStorage.getItem(SESSION_KEY) === 'true';
    setLoggedIn(isAdmin);
    if (isAdmin) {
      setOrdersState(loadOrders());
      setProductsState(loadProducts());
      setShopsState(loadShops());
      setShopProductsState(loadShopProducts());
      setPartnersState(loadPartners());
      setSettings(loadSettings());
    }
  }, []);

  const updateOrders = (nextOrders: Order[]) => {
    setOrdersState(nextOrders);
    saveOrders(nextOrders);
  };

  const updateProducts = (nextProducts: Product[]) => {
    setProductsState(nextProducts);
    saveProducts(nextProducts);
  };

  const updateShops = (nextShops: Shop[]) => {
    setShopsState(nextShops);
    saveShops(nextShops);
  };

  const updateShopProducts = (nextShopProducts: ShopProduct[]) => {
    setShopProductsState(nextShopProducts);
    saveShopProducts(nextShopProducts);
  };

  const updatePartners = (nextPartners: DeliveryPartner[]) => {
    setPartnersState(nextPartners);
    savePartners(nextPartners);
  };

  const updateSettings = (nextSettings: any) => {
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const statusMatches = statusFilter === 'All' || order.status === statusFilter;
      const partnerMatches = partnerFilter === 'All' || order.deliveryPartnerId === partnerFilter;
      const paymentStatusMatches = paymentStatusFilter === 'All' || order.paymentStatus === paymentStatusFilter;
      const paymentMethodMatches = paymentMethodFilter === 'All' || order.paymentMethod === paymentMethodFilter;
      return statusMatches && partnerMatches && paymentStatusMatches && paymentMethodMatches;
    });
  }, [orders, statusFilter, partnerFilter, paymentStatusFilter, paymentMethodFilter]);

  const overview = useMemo(() => {
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);

    const dailySales = orders
      .filter(order => order.createdAt.slice(0, 10) === todayKey)
      .reduce((sum, order) => sum + order.total, 0);

    const weeklySales = orders
      .filter(order => new Date(order.createdAt) >= weekAgo)
      .reduce((sum, order) => sum + order.total, 0);

    const monthlySales = orders
      .filter(order => new Date(order.createdAt) >= monthAgo)
      .reduce((sum, order) => sum + order.total, 0);

    const pending = orders.filter(order => order.status === 'Pending').length;
    const pendingPayments = orders.filter(order => order.paymentStatus === 'Pending').length;
    const paidPayments = orders.filter(order => order.paymentStatus === 'Paid').length;
    const codOrders = orders.filter(order => order.paymentMethod === 'cash_on_delivery').length;

    const productCounts = orders.reduce((counts, order) => {
      order.items.forEach(item => {
        counts[item.product.id] = (counts[item.product.id] ?? 0) + item.quantity;
      });
      return counts;
    }, {} as Record<string, number>);

    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([productId, count]) => {
        const product = products.find(product => product.id === productId);
        return { product, count };
      })
      .filter(item => item.product);

    return {
      dailySales,
      weeklySales,
      monthlySales,
      totalOrders: orders.length,
      pendingOrders: pending,
      pendingPayments,
      paidPayments,
      codOrders,
      topProducts,
      lowStock: products.filter(product => product.stock <= 5),
    };
  }, [orders, products]);

  const customers = useMemo(() => {
    const map: Record<string, { customer: CustomerInfo; orders: number; revenue: number }> = {};
    orders.forEach(order => {
      const key = order.customer.email.toLowerCase();
      if (!map[key]) {
        map[key] = { customer: order.customer, orders: 0, revenue: 0 };
      }
      map[key].orders += 1;
      map[key].revenue += order.total;
    });
    return Object.values(map).sort((a, b) => b.orders - a.orders);
  }, [orders]);

  const revenueTrend = useMemo(() => getTrendBuckets(orders), [orders]);

  const partnerSummary = useMemo(() => {
    return partners.map(partner => {
      const partnerOrders = orders.filter(order => order.deliveryPartnerId === partner.id);
      const totalCommission = partnerOrders.reduce((sum, order) => sum + (order.deliveryCommission ?? 0), 0);
      return {
        ...partner,
        assignedOrders: partnerOrders.length,
        totalCommission,
      };
    });
  }, [orders, partners]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      window.sessionStorage.setItem(SESSION_KEY, 'true');
      setOrdersState(loadOrders());
      setProductsState(loadProducts());
      setError('');
      return;
    }
    setError('Invalid credentials. Use admin@example.com / Supermarket123');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    window.sessionStorage.removeItem(SESSION_KEY);
  };

  const handleProductChange = (key: keyof Product, value: string | number) => {
    setProductForm(prev => ({ ...prev, [key]: value }));
  };

  const handleShopChange = (key: keyof Shop, value: string | number | boolean) => {
    setShopForm(prev => ({ ...prev, [key]: value }));
  };

  const handleShopProductChange = (key: keyof ShopProduct, value: string | number | boolean) => {
    setShopProductForm(prev => ({ ...prev, [key]: value }));
  };

  const clearForm = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: '',
      subcategory: '',
      aisle: '',
      sku: '',
      barcode: '',
      price: 0,
      discountPrice: 0,
      stock: 0,
      expiryDate: '',
      image: '',
      description: '',
    });
  };

  const clearShopForm = () => {
    setEditingShopId(null);
    setShopForm({
      name: '',
      location: '',
      logo: '',
      email: '',
      phone: '',
      status: 'active',
      rating: 4.5,
      active: true,
      deliveryNote: '',
    });
  };

  const clearShopProductForm = () => {
    setEditingShopProductId(null);
    setShopProductForm({
      shopId: '',
      productId: '',
      price: 0,
      discountPrice: 0,
      stock: 0,
      available: true,
      sku: '',
      status: 'Available',
    });
  };

  const handleProductSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextProduct: Product = {
      id: editingProductId ?? crypto.randomUUID?.() ?? Date.now().toString(),
      name: String(productForm.name || '').trim(),
      category: String(productForm.category || '').trim(),
      subcategory: String(productForm.subcategory || '').trim(),
      aisle: String(productForm.aisle || '').trim(),
      sku: String(productForm.sku || '').trim(),
      barcode: String(productForm.barcode || '').trim(),
      price: Number(productForm.price || 0),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
      stock: Number(productForm.stock || 0),
      expiryDate: String(productForm.expiryDate || '').trim(),
      image: String(productForm.image || '').trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      description: String(productForm.description || '').trim(),
    };

    if (!nextProduct.name || !nextProduct.category || !nextProduct.sku) {
      setError('Please complete the product name, category, and SKU.');
      return;
    }

    const nextProducts = editingProductId
      ? products.map(product => (product.id === editingProductId ? nextProduct : product))
      : [nextProduct, ...products];

    updateProducts(nextProducts);
    clearForm();
    setError('');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm(product);
    setSelectedTab('products');
  };

  const handleDeleteProduct = (productId: string) => {
    updateProducts(products.filter(product => product.id !== productId));
  };

  const handleShopSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextShop: Shop = {
      id: editingShopId ?? crypto.randomUUID?.() ?? Date.now().toString(),
      name: String(shopForm.name || '').trim(),
      location: String(shopForm.location || '').trim(),
      logo: String(shopForm.logo || '').trim(),
      email: String(shopForm.email || '').trim(),
      phone: String(shopForm.phone || '').trim(),
      status: shopForm.status === 'suspended' ? 'suspended' : 'active',
      rating: Number(shopForm.rating ?? 4.5),
      active: Boolean(shopForm.active),
      deliveryNote: String(shopForm.deliveryNote || '').trim(),
    };

    if (!nextShop.name || !nextShop.location) {
      setError('Shop name and location are required.');
      return;
    }

    const nextShops = editingShopId
      ? shops.map(shop => (shop.id === editingShopId ? nextShop : shop))
      : [nextShop, ...shops];

    updateShops(nextShops);
    clearShopForm();
    setError('');
  };

  const handleEditShop = (shop: Shop) => {
    setEditingShopId(shop.id);
    setShopForm(shop);
    setSelectedTab('shops');
  };

  const handleDeleteShop = (shopId: string) => {
    updateShops(shops.filter(shop => shop.id !== shopId));
    updateShopProducts(shopProducts.filter(offer => offer.shopId !== shopId));
  };

  const handleShopProductSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextOffer: ShopProduct = {
      id: editingShopProductId ?? crypto.randomUUID?.() ?? Date.now().toString(),
      shopId: String(shopProductForm.shopId || '').trim(),
      productId: String(shopProductForm.productId || '').trim(),
      price: Number(shopProductForm.price || 0),
      discountPrice: shopProductForm.discountPrice ? Number(shopProductForm.discountPrice) : undefined,
      stock: Number(shopProductForm.stock || 0),
      available: Boolean(shopProductForm.available),
      sku: String(shopProductForm.sku || '').trim(),
      status: (shopProductForm.status || 'Available') as ShopProduct['status'],
    };

    if (!nextOffer.shopId || !nextOffer.productId) {
      setError('Shop and product selection are required for a listing.');
      return;
    }

    const nextOffers = editingShopProductId
      ? shopProducts.map(offer => (offer.id === editingShopProductId ? nextOffer : offer))
      : [nextOffer, ...shopProducts];

    updateShopProducts(nextOffers);
    clearShopProductForm();
    setError('');
  };

  const handleEditShopProduct = (offer: ShopProduct) => {
    setEditingShopProductId(offer.id);
    setShopProductForm(offer);
    setSelectedTab('shops');
  };

  const handleDeleteShopProduct = (offerId: string) => {
    updateShopProducts(shopProducts.filter(offer => offer.id !== offerId));
  };

  const handleEditPartner = (partner: DeliveryPartner) => {
    setEditingPartnerId(partner.id);
    setPartnerForm(partner);
    setSelectedTab('delivery');
  };

  const handleDeletePartner = (partnerId: string) => {
    updatePartners(partners.filter(partner => partner.id !== partnerId));
  };

  const handlePartnerChange = (key: keyof DeliveryPartner, value: string | number | string[] | boolean) => {
    setPartnerForm(prev => ({ ...prev, [key]: value }));
  };

  const clearPartnerForm = () => {
    setEditingPartnerId(null);
    setPartnerForm({
      companyName: '',
      contactName: '',
      phone: '',
      zones: [],
      commissionRate: 10,
      baseFee: 0,
      active: true,
    });
  };

  const handlePartnerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextPartner: DeliveryPartner = {
      id: editingPartnerId ?? crypto.randomUUID?.() ?? Date.now().toString(),
      companyName: String(partnerForm.companyName || '').trim(),
      contactName: String(partnerForm.contactName || '').trim(),
      phone: String(partnerForm.phone || '').trim(),
      zones: Array.isArray(partnerForm.zones)
        ? partnerForm.zones.map(zone => String(zone).trim()).filter(Boolean)
        : String(partnerForm.zones || '').split(',').map(zone => zone.trim()).filter(Boolean),
      commissionRate: Number(partnerForm.commissionRate || 0),
      baseFee: Number(partnerForm.baseFee || 0),
      active: Boolean(partnerForm.active),
    };

    if (!nextPartner.companyName || !nextPartner.contactName || !nextPartner.phone) {
      setError('Partner company, contact name, and phone are required.');
      return;
    }

    const nextPartners = editingPartnerId
      ? partners.map(partner => (partner.id === editingPartnerId ? nextPartner : partner))
      : [nextPartner, ...partners];

    updatePartners(nextPartners);
    clearPartnerForm();
    setError('');
  };

  const handleImageFileUpload = (file: File) => {
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setProductForm(prev => ({ ...prev, image: result }));
      }
    };
    reader.onerror = () => {
      setError('Unable to load image file.');
    };
    reader.readAsDataURL(file);
  };

  const parseCsvRows = (csv: string) => {
    const lines = csv.trim().split(/\r?\n/).filter(line => line.trim());
    if (!lines.length) return [];
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
    return lines.slice(1).map(line => {
      const values = line.match(/(?:"([^"]*(?:""[^"]*)*)"|[^,]+)/g)?.map(value => value.replace(/^"|"$/g, '').replace(/""/g, '"').trim()) ?? [];
      const row: Record<string, string> = {};
      headers.forEach((key, index) => {
        row[key] = values[index] ?? '';
      });
      return row;
    });
  };

  const handleCsvFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setCsvError('');
    setCsvUpdateMessage('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setCsvError('Please upload a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const rows = parseCsvRows(reader.result);
      if (!rows.length) {
        setCsvError('CSV file is empty or invalid.');
        return;
      }

      const updates: string[] = [];
      const created: string[] = [];
      const matchedCodes = new Set<string>();
      const nextProducts = products.map(product => {
        const matchRow = rows.find(row => {
          const code = (row.sku || row.code || row.productcode).trim().toLowerCase();
          return code && code === product.sku.trim().toLowerCase();
        });
        if (!matchRow) return product;

        matchedCodes.add(product.sku.trim().toLowerCase());
        const updated: Partial<Product> = {};
        const stockValue = matchRow.soh || matchRow.stock || matchRow.quantity;
        const sellPrice = matchRow.sellingprice || matchRow.sellprice || matchRow.price || matchRow['selling price'];
        const description = matchRow.description || matchRow.desc;
        const aisle = matchRow.aisle || matchRow.aisleid || matchRow.section || '';
        const name = matchRow.description || matchRow.product || matchRow.name || matchRow.item;
        const category = matchRow.category || matchRow.type || 'Imported';
        const subcategory = matchRow.subcategory || matchRow.group || 'Imported';

        if (stockValue !== undefined && stockValue !== '') {
          const parsedStock = Number(stockValue.replace(/[^0-9\-\.]/g, ''));
          if (!Number.isNaN(parsedStock)) updated.stock = parsedStock;
        }
        if (sellPrice !== undefined && sellPrice !== '') {
          const parsedPrice = Number(sellPrice.replace(/[^0-9\.]/g, ''));
          if (!Number.isNaN(parsedPrice)) updated.price = parsedPrice;
        }
        if (description !== undefined && description !== '') {
          updated.description = description;
        }
        if (aisle !== undefined && aisle !== '') {
          updated.aisle = String(aisle).trim();
        }
        if (name !== undefined && name !== '') {
          updated.name = String(name).trim();
        }
        if (category !== undefined && category !== '') {
          updated.category = String(category).trim();
        }
        if (subcategory !== undefined && subcategory !== '') {
          updated.subcategory = String(subcategory).trim();
        }
        if (Object.keys(updated).length) {
          updates.push(product.name);
          return { ...product, ...updated };
        }
        return product;
      });

      const newProducts: Product[] = [];
      rows.forEach(row => {
        const code = (row.sku || row.code || row.productcode).trim().toLowerCase();
        if (!code || matchedCodes.has(code)) return;
        const name = row.description || row.product || row.name || row.item || code;
        const aisle = row.aisle || row.aisleid || row.section || 'Imported';
        const priceValue = row.sellingprice || row.sellprice || row.price || row['selling price'] || row.costincl || row.costexcl;
        const stockValue = row.soh || row.stock || row.quantity;
        const description = row.description || row.desc || row.product || row.name;

        const parsedPrice = priceValue !== undefined && priceValue !== '' ? Number(String(priceValue).replace(/[^0-9\.]/g, '')) : undefined;
        const parsedStock = stockValue !== undefined && stockValue !== '' ? Number(String(stockValue).replace(/[^0-9\-\.]/g, '')) : undefined;

        const newProduct: Product = {
          id: crypto.randomUUID?.() ?? Date.now().toString(),
          name: String(name).trim() || code,
          category: String(row.category || row.type || 'Imported').trim(),
          subcategory: String(row.subcategory || row.group || 'Imported').trim(),
          aisle: String(aisle).trim(),
          sku: code.toUpperCase(),
          barcode: String(row.barcode || '').trim() || undefined,
          price: parsedPrice !== undefined && !Number.isNaN(parsedPrice) ? parsedPrice : 0,
          discountPrice: undefined,
          stock: parsedStock !== undefined && !Number.isNaN(parsedStock) ? parsedStock : 0,
          expiryDate: '',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
          description: String(description || '').trim(),
        };

        newProducts.push(newProduct);
        matchedCodes.add(code);
        created.push(newProduct.name);
      });

      const finalProducts = [...newProducts, ...nextProducts];
      if (!updates.length && !created.length) {
        setCsvError('No matching products were updated or created. Check the SKU/Code values.');
        return;
      }

      updateProducts(finalProducts);
      const messages: string[] = [];
      if (updates.length) messages.push(`${updates.length} product${updates.length === 1 ? '' : 's'} updated`);
      if (created.length) messages.push(`${created.length} product${created.length === 1 ? '' : 's'} added`);
      setCsvUpdateMessage(`${messages.join(' and ')} successfully.`);
      if (created.length && !updates.length) {
        setCsvError('New products were added from unmatched SKUs.');
      }
      setSelectedCsvFile(null);
      setCsvFileName('');
    };
    reader.onerror = () => setCsvError('Unable to read CSV file.');
    if (!selectedCsvFile) {
      setCsvError('Please select a CSV file before importing.');
      return;
    }
    reader.readAsText(selectedCsvFile);
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const next = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    updateOrders(next);
  };

  const handleAssignRider = (orderId: string, rider: string) => {
    const next = orders.map(order =>
      order.id === orderId ? { ...order, assignedRider: rider } : order
    );
    updateOrders(next);
  };

  const handleAssignPartner = (orderId: string, partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    const next = orders.map(order => {
      if (order.id !== orderId) return order;
      if (!partnerId || !partner) {
        return {
          ...order,
          deliveryPartnerId: undefined,
          deliveryPartnerName: undefined,
          deliveryFee: undefined,
          deliveryCommission: undefined,
        };
      }
      const commission = Number((order.total * (partner.commissionRate / 100)).toFixed(2));
      const fee = Number((partner.baseFee + commission).toFixed(2));
      return {
        ...order,
        deliveryPartnerId: partner.id,
        deliveryPartnerName: partner.companyName,
        deliveryFee: fee,
        deliveryCommission: commission,
      };
    });
    updateOrders(next);
  };

  const handleMarkPaymentPaid = (orderId: string) => {
    const next: Order[] = orders.map(order =>
      order.id === orderId
        ? ({
            ...order,
            paymentStatus: 'Paid',
            status: order.status === 'Pending' ? 'Confirmed' : order.status,
          } as Order)
        : order
    );
    updateOrders(next);
  };

  const handlePaymentReferenceUpdate = (orderId: string, reference: string) => {
    const next = orders.map(order =>
      order.id === orderId ? { ...order, paymentReference: reference } : order
    );
    updateOrders(next);
  };

  const handleToggleFlagged = (orderId: string) => {
    const next = orders.map(order =>
      order.id === orderId ? { ...order, flagged: !order.flagged } : order
    );
    updateOrders(next);
  };

  const orderSummary = useMemo(() => ({
    orders: orders.length,
    revenue: overview.monthlySales,
  }), [orders, overview.monthlySales]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl p-8">
          <h1 className="text-3xl font-semibold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button className="w-full rounded-2xl bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition">
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.18),_transparent_20%),#020617] px-4 py-10 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.55)] backdrop-blur-3xl md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">CEO Command Center</p>
            <h1 className="mt-3 text-4xl font-semibold">QKart Admin</h1>
            <p className="mt-2 max-w-2xl text-slate-300">Dashboard overview, product inventory, order operations, and customer intelligence — all in one place.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['overview', 'products', 'shops', 'orders', 'customers', 'delivery', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${selectedTab === tab ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-300 hover:bg-white/15'}`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'products' ? 'Products' : tab === 'shops' ? 'Shops' : tab === 'orders' ? 'Orders' : tab === 'customers' ? 'Customers' : tab === 'delivery' ? 'Delivery' : 'Settings'}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        </div>

        {selectedTab === 'overview' && (
          <section className="space-y-8">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <p className="text-sm text-slate-400">Sales Today</p>
                <p className="mt-4 text-3xl font-semibold text-white">{formatCurrency(overview.dailySales)}</p>
                <p className="mt-2 text-sm text-slate-400">Orders: {orders.filter(order => order.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <p className="text-sm text-slate-400">This Week</p>
                <p className="mt-4 text-3xl font-semibold text-white">{formatCurrency(overview.weeklySales)}</p>
                <p className="mt-2 text-sm text-slate-400">Total orders: {overview.totalOrders}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <p className="text-sm text-slate-400">Pending Payments</p>
                <p className="mt-4 text-3xl font-semibold text-white">{overview.pendingPayments}</p>
                <p className="mt-2 text-sm text-slate-400">Awaiting verification</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <p className="text-sm text-slate-400">Cash on Delivery</p>
                <p className="mt-4 text-3xl font-semibold text-white">{overview.codOrders}</p>
                <p className="mt-2 text-sm text-slate-400">COD orders waiting pickup</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="col-span-2 rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Revenue trend</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Last 7 days</h2>
                  </div>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300">Total {formatCurrency(orderSummary.revenue)}</div>
                </div>
                <div className="mt-6 flex items-end gap-4">
                  {revenueTrend.map(bucket => {
                    const max = Math.max(...revenueTrend.map(item => item.value), 1);
                    const height = Math.max(36, (bucket.value / max) * 160);
                    return (
                      <div key={bucket.label} className="flex-1 text-center">
                        <div className="mx-auto flex h-[180px] w-full flex-col justify-end gap-2">
                          <div className="mx-auto h-[1px] w-full bg-slate-700" />
                          <div className="mx-auto w-full max-w-[56px] rounded-3xl bg-white/10 p-2 text-xs text-slate-300">{formatCurrency(bucket.value)}</div>
                          <div className="mx-auto w-11 rounded-3xl bg-gradient-to-b from-violet-400 to-sky-500" style={{ height }} />
                        </div>
                        <span className="mt-3 inline-block text-sm text-slate-400">{bucket.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Top selling</p>
                <div className="mt-5 space-y-4">
                  {overview.topProducts.length === 0 ? (
                    <p className="text-sm text-slate-400">No sales yet.</p>
                  ) : (
                    overview.topProducts.map(({ product, count }) => (
                      <div key={product!.id} className="rounded-3xl bg-white/5 p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 overflow-hidden rounded-3xl bg-slate-800">
                            <img src={product!.image} alt={product!.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{product!.name}</p>
                            <p className="text-sm text-slate-400">{count} sold</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Low stock alerts</p>
                <div className="mt-5 space-y-3">
                  {overview.lowStock.length === 0 ? (
                    <p className="text-slate-400">No low stock items right now.</p>
                  ) : (
                    overview.lowStock.map(product => (
                      <div key={product.id} className="rounded-3xl bg-white/5 p-4">
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-slate-400">Stock: {product.stock} • {product.category} / {product.subcategory}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pending orders</p>
                <div className="mt-5 space-y-3">
                  {orders.filter(order => order.status === 'Pending').slice(0, 4).map(order => (
                    <div key={order.id} className="rounded-3xl bg-white/5 p-4">
                      <p className="font-medium text-white">Order #{order.id}</p>
                      <p className="text-sm text-slate-400">{order.customer.name} • {formatCurrency(order.total)}</p>
                    </div>
                  ))}
                  {orders.filter(order => order.status === 'Pending').length === 0 && (
                    <p className="text-slate-400">No pending orders currently.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'products' && (
          <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Product Management</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Inventory brain</h2>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm text-emerald-200">{products.length} products</span>
              </div>
              <form onSubmit={handleProductSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Name</span>
                    <input value={productForm.name ?? ''} onChange={e => handleProductChange('name', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Category</span>
                    <input value={productForm.category ?? ''} onChange={e => handleProductChange('category', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Subcategory</span>
                    <input value={productForm.subcategory ?? ''} onChange={e => handleProductChange('subcategory', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Aisle</span>
                    <input value={productForm.aisle ?? ''} onChange={e => handleProductChange('aisle', e.target.value)} placeholder="General, Cleaning, Staples" className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">SKU</span>
                    <input value={productForm.sku ?? ''} onChange={e => handleProductChange('sku', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-sm text-slate-300">Price</span>
                    <input type="number" step="0.01" value={productForm.price ?? 0} onChange={e => handleProductChange('price', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Discount</span>
                    <input type="number" step="0.01" value={productForm.discountPrice ?? 0} onChange={e => handleProductChange('discountPrice', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Stock</span>
                    <input type="number" value={productForm.stock ?? 0} onChange={e => handleProductChange('stock', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Barcode</span>
                    <input value={productForm.barcode ?? ''} onChange={e => handleProductChange('barcode', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Expiry date</span>
                    <input type="date" value={productForm.expiryDate ?? ''} onChange={e => handleProductChange('expiryDate', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm text-slate-300">Image URL</span>
                  <input value={productForm.image ?? ''} onChange={e => handleProductChange('image', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Upload photo</span>
                  <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) handleImageFileUpload(file); }} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Description</span>
                  <textarea value={productForm.description ?? ''} onChange={e => handleProductChange('description', e.target.value)} rows={4} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                </label>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition">
                    {editingProductId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={clearForm} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 hover:bg-white/10 transition">
                    Reset form
                  </button>
                </div>
              </form>
              <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">CSV inventory upload</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Update price & stock</h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">SKU-based import</span>
                </div>
                <div className="mt-6 space-y-4">
                  <input type="file" accept=".csv,text/csv" onChange={handleCsvFileUpload} className="block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  <p className="text-sm text-slate-400">Upload a CSV with columns like <span className="text-white">SKU</span>, <span className="text-white">SOH</span>, <span className="text-white">Selling Price</span>, <span className="text-white">Aisle</span>, and optional <span className="text-white">Description</span>. New SKUs will be added automatically as products.</p>
                  {csvUpdateMessage && <p className="text-sm text-emerald-300">{csvUpdateMessage}</p>}
                  {csvError && <p className="text-sm text-rose-500">{csvError}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <h2 className="text-2xl font-semibold text-white">Product catalog</h2>
              <p className="mt-2 text-sm text-slate-400">Edit products, manage stock, and review category placement.</p>
              <div className="mt-6 space-y-4">
                {products.map(item => (
                  <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 overflow-hidden rounded-3xl bg-slate-800">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-slate-400">{item.category} / {item.subcategory} • {item.aisle || 'No aisle'}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                        <span>SKU: {item.sku}</span>
                        <span>Stock: {item.stock}</span>
                        <span>{item.discountPrice ? formatCurrency(item.discountPrice) : formatCurrency(item.price)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button type="button" onClick={() => handleEditProduct(item)} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 transition">Edit</button>
                      <button type="button" onClick={() => handleDeleteProduct(item.id)} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'shops' && (
          <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Shop Management</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Vendor directory</h2>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm text-emerald-200">{shops.length} shops</span>
              </div>
              <form onSubmit={handleShopSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Shop name</span>
                    <input value={shopForm.name ?? ''} onChange={e => handleShopChange('name', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Location</span>
                    <input value={shopForm.location ?? ''} onChange={e => handleShopChange('location', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Email</span>
                    <input value={shopForm.email ?? ''} onChange={e => handleShopChange('email', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Phone</span>
                    <input value={shopForm.phone ?? ''} onChange={e => handleShopChange('phone', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Status</span>
                    <select value={shopForm.status ?? 'active'} onChange={e => handleShopChange('status', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Delivery note</span>
                    <input value={shopForm.deliveryNote ?? ''} onChange={e => handleShopChange('deliveryNote', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition">
                    {editingShopId ? 'Update Shop' : 'Add Shop'}
                  </button>
                  <button type="button" onClick={clearShopForm} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 hover:bg-white/10 transition">
                    Reset form
                  </button>
                </div>
                {error && <p className="text-sm text-rose-500">{error}</p>}
              </form>
              <div className="mt-8 space-y-4">
                {shops.map(shop => (
                  <div key={shop.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-white">{shop.name}</p>
                        <p className="text-sm text-slate-400">{shop.location} • {shop.status}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                        <span>{shop.email}</span>
                        <span>{shop.phone}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button type="button" onClick={() => handleEditShop(shop)} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 transition">Edit</button>
                      <button type="button" onClick={() => handleDeleteShop(shop.id)} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Shop listings</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Vendor offers</h2>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">{shopProducts.length} listings</span>
              </div>
              <form onSubmit={handleShopProductSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Shop</span>
                    <select value={shopProductForm.shopId ?? ''} onChange={e => handleShopProductChange('shopId', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option value="">Select vendor</option>
                      {shops.map(shop => (
                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Product</span>
                    <select value={shopProductForm.productId ?? ''} onChange={e => handleShopProductChange('productId', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option value="">Select product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-sm text-slate-300">Price</span>
                    <input type="number" step="0.01" value={shopProductForm.price ?? 0} onChange={e => handleShopProductChange('price', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Discount</span>
                    <input type="number" step="0.01" value={shopProductForm.discountPrice ?? 0} onChange={e => handleShopProductChange('discountPrice', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Stock</span>
                    <input type="number" value={shopProductForm.stock ?? 0} onChange={e => handleShopProductChange('stock', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Availability</span>
                    <select value={shopProductForm.status ?? 'Available'} onChange={e => handleShopProductChange('status', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option value="Available">Available</option>
                      <option value="Low stock">Low stock</option>
                      <option value="Out of stock">Out of stock</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Vendor SKU</span>
                    <input value={shopProductForm.sku ?? ''} onChange={e => handleShopProductChange('sku', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input type="checkbox" checked={Boolean(shopProductForm.available)} onChange={e => handleShopProductChange('available', e.target.checked)} className="h-5 w-5 rounded border-white/10 bg-slate-950/70 text-emerald-500" />
                  <span>Offer is available</span>
                </label>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition">
                    {editingShopProductId ? 'Update Listing' : 'Add Listing'}
                  </button>
                  <button type="button" onClick={clearShopProductForm} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 hover:bg-white/10 transition">
                    Reset form
                  </button>
                </div>
                {error && <p className="text-sm text-rose-500">{error}</p>}
              </form>
              <div className="mt-8 space-y-4">
                {shopProducts.map(offer => (
                  <div key={offer.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-white">{offer.shopId} • {offer.status}</p>
                        <p className="text-sm text-slate-400">Product {offer.productId} • SKU {offer.sku || '—'}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                        <span>{offer.available ? 'Available' : 'Unavailable'}</span>
                        <span>Price: {formatCurrency(offer.discountPrice ?? offer.price)}</span>
                        <span>Stock: {offer.stock}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button type="button" onClick={() => handleEditShopProduct(offer)} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 transition">Edit</button>
                      <button type="button" onClick={() => handleDeleteShopProduct(offer.id)} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'orders' && (
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Order Management</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Cash pipeline</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <span>Status</span>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option>All</option>
                      {STATUS_OPTIONS.map(status => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <span>Partner</span>
                    <select value={partnerFilter} onChange={e => setPartnerFilter(e.target.value as any)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option value="All">All partners</option>
                      {partners.map(partner => (
                        <option key={partner.id} value={partner.id}>{partner.companyName}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <span>Payment Status</span>
                    <select value={paymentStatusFilter} onChange={e => setPaymentStatusFilter(e.target.value as any)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option>All</option>
                      <option>Pending</option>
                      <option>Paid</option>
                      <option>Failed</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <span>Payment Method</span>
                    <select value={paymentMethodFilter} onChange={e => setPaymentMethodFilter(e.target.value as any)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option>All</option>
                      <option>online</option>
                      <option>cash_on_delivery</option>
                      <option>mobile_money_manual</option>
                      <option>pickup</option>
                    </select>
                  </label>
                  <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">{filteredOrders.length} orders</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 text-slate-300 shadow-xl backdrop-blur-3xl">No orders match this filter.</div>
              ) : filteredOrders.slice().reverse().map(order => (
                <div key={order.id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Order #{order.id}</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{order.customer.name}</h3>
                      <p className="text-sm text-slate-400">{order.customer.email} · {order.customer.address}, {order.customer.city}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">{order.status}</span>
                      <span className="rounded-full bg-slate-700/80 px-3 py-2 text-sm text-slate-200">{order.paymentStatus}</span>
                      <span className="rounded-full bg-white/10 px-3 py-2 text-sm text-slate-300">{order.paymentMethod.replace(/_/g, ' ')}</span>
                      <span className="rounded-full bg-white/10 px-3 py-2 text-sm text-slate-300">{formatCurrency(order.total)}</span>
                      {order.flagged && <span className="rounded-full bg-rose-500/20 px-3 py-2 text-sm text-rose-200">Flagged</span>}
                    </div>
                  </div>
                  <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                    <p><span className="font-medium text-white">Payment reference:</span> {order.paymentReference || 'Not provided'}</p>
                  </div>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Items</p>
                      <ul className="mt-3 space-y-2 text-slate-200">
                        {order.items.map(item => (
                          <li key={item.product.id} className="flex justify-between border-b border-white/10 pb-2">
                            <span>{item.product.name} × {item.quantity}</span>
                            <span>{formatCurrency(item.product.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Actions</p>
                      <div className="mt-3 space-y-4">
                        <label className="block text-sm text-slate-300">Status</label>
                        <select
                          value={order.status}
                          onChange={e => handleOrderStatusUpdate(order.id, e.target.value as OrderStatus)}
                          className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none"
                        >
                          {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <label className="block text-sm text-slate-300">Delivery partner</label>
                        <select
                          value={order.deliveryPartnerId ?? ''}
                          onChange={e => handleAssignPartner(order.id, e.target.value)}
                          className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none"
                        >
                          <option value="">Choose partner</option>
                          {partners.filter(partner => partner.active).map(partner => (
                            <option key={partner.id} value={partner.id}>{partner.companyName}</option>
                          ))}
                        </select>
                        {order.deliveryPartnerName && (
                          <p className="mt-2 text-sm text-slate-300">Partner: {order.deliveryPartnerName} · Commission {formatCurrency(order.deliveryCommission ?? 0)} · Fee {formatCurrency(order.deliveryFee ?? 0)}</p>
                        )}
                        <label className="block text-sm text-slate-300">Payment reference</label>
                        <input
                          value={order.paymentReference ?? ''}
                          onChange={e => handlePaymentReferenceUpdate(order.id, e.target.value)}
                          placeholder="Manual payment reference"
                          className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none"
                        />
                        {order.paymentStatus === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleMarkPaymentPaid(order.id)}
                            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-400 transition"
                          >
                            Mark as Paid
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleFlagged(order.id)}
                          className={`mt-3 inline-flex w-full items-center justify-center rounded-2xl ${order.flagged ? 'bg-rose-600' : 'bg-slate-700'} px-4 py-3 text-sm font-medium text-white hover:opacity-90 transition`}
                        >
                          {order.flagged ? 'Unflag order' : 'Flag suspicious'}
                        </button>
                        <label className="block text-sm text-slate-300">Assign rider</label>
                        <input
                          value={order.assignedRider ?? ''}
                          onChange={e => handleAssignRider(order.id, e.target.value)}
                          placeholder="Rider name"
                          className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none"
                        />
                        <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                          <p><span className="font-medium text-white">Delivery zone:</span> {order.deliveryZone || 'Unassigned'}</p>
                          <p className="mt-2"><span className="font-medium text-white">Invoice:</span> #{order.id}-{order.customer.name.split(' ')[0]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedTab === 'delivery' && (
          <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Delivery liaison</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Partner operations</h2>
                </div>
                <span className="rounded-full bg-sky-500/15 px-4 py-2 text-sm text-sky-200">{partners.length} partners</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl bg-white/5 p-4 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active partners</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{partners.filter(partner => partner.active).length}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Assigned orders</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{partnerSummary.reduce((sum, partner) => sum + partner.assignedOrders, 0)}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimated commission</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(partnerSummary.reduce((sum, partner) => sum + partner.totalCommission, 0))}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Top partner</p>
                  <p className="mt-3 text-xl font-semibold text-white">{partnerSummary.slice().sort((a, b) => b.assignedOrders - a.assignedOrders)[0]?.companyName || 'None'}</p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 shadow-inner shadow-slate-950/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Partner performance</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Order load vs commission</h3>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-4 py-2 text-sm text-slate-200">Live update</span>
                </div>
                <div className="mt-5 space-y-4">
                  {partnerSummary.length === 0 ? (
                    <p className="text-sm text-slate-400">No partner activity yet.</p>
                  ) : (
                    partnerSummary.map(partner => {
                      const maxOrders = Math.max(...partnerSummary.map(item => item.assignedOrders), 1);
                      const widthPercent = Math.round((partner.assignedOrders / maxOrders) * 100);
                      return (
                        <div key={partner.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>{partner.companyName}</span>
                            <span>{partner.assignedOrders} orders · {formatCurrency(partner.totalCommission)}</span>
                          </div>
                          <div className="h-3 rounded-full bg-white/10">
                            <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-violet-500" style={{ width: `${widthPercent}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <form onSubmit={handlePartnerSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Company name</span>
                    <input value={partnerForm.companyName ?? ''} onChange={e => handlePartnerChange('companyName', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Contact name</span>
                    <input value={partnerForm.contactName ?? ''} onChange={e => handlePartnerChange('contactName', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Phone</span>
                    <input value={partnerForm.phone ?? ''} onChange={e => handlePartnerChange('phone', e.target.value)} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Delivery zones</span>
                    <input value={Array.isArray(partnerForm.zones) ? partnerForm.zones.join(', ') : partnerForm.zones ?? ''} onChange={e => handlePartnerChange('zones', e.target.value)} placeholder="Lilongwe Area 25, Area 18" className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-sm text-slate-300">Commission rate (%)</span>
                    <input type="number" step="1" min="0" value={partnerForm.commissionRate ?? 0} onChange={e => handlePartnerChange('commissionRate', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Base fee</span>
                    <input type="number" step="0.1" min="0" value={partnerForm.baseFee ?? 0} onChange={e => handlePartnerChange('baseFee', Number(e.target.value))} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Active</span>
                    <select value={partnerForm.active ? 'active' : 'inactive'} onChange={e => handlePartnerChange('active', e.target.value === 'active')} className="mt-2 block w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                </div>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition">
                    {editingPartnerId ? 'Update Partner' : 'Add Partner'}
                  </button>
                  <button type="button" onClick={clearPartnerForm} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 hover:bg-white/10 transition">
                    Reset
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Partner network</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Courier partners</h2>
                </div>
                <span className="rounded-full bg-slate-800/80 px-4 py-2 text-sm text-slate-200">{partnerSummary.reduce((sum, partner) => sum + partner.assignedOrders, 0)} assigned orders</span>
              </div>
              <div className="mt-6 space-y-4">
                {partners.length === 0 ? (
                  <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 text-slate-300 shadow-xl backdrop-blur-3xl">No delivery partners configured yet.</div>
                ) : (
                  partners.map(partner => (
                    <div key={partner.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{partner.companyName}</p>
                          <p className="text-sm text-slate-400">Contact: {partner.contactName} · {partner.phone}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                          <span className="rounded-full bg-slate-800/90 px-3 py-2">{partner.active ? 'Active' : 'Inactive'}</span>
                          <span className="rounded-full bg-slate-800/90 px-3 py-2">{partner.zones.join(', ')}</span>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-3 text-slate-300">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Commission</p>
                          <p className="mt-2 font-semibold text-white">{partner.commissionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Base fee</p>
                          <p className="mt-2 font-semibold text-white">{formatCurrency(partner.baseFee)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Orders assigned</p>
                          <p className="mt-2 font-semibold text-white">{partnerSummary.find(item => item.id === partner.id)?.assignedOrders ?? 0}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button type="button" onClick={() => handleEditPartner(partner)} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 transition">Edit</button>
                        <button type="button" onClick={() => handleDeletePartner(partner.id)} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400 transition">Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'customers' && (
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl lg:col-span-1">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Customer intelligence</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Customer profiles</h2>
              <p className="mt-4 text-slate-300">Track repeat buyers, revenue impact, and address records from recent orders.</p>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {customers.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 text-slate-300 shadow-xl backdrop-blur-3xl">No customers yet.</div>
              ) : customers.map(customer => (
                <div key={customer.customer.email} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-3xl">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xl font-semibold text-white">{customer.customer.name}</p>
                      <p className="text-sm text-slate-400">{customer.customer.email} · {customer.customer.phone || 'No phone'}</p>
                    </div>
                    <span className="rounded-full bg-slate-800/90 px-4 py-2 text-sm text-slate-200">{customer.orders} orders</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3 text-slate-300">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Revenue</p>
                      <p className="mt-2 font-semibold text-white">{formatCurrency(customer.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">City</p>
                      <p className="mt-2 text-slate-300">{customer.customer.city}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Address</p>
                      <p className="mt-2 text-slate-300">{customer.customer.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedTab === 'settings' && (
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl lg:col-span-1">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">App customization</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Settings</h2>
              <p className="mt-4 text-slate-300">Customize the app's appearance, colors, and images.</p>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <h3 className="text-lg font-semibold text-white mb-4">UI Customization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-full h-10 rounded border border-slate-600 bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Background Color</label>
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSettings({ ...settings, backgroundColor: e.target.value })}
                      className="w-full h-10 rounded border border-slate-600 bg-slate-800"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-3xl">
                <h3 className="text-lg font-semibold text-white mb-4">Image Customization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Logo Image URL</label>
                    <input
                      type="url"
                      value={settings.logoImage}
                      onChange={(e) => updateSettings({ ...settings, logoImage: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="w-full rounded-2xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image URL</label>
                    <input
                      type="url"
                      value={settings.heroImage}
                      onChange={(e) => updateSettings({ ...settings, heroImage: e.target.value })}
                      placeholder="https://example.com/hero.jpg"
                      className="w-full rounded-2xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
