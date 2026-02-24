import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Truck, Shield, Clock, Plus, Minus, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  const product = products.find((p) => p.id === id);
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  useEffect(() => {
    if (!product) {
      navigate('/shop');
      return;
    }

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        contentRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [product, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-[#F4F1EA]/40 hover:text-[#F4F1EA] transition-colors">
            Home
          </Link>
          <span className="text-[#F4F1EA]/20">/</span>
          <Link to="/shop" className="text-[#F4F1EA]/40 hover:text-[#F4F1EA] transition-colors">
            Shop
          </Link>
          <span className="text-[#F4F1EA]/20">/</span>
          <span className="text-[#F4F1EA]">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Image Gallery */}
          <div ref={imageRef} style={{ opacity: 0 }}>
            <div className="relative aspect-square bg-[#F4F1EA]/5 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.bestseller && (
                <span className="absolute top-4 left-4 px-4 py-2 bg-[#D4A24F] text-[#0B0B0D] text-xs font-semibold uppercase">
                  Bestseller
                </span>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            <div className="flex gap-3">
              {[product.image, product.image, product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 border-2 overflow-hidden transition-colors ${
                    activeImage === idx ? 'border-[#D4A24F]' : 'border-[#F4F1EA]/10'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div ref={contentRef} style={{ opacity: 0 }}>
            {/* Collection */}
            <p className="luxury-label text-[#D4A24F] mb-3">{product.collection}</p>
            
            {/* Name */}
            <h1 className="luxury-heading text-[#F4F1EA] text-4xl lg:text-5xl mb-4">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4A24F] text-[#D4A24F]" />
                ))}
              </div>
              <span className="text-[#F4F1EA]/40 text-sm">(128 reviews)</span>
            </div>

            {/* Price */}
            <p className="text-[#D4A24F] text-3xl font-bold mb-6">
              ₹{product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-[#F4F1EA]/70 text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size */}
            <div className="mb-8">
              <p className="luxury-label text-[#F4F1EA]/40 mb-3">Size</p>
              <div className="flex items-center gap-3">
                <button className="px-6 py-3 border-2 border-[#D4A24F] text-[#D4A24F] text-sm font-semibold">
                  {product.size}
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="luxury-label text-[#F4F1EA]/40 mb-3">Quantity</p>
              <div className="flex items-center border border-[#F4F1EA]/20 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-[#F4F1EA] font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-secondary flex-1"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#F4F1EA]/10">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-6 h-6 text-[#D4A24F] mb-2" />
                <span className="text-[#F4F1EA]/60 text-xs">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-6 h-6 text-[#D4A24F] mb-2" />
                <span className="text-[#F4F1EA]/60 text-xs">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Clock className="w-6 h-6 text-[#D4A24F] mb-2" />
                <span className="text-[#F4F1EA]/60 text-xs">8-12 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fragrance Notes */}
        <div className="mb-20">
          <h2 className="luxury-heading text-[#F4F1EA] text-2xl mb-8">
            FRAGRANCE <span className="text-[#D4A24F]">NOTES</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Notes */}
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
              <h3 className="luxury-label text-[#D4A24F] mb-4">Top Notes</h3>
              <ul className="space-y-2">
                {product.topNotes.map((note, idx) => (
                  <li key={idx} className="text-[#F4F1EA]/70 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4A24F] rounded-full" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle Notes */}
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
              <h3 className="luxury-label text-[#D4A24F] mb-4">Middle Notes</h3>
              <ul className="space-y-2">
                {product.middleNotes.map((note, idx) => (
                  <li key={idx} className="text-[#F4F1EA]/70 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4A24F] rounded-full" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Base Notes */}
            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
              <h3 className="luxury-label text-[#D4A24F] mb-4">Base Notes</h3>
              <ul className="space-y-2">
                {product.baseNotes.map((note, idx) => (
                  <li key={idx} className="text-[#F4F1EA]/70 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4A24F] rounded-full" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mb-20">
          <h2 className="luxury-heading text-[#F4F1EA] text-2xl mb-8">
            PRODUCT <span className="text-[#D4A24F]">DETAILS</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-between py-4 border-b border-[#F4F1EA]/10">
              <span className="text-[#F4F1EA]/40">Longevity</span>
              <span className="text-[#F4F1EA]">{product.longevity}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-[#F4F1EA]/10">
              <span className="text-[#F4F1EA]/40">Projection</span>
              <span className="text-[#F4F1EA]">{product.projection}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-[#F4F1EA]/10">
              <span className="text-[#F4F1EA]/40">Size</span>
              <span className="text-[#F4F1EA]">{product.size}</span>
            </div>
            <div className="flex justify-between py-4 border-b border-[#F4F1EA]/10">
              <span className="text-[#F4F1EA]/40">Category</span>
              <span className="text-[#F4F1EA]">{product.category}</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="luxury-heading text-[#F4F1EA] text-2xl mb-8">
              YOU MAY ALSO <span className="text-[#D4A24F]">LIKE</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="group"
                >
                  <div className="relative aspect-square bg-[#F4F1EA]/5 mb-4 overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-[#F4F1EA] font-semibold text-sm mb-1 group-hover:text-[#D4A24F] transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-[#D4A24F] font-semibold">
                    ₹{related.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
