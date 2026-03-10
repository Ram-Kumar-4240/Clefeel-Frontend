import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchWhyChooseFeatures } from '@/data/api';
import type { WhyChooseFeature } from '@/data/api';
import { Droplets, Clock, Gem, Gift, Users, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Clock,
  Gem,
  Gift,
  Users,
  Truck,
};

export default function WhyChooseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [features, setFeatures] = useState<WhyChooseFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchWhyChooseFeatures().then((data) => {
      if (!cancelled) {
        setFeatures(data);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (isLoading || features.length === 0) return;

    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        if (headingRef.current) {
          gsap.fromTo(
            headingRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: headingRef.current,
                start: 'top 85%',
              },
            }
          );
        }

        const cards = cardsRef.current?.querySelectorAll('.wc-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 50, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 82%',
              },
            }
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => cancelAnimationFrame(raf);
  }, [isLoading, features]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-40 overflow-hidden"
      style={{ background: '#0B0B0D' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold radial glow top */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,162,79,0.06) 0%, transparent 60%)' }}
        />
        {/* Subtle gold glow bottom-right */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,162,79,0.04) 0%, transparent 60%)' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,162,79,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,162,79,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-[6vw]">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-20" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A24F]/60 to-transparent" />
            <span className="text-[#D4A24F] text-xs font-bold tracking-[0.35em] uppercase">
              The CLEFEEL Difference
            </span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A24F]/60 to-transparent" />
          </div>
          <h2
            className="luxury-heading text-[#F4F1EA]"
            style={{ fontSize: 'clamp(32px, 4vw, 64px)' }}
          >
            WHY CHOOSE{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #D4A24F 0%, #F4D58D 50%, #D4A24F 100%)',
              }}
            >
              CLEFEEL
            </span>
          </h2>
          <p className="mt-4 text-[#F4F1EA]/50 text-base lg:text-lg max-w-xl mx-auto">
            Crafted with precision, delivered with care — every detail is designed for perfection.
          </p>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl animate-pulse"
                style={{ background: 'rgba(212,162,79,0.04)', border: '1px solid rgba(212,162,79,0.08)' }}
              />
            ))}
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Gem;
              const isHovered = hoveredCard === index;

              return (
                <div
                  key={index}
                  className="wc-card group relative"
                  style={{ opacity: 0 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card */}
                  <div
                    className="relative rounded-2xl p-8 lg:p-10 h-full overflow-hidden transition-all duration-500 cursor-pointer"
                    style={{
                      background: isHovered
                        ? 'linear-gradient(135deg, rgba(212,162,79,0.1) 0%, rgba(244,241,234,0.04) 100%)'
                        : 'rgba(244,241,234,0.03)',
                      border: isHovered
                        ? '1px solid rgba(212,162,79,0.35)'
                        : '1px solid rgba(244,241,234,0.06)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: isHovered
                        ? '0 8px 32px rgba(212,162,79,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.02)',
                    }}
                  >
                    {/* Animated top bar */}
                    <div
                      className="absolute top-0 left-0 h-[2px] rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: isHovered ? '100%' : '0%',
                        background: 'linear-gradient(90deg, #D4A24F, #F4D58D, #D4A24F)',
                      }}
                    />

                    {/* Floating number badge */}
                    <div
                      className="absolute top-5 right-6 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500"
                      style={{
                        background: isHovered
                          ? 'rgba(212,162,79,0.15)'
                          : 'rgba(244,241,234,0.04)',
                        border: isHovered
                          ? '1px solid rgba(212,162,79,0.3)'
                          : '1px solid rgba(244,241,234,0.06)',
                        color: isHovered ? '#D4A24F' : 'rgba(244,241,234,0.15)',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500"
                        style={{
                          background: isHovered
                            ? 'linear-gradient(135deg, #D4A24F, #F4D58D)'
                            : 'rgba(212,162,79,0.1)',
                          boxShadow: isHovered
                            ? '0 4px 20px rgba(212,162,79,0.25)'
                            : 'none',
                        }}
                      >
                        <Icon
                          className="w-6 h-6 transition-all duration-500"
                          style={{
                            color: isHovered ? '#0B0B0D' : '#D4A24F',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <h3
                      className="font-semibold text-lg mb-3 transition-colors duration-400"
                      style={{ color: isHovered ? '#D4A24F' : '#F4F1EA' }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-[#F4F1EA]/45 text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Bottom glow effect */}
                    {isHovered && (
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(212,162,79,0.4), transparent)',
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom trust strip */}
        <div className="mt-20 flex items-center justify-center gap-8 flex-wrap">
          {['Premium Ingredients', 'Cruelty Free', 'Made in India'].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#D4A24F' }}
              />
              <span className="text-[#F4F1EA]/35 text-xs tracking-wider uppercase">{label}</span>
              {i < 2 && <div className="hidden sm:block w-px h-4 bg-[#F4F1EA]/10 ml-5" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
