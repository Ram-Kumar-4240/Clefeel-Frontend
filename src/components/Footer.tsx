import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    { name: 'Privacy Policy', path: '/policies/privacy' },
    { name: 'Terms & Conditions', path: '/policies/terms' },
    { name: 'Shipping Policy', path: '/policies/shipping' },
    { name: 'Return & Refund', path: '/policies/returns' },
  ];

  const quickLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/shop?tab=collections' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-[#0B0B0D] border-t border-[#F4F1EA]/10">
      {/* Main Footer */}
      <div className="w-full px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="text-3xl font-bold tracking-tight text-[#F4F1EA]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              CLEFEEL
            </Link>
            <p className="mt-4 text-[#F4F1EA]/60 text-sm leading-relaxed">
              Premium luxury fragrances crafted for those who leave a lasting impression.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="mailto:support@clefeel.com"
                className="w-10 h-10 rounded-full border border-[#F4F1EA]/20 flex items-center justify-center text-[#F4F1EA]/60 hover:text-[#D4A24F] hover:border-[#D4A24F] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+919876543210"
                className="w-10 h-10 rounded-full border border-[#F4F1EA]/20 flex items-center justify-center text-[#F4F1EA]/60 hover:text-[#D4A24F] hover:border-[#D4A24F] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#F4F1EA]/20 flex items-center justify-center text-[#F4F1EA]/60 hover:text-[#D4A24F] hover:border-[#D4A24F] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="luxury-label text-xs text-[#F4F1EA]/40 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#F4F1EA]/60 hover:text-[#D4A24F] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="luxury-label text-xs text-[#F4F1EA]/40 mb-6">Policies</h4>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#F4F1EA]/60 hover:text-[#D4A24F] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="luxury-label text-xs text-[#F4F1EA]/40 mb-6">Newsletter</h4>
            <p className="text-[#F4F1EA]/60 text-sm mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 text-sm focus:outline-none focus:border-[#D4A24F] transition-colors"
              />
              <button type="submit" className="btn-primary w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#F4F1EA]/10">
        <div className="w-full px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#F4F1EA]/40 text-xs">
              © {currentYear} CLEFEEL. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[#F4F1EA]/40 text-xs">Free shipping over ₹4,999</span>
              <span className="text-[#F4F1EA]/40 text-xs">COD Available</span>
              <span className="text-[#F4F1EA]/40 text-xs">Pan India Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
