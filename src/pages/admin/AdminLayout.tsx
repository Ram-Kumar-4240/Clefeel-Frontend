import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    ChevronLeft
} from 'lucide-react';

export default function AdminLayout() {
    const { user, isLoggedIn, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Redirect if not logged in or not admin
        if (!isLoggedIn || user?.role !== 'admin') {
            navigate('/account');
        }
    }, [isLoggedIn, user, navigate]);

    if (!isLoggedIn || user?.role !== 'admin') return null;

    const isActive = (path: string) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-[#0B0B0D] flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#F4F1EA]/5 border-r border-[#F4F1EA]/10 pt-24 pb-8 flex flex-col z-40 hidden lg:flex">
                <div className="px-6 mb-8">
                    <p className="text-[#D4A24F] text-xs font-bold tracking-widest uppercase mb-1">
                        Admin Portal
                    </p>
                    <h2 className="luxury-heading text-[#F4F1EA] text-xl">CLEFEEL</h2>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive('/admin') && location.pathname === '/admin'
                                ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                                : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA] hover:bg-[#F4F1EA]/5'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-semibold text-sm">Dashboard</span>
                    </Link>

                    <Link
                        to="/admin/products"
                        className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive('/admin/products')
                                ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                                : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA] hover:bg-[#F4F1EA]/5'
                            }`}
                    >
                        <Package className="w-5 h-5" />
                        <span className="font-semibold text-sm">Products</span>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive('/admin/orders')
                                ? 'bg-[#D4A24F]/10 text-[#D4A24F]'
                                : 'text-[#F4F1EA]/60 hover:text-[#F4F1EA] hover:bg-[#F4F1EA]/5'
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-semibold text-sm">Orders</span>
                    </Link>

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
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 pt-24 pb-16 px-6 lg:px-12 min-h-screen relative z-10">
                <Outlet />
            </main>
        </div>
    );
}
