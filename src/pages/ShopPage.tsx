import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products, collections } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { Plus, Filter, ChevronDown, Grid3X3, List } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Oud', 'Floral', 'Amber', 'Fresh', 'Spicy'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'bestseller', label: 'Best Sellers' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCollection, setActiveCollection] = useState<string | null>(
    searchParams.get('collection')
  );
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  // Filter and sort products
  let filteredProducts = products;
  
  if (activeCategory !== 'All') {
    filteredProducts = filteredProducts.filter((p) => p.category === activeCategory);
  }
  
  if (activeCollection) {
    const collection = collections.find((c) => c.id === activeCollection);
    if (collection) {
      filteredProducts = filteredProducts.filter((p) => p.collection === collection.name);
    }
  }

  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
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
    const collection = searchParams.get('collection');
    const tab = searchParams.get('tab');
    if (collection) {
      setActiveCollection(collection);
    }
    if (tab === 'collections') {
      setIsFilterOpen(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      const cards = gridRef.current?.querySelectorAll('.product-card');
      if (cards) {
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
              start: 'top 80%',
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [filteredProducts]);

  const clearFilters = () => {
    setActiveCategory('All');
    setActiveCollection(null);
    setSearchParams({});
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
      <div className="w-full px-6 lg:px-[6vw]">
        {/* Header */}
        <div ref={headerRef} className="mb-10" style={{ opacity: 0 }}>
          <h1 className="luxury-heading text-[#F4F1EA] text-4xl lg:text-5xl mb-4">
            {activeCollection 
              ? collections.find(c => c.id === activeCollection)?.name || 'Shop'
              : 'SHOP ALL'
            }
          </h1>
          <p className="text-[#F4F1EA]/60 max-w-xl">
            Discover our collection of premium fragrances crafted for the modern individual.
          </p>
        </div>

        {/* Collections Banner */}
        {!activeCollection && (
          <div className="mb-10 overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => {
                    setActiveCollection(collection.id);
                    setSearchParams({ collection: collection.id });
                  }}
                  className="relative w-64 h-32 overflow-hidden group"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/90 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-[#F4F1EA] font-semibold text-sm">{collection.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#F4F1EA]/10">
          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#F4F1EA]/20 text-[#F4F1EA]/60 hover:border-[#D4A24F] hover:text-[#D4A24F] transition-colors lg:hidden">
                  <Filter className="w-4 h-4" />
                  <span className="text-xs uppercase">Filters</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0B0B0D] border-[#F4F1EA]/10">
                <DialogHeader>
                  <DialogTitle className="text-[#F4F1EA]">Filters</DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mt-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                        activeCategory === cat
                          ? 'border-[#D4A24F] text-[#D4A24F]'
                          : 'border-[#F4F1EA]/20 text-[#F4F1EA]/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="hidden lg:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                    activeCategory === cat
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
            {(activeCategory !== 'All' || activeCollection) && (
              <button
                onClick={clearFilters}
                className="text-[#D4A24F] text-xs uppercase tracking-wider hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-[#F4F1EA]/40 text-sm mb-6">
          Showing {filteredProducts.length} products
        </p>

        {/* Product Grid */}
        <div
          ref={gridRef}
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1'
          }`}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`product-card group ${viewMode === 'list' ? 'flex gap-6' : ''}`}
              style={{ opacity: 0 }}
            >
              {/* Image */}
              <Link
                to={`/product/${product.id}`}
                className={`relative overflow-hidden bg-[#F4F1EA]/5 ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square mb-4'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                
                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className={`absolute bg-[#D4A24F] text-[#0B0B0D] flex items-center justify-center gap-2 transition-transform duration-300 ${
                    viewMode === 'list'
                      ? 'bottom-3 right-3 w-10 h-10 rounded-full'
                      : 'bottom-0 left-0 right-0 py-3 translate-y-full group-hover:translate-y-0'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  {viewMode === 'grid' && (
                    <span className="text-xs font-semibold uppercase tracking-wider">Add to Cart</span>
                  )}
                </button>
              </Link>

              {/* Info */}
              <div className={viewMode === 'list' ? 'flex-1 py-2' : ''}>
                <h3 className="text-[#F4F1EA] font-semibold text-sm mb-1 group-hover:text-[#D4A24F] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#F4F1EA]/40 text-xs mb-2">{product.size}</p>
                {viewMode === 'list' && (
                  <p className="text-[#F4F1EA]/60 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <p className="text-[#D4A24F] font-semibold">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
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
