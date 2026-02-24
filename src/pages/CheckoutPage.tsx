import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/cartStore';
import { CreditCard, Wallet, Banknote, Truck, Shield, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Address } from '@/types';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Wallet, description: 'Pay using UPI apps' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
];

const states = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 
  'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Uttar Pradesh',
  'West Bengal', 'Kerala', 'Madhya Pradesh', 'Bihar', 'Odisha'
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, discount, clearCart } = useCartStore();
  const { user, addOrder } = useUserStore();
  
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  const pageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    window.scrollTo(0, 0);
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeStep === 1) {
      // Validate address
      if (!formData.fullName || !formData.mobile || !formData.house || !formData.street || 
          !formData.city || !formData.state || !formData.pincode) {
        toast.error('Please fill in all required fields');
        return;
      }
      setActiveStep(2);
      return;
    }

    // Place order
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const address: Address = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      house: formData.house,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };

    const order = {
      id: `CLE-${Date.now().toString().slice(-6)}`,
      items: [...items],
      total: getTotal() + (getSubtotal() >= 4999 ? 0 : 99),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      address,
    };

    addOrder(order);
    clearCart();
    
    navigate('/order-confirmation', { state: { order } });
  };

  if (items.length === 0) return null;

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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              activeStep >= 1 ? 'bg-[#D4A24F] text-[#0B0B0D]' : 'bg-[#F4F1EA]/10 text-[#F4F1EA]/40'
            }`}>
              1
            </div>
            <span className="hidden sm:inline text-sm uppercase tracking-wider">Delivery</span>
          </div>
          <div className="flex-1 h-px bg-[#F4F1EA]/10" />
          <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-[#D4A24F]' : 'text-[#F4F1EA]/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              activeStep >= 2 ? 'bg-[#D4A24F] text-[#0B0B0D]' : 'bg-[#F4F1EA]/10 text-[#F4F1EA]/40'
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
            <form ref={formRef} onSubmit={handleSubmit}>
              {activeStep === 1 ? (
                /* Delivery Address Form */
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 lg:p-8">
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

                    <div>
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">House/Flat No. *</label>
                      <input
                        type="text"
                        name="house"
                        value={formData.house}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="123, Building Name"
                      />
                    </div>

                    <div>
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Street *</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="Street name, Area"
                      />
                    </div>

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
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors appearance-none"
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full mt-8">
                    Continue to Payment
                  </button>
                </div>
              ) : (
                /* Payment Method Selection */
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 lg:p-8">
                  <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                    PAYMENT <span className="text-[#D4A24F]">METHOD</span>
                  </h2>

                  <div className="space-y-4 mb-8">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                            paymentMethod === method.id
                              ? 'border-[#D4A24F] bg-[#D4A24F]/5'
                              : 'border-[#F4F1EA]/10 hover:border-[#F4F1EA]/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id ? 'border-[#D4A24F]' : 'border-[#F4F1EA]/30'
                          }`}>
                            {paymentMethod === method.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#D4A24F]" />
                            )}
                          </div>
                          <div className="w-10 h-10 bg-[#F4F1EA]/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#D4A24F]" />
                          </div>
                          <div>
                            <p className="text-[#F4F1EA] font-semibold">{method.name}</p>
                            <p className="text-[#F4F1EA]/40 text-sm">{method.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="btn-secondary flex-1"
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
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 sticky top-24">
              <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                ORDER <span className="text-[#D4A24F]">SUMMARY</span>
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-[#F4F1EA] text-sm font-semibold">{item.product.name}</p>
                      <p className="text-[#F4F1EA]/40 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#D4A24F] text-sm">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
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
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F4F1EA]/60">Discount</span>
                    <span className="text-[#D4A24F]">
                      -₹{Math.round(getSubtotal() * discount).toLocaleString()}
                    </span>
                  </div>
                )}
                
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
                    ₹{(getTotal() + (getSubtotal() >= 4999 ? 0 : 99)).toLocaleString()}
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
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
