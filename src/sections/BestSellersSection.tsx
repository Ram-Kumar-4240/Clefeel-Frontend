import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BestSellersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subcopyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  const bestsellers = products.filter((p) => p.bestseller).slice(0, 3);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Phase 1: ENTRANCE (0-30%)
      // Background
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.1, x: '8vw', opacity: 0.6 },
        { scale: 1, x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Headline
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-40vw', opacity: 0, rotateY: 25 },
        { x: 0, opacity: 1, rotateY: 0, ease: 'none' },
        0
      );

      // Subcopy + CTA
      scrollTl.fromTo(
        [subcopyRef.current, ctaRef.current],
        { y: '18vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // Cards stagger
      const cards = cardsRef.current?.querySelectorAll('.product-card');
      if (cards) {
        scrollTl.fromTo(
          cards,
          { x: '50vw', opacity: 0, scale: 0.92 },
          { x: 0, opacity: 1, scale: 1, stagger: 0.02, ease: 'none' },
          0.05
        );
      }

      // Phase 2: SETTLE (30-70%) - hold

      // Phase 3: EXIT (70-100%)
      scrollTl.fromTo(
        [headlineRef.current, subcopyRef.current, ctaRef.current],
        { x: 0, opacity: 1 },
        { x: '-28vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (cards) {
        scrollTl.fromTo(
          cards,
          { x: 0, opacity: 1 },
          { x: '28vw', opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.06, opacity: 0.8, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-[#0B0B0D] z-20"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/bestseller_bottle_flowers.jpg"
          alt="Best sellers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/90 via-[#0B0B0D]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        {/* Left Content */}
        <div className="max-w-xl">
          {/* Headline */}
          <div
            ref={headlineRef}
            className="luxury-heading text-[#F4F1EA] mb-6"
            style={{
              fontSize: 'clamp(34px, 4.2vw, 72px)',
              lineHeight: 1.05,
              opacity: 0,
            }}
          >
            <div>BEST</div>
            <div className="text-[#D4A24F]">SELLERS</div>
          </div>

          {/* Subcopy */}
          <div
            ref={subcopyRef}
            className="luxury-body text-[#F4F1EA]/70 text-base lg:text-lg mb-8"
            style={{ opacity: 0 }}
          >
            Four scents loved across India—long-lasting, skin-friendly, unisex.
          </div>

          {/* CTA */}
          <div ref={ctaRef} style={{ opacity: 0 }}>
            <Link to="/shop" className="btn-primary inline-block">
              Shop Best Sellers
            </Link>
          </div>
        </div>

        {/* Right Product Cards */}
        <div
          ref={cardsRef}
          className="absolute right-[6vw] top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4"
        >
          {bestsellers.map((product) => (
            <div
              key={product.id}
              className="product-card bg-[#0B0B0D]/80 backdrop-blur-sm border border-[#F4F1EA]/10 p-4 flex items-center gap-4 w-80"
              style={{ opacity: 0 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover"
              />
              <div className="flex-1">
                <h4 className="text-[#F4F1EA] font-semibold text-sm">
                  {product.name}
                </h4>
                <p className="text-[#D4A24F] text-sm">
                  ₹{product.basePrice.toLocaleString()}
                  {product.baseMrp > product.basePrice && (
                    <span className="text-[#F4F1EA]/30 text-xs line-through ml-2">
                      ₹{product.baseMrp.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => addToCart(product, product.sizes[0])}
                className="w-10 h-10 bg-[#D4A24F] text-[#0B0B0D] flex items-center justify-center hover:bg-[#F4F1EA] transition-colors"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
