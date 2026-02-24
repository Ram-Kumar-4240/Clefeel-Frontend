import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useUserStore } from '@/store/cartStore';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { User as UserType } from '@/types';

export default function AccountPage() {
  const { user, isLoggedIn, login, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [showLogin, setShowLogin] = useState(!isLoggedIn);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const mockUser: UserType = {
      id: 'user-1',
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      mobile: formData.get('mobile') as string,
      addresses: [],
      orders: [],
    };
    
    login(mockUser);
    setShowLogin(false);
    toast.success('Welcome back!');
  };

  if (showLogin) {
    return (
      <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <h1 className="luxury-heading text-[#F4F1EA] text-3xl text-center mb-2">
            WELCOME <span className="text-[#D4A24F]">BACK</span>
          </h1>
          <p className="text-[#F4F1EA]/60 text-center mb-8">
            Sign in to access your orders and saved addresses
          </p>

          <form onSubmit={handleLogin} className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8">
            <div className="space-y-6">
              <div>
                <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-8">
              Sign In
            </button>
          </form>

          <p className="text-[#F4F1EA]/40 text-sm text-center mt-6">
            Don&apos;t have an account?{' '}
            <button className="text-[#D4A24F] hover:underline">Create one</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div ref={contentRef} className="w-full px-6 lg:px-[6vw]" style={{ opacity: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="luxury-heading text-[#F4F1EA] text-3xl lg:text-4xl mb-2">
              MY <span className="text-[#D4A24F]">ACCOUNT</span>
            </h1>
            <p className="text-[#F4F1EA]/60">
              Welcome back, {user?.fullName}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              setShowLogin(true);
              toast.success('Logged out successfully');
            }}
            className="flex items-center gap-2 text-[#F4F1EA]/60 hover:text-[#D4A24F] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wider">Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 p-4 transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                    : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA]'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="text-sm font-semibold">My Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 p-4 transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                    : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA]'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-semibold">Saved Addresses</span>
              </button>
            </div>

            {/* User Info Card */}
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 mt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#D4A24F]/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4A24F]" />
                </div>
                <div>
                  <p className="text-[#F4F1EA] font-semibold">{user?.fullName}</p>
                  <p className="text-[#F4F1EA]/40 text-sm">{user?.email}</p>
                </div>
              </div>
              <p className="text-[#F4F1EA]/60 text-sm">{user?.mobile}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' ? (
              <div>
                <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                  MY <span className="text-[#D4A24F]">ORDERS</span>
                </h2>

                {user?.orders && user.orders.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-[#F4F1EA] font-semibold">Order #{order.id}</p>
                            <p className="text-[#F4F1EA]/40 text-sm">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 text-xs uppercase font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-green-500/20 text-green-500'
                                : order.status === 'shipped'
                                ? 'bg-blue-500/20 text-blue-500'
                                : 'bg-[#D4A24F]/20 text-[#D4A24F]'
                            }`}>
                              {order.status}
                            </span>
                            <p className="text-[#D4A24F] font-semibold">
                              ₹{order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex-shrink-0">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        <button className="flex items-center gap-2 text-[#D4A24F] text-sm hover:gap-3 transition-all">
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12 text-center">
                    <Package className="w-12 h-12 text-[#F4F1EA]/20 mx-auto mb-4" />
                    <p className="text-[#F4F1EA]/60 mb-4">No orders yet</p>
                    <Link to="/shop" className="btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                  SAVED <span className="text-[#D4A24F]">ADDRESSES</span>
                </h2>

                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6"
                      >
                        <p className="text-[#F4F1EA] font-semibold mb-2">{address.fullName}</p>
                        <p className="text-[#F4F1EA]/60 text-sm">
                          {address.house}, {address.street}
                        </p>
                        <p className="text-[#F4F1EA]/60 text-sm">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-[#F4F1EA]/60 text-sm">{address.mobile}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12 text-center">
                    <MapPin className="w-12 h-12 text-[#F4F1EA]/20 mx-auto mb-4" />
                    <p className="text-[#F4F1EA]/60 mb-4">No saved addresses</p>
                    <p className="text-[#F4F1EA]/40 text-sm">
                      Addresses will be saved automatically when you place an order
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
