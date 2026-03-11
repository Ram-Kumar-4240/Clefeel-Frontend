import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ProductVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // GSAP scroll reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text block slides in from left
      if (textBlockRef.current) {
        gsap.fromTo(
          textBlockRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
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
            duration: 0.8,
            ease: 'power3.out',
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
            duration: 1.3,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-play/pause based on viewport
  useEffect(() => {
    if (!videoRef.current || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

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
      </div>

      {/* Main layout — asymmetric split */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[70vh] lg:min-h-[85vh]">
        {/* Left text panel — 4 cols */}
        <div className="lg:col-span-4 flex flex-col justify-center px-6 lg:pl-[6vw] lg:pr-12 py-20 lg:py-0 order-2 lg:order-1">
          <div ref={textBlockRef} style={{ opacity: 0 }}>
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
            <p className="text-[#F4F1EA]/45 text-sm lg:text-base leading-relaxed mb-10 max-w-sm">
              Experience the craftsmanship behind every CLEFEEL bottle — 
              luxury distilled into 8 seconds of pure artistry.
            </p>

            {/* Controls row */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="group flex items-center gap-3 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                  style={{
                    background: isPlaying
                      ? 'rgba(212,162,79,0.15)'
                      : 'linear-gradient(135deg, #D4A24F, #F4D58D)',
                    border: isPlaying ? '1px solid rgba(212,162,79,0.4)' : 'none',
                    boxShadow: isPlaying ? 'none' : '0 0 30px rgba(212,162,79,0.2)',
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-[#D4A24F]" />
                  ) : (
                    <Play className="w-4 h-4 text-[#0B0B0D] ml-0.5" fill="#0B0B0D" />
                  )}
                </div>
                <span className="text-[#F4F1EA]/50 text-xs tracking-wider uppercase hidden sm:inline">
                  {isPlaying ? 'Pause' : 'Watch Film'}
                </span>
              </button>

              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#D4A24F]/10"
                style={{
                  background: 'rgba(244,241,234,0.05)',
                  border: '1px solid rgba(244,241,234,0.08)',
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-[#F4F1EA]/40" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#D4A24F]" />
                )}
              </button>
            </div>

            {/* Duration badge */}
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(244,241,234,0.04)',
                border: '1px solid rgba(244,241,234,0.06)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4A24F] animate-pulse" />
              <span className="text-[#F4F1EA]/30 text-[10px] tracking-wider uppercase">0:08</span>
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
            className="relative w-full h-[50vh] lg:h-full cursor-pointer group"
            style={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/product_video.mp4"
              loop
              muted
              playsInline
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

            {/* Center play overlay (when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: 'rgba(212,162,79,0.85)',
                    boxShadow: '0 0 80px rgba(212,162,79,0.25)',
                  }}
                >
                  <Play className="w-8 h-8 text-[#0B0B0D] ml-1" fill="#0B0B0D" />
                </div>
              </div>
            )}

            {/* Hover pause indicator (when playing) */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
                  style={{
                    background: 'rgba(11,11,13,0.6)',
                    border: '1px solid rgba(212,162,79,0.3)',
                  }}
                >
                  <Pause className="w-5 h-5 text-[#D4A24F]" />
                </div>
              </div>
            )}

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
