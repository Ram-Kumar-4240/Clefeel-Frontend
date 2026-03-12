import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchProducts } from '@/data/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { Filter, ChevronDown, Grid3X3, List, Heart } from 'lucide-react';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Oud', 'Floral', 'Amber', 'Fresh', 'Spicy'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'bestseller', label: 'Best Sellers' },
];

export default function ShopPage() {
  const [, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    let cancelled = false;
    fetchProducts().then((data) => {
      if (!cancelled) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  // Filter and sort products
  let filteredProducts = products;

  if (activeCategory !== 'All') {
    filteredProducts = filteredProducts.filter((p) => p.category === activeCategory);
  }

  switch (sortBy) {
    case 'price-low':
      filteredProducts = [...filteredProducts].sort((a, b) => a.basePrice - b.basePrice);
      break;
    case 'price-high':
      filteredProducts = [...filteredProducts].sort((a, b) => b.basePrice - a.basePrice);
      break;
    case 'bestseller':
      filteredProducts = [...filteredProducts].sort((a, b) =>
        (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0)
      );
      break;
    default:
      filteredProducts = [...filteredProducts].sort((a, b) =>
        (b.new ? 1 : 0) - (a.new ? 1 : 0)
      );
  }

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [filteredProducts, isLoading]);

  const clearFilters = () => {
    setActiveCategory('All');
    setSearchParams({});
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Header */}
        <div ref={headerRef} className="mb-10" style={{ opacity: 0 }}>
          <h1 className="luxury-heading text-[#F4F1EA] text-4xl lg:text-5xl mb-4">
            SHOP <span className="text-[#D4A24F]">ALL</span>
          </h1>
          <p className="text-[#F4F1EA]/60 max-w-xl">
            Discover our premium fragrances crafted for the modern individual.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#F4F1EA]/10">
          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#F4F1EA]/20 text-[#F4F1EA]/60 hover:border-[#D4A24F] hover:text-[#D4A24F] transition-colors lg:hidden"
            >
              <Filter className="w-4 h-4" />
              <span className="text-xs uppercase">Filters</span>
            </button>

            <div className="hidden lg:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${activeCategory === cat
                    ? 'border-[#D4A24F] text-[#D4A24F]'
                    : 'border-[#F4F1EA]/20 text-[#F4F1EA]/60 hover:border-[#F4F1EA]/40'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border border-[#F4F1EA]/20 text-[#F4F1EA]/60 px-4 py-2 pr-10 text-xs uppercase tracking-wider focus:outline-none focus:border-[#D4A24F] cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0B0B0D]">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F1EA]/40 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-[#F4F1EA]/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#D4A24F] text-[#0B0B0D]' : 'text-[#F4F1EA]/60'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#D4A24F] text-[#0B0B0D]' : 'text-[#F4F1EA]/60'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {activeCategory !== 'All' && (
              <button
                onClick={clearFilters}
                className="text-[#D4A24F] text-xs uppercase tracking-wider hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {mobileFilterOpen && (
          <div className="flex flex-wrap gap-2 mb-6 lg:hidden">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setMobileFilterOpen(false); }}
                className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${activeCategory === cat
                  ? 'border-[#D4A24F] text-[#D4A24F]'
                  : 'border-[#F4F1EA]/20 text-[#F4F1EA]/60'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <p className="text-[#F4F1EA]/40 text-sm mb-6">
          Showing {filteredProducts.length} products
        </p>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-[#F4F1EA]/5 mb-4" />
                <div className="h-4 bg-[#F4F1EA]/5 w-3/4 mb-2" />
                <div className="h-3 bg-[#F4F1EA]/5 w-1/4 mb-2" />
                <div className="h-4 bg-[#F4F1EA]/5 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          /* Product Grid */
          <div
            ref={gridRef}
            className={`grid gap-6 lg:gap-8 ${viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1'
              }`}
          >
            {filteredProducts.map((product) => {
              const isLiked = wishlistItems.some((item) => item.id === product.id);
              const defaultSize = product.sizes[0];

              return (
                <div
                  key={product.id}
                  className={`product-card group ${viewMode === 'list' ? 'flex gap-6' : ''}`}
                  style={{ opacity: 0 }}
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className={`relative overflow-hidden bg-[#F4F1EA]/5 block ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-[4/5] mb-4'
                      }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {product.bestseller && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#D4A24F] text-[#0B0B0D] text-xs font-semibold uppercase">
                        Bestseller
                      </span>
                    )}
                    {product.new && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#F4F1EA] text-[#0B0B0D] text-xs font-semibold uppercase">
                        New
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-[#0B0B0D]/60 backdrop-blur-sm flex items-center justify-center rounded-full hover:bg-[#0B0B0D]/80 transition-colors z-10"
                      aria-label={`Toggle wishlist for ${product.name}`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${isLiked
                          ? 'text-red-500 fill-red-500'
                          : 'text-[#F4F1EA]/80'
                          }`}
                      />
                    </button>

                    {/* Hover CTA */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                      <span className="w-full block text-center py-3 bg-[#0B0B0D]/80 backdrop-blur-md border border-[#D4A24F]/30 text-[#F4F1EA] text-xs uppercase tracking-wider font-semibold">
                        View Details
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className={viewMode === 'list' ? 'flex-1 py-2' : ''}>
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="text-[#F4F1EA] font-semibold text-sm mb-1 group-hover:text-[#D4A24F] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[#F4F1EA]/40 text-xs mb-2">
                      {product.sizes.map(s => s.sizeName).join(' / ')}
                    </p>
                    {viewMode === 'list' && (
                      <p className="text-[#F4F1EA]/60 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <p className="text-[#D4A24F] font-semibold">
                      ₹{product.basePrice.toLocaleString()}
                      {product.baseMrp > product.basePrice && (
                        <span className="text-[#F4F1EA]/30 font-normal text-xs line-through ml-2">
                          ₹{product.baseMrp.toLocaleString()}
                        </span>
                      )}
                      {defaultSize && product.sizes.length > 1 && (
                        <span className="text-[#F4F1EA]/30 font-normal text-xs ml-2">onwards</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#F4F1EA]/60 text-lg mb-4">No products found</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
