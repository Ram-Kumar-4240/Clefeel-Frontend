import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

const collections = [
  { id: 'oud', name: 'Royal Oud', image: '/product_royal_oud.jpg' },
  { id: 'floral', name: 'Velvet Rose', image: '/product_velvet_rose.jpg' },
  { id: 'amber', name: 'Amber Mystique', image: '/product_amber_mystique.jpg' },
  { id: 'noir', name: 'Midnight Noir', image: '/product_midnight_noir.jpg' },
];

gsap.registerPlugin(ScrollTrigger);

export default function CollectionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subcopyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);

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
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.12, opacity: 0.5 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: '-45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        [subcopyRef.current, ctaRef.current],
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      const tiles = tilesRef.current?.querySelectorAll('.collection-tile');
      if (tiles) {
        scrollTl.fromTo(
          tiles,
          { x: '55vw', opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, stagger: 0.015, ease: 'none' },
          0.05
        );
      }

      // Phase 2: SETTLE (30-70%) - hold

      // Phase 3: EXIT (70-100%)
      scrollTl.fromTo(
        [headlineRef.current, subcopyRef.current, ctaRef.current],
        { x: 0, opacity: 1 },
        { x: '-26vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (tiles) {
        scrollTl.fromTo(
          tiles,
          { x: 0, opacity: 1 },
          { x: '26vw', opacity: 0, ease: 'power2.in' },
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
      className="section-pinned bg-[#0B0B0D] z-30"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/collections_bottle_dried.jpg"
          alt="Collections"
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
            <div>SIGNATURE</div>
            <div className="text-[#D4A24F]">COLLECTIONS</div>
          </div>

          {/* Subcopy */}
          <div
            ref={subcopyRef}
            className="luxury-body text-[#F4F1EA]/70 text-base lg:text-lg mb-8"
            style={{ opacity: 0 }}
          >
            From Royal Oud to Midnight Noir—find your signature.
          </div>

          {/* CTA */}
          <div ref={ctaRef} style={{ opacity: 0 }}>
            <Link to="/shop?tab=collections" className="btn-primary inline-block">
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Right Collection Tiles */}
        <div
          ref={tilesRef}
          className="absolute right-[6vw] top-1/2 -translate-y-1/2 hidden lg:grid grid-cols-2 gap-3 w-[36vw] max-w-xl"
        >
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/shop?collection=${collection.id}`}
              className="collection-tile group relative overflow-hidden aspect-[4/3] border border-[#F4F1EA]/10"
              style={{ opacity: 0 }}
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 via-[#0B0B0D]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-[#F4F1EA] font-semibold text-sm mb-1 group-hover:text-[#D4A24F] transition-colors">
                  {collection.name}
                </h4>
                <div className="flex items-center gap-1 text-[#F4F1EA]/50 text-xs group-hover:text-[#D4A24F] transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
