import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Check, Package, Truck, Mail, ShoppingBag } from 'lucide-react';
import type { Order } from '@/types';

const ORDER_STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: Package },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Check },
];

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [order, navigate]);

  if (!order) return null;

  const currentStatusIndex = ORDER_STATUS_STEPS.findIndex(s => s.id === order.orderStatus) >= 0
    ? ORDER_STATUS_STEPS.findIndex(s => s.id === order.orderStatus)
    : 0;

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16 flex items-center justify-center">
      <div ref={contentRef} className="w-full max-w-2xl px-6" style={{ opacity: 0 }}>
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-[#D4A24F] rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-[#0B0B0D]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="luxury-heading text-[#F4F1EA] text-3xl lg:text-4xl text-center mb-4">
          ORDER <span className="text-[#D4A24F]">CONFIRMED</span>
        </h1>

        <p className="text-[#F4F1EA]/60 text-center mb-10">
          Thank you for your purchase. We've sent a confirmation email to {order.address.email}.
        </p>

        {/* Tracking Info (5-Step) */}
        <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 lg:p-8 mb-8 overflow-x-auto">
          <p className="luxury-label text-[#F4F1EA]/40 mb-6 text-center">Order Status</p>
          <div className="flex items-center justify-between min-w-[500px]">
            {ORDER_STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStatusIndex;
              const isActive = index === currentStatusIndex;

              return (
                <div key={step.id} className="flex flex-col items-center relative flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 z-10 transition-colors ${isActive ? 'bg-[#D4A24F] text-[#0B0B0D]' :
                      isCompleted ? 'bg-[#D4A24F]/20 text-[#D4A24F]' : 'bg-[#F4F1EA]/5 text-[#F4F1EA]/20'
                    }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-semibold text-center ${isCompleted ? 'text-[#F4F1EA]' : 'text-[#F4F1EA]/40'
                    }`}>
                    {step.label}
                  </span>

                  {/* Progress Line */}
                  {index < ORDER_STATUS_STEPS.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-px ${index < currentStatusIndex ? 'bg-[#D4A24F]/50' : 'bg-[#F4F1EA]/10'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 lg:p-8 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="luxury-label text-[#F4F1EA]/40 mb-1">Order ID</p>
              <p className="text-[#F4F1EA] font-semibold">#{order.id}</p>
            </div>
            <div>
              <p className="luxury-label text-[#F4F1EA]/40 mb-1">Order Date</p>
              <p className="text-[#F4F1EA] font-semibold">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
            {order.estimatedDelivery && (
              <div>
                <p className="luxury-label text-[#F4F1EA]/40 mb-1">Estimated Delivery</p>
                <p className="text-[#D4A24F] font-semibold">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            )}
            <div>
              <p className="luxury-label text-[#F4F1EA]/40 mb-1">Total Amount</p>
              <p className="text-[#D4A24F] font-semibold">₹{order.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="luxury-label text-[#F4F1EA]/40 mb-1">Payment Status</p>
              <p className={`font-semibold uppercase text-sm ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-[#D4A24F]'
                }`}>
                {order.paymentStatus}
              </p>
            </div>
          </div>

          <div className="hairline my-6" />

          {/* Delivery Address */}
          <div>
            <p className="luxury-label text-[#F4F1EA]/40 mb-2">Delivery Address</p>
            <p className="text-[#F4F1EA]">{order.address.fullName}</p>
            <p className="text-[#F4F1EA]/60 text-sm">{order.address.address}</p>
            <p className="text-[#F4F1EA]/60 text-sm">
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p className="text-[#F4F1EA]/60 text-sm">{order.address.country}</p>
            <p className="text-[#F4F1EA]/60 text-sm mt-1">{order.address.phone}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 lg:p-8 mb-8">
          <p className="luxury-label text-[#F4F1EA]/40 mb-4">Order Items ({order.items.length})</p>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover bg-[#0B0B0D]"
                />
                <div className="flex-1">
                  <p className="text-[#F4F1EA] font-semibold">{item.product.name}</p>
                  <p className="text-[#F4F1EA]/40 text-sm">Size: {item.sizeName} | Qty: {item.quantity}</p>
                </div>
                <p className="text-[#D4A24F] font-semibold">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/shop" className="btn-primary flex-1 flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          <Link to="/account" className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
