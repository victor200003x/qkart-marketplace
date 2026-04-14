export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  aisle?: string;
  sku: string;
  barcode?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  expiryDate?: string;
  image: string;
  description: string;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  logo?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'suspended';
  rating?: number;
  active: boolean;
  deliveryNote?: string;
}

export interface ShopProduct {
  id: string;
  shopId: string;
  productId: string;
  price: number;
  discountPrice?: number;
  stock: number;
  available: boolean;
  sku?: string;
  status?: 'Available' | 'Low stock' | 'Out of stock' | 'Unavailable';
}

export interface CartItem {
  product: Product;
  shopProduct: ShopProduct;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface DeliveryPartner {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  zones: string[];
  commissionRate: number;
  baseFee: number;
  active: boolean;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type PaymentMethod = 'online' | 'cash_on_delivery' | 'mobile_money_manual' | 'pickup';

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  flagged?: boolean;
  assignedRider?: string;
  deliveryZone?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryFee?: number;
  deliveryCommission?: number;
  shopId?: string;
  shopName?: string;
}
