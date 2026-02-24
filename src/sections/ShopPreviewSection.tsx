import { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { Plus, Filter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Oud', 'Floral', 'Amber', 'Fresh', 'Spicy'];

export default function ShopPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const addToCart = useCartStore((state) => state.addToCart);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Filters animation
      gsap.fromTo(
        filtersRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: filtersRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Grid cards animation
      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProducts]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0B0B0D] py-24 lg:py-32 z-50"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Header */}
        <div ref={headerRef} className="mb-8" style={{ opacity: 0 }}>
          <h2
            className="luxury-heading text-[#F4F1EA] mb-4"
            style={{ fontSize: 'clamp(28px, 3.5vw, 56px)' }}
          >
            SHOP <span className="text-[#D4A24F]">ALL</span>
          </h2>
          <p className="text-[#F4F1EA]/60 text-base max-w-md">
            Filter by mood. Sort by preference. Add in seconds.
          </p>
        </div>

        {/* Filters */}
        <div
          ref={filtersRef}
          className="flex flex-wrap items-center gap-3 mb-10"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 text-[#F4F1EA]/40 mr-4">
            <Filter className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Filter:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                activeCategory === category
                  ? 'border-[#D4A24F] text-[#D4A24F]'
                  : 'border-[#F4F1EA]/20 text-[#F4F1EA]/60 hover:border-[#F4F1EA]/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card group"
              style={{ opacity: 0 }}
            >
              {/* Image */}
              <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square mb-4 bg-[#F4F1EA]/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.bestseller && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#D4A24F] text-[#0B0B0D] text-xs font-semibold uppercase">
                    Bestseller
                  </span>
                )}
                {product.new && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#F4F1EA] text-[#0B0B0D] text-xs font-semibold uppercase">
                    New
                  </span>
                )}
                
                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="absolute bottom-0 left-0 right-0 bg-[#D4A24F] text-[#0B0B0D] py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Add to Cart</span>
                </button>
              </Link>

              {/* Info */}
              <div>
                <h3 className="text-[#F4F1EA] font-semibold text-sm mb-1 group-hover:text-[#D4A24F] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#F4F1EA]/40 text-xs mb-2">{product.size}</p>
                <p className="text-[#D4A24F] font-semibold">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link to="/shop" className="btn-secondary inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
