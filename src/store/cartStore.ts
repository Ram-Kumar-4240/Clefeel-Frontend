import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Address, Order, User } from '@/types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  addOrder: (order: Order) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

      applyCoupon: (code) => {
        const validCoupons: Record<string, number> = {
          'CLEFEEL10': 0.1,
          'CLEFEEL20': 0.2,
          'WELCOME': 0.15,
        };
        if (validCoupons[code]) {
          set({ couponCode: code, discount: validCoupons[code] });
        }
      },

      removeCoupon: () => set({ couponCode: null, discount: 0 }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discount;
        return Math.round(subtotal * (1 - discount));
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'clefeel-cart',
    }
  )
);

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      login: (user) => set({ user, isLoggedIn: true }),

      logout: () => set({ user: null, isLoggedIn: false }),

      addAddress: (address) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: [...state.user.addresses, address],
            },
          };
        });
      },

      removeAddress: (addressId) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses.filter(
                (addr) => addr.id !== addressId
              ),
            },
          };
        });
      },

      addOrder: (order) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              orders: [order, ...state.user.orders],
            },
          };
        });
      },
    }),
    {
      name: 'clefeel-user',
    }
  )
);
