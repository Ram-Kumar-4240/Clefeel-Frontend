import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { fetchProductById, fetchSimilarProducts } from '@/data/api';
import { ArrowRight, CreditCard, Heart, Droplets, Clock, Wind, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, ProductSize } from '@/types';

gsap.registerPlugin(ScrollTrigger);

function getDiscount(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();

  const pageRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      if (id) {
        const data = await fetchProductById(id);
        if (data) {
          setProduct(data);
          const validSize = data.sizes.find(s => s.stock > 0) || data.sizes[0];
          setSelectedSize(validSize);
          setActiveImageIndex(0);
          const similar = await fetchSimilarProducts(data.id, data.basePrice);
          setSimilarProducts(similar);
        }
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [id]);

  // Track which image is in viewport
  useEffect(() => {
    if (isLoading || !product || product.images.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(idx)) setActiveImageIndex(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    const images = document.querySelectorAll('.pdp-scroll-image');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [isLoading, product]);

  // Animate below-fold sections
  useEffect(() => {
    if (isLoading || !product) return;

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      if (ingredientsRef.current) {
        gsap.fromTo(
          ingredientsRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ingredientsRef.current, start: 'top 80%' } }
        );
      }
      if (similarRef.current) {
        gsap.fromTo(
          similarRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: similarRef.current, start: 'top 80%' } }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [isLoading, product, id]);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedSize) return;
    if (selectedSize.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    for (let i = 0; i < quantity; i++) addToCart(product, selectedSize);
    toast.success('Added to cart');
    setQuantity(1);
  }, [product, selectedSize, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product || !selectedSize || selectedSize.stock === 0) return;
    for (let i = 0; i < quantity; i++) addToCart(product, selectedSize);
    navigate('/checkout');
  }, [product, selectedSize, quantity, addToCart, navigate]);

  const isLiked = product ? wishlistItems.some((item) => item.id === product.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] pt-24 pb-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A24F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="luxury-heading text-[#F4F1EA] text-3xl mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const currentPrice = selectedSize?.price || product.basePrice;
  const currentMrp = selectedSize?.mrp || product.baseMrp;
  const discount = getDiscount(currentMrp, currentPrice);
  const hasMultipleImages = product.images.length > 1;
  const isDisabled = !selectedSize || selectedSize.stock === 0;

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#F4F1EA]/40 text-sm mb-8">
          <Link to="/" className="hover:text-[#D4A24F] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#D4A24F] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#F4F1EA]">{product.name}</span>
        </div>

        {/* Product Section — CSS sticky layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24">
          {/* LEFT: Images scroll naturally */}
          <div className="flex flex-col gap-4">
            {product.images.map((img, idx) => (
              <div
                key={img.id}
                data-index={idx}
                className="pdp-scroll-image relative w-full bg-[#0B0B0D] aspect-[4/5]"
              >
                <img
                  src={img.imageUrl}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
                {idx === 0 && product.new && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#D4A24F] text-[#0B0B0D] text-xs font-semibold uppercase tracking-wider z-10">
                    New Arrival
                  </div>
                )}
                {/* Image counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#0B0B0D]/60 backdrop-blur-sm text-[#F4F1EA]/50 text-xs font-semibold z-10">
                    {idx + 1} / {product.images.length}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT: Details panel — sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#D4A24F] text-sm font-semibold uppercase tracking-wider">
                {product.category}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 transition-colors ${isLiked ? 'text-red-500' : 'text-[#F4F1EA]/40 hover:text-[#D4A24F]'}`}
                aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            <h1 className="luxury-heading text-[#F4F1EA] text-3xl lg:text-4xl mb-4">
              {product.name}
            </h1>

            <p className="text-[#F4F1EA]/60 text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price with MRP & Discount */}
            <div className="flex items-end gap-3 mb-1">
              <span className="text-[#D4A24F] text-2xl lg:text-3xl font-bold">
                ₹{currentPrice.toLocaleString()}
              </span>
              {currentMrp > currentPrice && (
                <>
                  <span className="text-[#F4F1EA]/30 text-base line-through mb-0.5">
                    ₹{currentMrp.toLocaleString()}
                  </span>
                  <span className="text-[#D4A24F]/80 text-sm font-semibold mb-0.5">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <span className="text-[#F4F1EA]/40 text-xs mb-6 block">Inclusive of all taxes</span>

            <div className="h-px bg-[#F4F1EA]/10 mb-6" />

            {/* Dot indicators for multi-image */}
            {hasMultipleImages && (
              <div className="flex items-center gap-2 mb-6">
                {product.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-300 ${
                      activeImageIndex === idx
                        ? 'bg-[#D4A24F] w-5 h-2'
                        : 'bg-[#F4F1EA]/20 w-2 h-2'
                    }`}
                  />
                ))}
                <span className="text-[#F4F1EA]/30 text-[10px] ml-1">
                  {activeImageIndex + 1}/{product.images.length}
                </span>
              </div>
            )}

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[#F4F1EA]/80 text-xs font-semibold uppercase tracking-wider">Select Size</span>
                {selectedSize?.stock && selectedSize.stock < 10 ? (
                  <span className="text-[#D4A24F] text-xs">Only {selectedSize.stock} left</span>
                ) : null}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => {
                  const outOfStock = size.stock <= 0;
                  const sizeDiscount = getDiscount(size.mrp, size.price);
                  return (
                    <button
                      key={size.id}
                      disabled={outOfStock}
                      onClick={() => { setSelectedSize(size); setQuantity(1); }}
                      className={`relative py-2.5 px-2 border transition-all text-center ${selectedSize?.id === size.id
                        ? 'border-[#D4A24F] bg-[#D4A24F]/10 text-[#D4A24F]'
                        : outOfStock
                          ? 'border-[#F4F1EA]/5 text-[#F4F1EA]/20 cursor-not-allowed bg-[#F4F1EA]/5'
                          : 'border-[#F4F1EA]/20 text-[#F4F1EA]/60 hover:border-[#F4F1EA]/40'
                        }`}
                    >
                      <span className="font-semibold text-sm block">{size.sizeName}</span>
                      <span className="text-[10px] block mt-0.5">₹{size.price.toLocaleString()}</span>
                      {sizeDiscount > 0 && !outOfStock && (
                        <span className="absolute -top-2 -right-2 bg-[#D4A24F] text-[#0B0B0D] text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          -{sizeDiscount}%
                        </span>
                      )}
                      {outOfStock && (
                        <div className="absolute top-1/2 left-0 w-full h-px bg-[#F4F1EA]/20 -rotate-12" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <span className="text-[#F4F1EA]/80 text-xs font-semibold uppercase tracking-wider block mb-3">Quantity</span>
              <div className="flex items-center border border-[#F4F1EA]/20 w-28">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 py-3 flex justify-center text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-[#F4F1EA] font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => { if (selectedSize && quantity < selectedSize.stock) setQuantity(quantity + 1); }}
                  className="flex-1 py-3 flex justify-center text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                  aria-label="Increase quantity"
                  disabled={selectedSize ? quantity >= selectedSize.stock : true}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons — side by side */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isDisabled}
                className="flex-1 py-3.5 flex items-center justify-center gap-2 border border-[#D4A24F] text-[#D4A24F] font-semibold uppercase tracking-wider text-xs hover:bg-[#D4A24F]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {isDisabled ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isDisabled}
                className="flex-1 py-3.5 flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #D4A24F 0%, #E8C76B 50%, #D4A24F 100%)',
                  color: '#0B0B0D',
                }}
              >
                <CreditCard className="w-4 h-4" />
                Buy Now
              </button>
            </div>

            {/* Secure checkout */}
            <div className="bg-[#F4F1EA]/5 px-4 py-3 flex items-center justify-center text-[#F4F1EA]/30 text-xs">
              Secure checkout via Razorpay
            </div>
          </div>
        </div>

        {/* Olfactory Profile */}
        <div ref={ingredientsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 hover:border-[#D4A24F]/30 transition-colors">
            <Droplets className="w-7 h-7 text-[#D4A24F] mb-5" />
            <h3 className="text-[#F4F1EA] font-semibold text-lg mb-3">Top Notes</h3>
            <p className="text-[#F4F1EA]/60 leading-relaxed">{product.topNotes.join(', ')}</p>
          </div>
          <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 hover:border-[#D4A24F]/30 transition-colors">
            <Wind className="w-7 h-7 text-[#D4A24F] mb-5" />
            <h3 className="text-[#F4F1EA] font-semibold text-lg mb-3">Heart Notes</h3>
            <p className="text-[#F4F1EA]/60 leading-relaxed">{product.middleNotes.join(', ')}</p>
          </div>
          <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 hover:border-[#D4A24F]/30 transition-colors">
            <Clock className="w-7 h-7 text-[#D4A24F] mb-5" />
            <h3 className="text-[#F4F1EA] font-semibold text-lg mb-3">Base Notes</h3>
            <p className="text-[#F4F1EA]/60 leading-relaxed">{product.baseNotes.join(', ')}</p>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div ref={similarRef} className="mb-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="luxury-heading text-[#F4F1EA] text-2xl lg:text-3xl">
                YOU MAY ALSO <span className="text-[#D4A24F]">LIKE</span>
              </h2>
              <Link to="/shop" className="hidden md:flex items-center gap-2 text-[#D4A24F] hover:gap-4 transition-all uppercase tracking-wider text-sm font-semibold">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {similarProducts.map((p) => {
                const pDiscount = getDiscount(p.baseMrp, p.basePrice);
                return (
                  <Link key={p.id} to={`/product/${p.id}`} className="group block">
                    <div className="relative aspect-[4/5] bg-[#0B0B0D] overflow-hidden mb-3">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-[#0B0B0D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {pDiscount > 0 && (
                        <div className="absolute top-3 left-3 bg-[#D4A24F] text-[#0B0B0D] text-[10px] font-bold px-2 py-0.5">
                          {pDiscount}% OFF
                        </div>
                      )}
                    </div>
                    <h3 className="text-[#F4F1EA] font-semibold text-sm mb-1">{p.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#D4A24F] font-medium text-sm">₹{p.basePrice.toLocaleString()}</span>
                      {p.baseMrp > p.basePrice && (
                        <span className="text-[#F4F1EA]/30 text-xs line-through">₹{p.baseMrp.toLocaleString()}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 flex justify-center md:hidden">
              <Link to="/shop" className="btn-secondary w-full flex justify-center">View Full Collection</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
