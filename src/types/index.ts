export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  image: string;
  category: string;
  collection: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  longevity: string;
  projection: string;
  bestseller?: boolean;
  new?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  address: Address;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  addresses: Address[];
  orders: Order[];
}
