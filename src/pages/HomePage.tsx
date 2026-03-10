import { useRef } from 'react';
import HeroSection from '@/sections/HeroSection';
import WhyChooseSection from '@/sections/WhyChooseSection';
import ShopPreviewSection from '@/sections/ShopPreviewSection';
import AboutPreviewSection from '@/sections/AboutPreviewSection';

export default function HomePage() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mainRef} className="relative">
      <HeroSection />
      <WhyChooseSection />
      <ShopPreviewSection />
      <AboutPreviewSection />
    </div>
  );
}
