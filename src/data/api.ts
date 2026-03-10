/**
 * API Service Abstraction Layer
 * 
 * Currently returns static data via Promise.resolve().
 * When backend is ready, replace implementations with actual fetch() calls.
 * 
 * Example future usage:
 *   export async function fetchProducts(): Promise<Product[]> {
 *     const res = await fetch('/api/products');
 *     return res.json();
 *   }
 */

import type { Product } from '@/types';
import { products as staticProducts, whyChooseFeatures as staticFeatures } from './products';

export interface WhyChooseFeature {
    icon: string;
    title: string;
    description: string;
}

/** Fetch all products — swap with real API call when backend is ready */
export async function fetchProducts(): Promise<Product[]> {
    // Simulate network delay for realistic loading states
    await new Promise((r) => setTimeout(r, 100));
    return staticProducts;
}

/** Fetch a single product by ID */
export async function fetchProductById(id: string): Promise<Product | undefined> {
    await new Promise((r) => setTimeout(r, 100));
    return staticProducts.find((p) => p.id === id);
}

/** Fetch "Why Choose" features — swap with CMS/API when ready */
export async function fetchWhyChooseFeatures(): Promise<WhyChooseFeature[]> {
    await new Promise((r) => setTimeout(r, 100));
    return staticFeatures;
}

/** Fetch bestseller products */
export async function fetchBestsellers(): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 100));
    return staticProducts.filter((p) => p.bestseller);
}

/** Fetch new arrival products */
export async function fetchNewArrivals(): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 100));
    return staticProducts.filter((p) => p.new);
}
