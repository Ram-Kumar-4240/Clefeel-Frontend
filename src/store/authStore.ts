import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, Address, Order } from '@/types';

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    registrationEmail: string | null; // Track email after registration for verification message

    // Auth actions
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<boolean>;
    verifyEmail: (token: string) => Promise<boolean>;
    resetPassword: (token: string, password: string) => Promise<boolean>;
    resendVerification: () => Promise<boolean>;

    // Profile actions (API-backed)
    updateProfile: (data: Partial<User>) => Promise<void>;
    addAddress: (address: Address) => Promise<void>;
    removeAddress: (addressId: string) => Promise<void>;
    fetchMyOrders: () => Promise<Order[]>;

    // Direct set for local usage
    setUser: (user: User) => void;
    clearRegistrationEmail: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(token?: string) {
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            tokens: null,
            isLoggedIn: false,
            isLoading: false,
            registrationEmail: null,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    if (API_BASE) {
                        const res = await fetch(`${API_BASE}/api/auth/login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password }),
                        });
                        const data = await res.json();
                        if (data.success) {
                            set({
                                user: data.data.user,
                                tokens: data.data.tokens,
                                isLoggedIn: true,
                                isLoading: false,
                            });
                            return { success: true };
                        }
                        set({ isLoading: false });
                        return { success: false, message: data.message || 'Login failed' };
                    }

                    // Local mock login (fallback only when no API)
                    if (email === 'admin@clefeel.com' && password === 'admin123') {
                        const adminUser: User = {
                            id: 'admin-1', fullName: 'CLEFEEL Admin', email: 'admin@clefeel.com',
                            phone: '', isVerified: true, addresses: [], orders: [], role: 'admin',
                        };
                        set({ user: adminUser, isLoggedIn: true, isLoading: false });
                        return { success: true };
                    }
                    set({ isLoading: false });
                    return { success: false, message: 'Invalid credentials' };
                } catch {
                    set({ isLoading: false });
                    return { success: false, message: 'Network error' };
                }
            },

            register: async (data) => {
                set({ isLoading: true });
                try {
                    if (API_BASE) {
                        const res = await fetch(`${API_BASE}/api/auth/register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                        });
                        const result = await res.json();
                        set({ isLoading: false });
                        if (result.success) {
                            // Don't log in — user needs to verify email first
                            set({ registrationEmail: data.email });
                            return { success: true, message: result.message || 'Check your email for verification link' };
                        }
                        return { success: false, message: result.message || 'Registration failed' };
                    }

                    // Local mock
                    set({ registrationEmail: data.email, isLoading: false });
                    return { success: true, message: 'Check your email for verification link' };
                } catch {
                    set({ isLoading: false });
                    return { success: false, message: 'Network error' };
                }
            },

            logout: () => {
                set({ user: null, tokens: null, isLoggedIn: false, registrationEmail: null });
            },

            forgotPassword: async (email) => {
                try {
                    if (API_BASE) {
                        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email }),
                        });
                        const data = await res.json();
                        return data.success;
                    }
                    return true;
                } catch {
                    return false;
                }
            },

            verifyEmail: async (token) => {
                try {
                    if (API_BASE) {
                        const res = await fetch(`${API_BASE}/api/auth/verify-email?token=${token}`);
                        const data = await res.json();
                        if (data.success && get().user) {
                            set((state) => ({
                                user: state.user ? { ...state.user, isVerified: true } : null,
                            }));
                        }
                        return data.success;
                    }
                    return true;
                } catch {
                    return false;
                }
            },

            resetPassword: async (token, password) => {
                try {
                    if (API_BASE) {
                        const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token, password }),
                        });
                        const data = await res.json();
                        return data.success;
                    }
                    return true;
                } catch {
                    return false;
                }
            },

            resendVerification: async () => {
                try {
                    const { tokens } = get();
                    if (API_BASE && tokens) {
                        const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
                            method: 'POST',
                            headers: authHeaders(tokens.accessToken),
                        });
                        const data = await res.json();
                        return data.success;
                    }
                    return true;
                } catch {
                    return false;
                }
            },

            updateProfile: async (data) => {
                const { tokens } = get();
                if (API_BASE && tokens) {
                    const res = await fetch(`${API_BASE}/api/auth/profile`, {
                        method: 'PUT',
                        headers: authHeaders(tokens.accessToken),
                        body: JSON.stringify(data),
                    });
                    const result = await res.json();
                    if (result.success) {
                        set((state) => ({
                            user: state.user ? { ...state.user, ...result.data } : null,
                        }));
                        return;
                    }
                }
                // Local fallback
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null,
                }));
            },

            addAddress: async (address) => {
                const { tokens } = get();
                if (API_BASE && tokens) {
                    try {
                        const res = await fetch(`${API_BASE}/api/auth/address`, {
                            method: 'POST',
                            headers: authHeaders(tokens.accessToken),
                            body: JSON.stringify(address),
                        });
                        const result = await res.json();
                        if (result.success) {
                            set((state) => {
                                if (!state.user) return state;
                                return {
                                    user: {
                                        ...state.user,
                                        addresses: [...state.user.addresses, result.data],
                                    },
                                };
                            });
                            return;
                        }
                    } catch (e) {
                        console.error('addAddress error:', e);
                    }
                }
                // Local fallback
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

            removeAddress: async (addressId) => {
                const { tokens } = get();
                if (API_BASE && tokens) {
                    try {
                        await fetch(`${API_BASE}/api/auth/address/${addressId}`, {
                            method: 'DELETE',
                            headers: authHeaders(tokens.accessToken),
                        });
                    } catch (e) {
                        console.error('removeAddress error:', e);
                    }
                }
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            addresses: state.user.addresses.filter((a) => a.id !== addressId),
                        },
                    };
                });
            },

            fetchMyOrders: async () => {
                const { tokens } = get();
                if (API_BASE && tokens) {
                    try {
                        const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
                            headers: authHeaders(tokens.accessToken),
                        });
                        const data = await res.json();
                        if (data.success) {
                            // Map order items to include product image for display
                            const orders = data.data.map((order: any) => ({
                                ...order,
                                items: order.items.map((item: any) => ({
                                    ...item,
                                    product: {
                                        ...item.product,
                                        image: item.product?.images?.[0]?.imageUrl || item.product?.image || '',
                                    },
                                })),
                            }));
                            set((state) => ({
                                user: state.user ? { ...state.user, orders } : null,
                            }));
                            return orders;
                        }
                    } catch (e) {
                        console.error('fetchMyOrders error:', e);
                    }
                }
                return get().user?.orders || [];
            },

            setUser: (user) => set({ user, isLoggedIn: true }),
            clearRegistrationEmail: () => set({ registrationEmail: null }),
        }),
        {
            name: 'clefeel-auth',
        }
    )
);
