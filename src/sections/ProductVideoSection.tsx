import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Gem, FlaskConical } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ProductVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const detailCardsRef = useRef<HTMLDivElement>(null);

  // GSAP scroll reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text block slides in from left with stagger
      if (textBlockRef.current) {
        const children = textBlockRef.current.children;
        gsap.fromTo(
          Array.from(children),
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Accent line grows in
      if (accentLineRef.current) {
        gsap.fromTo(
          accentLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Video wrapper reveals from right with clip-path
      if (videoWrapperRef.current) {
        gsap.fromTo(
          videoWrapperRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1.4,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Detail cards stagger in
      if (detailCardsRef.current) {
        gsap.fromTo(
          Array.from(detailCardsRef.current.children),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: detailCardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-play/pause based on viewport (always plays when visible)
  useEffect(() => {
    if (!videoRef.current || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#0B0B0D' }}
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,162,79,0.06) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,162,79,0.04) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Main layout — asymmetric split */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[70vh] lg:min-h-[85vh]">
        {/* Left text panel — 4 cols */}
        <div className="lg:col-span-4 flex flex-col justify-center px-6 lg:pl-[6vw] lg:pr-12 py-20 lg:py-0 order-2 lg:order-1">
          <div ref={textBlockRef}>
            {/* Label */}
            <div className="inline-flex items-center gap-3 mb-8">
              <div
                className="w-8 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #D4A24F, transparent)' }}
              />
              <span className="text-[#D4A24F] text-[10px] font-bold tracking-[0.4em] uppercase">
                Product Film
              </span>
            </div>

            {/* Heading */}
            <h2
              className="luxury-heading text-[#F4F1EA] mb-6"
              style={{ fontSize: 'clamp(26px, 3vw, 48px)' }}
            >
              THE ART OF
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #D4A24F 0%, #F4D58D 50%, #D4A24F 100%)',
                }}
              >
                FRAGRANCE
              </span>
            </h2>

            {/* Description */}
            <p className="text-[#F4F1EA]/45 text-sm lg:text-base leading-relaxed mb-8 max-w-sm">
              Experience the craftsmanship behind every CLEFEEL bottle — 
              luxury distilled into pure artistry.
            </p>

            {/* Brand detail cards */}
            <div ref={detailCardsRef} className="flex flex-col gap-4">
              <div className="flex items-center gap-4 px-4 py-3 rounded-sm"
                style={{
                  background: 'rgba(244,241,234,0.03)',
                  border: '1px solid rgba(244,241,234,0.06)',
                }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(212,162,79,0.12)' }}
                >
                  <FlaskConical className="w-4 h-4 text-[#D4A24F]" />
                </div>
                <div>
                  <p className="text-[#F4F1EA]/80 text-sm font-semibold">Eau de Parfum</p>
                  <p className="text-[#F4F1EA]/30 text-[11px]">20-25% concentration</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-3 rounded-sm"
                style={{
                  background: 'rgba(244,241,234,0.03)',
                  border: '1px solid rgba(244,241,234,0.06)',
                }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(212,162,79,0.12)' }}
                >
                  <Gem className="w-4 h-4 text-[#D4A24F]" />
                </div>
                <div>
                  <p className="text-[#F4F1EA]/80 text-sm font-semibold">Handcrafted</p>
                  <p className="text-[#F4F1EA]/30 text-[11px]">Small batch luxury</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-3 rounded-sm"
                style={{
                  background: 'rgba(244,241,234,0.03)',
                  border: '1px solid rgba(244,241,234,0.06)',
                }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(212,162,79,0.12)' }}
                >
                  <Sparkles className="w-4 h-4 text-[#D4A24F]" />
                </div>
                <div>
                  <p className="text-[#F4F1EA]/80 text-sm font-semibold">Premium Ingredients</p>
                  <p className="text-[#F4F1EA]/30 text-[11px]">Sourced from France & Middle East</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gold accent line separator */}
        <div className="lg:col-span-1 hidden lg:flex items-center justify-center order-2">
          <div
            ref={accentLineRef}
            className="w-[1px] h-2/3 origin-top"
            style={{
              background: 'linear-gradient(to bottom, transparent, #D4A24F, transparent)',
              transform: 'scaleY(0)',
            }}
          />
        </div>

        {/* Right video panel — 7 cols */}
        <div className="lg:col-span-7 relative order-1 lg:order-3">
          <div
            ref={videoWrapperRef}
            className="relative w-full h-[50vh] lg:h-full"
            style={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/product_video.mp4"
              loop
              muted
              playsInline
              autoPlay
              preload="metadata"
              poster="/hero_perfume_fabric.jpg"
            />

            {/* Cinematic left-edge fade into text panel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, #0B0B0D 0%, transparent 20%)',
              }}
            />

            {/* Bottom vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(11,11,13,0.5) 0%, transparent 30%)',
              }}
            />

            {/* Bottom shimmer */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] z-20 overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #D4A24F, transparent)',
                  animation: 'videoShimmer 3s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes videoShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
