import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistState {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    toggleWishlist: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) =>
                set((state) => {
                    if (state.items.some((item) => item.id === product.id)) return state;
                    return { items: [...state.items, product] };
                }),

            removeFromWishlist: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            isInWishlist: (id) => get().items.some((item) => item.id === id),

            toggleWishlist: (product) => {
                const state = get();
                if (state.items.some((item) => item.id === product.id)) {
                    set({ items: state.items.filter((item) => item.id !== product.id) });
                } else {
                    set({ items: [...state.items, product] });
                }
            },
        }),
        {
            name: 'clefeel-wishlist',
        }
    )
);
