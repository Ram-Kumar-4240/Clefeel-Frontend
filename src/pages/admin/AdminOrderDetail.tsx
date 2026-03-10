import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { adminFetchOrders, adminUpdateOrderStatus } from '@/data/api';
import { ArrowLeft, Save, MapPin, Package, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '@/types';

export default function AdminOrderDetail() {
    const { id } = useParams();
    const { tokens } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<Order['orderStatus']>('pending');

    useEffect(() => {
        const loadOrder = async () => {
            setIsLoading(true);
            const orders = await adminFetchOrders(tokens?.accessToken || '');
            const found = orders.find((o: Order) => o.id === id);
            if (found) {
                setOrder(found);
                setStatus(found.orderStatus);
            } else {
                toast.error('Order not found');
            }
            setIsLoading(false);
        };
        loadOrder();
    }, [id, tokens]);

    const handleUpdateStatus = async () => {
        if (!order) return;
        setIsSaving(true);
        try {
            const res = await adminUpdateOrderStatus(order.id, status, tokens?.accessToken || '');
            if (res.success) {
                toast.success(`Order status updated to ${status.replace(/_/g, ' ')}`);
                setOrder({ ...order, orderStatus: status });
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to update order status');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#D4A24F] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div>
                <Link to="/admin/orders" className="text-[#D4A24F] hover:underline">&larr; Back to Orders</Link>
                <h1 className="text-[#F4F1EA] text-2xl mt-4">Order Not Found</h1>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/orders" className="p-2 text-[#F4F1EA]/60 hover:text-[#D4A24F] transition-colors -ml-2">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="luxury-heading text-[#F4F1EA] text-3xl">
                    ORDER <span className="text-[#D4A24F]">#{order.id}</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Details) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Order Items */}
                    <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#D4A24F]" /> Items Ordered
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-[#F4F1EA]/10 pb-4 last:border-0 last:pb-0">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover bg-[#0B0B0D]"
                                    />
                                    <div className="flex-1">
                                        <p className="text-[#F4F1EA] font-semibold">{item.product.name}</p>
                                        <p className="text-[#F4F1EA]/60 text-sm mb-2">Size: {item.sizeName}</p>
                                        <p className="text-[#F4F1EA]/40 text-xs">Quantity: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#D4A24F] font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="hairline my-6" />
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-[#F4F1EA] uppercase tracking-wider font-semibold">Total</span>
                            <span className="text-[#D4A24F] font-bold text-2xl">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Customer & Address */}
                    <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#D4A24F]" /> Shipping Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <p className="text-[#F4F1EA]/40 mb-1 uppercase tracking-wider text-xs font-semibold">Customer</p>
                                <p className="text-[#F4F1EA]">{order.address.fullName}</p>
                                <p className="text-[#F4F1EA]/60">{order.address.email}</p>
                                <p className="text-[#F4F1EA]/60">{order.address.phone}</p>
                            </div>
                            <div>
                                <p className="text-[#F4F1EA]/40 mb-1 uppercase tracking-wider text-xs font-semibold">Delivery Address</p>
                                <p className="text-[#F4F1EA]">{order.address.address}</p>
                                <p className="text-[#F4F1EA]">{order.address.city}, {order.address.state}</p>
                                <p className="text-[#F4F1EA]">{order.address.country} - {order.address.pincode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Status & Payment) */}
                <div className="space-y-8">

                    {/* Status Update Card */}
                    <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#D4A24F]" /> Order Status
                        </h2>

                        <p className="text-[#F4F1EA]/60 text-sm mb-4">
                            Placed on: {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>

                        <div className="mb-6">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Current Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Order['orderStatus'])}
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors appearance-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>

                        <button
                            onClick={handleUpdateStatus}
                            disabled={isSaving || status === order.orderStatus}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <><Save className="w-4 h-4" /> Update Status</>
                            )}
                        </button>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#D4A24F]" /> Payment Details
                        </h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-[#F4F1EA]/10 pb-2">
                                <span className="text-[#F4F1EA]/60">Status</span>
                                <span className={`uppercase font-semibold tracking-wider ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-[#F4F1EA]/10 pb-2">
                                <span className="text-[#F4F1EA]/60">Method</span>
                                <span className="text-[#F4F1EA] uppercase tracking-wider font-semibold">
                                    {order.razorpayPaymentId ? 'Razorpay' : 'COD'}
                                </span>
                            </div>
                            {order.razorpayOrderId && (
                                <div className="border-b border-[#F4F1EA]/10 pb-2">
                                    <span className="text-[#F4F1EA]/60 block mb-1">Razorpay Order ID</span>
                                    <span className="text-[#F4F1EA] font-mono text-xs">{order.razorpayOrderId}</span>
                                </div>
                            )}
                            {order.razorpayPaymentId && (
                                <div>
                                    <span className="text-[#F4F1EA]/60 block mb-1">Payment ID</span>
                                    <span className="text-[#F4F1EA] font-mono text-xs">{order.razorpayPaymentId}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
