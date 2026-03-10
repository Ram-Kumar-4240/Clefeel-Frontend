import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, Address, Order } from '@/types';

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isLoggedIn: boolean;
    isLoading: boolean;

    // Auth actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<boolean>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<boolean>;
    verifyEmail: (token: string) => Promise<boolean>;

    // Profile actions
    updateProfile: (data: Partial<User>) => void;
    addAddress: (address: Address) => void;
    removeAddress: (addressId: string) => void;
    addOrder: (order: Order) => void;
    updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;

    // Direct set for mock/local usage
    setUser: (user: User) => void;
}

// TODO: Replace with real API calls when backend is connected
const API_BASE = import.meta.env.VITE_API_URL || '';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            tokens: null,
            isLoggedIn: false,
            isLoading: false,

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
                            return true;
                        }
                        set({ isLoading: false });
                        return false;
                    }

                    // Local mock login
                    // Default admin account
                    if (email === 'admin@clefeel.com' && password === 'admin123') {
                        const adminUser: User = {
                            id: 'admin-1',
                            fullName: 'CLEFEEL Admin',
                            email: 'admin@clefeel.com',
                            phone: '',
                            isVerified: true,
                            addresses: [],
                            orders: [],
                            role: 'admin',
                        };
                        set({ user: adminUser, isLoggedIn: true, isLoading: false });
                        return true;
                    }

                    // Regular user mock login
                    const mockUser: User = {
                        id: 'user-1',
                        fullName: email.split('@')[0],
                        email,
                        phone: '',
                        isVerified: true,
                        addresses: [],
                        orders: [],
                        role: 'user',
                    };
                    set({ user: mockUser, isLoggedIn: true, isLoading: false });
                    return true;
                } catch {
                    set({ isLoading: false });
                    return false;
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
                        if (result.success) {
                            set({ isLoading: false });
                            return true;
                        }
                        set({ isLoading: false });
                        return false;
                    }

                    // Local mock register
                    const mockUser: User = {
                        id: Date.now().toString(),
                        fullName: data.fullName,
                        email: data.email,
                        phone: data.phone,
                        isVerified: false,
                        addresses: [],
                        orders: [],
                        role: 'user',
                    };
                    set({ user: mockUser, isLoggedIn: true, isLoading: false });
                    return true;
                } catch {
                    set({ isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({ user: null, tokens: null, isLoggedIn: false });
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
                    return true; // Mock success
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
                    set((state) => ({
                        user: state.user ? { ...state.user, isVerified: true } : null,
                    }));
                    return true;
                } catch {
                    return false;
                }
            },

            updateProfile: (data) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null,
                }));
            },

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
                            addresses: state.user.addresses.filter((a) => a.id !== addressId),
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

            updateOrderStatus: (orderId, status) => {
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            orders: state.user.orders.map((o) =>
                                o.id === orderId ? { ...o, orderStatus: status } : o
                            ),
                        },
                    };
                });
            },

            setUser: (user) => set({ user, isLoggedIn: true }),
        }),
        {
            name: 'clefeel-auth',
        }
    )
);
