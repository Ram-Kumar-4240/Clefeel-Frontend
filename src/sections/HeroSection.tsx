import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background fade and scale
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.2 },
        0
      );

      // Label fade in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.4
      );

      // Set headline container visible, then stagger words
      tl.set(headlineRef.current, { opacity: 1 }, 0.5);

      const words = headlineRef.current?.querySelectorAll('.word');
      if (words) {
        tl.fromTo(
          words,
          { opacity: 0, y: 40, rotateX: 35 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.06 },
          0.5
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.9
      );

      // CTA
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-screen overflow-hidden bg-[#0B0B0D] z-10"
      style={{ height: '100dvh' }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/hero_perfume_fabric.jpg"
          alt="Luxury perfume"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/80 via-[#0B0B0D]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        {/* Label */}
        <div
          ref={labelRef}
          className="luxury-label text-[#D4A24F] mb-6"
          style={{ opacity: 0 }}
        >
          CLEFEEL PARFUMS
        </div>

        {/* Headline */}
        <div
          ref={headlineRef}
          className="luxury-heading text-[#F4F1EA] mb-8"
          style={{
            fontSize: 'clamp(44px, 6vw, 96px)',
            lineHeight: 1.05,
            maxWidth: '62vw',
            opacity: 0,
          }}
        >
          <div className="word inline-block">FEEL</div>{' '}
          <div className="word inline-block">THE</div>
          <br />
          <div className="word inline-block text-[#D4A24F]">LUXURY</div>
          <br />
          <div className="word inline-block">OWN</div>{' '}
          <div className="word inline-block">THE</div>{' '}
          <div className="word inline-block">SCENT</div>
        </div>

        {/* Subheadline */}
        <div
          ref={subheadlineRef}
          className="luxury-body text-[#F4F1EA]/70 text-base lg:text-lg mb-8 max-w-md"
          style={{ opacity: 0 }}
        >
          Premium fragrances crafted for those who leave a lasting impression.
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{ opacity: 0 }}>
          <Link to="/shop" className="btn-primary inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
