import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Heart, Trash2, Plus } from 'lucide-react';

export default function WishlistPage() {
    const items = useWishlistStore((state) => state.items);
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
    const addToCart = useCartStore((state) => state.addToCart);
    const pageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );

            const cards = gridRef.current?.querySelectorAll('.wishlist-card');
            if (cards && cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: 'power3.out',
                    }
                );
            }
        }, pageRef);

        return () => ctx.revert();
    }, [items]);

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0B0B0D] pt-24 pb-16">
            <div className="w-full px-6 lg:px-[6vw]">
                {/* Header */}
                <div ref={headerRef} className="mb-10" style={{ opacity: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-8 h-8 text-[#D4A24F]" />
                        <h1 className="luxury-heading text-[#F4F1EA] text-4xl lg:text-5xl">
                            WISHLIST
                        </h1>
                    </div>
                    <p className="text-[#F4F1EA]/60 max-w-xl">
                        {items.length > 0
                            ? `You have ${items.length} item${items.length > 1 ? 's' : ''} in your wishlist.`
                            : 'Your wishlist is empty. Start exploring our fragrances.'}
                    </p>
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 text-[#F4F1EA]/10 mx-auto mb-6" />
                        <p className="text-[#F4F1EA]/60 text-lg mb-2">No saved items yet</p>
                        <p className="text-[#F4F1EA]/40 text-sm mb-8">
                            Browse our shop and tap the heart icon to save items you love.
                        </p>
                        <Link to="/shop" className="btn-primary inline-block">
                            Explore Shop
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {items.map((product) => (
                            <div
                                key={product.id}
                                className="wishlist-card group"
                                style={{ opacity: 0 }}
                            >
                                {/* Image */}
                                <Link
                                    to={`/product/${product.id}`}
                                    className="block relative overflow-hidden aspect-square mb-4 bg-[#F4F1EA]/5"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Remove from Wishlist */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(product.id);
                                        }}
                                        className="absolute top-3 right-3 w-9 h-9 bg-[#0B0B0D]/60 backdrop-blur-sm flex items-center justify-center rounded-full hover:bg-red-900/60 transition-colors"
                                        aria-label={`Remove ${product.name} from wishlist`}
                                    >
                                        <Trash2 className="w-4 h-4 text-[#F4F1EA]/80" />
                                    </button>

                                    {/* Quick Add Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                        }}
                                        className="absolute bottom-0 left-0 right-0 bg-[#D4A24F] text-[#0B0B0D] py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">Add to Cart</span>
                                    </button>
                                </Link>

                                {/* Info */}
                                <div>
                                    <h3 className="text-[#F4F1EA] font-semibold text-sm mb-1 group-hover:text-[#D4A24F] transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-[#F4F1EA]/40 text-xs mb-2">{product.size}</p>
                                    <p className="text-[#D4A24F] font-semibold">
                                        ₹{product.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
