import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Mail, Phone, MessageCircle, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@clefeel.com',
    link: 'mailto:support@clefeel.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+91 98765 43210',
    link: 'tel:+919876543210',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: 'Chat with us',
    link: 'https://wa.me/919876543210',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div ref={contentRef} className="w-full px-6 lg:px-[6vw]" style={{ opacity: 0 }}>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="luxury-heading text-[#F4F1EA] text-3xl lg:text-5xl mb-4">
            GET IN <span className="text-[#D4A24F]">TOUCH</span>
          </h1>
          <p className="text-[#F4F1EA]/60 max-w-xl mx-auto">
            Have a question or need assistance? We&apos;re here to help you find your perfect scent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <a
                    key={index}
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-6 bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 hover:border-[#D4A24F]/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#D4A24F]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#D4A24F]" />
                    </div>
                    <div>
                      <p className="luxury-label text-[#F4F1EA]/40 mb-1">{method.title}</p>
                      <p className="text-[#F4F1EA] font-semibold">{method.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Business Hours */}
            <div className="mt-8 p-6 bg-[#F4F1EA]/5 border border-[#F4F1EA]/10">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#D4A24F]" />
                <p className="text-[#F4F1EA] font-semibold">Business Hours</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#F4F1EA]/60">Monday - Friday</span>
                  <span className="text-[#F4F1EA]">10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F4F1EA]/60">Saturday</span>
                  <span className="text-[#F4F1EA]">11:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F4F1EA]/60">Sunday</span>
                  <span className="text-[#F4F1EA]/40">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8">
              <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">
                SEND US A <span className="text-[#D4A24F]">MESSAGE</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div className="mb-8">
                <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
