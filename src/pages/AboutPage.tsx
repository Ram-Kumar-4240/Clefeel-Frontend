import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Globe, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Award, value: '50+', label: 'Premium Fragrances' },
  { icon: Users, value: '100K+', label: 'Happy Customers' },
  { icon: Globe, value: '15+', label: 'States Served' },
  { icon: Heart, value: '4.9', label: 'Average Rating' },
];

const values = [
  {
    title: 'Craftsmanship',
    description: 'Each fragrance is meticulously crafted by master perfumers with decades of experience.',
  },
  {
    title: 'Quality',
    description: 'We use only the finest ingredients sourced from renowned perfumeries worldwide.',
  },
  {
    title: 'Innovation',
    description: 'Constantly pushing boundaries to create unique, memorable scent experiences.',
  },
  {
    title: 'Sustainability',
    description: 'Committed to eco-friendly practices and sustainable sourcing.',
  },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

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
          },
        }
      );

      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems) {
        gsap.fromTo(
          statItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      const valueItems = valuesRef.current?.querySelectorAll('.value-item');
      if (valueItems) {
        gsap.fromTo(
          valueItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: valuesRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      {/* Hero */}
      <div ref={heroRef} className="relative h-[60vh] mb-16" style={{ opacity: 0 }}>
        <img
          src="/about_packaging_2.jpg"
          alt="About CLEFEEL"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-[6vw] pb-16">
          <h1 className="luxury-heading text-[#F4F1EA] text-4xl lg:text-6xl mb-4">
            CRAFTED FOR <span className="text-[#D4A24F]">THE BOLD</span>
          </h1>
          <p className="text-[#F4F1EA]/60 text-lg max-w-xl">
            A luxury perfume house dedicated to creating unforgettable fragrance experiences.
          </p>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="w-full px-6 lg:px-[6vw] mb-20" style={{ opacity: 0 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="luxury-heading text-[#F4F1EA] text-2xl lg:text-3xl mb-6">
              OUR <span className="text-[#D4A24F]">STORY</span>
            </h2>
            <div className="space-y-4 text-[#F4F1EA]/70 leading-relaxed">
              <p>
                CLEFEEL is a luxury perfume house built for modern India. We believe that 
                fragrance is more than just a scent—it&apos;s an expression of individuality, 
                a signature that leaves a lasting impression.
              </p>
              <p>
                Founded with a passion for exceptional perfumery, we source the finest 
                ingredients from renowned perfumeries in France, the Middle East, and beyond. 
                Each fragrance in our collection is meticulously crafted to deliver 8-12 hours 
                of long-lasting elegance.
              </p>
              <p>
                Our unisex fragrances are designed for the modern individual who values 
                sophistication, quality, and uniqueness. From the rich depths of oud to the 
                delicate beauty of roses, our collections offer something for every mood and occasion.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/about_packaging_1.jpg"
              alt="Luxury packaging"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="w-full px-6 lg:px-[6vw] mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stat-item bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 text-center"
                style={{ opacity: 0 }}
              >
                <div className="w-12 h-12 bg-[#D4A24F]/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#D4A24F]" />
                </div>
                <p className="luxury-heading text-[#D4A24F] text-3xl mb-2">{stat.value}</p>
                <p className="text-[#F4F1EA]/60 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Values */}
      <div ref={valuesRef} className="w-full px-6 lg:px-[6vw]">
        <h2 className="luxury-heading text-[#F4F1EA] text-2xl lg:text-3xl mb-10 text-center">
          OUR <span className="text-[#D4A24F]">VALUES</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="value-item bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6"
              style={{ opacity: 0 }}
            >
              <h3 className="text-[#F4F1EA] font-semibold text-lg mb-3">{value.title}</h3>
              <p className="text-[#F4F1EA]/60 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
