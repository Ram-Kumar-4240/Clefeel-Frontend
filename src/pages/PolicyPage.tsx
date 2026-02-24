import { useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft } from 'lucide-react';

const policies: Record<string, { title: string; content: React.ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    content: (
      <>
        <p className="mb-4">
          At CLEFEEL, we value your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, and safeguard your data.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Information We Collect</h3>
        <p className="mb-4">
          We collect information you provide directly to us, including your name, email address, 
          phone number, shipping address, and payment information when you make a purchase.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">How We Use Your Information</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your orders and account</li>
          <li>Send you promotional emails (with your consent)</li>
          <li>Improve our products and services</li>
          <li>Prevent fraud and ensure security</li>
        </ul>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Data Security</h3>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information. 
          All payment transactions are encrypted using SSL technology.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Your Rights</h3>
        <p className="mb-4">
          You have the right to access, correct, or delete your personal information. 
          Contact us at support@clefeel.com for any privacy-related requests.
        </p>
      </>
    ),
  },
  terms: {
    title: 'Terms & Conditions',
    content: (
      <>
        <p className="mb-4">
          By accessing and using the CLEFEEL website, you agree to be bound by these Terms and Conditions. 
          Please read them carefully before making a purchase.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Product Information</h3>
        <p className="mb-4">
          We strive to display our products and their colors as accurately as possible. 
          However, actual colors may vary depending on your monitor and device settings.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Pricing and Payment</h3>
        <p className="mb-4">
          All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. 
          We accept payments via UPI, Credit/Debit cards, and Cash on Delivery.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Order Acceptance</h3>
        <p className="mb-4">
          Your receipt of an order confirmation does not constitute our acceptance of your order. 
          We reserve the right to refuse service to anyone for any reason at any time.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Intellectual Property</h3>
        <p className="mb-4">
          All content on this website, including text, graphics, logos, and images, 
          is the property of CLEFEEL and is protected by copyright laws.
        </p>
      </>
    ),
  },
  shipping: {
    title: 'Shipping Policy',
    content: (
      <>
        <p className="mb-4">
          CLEFEEL offers pan-India delivery with multiple shipping options to ensure 
          your order reaches you safely and on time.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Shipping Methods</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Standard Delivery: 3-5 business days</li>
          <li>Express Delivery: 1-2 business days (additional charges apply)</li>
        </ul>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Free Shipping</h3>
        <p className="mb-4">
          We offer free standard shipping on all orders above ₹4,999. 
          For orders below this amount, a shipping fee of ₹99 will be charged.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Order Processing</h3>
        <p className="mb-4">
          Orders are processed within 24 hours of placement. You will receive a confirmation 
          email with tracking details once your order is shipped.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Delivery Areas</h3>
        <p className="mb-4">
          We currently deliver to all major cities and towns across India. 
          For remote locations, delivery may take an additional 2-3 business days.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Tracking</h3>
        <p className="mb-4">
          Once your order is shipped, you will receive an SMS and email with tracking information. 
          You can also track your order in your account dashboard.
        </p>
      </>
    ),
  },
  returns: {
    title: 'Return & Refund Policy',
    content: (
      <>
        <p className="mb-4">
          At CLEFEEL, we take pride in the quality of our products. Due to the nature of our products, 
          we have a strict no-return policy for opened or used items.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">No Return Policy</h3>
        <p className="mb-4">
          For hygiene and safety reasons, we do not accept returns on perfumes and fragrances 
          once the seal is broken or the product has been used.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Damaged or Defective Products</h3>
        <p className="mb-4">
          If you receive a damaged or defective product, please contact us within 24 hours of delivery 
          with photos of the damage. We will arrange a replacement or refund after verification.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Wrong Product Delivered</h3>
        <p className="mb-4">
          If you receive a product different from what you ordered, please contact us immediately. 
          We will arrange for the correct product to be sent and the wrong product to be picked up.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Refund Process</h3>
        <p className="mb-4">
          Approved refunds will be processed within 5-7 business days. The refund will be credited 
          to the original payment method used for the purchase.
        </p>
        
        <h3 className="text-[#F4F1EA] font-semibold text-lg mb-2 mt-6">Contact Us</h3>
        <p className="mb-4">
          For any issues with your order, please contact our customer support at 
          support@clefeel.com or call us at +91 98765 43210.
        </p>
      </>
    ),
  },
};

export default function PolicyPage() {
  const { type } = useParams<{ type: string }>();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const policy = type && policies[type] ? policies[type] : policies.privacy;

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [type]);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div ref={contentRef} className="w-full max-w-3xl mx-auto px-6" style={{ opacity: 0 }}>
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#F4F1EA]/60 hover:text-[#D4A24F] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-wider">Back to Home</span>
        </Link>

        {/* Title */}
        <h1 className="luxury-heading text-[#F4F1EA] text-3xl lg:text-4xl mb-8">
          {policy.title.split(' ').map((word, i, arr) => (
            <span key={i}>
              {i === arr.length - 1 ? <span className="text-[#D4A24F]">{word}</span> : word}
              {i < arr.length - 1 && ' '}
            </span>
          ))}
        </h1>

        {/* Content */}
        <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8 lg:p-10 text-[#F4F1EA]/70 leading-relaxed">
          {policy.content}
        </div>

        {/* Last Updated */}
        <p className="text-[#F4F1EA]/40 text-sm text-center mt-8">
          Last updated: February 2026
        </p>
      </div>
    </div>
  );
}
