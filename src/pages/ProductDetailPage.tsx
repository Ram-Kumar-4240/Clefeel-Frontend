import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { fetchProductById, fetchSimilarProducts } from '@/data/api';
import { ArrowRight, ShoppingBag, Heart, Droplets, Clock, Wind, Plus, Minus, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, ProductSize } from '@/types';

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
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      if (id) {
        const data = await fetchProductById(id);
        if (data) {
          setProduct(data);
          // Set initial size (find first with stock, or just first)
          const validSize = data.sizes.find(s => s.stock > 0) || data.sizes[0];
          setSelectedSize(validSize);

          // Fetch similar products based on price
          const similar = await fetchSimilarProducts(data.id, data.basePrice);
          setSimilarProducts(similar);
        }
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (isLoading || !product) return;

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        imageRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
      ).fromTo(
        detailsRef.current?.children ? Array.from(detailsRef.current.children) : [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.5'
      );

      gsap.fromTo(
        ingredientsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ingredientsRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        similarRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: similarRef.current,
            start: 'top 80%',
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [isLoading, product, id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    if (selectedSize.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    // Add item quantity times
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    toast.success('Added to cart securely');
    setQuantity(1);
  };

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

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[#F4F1EA]/40 text-sm mb-8">
          <Link to="/" className="hover:text-[#D4A24F] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#D4A24F] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#F4F1EA]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Images Gallery */}
          <div ref={imageRef} className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] bg-[#F4F1EA]/5 overflow-hidden group">
              <img
                src={product.images[activeImageIndex]?.imageUrl || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              {product.new && (
                <div className="absolute top-4 left-4 lg:hidden px-3 py-1 bg-[#D4A24F] text-[#0B0B0D] text-xs font-semibold uppercase tracking-wider">
                  New Arrival
                </div>
              )}

              {/* Image Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(activeImageIndex === 0 ? product.images.length - 1 : activeImageIndex - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#0B0B0D]/60 backdrop-blur-sm flex items-center justify-center text-[#F4F1EA] hover:bg-[#D4A24F] hover:text-[#0B0B0D] transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-full"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(activeImageIndex === product.images.length - 1 ? 0 : activeImageIndex + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#0B0B0D]/60 backdrop-blur-sm flex items-center justify-center text-[#F4F1EA] hover:bg-[#D4A24F] hover:text-[#0B0B0D] transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-full"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === idx
                            ? 'bg-[#D4A24F] w-6'
                            : 'bg-[#F4F1EA]/40 hover:bg-[#F4F1EA]/70'
                          }`}
                        aria-label={`View image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 aspect-square flex-shrink-0 bg-[#F4F1EA]/5 overflow-hidden transition-all ${activeImageIndex === idx ? 'ring-1 ring-[#D4A24F]' : 'opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div ref={detailsRef} className="flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#D4A24F] text-sm font-semibold uppercase tracking-wider">
                {product.category}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 transition-colors ${isLiked ? 'text-red-500' : 'text-[#F4F1EA]/40 hover:text-[#D4A24F]'
                  }`}
                aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            <h1 className="luxury-heading text-[#F4F1EA] text-4xl lg:text-5xl mb-4">
              {product.name}
            </h1>

            <p className="text-[#F4F1EA]/60 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-[#D4A24F] text-3xl font-bold">
                ₹{selectedSize?.price.toLocaleString() || product.basePrice.toLocaleString()}
              </span>
              <span className="text-[#F4F1EA]/40 mb-1">Tax included.</span>
            </div>

            <div className="hairline mb-8" />

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <span className="luxury-label text-[#F4F1EA]/80">Select Size</span>
                {selectedSize?.stock && selectedSize.stock < 10 ? (
                  <span className="text-[#D4A24F] text-xs">Only {selectedSize.stock} left in stock</span>
                ) : null}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.sizes.map((size) => {
                  const outOfStock = size.stock <= 0;
                  return (
                    <button
                      key={size.id}
                      disabled={outOfStock}
                      onClick={() => {
                        setSelectedSize(size);
                        setQuantity(1);
                      }}
                      className={`relative py-3 border transition-all ${selectedSize?.id === size.id
                        ? 'border-[#D4A24F] bg-[#D4A24F]/10 text-[#D4A24F]'
                        : outOfStock
                          ? 'border-[#F4F1EA]/5 text-[#F4F1EA]/20 cursor-not-allowed bg-[#F4F1EA]/5'
                          : 'border-[#F4F1EA]/20 text-[#F4F1EA]/60 hover:border-[#F4F1EA]/40'
                        }`}
                    >
                      <span className="font-semibold">{size.sizeName}</span>
                      {outOfStock && (
                        <div className="absolute top-1/2 left-0 w-full h-px bg-[#F4F1EA]/20 -rotate-12" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-10">
              <div className="flex items-center border border-[#F4F1EA]/20 w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 py-4 flex justify-center text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center text-[#F4F1EA] font-semibold">{quantity}</span>
                <button
                  onClick={() => {
                    if (selectedSize && quantity < selectedSize.stock) {
                      setQuantity(quantity + 1);
                    }
                  }}
                  className="flex-1 py-4 flex justify-center text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                  aria-label="Increase quantity"
                  disabled={selectedSize ? quantity >= selectedSize.stock : true}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || selectedSize.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {selectedSize?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={() => {
                if (!product || !selectedSize || selectedSize.stock === 0) return;
                for (let i = 0; i < quantity; i++) {
                  addToCart(product, selectedSize);
                }
                navigate('/checkout');
              }}
              disabled={!selectedSize || selectedSize.stock === 0}
              className="w-full py-4 flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-10"
              style={{
                background: 'linear-gradient(135deg, #D4A24F 0%, #E8C76B 50%, #D4A24F 100%)',
                color: '#0B0B0D',
              }}
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </button>

            {/* Guaranteed Safe Checkout */}
            <div className="bg-[#F4F1EA]/5 p-4 flex items-center justify-center gap-4 text-[#F4F1EA]/40 text-sm">
              <span>Secure checkout via Razorpay</span>
            </div>
          </div>
        </div>

        {/* Olfactory Profile */}
        <div ref={ingredientsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 hover:border-[#D4A24F]/30 transition-colors">
            <Droplets className="w-8 h-8 text-[#D4A24F] mb-6" />
            <h3 className="text-[#F4F1EA] font-semibold text-lg mb-4">Top Notes</h3>
            <p className="text-[#F4F1EA]/60 leading-relaxed">
              {product.topNotes.join(', ')}
            </p>
          </div>

          <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 hover:border-[#D4A24F]/30 transition-colors">
            <Wind className="w-8 h-8 text-[#D4A24F] mb-6" />
            <h3 className="text-[#F4F1EA] font-semibold text-lg mb-4">Heart Notes</h3>
            <p className="text-[#F4F1EA]/60 leading-relaxed">
              {product.middleNotes.join(', ')}
            </p>
          </div>

          <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 hover:border-[#D4A24F]/30 transition-colors">
            <Clock className="w-8 h-8 text-[#D4A24F] mb-6" />
            <h3 className="text-[#F4F1EA] font-semibold text-lg mb-4">Base Notes</h3>
            <p className="text-[#F4F1EA]/60 leading-relaxed">
              {product.baseNotes.join(', ')}
            </p>
          </div>
        </div>

        {/* You May Also Like */}
        {similarProducts.length > 0 && (
          <div ref={similarRef} className="mb-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="luxury-heading text-[#F4F1EA] text-2xl lg:text-3xl">
                YOU MAY ALSO <span className="text-[#D4A24F]">LIKE</span>
              </h2>
              <Link
                to="/shop"
                className="hidden md:flex items-center gap-2 text-[#D4A24F] hover:gap-4 transition-all uppercase tracking-wider text-sm font-semibold"
              >
                View Full Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {similarProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] bg-[#F4F1EA]/5 overflow-hidden mb-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#0B0B0D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-[#F4F1EA] font-semibold text-lg mb-1">{p.name}</h3>
                  <p className="text-[#D4A24F]">₹{p.basePrice.toLocaleString()}</p>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center md:hidden">
              <Link
                to="/shop"
                className="btn-secondary w-full flex justify-center"
              >
                View Full Collection
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
