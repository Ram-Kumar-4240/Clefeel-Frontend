import { useRef } from 'react';
import HeroSection from '@/sections/HeroSection';
import ProductVideoSection from '@/sections/ProductVideoSection';
import ShopPreviewSection from '@/sections/ShopPreviewSection';
import WhyChooseSection from '@/sections/WhyChooseSection';
import AboutPreviewSection from '@/sections/AboutPreviewSection';

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mainRef} className="relative">
      <HeroSection />
      <ProductVideoSection />
      <ShopPreviewSection />
      <WhyChooseSection />
      <AboutPreviewSection />
    </div>
  );
}
