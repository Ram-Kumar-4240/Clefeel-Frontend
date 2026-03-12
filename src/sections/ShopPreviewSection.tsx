import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Heart } from 'lucide-react';
import { fetchProducts } from '@/data/api';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function ShopPreviewSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { items: wishlistItems, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const allProducts = await fetchProducts();
      // Show only current bestsellers
      setProducts(allProducts.filter(p => p.bestseller).slice(0, 4));
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (isLoading || products.length === 0) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current?.children ? Array.from(headerRef.current.children) : [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
          },
        }
      );

      // Grid items animation
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, products.length]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0B0B0D] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4A24F]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4A24F]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="w-full px-6 lg:px-[6vw] relative z-10">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="luxury-heading text-[#F4F1EA] text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
              DISCOVER <span className="text-[#D4A24F] italic">EXCELLENCE</span>
            </h2>
            <p className="text-[#F4F1EA]/60 text-lg">
              Explore our curated selection of signature fragrances, crafted for those who demand nothing but the best.
            </p>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-3 text-[#D4A24F] font-semibold uppercase tracking-widest text-sm hover:text-[#F4F1EA] transition-colors"
          >
            <span>View All</span>
            <span className="w-10 h-10 rounded-full border border-[#D4A24F] flex items-center justify-center group-hover:bg-[#D4A24F] group-hover:text-[#0B0B0D] transition-all duration-300">
              <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[4/5] bg-[#F4F1EA]/5 mb-4" />
                <div className="w-2/3 h-5 bg-[#F4F1EA]/10 mb-2" />
                <div className="w-1/3 h-4 bg-[#F4F1EA]/10" />
              </div>
            ))}
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => {
              const isLiked = wishlistItems.some(item => item.id === product.id);

              return (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[4/5] bg-[#F4F1EA]/5 overflow-hidden mb-5">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </Link>

                    <div className="absolute inset-0 bg-[#0B0B0D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0B0B0D]/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#D4A24F]"
                      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-[#F4F1EA] group-hover:text-[#0B0B0D]'
                          }`}
                      />
                    </button>

                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                      <Link
                        to={`/product/${product.id}`}
                        className="w-full block text-center py-3 bg-[#0B0B0D]/80 backdrop-blur-md border border-[#D4A24F]/30 text-[#F4F1EA] text-sm uppercase tracking-wider font-semibold hover:bg-[#D4A24F] hover:text-[#0B0B0D] transition-colors"
                      >
                        Explore Details
                      </Link>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[#F4F1EA] font-semibold text-lg mb-1 group-hover:text-[#D4A24F] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[#F4F1EA]/40 text-sm">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#D4A24F] font-medium tracking-wide">
                        ₹{product.basePrice.toLocaleString()}
                      </p>
                      {product.baseMrp > product.basePrice && (
                        <p className="text-[#F4F1EA]/30 text-xs line-through">
                          ₹{product.baseMrp.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
