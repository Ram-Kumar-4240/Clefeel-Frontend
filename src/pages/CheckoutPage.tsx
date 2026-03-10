import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { createRazorpayOrder, verifyPayment } from '@/data/api';
import { indianStates } from '@/data/states';
import { countries } from '@/data/countries';
import { Truck, Shield, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Address, Order } from '@/types';

// Load Razorpay Script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const { user, isLoggedIn, addOrder, addAddress } = useAuthStore();

  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    customState: '',
    country: 'India',
    customCountry: '',
    pincode: '',
  });

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Require login before checkout
    if (!isLoggedIn) {
      toast.error('Please login to proceed with checkout');
      navigate('/account');
      return;
    }

    window.scrollTo(0, 0);
  }, [items, navigate, isLoggedIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address ||
      !formData.city || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.state === 'Other' && !formData.customState) {
      toast.error('Please specify your state');
      return;
    }
    if (formData.country === 'Other' && !formData.customCountry) {
      toast.error('Please specify your country');
      return;
    }
    setActiveStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const finalAddress: Address = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      phone: '',
      address: formData.address,
      city: formData.city,
      state: formData.state === 'Other' ? formData.customState : formData.state,
      country: formData.country === 'Other' ? formData.customCountry : formData.country,
      pincode: formData.pincode,
    };

    const orderTotal = getTotal();
    const orderItems = items.map(item => ({
      id: `${item.product.id}-${item.selectedSize.id}`,
      product: item.product,
      sizeName: item.selectedSize.sizeName,
      price: item.selectedSize.price,
      quantity: item.quantity
    }));

    // Razorpay Flow (Online Payment Only)
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error('Failed to load Razorpay popup. Check your connection.');
      setIsProcessing(false);
      return;
    }

    try {
      const orderRes = await createRazorpayOrder(orderTotal, 'INR');
      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to create order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'CLEFEEL',
        description: 'Luxury Fragrance Purchase',
        order_id: orderRes.data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success) {
              const newOrder: Order = {
                id: `CLE-${Date.now().toString().slice(-6)}`,
                items: orderItems,
                totalAmount: orderTotal,
                paymentStatus: 'paid',
                orderStatus: 'processing',
                createdAt: new Date().toISOString(),
                address: finalAddress,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              };

              addOrder(newOrder);
              // Save address to user's saved addresses
              addAddress(finalAddress);
              clearCart();
              toast.success('Payment successful!');
              navigate('/order-confirmation', { state: { order: newOrder } });
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Payment verification failed');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
        theme: {
          color: '#D4A24F',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  if (items.length === 0 || !isLoggedIn) return null;

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Header */}
        <h1 className="luxury-heading text-[#F4F1EA] text-3xl lg:text-4xl mb-8">
          SECURE <span className="text-[#D4A24F]">CHECKOUT</span>
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10">
          <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-[#D4A24F]' : 'text-[#F4F1EA]/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${activeStep >= 1 ? 'bg-[#D4A24F] text-[#0B0B0D]' : 'bg-[#F4F1EA]/10 text-[#F4F1EA]/40'
              }`}>
              1
            </div>
            <span className="hidden sm:inline text-sm uppercase tracking-wider">Delivery</span>
          </div>
          <div className="flex-1 h-px bg-[#F4F1EA]/10" />
          <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-[#D4A24F]' : 'text-[#F4F1EA]/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${activeStep >= 2 ? 'bg-[#D4A24F] text-[#0B0B0D]' : 'bg-[#F4F1EA]/10 text-[#F4F1EA]/40'
              }`}>
              2
            </div>
            <span className="hidden sm:inline text-sm uppercase tracking-wider">Payment</span>
          </div>
          <div className="flex-1 h-px bg-[#F4F1EA]/10" />
          <div className="flex items-center gap-2 text-[#F4F1EA]/40">
            <div className="w-8 h-8 rounded-full bg-[#F4F1EA]/10 flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="hidden sm:inline text-sm uppercase tracking-wider">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {activeStep === 1 ? (
              <form onSubmit={handleDeliverySubmit} className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 lg:p-8">
                <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                  DELIVERY <span className="text-[#D4A24F]">ADDRESS</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Address (House, Street, Area) *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                      placeholder="123, Building Name, Street"
                    />
                  </div>

                  <div>
                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors appearance-none"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {formData.country === 'Other' && (
                    <div>
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Specify Country *</label>
                      <input
                        type="text"
                        name="customCountry"
                        value={formData.customCountry}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="Enter Country"
                      />
                    </div>
                  )}

                  <div>
                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">State *</label>
                    {formData.country === 'India' ? (
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors appearance-none"
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="Enter State/Province"
                      />
                    )}
                  </div>

                  {formData.state === 'Other' && formData.country === 'India' && (
                    <div>
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Specify State *</label>
                      <input
                        type="text"
                        name="customState"
                        value={formData.customState}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="Enter State"
                      />
                    </div>
                  )}

                  <div>
                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Pincode/Zipcode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                      placeholder="Zip/Postal Code"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-8">
                  Continue to Payment
                </button>
              </form>
            ) : (
              <form onSubmit={handlePayment} className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 lg:p-8">
                <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                  PAYMENT <span className="text-[#D4A24F]">METHOD</span>
                </h2>

                {/* Only online payment */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 p-5 border border-[#D4A24F] bg-[#D4A24F]/5">
                    <div className="w-5 h-5 rounded-full border-2 border-[#D4A24F] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D4A24F]" />
                    </div>
                    <div className="w-10 h-10 bg-[#F4F1EA]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#D4A24F]" />
                    </div>
                    <div>
                      <p className="text-[#F4F1EA] font-semibold">Online Payment (Razorpay)</p>
                      <p className="text-[#F4F1EA]/40 text-sm">UPI, Credit/Debit Cards, NetBanking, Wallets</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="btn-secondary flex-1"
                    disabled={isProcessing}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 sticky top-24">
              <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                ORDER <span className="text-[#D4A24F]">SUMMARY</span>
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#D4A24F]/20 scrollbar-track-transparent">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize.id}`} className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover bg-[#0B0B0D]"
                    />
                    <div className="flex-1">
                      <p className="text-[#F4F1EA] text-sm font-semibold">{item.product.name}</p>
                      <p className="text-[#F4F1EA]/40 text-xs">Size: {item.selectedSize.sizeName}</p>
                      <p className="text-[#F4F1EA]/40 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#D4A24F] text-sm font-semibold">
                      ₹{(item.selectedSize.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="hairline my-4" />

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F1EA]/60">Subtotal</span>
                  <span className="text-[#F4F1EA]">₹{getSubtotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F1EA]/60">Shipping</span>
                  <span className="text-[#F4F1EA]">
                    {getSubtotal() >= 4999 ? 'Free' : '₹99'}
                  </span>
                </div>

                <div className="hairline my-4" />

                <div className="flex justify-between">
                  <span className="text-[#F4F1EA] font-semibold">Total</span>
                  <span className="text-[#D4A24F] text-xl font-bold">
                    ₹{getTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#F4F1EA]/10">
                <div className="flex items-center gap-2 text-[#F4F1EA]/40 text-xs">
                  <Truck className="w-4 h-4" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-[#F4F1EA]/40 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Secure Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
