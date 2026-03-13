import { whyChooseFeatures as localFeatures } from '@/data/products';
import { useProductStore } from '@/store/productStore';
import type { Product } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export interface WhyChooseFeature {
    icon: string;
    title: string;
    description: string;
}

/**
 * Helper: get products from the Zustand store (localStorage-persisted).
 */
function getLocalProducts(): Product[] {
    return useProductStore.getState().products;
}

/**
 * Fetch products from API, falls back to local store data.
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
    const all = getLocalProducts();
    const active = all.filter((p) => p.status === 'active');
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
    return getLocalProducts().find((p) => p.id === id) || null;
}

/**
 * Fetch similar products by price range
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
    const allProducts = getLocalProducts();
    const range = basePrice * 0.3;
    return allProducts
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
        return {
            success: true,
            data: {
                orderId: `order_mock_${Date.now()}`,
                amount: amount * 100,
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
 * Verify payment AND create order atomically in one backend call.
 * This is the preferred method after Razorpay payment success.
 */
export async function verifyAndCreateOrder(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    items: Array<{ productId: string; sizeName: string; price: number; quantity: number }>;
    totalAmount: number;
    address: any;
    userId?: string;
}) {
    if (!API_BASE) {
        // Offline fallback
        return { success: true, data: { id: `order_${Date.now()}`, ...data } };
    }
    console.log('[API] verifyAndCreateOrder called with', data.items.length, 'items, total ₹', data.totalAmount);
    const res = await fetch(`${API_BASE}/api/payment/verify-and-create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    console.log('[API] verifyAndCreateOrder response:', res.status, json);
    return json;
}

/**
 * Verify Razorpay payment (legacy — use verifyAndCreateOrder instead)
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
 * Create order in database (legacy — use verifyAndCreateOrder instead)
 */
export async function createOrder(orderData: {
    items: Array<{ productId: string; sizeName: string; price: number; quantity: number }>;
    totalAmount: number;
    address: any;
    userId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
}) {
    if (!API_BASE) {
        return { success: true, data: { id: `order_${Date.now()}`, ...orderData } };
    }
    const res = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    return res.json();
}

/**
 * Upload image to Cloudinary via backend
 */
export async function uploadImage(file: File, token: string): Promise<{ url: string; publicId: string } | null> {
    if (!API_BASE) {
        console.error('[Upload] No API_BASE configured');
        return null;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
        console.log('[Upload] Sending to:', `${API_BASE}/api/upload`, 'File:', file.name, file.size, 'bytes');
        const res = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const data = await res.json();
        console.log('[Upload] Response:', res.status, data);
        if (data.success) return data.data;
        console.error('[Upload] Server error:', data.message);
    } catch (err) {
        console.error('[Upload] Fetch failed:', err);
    }
    return null;
}

/**
 * Admin: Fetch all products
 */
export async function adminFetchProducts(token: string): Promise<Product[]> {
    if (!API_BASE) return getLocalProducts();
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
        const store = useProductStore.getState();
        if (isNew) {
            const newProduct: Product = {
                ...product,
                id: product.id || `product-${Date.now()}`,
            } as Product;
            store.addProduct(newProduct);
            return { success: true, data: newProduct };
        } else {
            store.updateProduct(product.id!, product);
            return { success: true, data: product };
        }
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
    if (!API_BASE) {
        useProductStore.getState().deleteProduct(productId);
        return { success: true };
    }
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
