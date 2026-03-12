import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    X
} from 'lucide-react';

export default function AdminLayout() {
    const { user, isLoggedIn, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoggedIn || user?.role !== 'admin') {
            navigate('/account');
        }
    }, [isLoggedIn, user, navigate]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    if (!isLoggedIn || user?.role !== 'admin') return null;

    const isActive = (path: string) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navLinks = [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { to: '/admin/products', label: 'Products', icon: Package },
        { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    ];

    const SidebarContent = () => (
        <>
            <div className="px-6 mb-8">
                <p className="text-[#D4A24F] text-xs font-bold tracking-widest uppercase mb-1">
                    Admin Portal
                </p>
                <h2 className="luxury-heading text-[#F4F1EA] text-xl">CLEFEEL</h2>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navLinks.map(({ to, label, icon: Icon, exact }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                            (exact ? isActive(to) && location.pathname === to : isActive(to))
                                ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                                : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA] hover:bg-[#F4F1EA]/5'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{label}</span>
                    </Link>
                ))}

                {/* Settings stub */}
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded text-[#F4F1EA]/60 hover:text-[#F4F1EA] hover:bg-[#F4F1EA]/5 transition-colors text-left cursor-not-allowed opacity-50">
                    <Settings className="w-5 h-5" />
                    <span className="font-semibold text-sm">Settings</span>
                </button>
            </nav>

            <div className="px-4 mt-auto">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded text-[#F4F1EA]/60 hover:text-[#D4A24F] hover:bg-[#F4F1EA]/5 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-semibold text-sm">Back to Store</span>
                </Link>
                <button
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors mt-2 text-left"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-sm">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#0B0B0D] flex">
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#F4F1EA]/5 border-r border-[#F4F1EA]/10 pt-24 pb-8 flex-col z-40 hidden lg:flex">
                <SidebarContent />
            </aside>

            {/* Mobile Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#0B0B0D]/95 backdrop-blur-sm border-b border-[#F4F1EA]/10 flex items-center justify-between px-4 z-50 lg:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="w-10 h-10 flex items-center justify-center text-[#F4F1EA]/70 hover:text-[#D4A24F] transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <p className="text-[#D4A24F] text-[9px] font-bold tracking-widest uppercase">Admin</p>
                    <p className="luxury-heading text-[#F4F1EA] text-sm">CLEFEEL</p>
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-[#0B0B0D] border-r border-[#F4F1EA]/10 pt-6 pb-8 flex flex-col z-[70] lg:hidden transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Close button */}
                <div className="flex justify-end px-4 mb-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-10 h-10 flex items-center justify-center text-[#F4F1EA]/60 hover:text-[#F4F1EA] transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 pt-20 lg:pt-24 pb-16 px-4 sm:px-6 lg:px-12 min-h-screen relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
