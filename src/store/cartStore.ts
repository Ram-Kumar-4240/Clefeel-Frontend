import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, ProductSize } from '@/types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, selectedSize: ProductSize) => void;
  removeFromCart: (productId: string, sizeId: string) => void;
  updateQuantity: (productId: string, sizeId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, selectedSize) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize.id === selectedSize.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                  item.selectedSize.id === selectedSize.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { product, selectedSize, quantity: 1 }],
          };
        });
      },

      removeFromCart: (productId, sizeId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && item.selectedSize.id === sizeId)
          ),
        }));
      },

      updateQuantity: (productId, sizeId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, sizeId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.selectedSize.id === sizeId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.selectedSize.price * item.quantity,
          0
        );
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        // Free shipping over ₹4,999, else ₹99
        const shipping = subtotal >= 4999 ? 0 : 99;
        return subtotal + shipping;
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
