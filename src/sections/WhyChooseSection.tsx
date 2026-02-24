import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whyChooseFeatures } from '@/data/products';
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

  useLayoutEffect(() => {
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

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#6B4C42] py-24 lg:py-32 z-40"
    >
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none" />

      <div className="relative z-10 w-full px-6 lg:px-[6vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-16" style={{ opacity: 0 }}>
          <h2
            className="luxury-heading text-[#F4F1EA] text-center"
            style={{ fontSize: 'clamp(28px, 3.5vw, 56px)' }}
          >
            WHY CHOOSE <span className="text-[#D4A24F]">CLEFEEL</span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {whyChooseFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={index}
                className="feature-card bg-[#0B0B0D]/40 backdrop-blur-sm border border-[#F4F1EA]/10 p-8 hover:border-[#D4A24F]/30 transition-colors"
                style={{ opacity: 0 }}
              >
                <div className="w-12 h-12 bg-[#D4A24F]/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-[#D4A24F]" />
                </div>
                <h3 className="text-[#F4F1EA] font-semibold text-lg mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#F4F1EA]/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
