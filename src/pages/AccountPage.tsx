import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuthStore } from '@/store/authStore';
import { User, Package, MapPin, LogOut, ChevronRight, X, Mail } from 'lucide-react';
import { toast } from 'sonner';

// Google icon SVG component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function AccountPage() {
  const { user, isLoggedIn, login, register, logout, forgotPassword, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

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
  }, [isLoggedIn]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (isLoginMode) {
      const email = formData.get('email') as string;
      const pwd = formData.get('password') as string;
      const success = await login(email, pwd);
      if (success) toast.success('Welcome back!');
      else toast.error('Login failed. Please check your credentials.');
    } else {
      const success = await register({
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: '',
        password: formData.get('password') as string,
      });
      if (success) toast.success('Account created successfully!');
      else toast.error('Registration failed.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }
    setIsSendingReset(true);
    const success = await forgotPassword(forgotEmail);
    setIsSendingReset(false);
    if (success) {
      toast.success('Password reset link sent to your email!');
      setShowForgotModal(false);
      setForgotEmail('');
    } else {
      toast.error('Failed to send reset link. Try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder: In production, redirect to backend Google OAuth URL
    // e.g., window.location.href = `${API_BASE}/api/auth/google`;
    toast.info('Google sign-in requires backend integration. See INTEGRATION_GUIDE.md');
  };

  if (!isLoggedIn) {
    return (
      <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16 flex items-center justify-center">
        <div ref={contentRef} className="w-full max-w-md px-6" style={{ opacity: 0 }}>
          <h1 className="luxury-heading text-[#F4F1EA] text-3xl text-center mb-2">
            {isLoginMode ? (
              <>WELCOME <span className="text-[#D4A24F]">BACK</span></>
            ) : (
              <>CREATE <span className="text-[#D4A24F]">ACCOUNT</span></>
            )}
          </h1>
          <p className="text-[#F4F1EA]/60 text-center mb-8">
            {isLoginMode
              ? 'Sign in to access your orders and saved addresses'
              : 'Join us to manage your luxury fragrance collection'}
          </p>

          <form onSubmit={handleAuth} className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8">
            <div className="space-y-6">
              {!isLoginMode && (
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
              )}

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
                <div className="flex justify-between">
                  <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Password</label>
                  {isLoginMode && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[#D4A24F] text-xs hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-8 flex justify-center items-center gap-2 disabled:opacity-50">
              {isLoading && <div className="w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />}
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#F4F1EA]/10" />
              <span className="text-[#F4F1EA]/30 text-xs uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#F4F1EA]/10" />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 flex items-center justify-center gap-3 border border-[#F4F1EA]/20 text-[#F4F1EA] hover:border-[#F4F1EA]/40 hover:bg-[#F4F1EA]/5 transition-all duration-300 font-semibold text-sm"
            >
              <GoogleIcon className="w-5 h-5" />
              Sign in with Google
            </button>
          </form>

          <p className="text-[#F4F1EA]/40 text-sm text-center mt-6">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-[#D4A24F] hover:underline"
            >
              {isLoginMode ? 'Create one' : 'Sign in instead'}
            </button>
          </p>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0D]/80 backdrop-blur-sm px-6">
            <div className="w-full max-w-md bg-[#141416] border border-[#F4F1EA]/10 p-8 relative">
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-[#F4F1EA]/40 hover:text-[#F4F1EA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#D4A24F]/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#D4A24F]" />
                </div>
                <div>
                  <h3 className="luxury-heading text-[#F4F1EA] text-lg">RESET PASSWORD</h3>
                  <p className="text-[#F4F1EA]/40 text-sm">We'll send a reset link to your email</p>
                </div>
              </div>

              <form onSubmit={handleForgotPassword}>
                <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors mb-6"
                  placeholder="your@email.com"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSendingReset && <div className="w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />}
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        )}
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
                className={`w-full flex items-center gap-3 p-4 transition-colors ${activeTab === 'orders'
                  ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                  : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA]'
                  }`}
              >
                <Package className="w-5 h-5" />
                <span className="text-sm font-semibold">My Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 p-4 transition-colors ${activeTab === 'addresses'
                  ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                  : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA]'
                  }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-semibold">Saved Addresses</span>
              </button>
            </div>

            {/* User Info Card */}
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 mt-4 relative">
              {user?.role === 'admin' && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#D4A24F] text-[#0B0B0D] text-xs font-bold tracking-wider">
                  ADMIN
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#D4A24F]/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#D4A24F]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[#F4F1EA] font-semibold truncate">{user?.fullName}</p>
                  <p className="text-[#F4F1EA]/40 text-sm truncate">{user?.email}</p>
                </div>
              </div>

              {user?.role === 'admin' && (
                <Link to="/admin" className="mt-4 btn-secondary w-full flex justify-center py-2 text-xs">
                  Go to Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' ? (
              <div>
                <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                  MY <span className="text-[#D4A24F]">ORDERS</span>
                </h2>

                {user?.orders?.length ? (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#F4F1EA]/10">
                          <div>
                            <p className="text-[#F4F1EA] font-semibold">Order #{order.id}</p>
                            <p className="text-[#F4F1EA]/40 text-sm">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 text-xs uppercase font-semibold tracking-wider ${order.orderStatus === 'delivered'
                              ? 'bg-green-500/20 text-green-500'
                              : order.orderStatus === 'shipped' || order.orderStatus === 'out_for_delivery'
                                ? 'bg-blue-500/20 text-blue-500'
                                : 'bg-[#D4A24F]/20 text-[#D4A24F]'
                              }`}>
                              {order.orderStatus.replace(/_/g, ' ')}
                            </span>
                            <p className="text-[#D4A24F] font-semibold">
                              ₹{order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#D4A24F]/20">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex-shrink-0 flex items-center gap-3 bg-[#F4F1EA]/5 p-2 pr-4">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover bg-[#0B0B0D]"
                              />
                              <div>
                                <p className="text-[#F4F1EA] text-sm">{item.product.name}</p>
                                <p className="text-[#F4F1EA]/40 text-xs">{item.sizeName} x{item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Link to="/order-confirmation" state={{ order }} className="mt-2 inline-flex items-center gap-2 text-[#D4A24F] text-sm hover:gap-3 transition-all font-semibold uppercase tracking-wider">
                          <span>Track Order</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
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

                {user?.addresses?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 relative group"
                      >
                        <p className="text-[#F4F1EA] font-semibold mb-2">{address.fullName}</p>
                        <p className="text-[#F4F1EA]/60 text-sm">
                          {address.address}
                        </p>
                        <p className="text-[#F4F1EA]/60 text-sm">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-[#F4F1EA]/60 text-sm">{address.country}</p>
                        {address.email && (
                          <p className="text-[#F4F1EA]/60 text-sm mt-2">{address.email}</p>
                        )}

                        <button className="absolute top-4 right-4 text-[#F4F1EA]/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12 text-center">
                    <MapPin className="w-12 h-12 text-[#F4F1EA]/20 mx-auto mb-4" />
                    <p className="text-[#F4F1EA]/60 mb-4">No saved addresses</p>
                    <p className="text-[#F4F1EA]/40 text-sm">
                      Addresses are saved automatically when you place an order
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
