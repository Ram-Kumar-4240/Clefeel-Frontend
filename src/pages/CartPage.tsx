import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCartStore } from '@/store/cartStore';
import { Plus, Minus, X, Tag, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getSubtotal, getTotal, couponCode, discount, applyCoupon, removeCoupon } = useCartStore();
  
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

  const handleApplyCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('coupon') as HTMLInputElement;
    const code = input.value.trim().toUpperCase();
    
    if (code) {
      applyCoupon(code);
      if (['CLEFEEL10', 'CLEFEEL20', 'WELCOME'].includes(code)) {
        toast.success(`Coupon ${code} applied!`);
      } else {
        toast.error('Invalid coupon code');
      }
      input.value = '';
    }
  };

  if (items.length === 0) {
    return (
      <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-[#F4F1EA]/20 mx-auto mb-6" />
          <h1 className="luxury-heading text-[#F4F1EA] text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-[#F4F1EA]/60 mb-8">Discover our premium fragrances and add your favorites.</p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div ref={contentRef} className="w-full px-6 lg:px-[6vw]" style={{ opacity: 0 }}>
        {/* Header */}
        <h1 className="luxury-heading text-[#F4F1EA] text-3xl lg:text-4xl mb-8">
          YOUR <span className="text-[#D4A24F]">CART</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row gap-6 p-6 bg-[#F4F1EA]/5 border border-[#F4F1EA]/10"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-full sm:w-32 h-32 flex-shrink-0 bg-[#0B0B0D] overflow-hidden"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="text-[#F4F1EA] font-semibold hover:text-[#D4A24F] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#F4F1EA]/40 hover:text-[#F4F1EA] transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-[#F4F1EA]/40 text-sm mb-4">{item.product.size}</p>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-[#F4F1EA]/20">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-[#F4F1EA]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-[#D4A24F] font-semibold">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[#F4F1EA]/60 hover:text-[#D4A24F] transition-colors mt-8"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span className="text-sm uppercase tracking-wider">Continue Shopping</span>
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 sticky top-24">
              <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                CART <span className="text-[#D4A24F]">SUMMARY</span>
              </h2>

              {/* Coupon */}
              {!couponCode ? (
                <form onSubmit={handleApplyCoupon} className="mb-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F1EA]/40" />
                      <input
                        type="text"
                        name="coupon"
                        placeholder="Enter coupon code"
                        className="w-full pl-10 pr-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] text-sm placeholder:text-[#F4F1EA]/30 focus:outline-none focus:border-[#D4A24F] uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-3 bg-[#D4A24F] text-[#0B0B0D] text-sm font-semibold uppercase tracking-wider hover:bg-[#F4F1EA] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-[#F4F1EA]/40 text-xs mt-2">
                    Try: CLEFEEL10, CLEFEEL20, WELCOME
                  </p>
                </form>
              ) : (
                <div className="flex items-center justify-between mb-6 p-3 bg-[#D4A24F]/10 border border-[#D4A24F]/30">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#D4A24F]" />
                    <span className="text-[#D4A24F] text-sm font-semibold">{couponCode}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#F4F1EA]/40 hover:text-[#F4F1EA] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Summary Lines */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F1EA]/60">Subtotal</span>
                  <span className="text-[#F4F1EA]">₹{getSubtotal().toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F4F1EA]/60">Discount ({Math.round(discount * 100)}%)</span>
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

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-2 mt-6 text-[#F4F1EA]/40 text-xs">
                <Truck className="w-4 h-4" />
                <span>Free shipping over ₹4,999</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
