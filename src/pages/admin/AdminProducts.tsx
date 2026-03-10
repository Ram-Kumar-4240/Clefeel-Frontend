import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { adminFetchProducts, adminDeleteProduct } from '@/data/api';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function AdminProducts() {
    const navigate = useNavigate();
    const { tokens } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const loadProducts = async () => {
        setIsLoading(true);
        const data = await adminFetchProducts(tokens?.accessToken || '');
        setProducts(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadProducts();
    }, [tokens]);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            const res = await adminDeleteProduct(id, tokens?.accessToken || '');
            if (res.success) {
                toast.success('Product deleted successfully');
                loadProducts();
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete product');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="luxury-heading text-[#F4F1EA] text-3xl">
                    MANAGE <span className="text-[#D4A24F]">PRODUCTS</span>
                </h1>
                <Link
                    to="/admin/products/new"
                    className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add New Product
                </Link>
            </div>

            <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F1EA]/40" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors text-sm rounded-none"
                        />
                    </div>
                    <div className="w-full md:w-64 relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F1EA]/40" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors text-sm appearance-none rounded-none"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#D4A24F] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[#F4F1EA]/10 bg-[#0B0B0D]/50 text-[#F4F1EA]/60 text-sm">
                                <th className="p-4 font-normal w-16">Image</th>
                                <th className="p-4 font-normal">Name</th>
                                <th className="p-4 font-normal">Category</th>
                                <th className="p-4 font-normal">Price (Base)</th>
                                <th className="p-4 font-normal">Sizes/Stock</th>
                                <th className="p-4 font-normal w-24">Status</th>
                                <th className="p-4 font-normal w-32 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[#F4F1EA]/40">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);

                                    return (
                                        <tr key={product.id} className="border-b border-[#F4F1EA]/5 hover:bg-[#F4F1EA]/[0.02]">
                                            <td className="p-4">
                                                <img
                                                    src={product.images[0]?.imageUrl || product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover bg-[#0B0B0D]"
                                                />
                                            </td>
                                            <td className="p-4 text-[#F4F1EA] font-semibold">{product.name}</td>
                                            <td className="p-4 text-[#F4F1EA]/60 text-sm">{product.category}</td>
                                            <td className="p-4 text-[#D4A24F] font-semibold">₹{product.basePrice.toLocaleString()}</td>
                                            <td className="p-4">
                                                <p className={`text-sm ${totalStock === 0 ? 'text-red-500 font-semibold' : 'text-[#F4F1EA]/60'}`}>
                                                    {product.sizes.length} sizes ({totalStock} items)
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs uppercase font-semibold tracking-wider ${product.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                                                        className="p-2 text-[#F4F1EA]/40 hover:text-[#D4A24F] transition-colors"
                                                        aria-label="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-2 text-[#F4F1EA]/40 hover:text-red-500 transition-colors"
                                                        aria-label="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
