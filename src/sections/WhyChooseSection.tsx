import { useRef, useLayoutEffect, useState, useEffect } from 'react';
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [features, setFeatures] = useState<WhyChooseFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Backend-ready dynamic data fetching
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

  useLayoutEffect(() => {
    if (isLoading || features.length === 0) return;

    // Wait for DOM to paint
    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        // Heading animation
        gsap.fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Cards stagger animation with enhanced effects
        const cards = cardsRef.current?.querySelectorAll('.feature-card');
        if (cards) {
          gsap.fromTo(
            cards,
            { y: 80, opacity: 0, scale: 0.9, rotateX: 8 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotateX: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
                end: 'top 40%',
                toggleActions: 'play none none reverse',
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
      className="relative bg-[#6B4C42] py-24 lg:py-32 z-40 overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-[#D4A24F]/8 via-transparent to-black/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-gradient-to-b from-transparent via-[#6B4C42]/50 to-transparent opacity-60" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-[6vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 text-center" style={{ opacity: 0 }}>
          <p className="luxury-label text-[#D4A24F]/80 mb-4 text-xs tracking-[0.2em]">
            THE CLEFEEL DIFFERENCE
          </p>
          <h2
            className="luxury-heading text-[#F4F1EA]"
            style={{ fontSize: 'clamp(28px, 3.5vw, 56px)' }}
          >
            WHY CHOOSE <span className="text-[#D4A24F]">CLEFEEL</span>
          </h2>
          <div className="mt-4 mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4A24F] to-transparent" />
        </div>

        {/* Feature Cards — Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0B0B0D]/30 backdrop-blur-md border border-[#F4F1EA]/5 p-8 animate-pulse"
              >
                <div className="w-14 h-14 bg-[#F4F1EA]/5 rounded-xl mb-6" />
                <div className="h-5 bg-[#F4F1EA]/5 rounded w-3/4 mb-3" />
                <div className="h-4 bg-[#F4F1EA]/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          /* Feature Cards — Glassmorphism Design */
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <div
                  key={index}
                  className="feature-card group relative bg-[#0B0B0D]/30 backdrop-blur-md border border-[#F4F1EA]/10 p-8 transition-all duration-500 hover:border-[#D4A24F]/40 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(212,162,79,0.15)] cursor-default overflow-hidden"
                  style={{ opacity: 0 }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4A24F]/0 via-transparent to-[#D4A24F]/0 group-hover:from-[#D4A24F]/5 group-hover:to-[#D4A24F]/3 transition-all duration-500 pointer-events-none" />

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D4A24F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon container with animation */}
                  <div className="relative w-14 h-14 bg-gradient-to-br from-[#D4A24F]/20 to-[#D4A24F]/5 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:from-[#D4A24F]/30 group-hover:to-[#D4A24F]/10 group-hover:shadow-[0_0_25px_rgba(212,162,79,0.2)]">
                    <Icon className="w-6 h-6 text-[#D4A24F] transition-transform duration-500 group-hover:scale-110" />
                  </div>

                  {/* Content */}
                  <h3 className="relative text-[#F4F1EA] font-semibold text-lg mb-3 transition-colors duration-300 group-hover:text-[#D4A24F]">
                    {feature.title}
                  </h3>
                  <p className="relative text-[#F4F1EA]/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A24F] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
