import { products as localProducts, whyChooseFeatures as localFeatures } from '@/data/products';
import type { Product } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export interface WhyChooseFeature {
    icon: string;
    title: string;
    description: string;
}

/**
 * Fetch products from API, falls back to local data when no backend is configured.
 */
export async function fetchProducts(category?: string): Promise<Product[]> {
    if (API_BASE) {
        try {
            const url = category
                ? `${API_BASE}/api/products?category=${category}`
                : `${API_BASE}/api/products`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) return data.data;
        } catch (err) {
            console.warn('API fetch failed, using local data:', err);
        }
    }
    // Fallback: local data
    const active = localProducts.filter((p) => p.status === 'active');
    return category ? active.filter((p) => p.category === category) : active;
}

/**
 * Fetch single product by ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/api/products/${id}`);
            const data = await res.json();
            if (data.success) return data.data;
        } catch (err) {
            console.warn('API fetch failed, using local data:', err);
        }
    }
    return localProducts.find((p) => p.id === id) || null;
}

/**
 * Fetch "You May Also Like" products by price range
 */
export async function fetchSimilarProducts(
    currentProductId: string,
    basePrice: number,
    limit = 4
): Promise<Product[]> {
    if (API_BASE) {
        try {
            const res = await fetch(
                `${API_BASE}/api/products/similar?excludeId=${currentProductId}&price=${basePrice}&limit=${limit}`
            );
            const data = await res.json();
            if (data.success) return data.data;
        } catch (err) {
            console.warn('API fetch failed, using local data:', err);
        }
    }
    // Fallback: local price-range logic
    const range = basePrice * 0.3; // ±30% price range
    return localProducts
        .filter((p) => p.id !== currentProductId && p.status === 'active')
        .filter((p) => Math.abs(p.basePrice - basePrice) <= range)
        .sort((a, b) => Math.abs(a.basePrice - basePrice) - Math.abs(b.basePrice - basePrice))
        .slice(0, limit);
}

/**
 * Fetch Why Choose features
 */
export async function fetchWhyChooseFeatures(): Promise<WhyChooseFeature[]> {
    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/api/features`);
            const data = await res.json();
            if (data.success) return data.data;
        } catch (err) {
            console.warn('API fetch failed, using local data:', err);
        }
    }
    return localFeatures;
}

/**
 * Create Razorpay order
 */
export async function createRazorpayOrder(amount: number, currency = 'INR') {
    if (!API_BASE) {
        // Mock order for frontend-only deployment
        return {
            success: true,
            data: {
                orderId: `order_mock_${Date.now()}`,
                amount: amount * 100, // Razorpay uses paise
                currency,
            },
        };
    }
    const res = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
    });
    return res.json();
}

/**
 * Verify Razorpay payment
 */
export async function verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}) {
    if (!API_BASE) {
        return { success: true, data: { verified: true } };
    }
    const res = await fetch(`${API_BASE}/api/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
    });
    return res.json();
}

/**
 * Admin: Fetch all products (including inactive)
 */
export async function adminFetchProducts(token: string): Promise<Product[]> {
    if (!API_BASE) return localProducts;
    const res = await fetch(`${API_BASE}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.data : [];
}

/**
 * Admin: Create/Update product
 */
export async function adminSaveProduct(
    product: Partial<Product>,
    token: string,
    isNew = false
) {
    if (!API_BASE) {
        return { success: true, data: { ...product, id: product.id || Date.now().toString() } };
    }
    const url = isNew
        ? `${API_BASE}/api/admin/products`
        : `${API_BASE}/api/admin/products/${product.id}`;
    const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
    });
    return res.json();
}

/**
 * Admin: Delete product
 */
export async function adminDeleteProduct(productId: string, token: string) {
    if (!API_BASE) return { success: true };
    const res = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

/**
 * Admin: Fetch all orders
 */
export async function adminFetchOrders(token: string) {
    if (!API_BASE) return [];
    const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.data : [];
}

/**
 * Admin: Update order status
 */
export async function adminUpdateOrderStatus(
    orderId: string,
    status: string,
    token: string
) {
    if (!API_BASE) return { success: true };
    const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    return res.json();
}
