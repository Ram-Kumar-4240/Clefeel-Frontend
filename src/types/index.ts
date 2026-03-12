export interface ProductSize {
  id: string;
  sizeName: string;
  price: number;
  mrp: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  baseMrp: number;
  category: string;
  status: 'active' | 'inactive';
  images: ProductImage[];
  sizes: ProductSize[];

  // Fragrance details
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  longevity: string;
  projection: string;
  bestseller?: boolean;
  new?: boolean;

  // Legacy compatibility — main display image
  image: string;
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  product: Product;
  sizeName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  address: Address;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  estimatedDelivery?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  addresses: Address[];
  orders: Order[];
  role: 'user' | 'admin';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
