import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '@/data/products';
import type { Product } from '@/types';

interface ProductStoreState {
    products: Product[];
    initialized: boolean;

    // Actions
    getProducts: (category?: string) => Product[];
    getProductById: (id: string) => Product | null;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    resetToDefaults: () => void;
}

export const useProductStore = create<ProductStoreState>()(
    persist(
        (set, get) => ({
            products: initialProducts,
            initialized: true,

            getProducts: (category?: string) => {
                const all = get().products;
                const active = all.filter(p => p.status === 'active');
                return category ? active.filter(p => p.category === category) : active;
            },

            getProductById: (id: string) => {
                return get().products.find(p => p.id === id) || null;
            },

            addProduct: (product: Product) => {
                set(state => ({
                    products: [...state.products, product],
                }));
            },

            updateProduct: (id: string, updates: Partial<Product>) => {
                set(state => ({
                    products: state.products.map(p =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                }));
            },

            deleteProduct: (id: string) => {
                set(state => ({
                    products: state.products.filter(p => p.id !== id),
                }));
            },

            resetToDefaults: () => {
                set({ products: initialProducts });
            },
        }),
        {
            name: 'clefeel-products',
        }
    )
);
