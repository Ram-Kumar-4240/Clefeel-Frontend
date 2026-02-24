import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Images parallax
      const images = imagesRef.current?.querySelectorAll('.about-image');
      if (images) {
        images.forEach((img, index) => {
          gsap.fromTo(
            img,
            { y: 0, opacity: 0, scale: 0.98 },
            {
              y: -40 * (index + 1) * 0.5,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: imagesRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0B0B0D] py-24 lg:py-32 z-50"
    >
      <div className="w-full px-6 lg:px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div ref={contentRef} style={{ opacity: 0 }}>
            <h2
              className="luxury-heading text-[#F4F1EA] mb-6"
              style={{ fontSize: 'clamp(28px, 3.5vw, 56px)' }}
            >
              CRAFTED FOR <span className="text-[#D4A24F]">THE BOLD</span>
            </h2>
            
            <div className="space-y-4 text-[#F4F1EA]/70 text-base leading-relaxed mb-8">
              <p>
                CLEFEEL is a luxury perfume house built for modern India. We believe 
                that fragrance is more than just a scent—it's an expression of 
                individuality, a signature that leaves a lasting impression.
              </p>
              <p>
                Every formula is designed for performance—8 to 12 hours of 
                long-lasting elegance. Our fragrances are crafted using premium 
                ingredients sourced from the finest perfumeries around the world.
              </p>
              <p>
                Unisex, skin-friendly, and made to leave a lasting impression. 
                This is CLEFEEL—where luxury meets longevity.
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#D4A24F] font-semibold text-sm uppercase tracking-wider hover:gap-4 transition-all"
            >
              <span>Read Our Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Images Collage */}
          <div ref={imagesRef} className="relative h-[500px] hidden lg:block">
            <div
              className="about-image absolute top-0 right-0 w-3/4 aspect-[4/3] overflow-hidden border border-[#F4F1EA]/10"
              style={{ opacity: 0 }}
            >
              <img
                src="/about_packaging_1.jpg"
                alt="Luxury packaging"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="about-image absolute top-24 left-0 w-2/3 aspect-[4/3] overflow-hidden border border-[#F4F1EA]/10"
              style={{ opacity: 0 }}
            >
              <img
                src="/about_packaging_2.jpg"
                alt="Perfume crafting"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="about-image absolute bottom-0 right-12 w-1/2 aspect-[4/3] overflow-hidden border border-[#F4F1EA]/10"
              style={{ opacity: 0 }}
            >
              <img
                src="/product_macro_bottle.jpg"
                alt="Perfume bottle"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
