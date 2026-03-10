import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

      // Headline words stagger
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

  // Scroll-driven animation — fixed for large screens
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          onLeaveBack: () => {
            gsap.set([labelRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current], {
              opacity: 1,
              x: 0,
            });
            gsap.set(bgRef.current, { scale: 1, opacity: 1 });
          },
        },
      });

      // Phase 1: ENTRANCE (0-30%) - subtle background scale
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1 },
        { scale: 1.02, ease: 'none' },
        0
      );

      // Phase 2: SETTLE (30-70%) - hold

      // Phase 3: EXIT (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-22vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        [labelRef.current, subheadlineRef.current, ctaRef.current],
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.02, opacity: 1 },
        { scale: 1.08, opacity: 0.85, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-[#0B0B0D] z-10"
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
