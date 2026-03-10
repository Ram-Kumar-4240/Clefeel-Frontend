import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { adminFetchOrders } from '@/data/api';
import { Search, Filter, Eye } from 'lucide-react';
import type { Order } from '@/types';

export default function AdminOrders() {
    const navigate = useNavigate();
    const { tokens } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            const data = await adminFetchOrders(tokens?.accessToken || '');
            setOrders(data);
            setIsLoading(false);
        };
        loadOrders();
    }, [tokens]);

    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.address.fullName.toLowerCase().includes(search.toLowerCase()) ||
            o.address.email.toLowerCase().includes(search.toLowerCase());

        const matchesFilter = statusFilter === 'all' || o.orderStatus === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="luxury-heading text-[#F4F1EA] text-3xl">
                    MANAGE <span className="text-[#D4A24F]">ORDERS</span>
                </h1>
            </div>

            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F1EA]/40" />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Name, or Email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors text-sm rounded-none"
                        />
                    </div>
                    <div className="w-full md:w-64 relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F1EA]/40" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors text-sm appearance-none rounded-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#D4A24F] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-[#F4F1EA]/10 bg-[#0B0B0D]/50 text-[#F4F1EA]/60 text-sm">
                                <th className="p-4 font-normal">Order ID</th>
                                <th className="p-4 font-normal">Date</th>
                                <th className="p-4 font-normal">Customer Info</th>
                                <th className="p-4 font-normal">Total</th>
                                <th className="p-4 font-normal">Payment</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[#F4F1EA]/40">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-[#F4F1EA]/5 hover:bg-[#F4F1EA]/[0.02]">
                                        <td className="p-4 text-[#F4F1EA] font-semibold">{order.id}</td>
                                        <td className="p-4 text-[#F4F1EA]/60 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-[#F4F1EA] text-sm font-semibold">{order.address.fullName}</p>
                                            <p className="text-[#F4F1EA]/60 text-xs">{order.address.email}</p>
                                            <p className="text-[#F4F1EA]/40 text-xs">{order.address.city}, {order.address.state}</p>
                                        </td>
                                        <td className="p-4 text-[#D4A24F] font-semibold">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs uppercase font-semibold tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs uppercase font-semibold tracking-wider ${order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-500'
                                                : order.orderStatus === 'pending' ? 'bg-orange-500/20 text-orange-500'
                                                    : 'bg-blue-500/20 text-blue-500'
                                                }`}>
                                                {order.orderStatus.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                className="p-2 text-[#F4F1EA]/40 hover:text-[#D4A24F] transition-colors inline-block"
                                                aria-label="View Order"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
