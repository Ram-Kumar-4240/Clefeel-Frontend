import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/shop?tab=collections' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return location.pathname === path.split('?')[0];
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B0B0D]/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-[#F4F1EA] hover:text-[#D4A24F] transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              CLEFEEL
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`luxury-label text-xs transition-colors ${
                    isActive(link.path)
                      ? 'text-[#D4A24F]'
                      : 'text-[#F4F1EA]/80 hover:text-[#F4F1EA]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              <button
                className="text-[#F4F1EA]/80 hover:text-[#F4F1EA] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/account"
                className={`hidden md:block transition-colors ${
                  location.pathname === '/account'
                    ? 'text-[#D4A24F]'
                    : 'text-[#F4F1EA]/80 hover:text-[#F4F1EA]'
                }`}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                to="/cart"
                className="relative text-[#F4F1EA]/80 hover:text-[#F4F1EA] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D4A24F] text-[#0B0B0D] text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-[#F4F1EA]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0B0B0D]/98 backdrop-blur-lg transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="luxury-heading text-3xl text-[#F4F1EA] hover:text-[#D4A24F] transition-colors"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/account"
            onClick={() => setIsMobileMenuOpen(false)}
            className="luxury-heading text-3xl text-[#F4F1EA] hover:text-[#D4A24F] transition-colors mt-4"
          >
            Account
          </Link>
        </div>
      </div>
    </>
  );
}
