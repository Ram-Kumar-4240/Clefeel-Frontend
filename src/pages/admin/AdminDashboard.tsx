import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { adminFetchProducts, adminFetchOrders } from '@/data/api';
import { IndianRupee, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import type { Order } from '@/types';

export default function AdminDashboard() {
    const { tokens } = useAuthStore();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            setIsLoading(true);
            const [productsData, ordersData] = await Promise.all([
                adminFetchProducts(tokens?.accessToken || ''),
                adminFetchOrders(tokens?.accessToken || '')
            ]);

            const revenue = ordersData.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);
            const pending = ordersData.filter((o: Order) => o.orderStatus === 'pending').length;

            setStats({
                totalRevenue: revenue,
                totalOrders: ordersData.length,
                totalProducts: productsData.length,
                pendingOrders: pending,
            });

            setRecentOrders(ordersData.slice(0, 5));
            setIsLoading(false);
        };

        loadDashboard();
    }, [tokens]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#D4A24F] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="luxury-heading text-[#F4F1EA] text-3xl mb-8">
                DASHBOARD <span className="text-[#D4A24F]">OVERVIEW</span>
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#D4A24F]/10 flex items-center justify-center">
                            <IndianRupee className="w-6 h-6 text-[#D4A24F]" />
                        </div>
                    </div>
                    <p className="text-[#F4F1EA]/60 text-sm mb-1">Total Revenue</p>
                    <p className="text-[#F4F1EA] text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#F4F1EA]/5 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-[#F4F1EA]" />
                        </div>
                    </div>
                    <p className="text-[#F4F1EA]/60 text-sm mb-1">Total Orders</p>
                    <p className="text-[#F4F1EA] text-2xl font-bold">{stats.totalOrders}</p>
                </div>

                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#F4F1EA]/5 flex items-center justify-center">
                            <Package className="w-6 h-6 text-[#F4F1EA]" />
                        </div>
                    </div>
                    <p className="text-[#F4F1EA]/60 text-sm mb-1">Total Products</p>
                    <p className="text-[#F4F1EA] text-2xl font-bold">{stats.totalProducts}</p>
                </div>

                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-orange-500/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                    <p className="text-[#F4F1EA]/60 text-sm mb-1">Pending Orders</p>
                    <p className="text-[#F4F1EA] text-2xl font-bold">{stats.pendingOrders}</p>
                </div>
            </div>

            {/* Recent Orders Table */}
            <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">Recent Orders</h2>
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#F4F1EA]/10 bg-[#0B0B0D]/50 text-[#F4F1EA]/60 text-sm">
                            <th className="p-4 font-normal">Order ID</th>
                            <th className="p-4 font-normal">Customer</th>
                            <th className="p-4 font-normal">Date</th>
                            <th className="p-4 font-normal">Amount</th>
                            <th className="p-4 font-normal">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-[#F4F1EA]/40">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-[#F4F1EA]/5 hover:bg-[#F4F1EA]/[0.02]">
                                    <td className="p-4 text-[#F4F1EA] font-semibold">{order.id}</td>
                                    <td className="p-4">
                                        <p className="text-[#F4F1EA] text-sm">{order.address.fullName}</p>
                                        <p className="text-[#F4F1EA]/40 text-xs">{order.address.email}</p>
                                    </td>
                                    <td className="p-4 text-[#F4F1EA]/60 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="p-4 text-[#D4A24F] font-semibold">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs uppercase font-semibold tracking-wider ${order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-500'
                                            : order.orderStatus === 'pending' ? 'bg-orange-500/20 text-orange-500'
                                                : 'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {order.orderStatus.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
