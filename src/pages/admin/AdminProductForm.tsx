import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { fetchProductById, adminSaveProduct } from '@/data/api';
import { Save, X, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, ProductSize } from '@/types';

const defaultProduct: Partial<Product> = {
    name: '',
    description: '',
    basePrice: 0,
    baseMrp: 0,
    category: '',
    status: 'active',
    images: [],
    sizes: [],
    topNotes: [],
    middleNotes: [],
    baseNotes: [],
    longevity: '',
    projection: '',
    bestseller: false,
    new: false,
    image: '', // Legacy fallback
};

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tokens } = useAuthStore();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Partial<Product>>(defaultProduct);
    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditing && id) {
            const loadData = async () => {
                const data = await fetchProductById(id);
                if (data) {
                    setFormData(data);
                } else {
                    toast.error('Product not found');
                    navigate('/admin/products');
                }
                setIsLoading(false);
            };
            loadData();
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else if (name === 'basePrice' || name === 'baseMrp') {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleArrayChange = (name: keyof Product, value: string) => {
        // split by comma, trim spaces
        const array = value.split(',').map(s => s.trim()).filter(Boolean);
        setFormData({ ...formData, [name]: array });
    };

    const addSize = () => {
        setFormData({
            ...formData,
            sizes: [...(formData.sizes || []), { id: `size-${Date.now()}`, sizeName: '', price: 0, mrp: 0, stock: 0 }]
        });
    };

    const updateSize = (index: number, field: keyof ProductSize, value: string | number) => {
        const newSizes = [...(formData.sizes || [])];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setFormData({ ...formData, sizes: newSizes });
    };

    const removeSize = (index: number) => {
        const newSizes = [...(formData.sizes || [])];
        newSizes.splice(index, 1);
        setFormData({ ...formData, sizes: newSizes });
    };

    const addImage = () => {
        setFormData({
            ...formData,
            images: [...(formData.images || []), { id: `img-${Date.now()}`, imageUrl: '', sortOrder: formData.images?.length || 0 }]
        });
    };

    const updateImage = (index: number, url: string) => {
        const newImages = [...(formData.images || [])];
        newImages[index].imageUrl = url;
        setFormData({ ...formData, images: newImages });
    };

    const removeImage = (index: number) => {
        const newImages = [...(formData.images || [])];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Ensure legacy image matches first image
        const finalData = {
            ...formData,
            image: formData.images?.[0]?.imageUrl || formData.image
        };

        try {
            const res = await adminSaveProduct(finalData, tokens?.accessToken || '', !isEditing);
            if (res.success) {
                toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
                navigate('/admin/products');
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to save product');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#D4A24F] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/products" className="p-2 text-[#F4F1EA]/60 hover:text-[#D4A24F] transition-colors -ml-2">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="luxury-heading text-[#F4F1EA] text-3xl">
                    {isEditing ? (
                        <>EDIT <span className="text-[#D4A24F]">PRODUCT</span></>
                    ) : (
                        <>ADD NEW <span className="text-[#D4A24F]">PRODUCT</span></>
                    )}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
                {/* Basic Info */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                    <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">Basic Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Category *</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category || ''}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="e.g. Oud, Floral, Amber"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors resize-none"
                            />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Base Selling Price (₹) *</label>
                            <input
                                type="number"
                                name="basePrice"
                                value={formData.basePrice || 0}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Base MRP (₹) *</label>
                            <input
                                type="number"
                                name="baseMrp"
                                value={formData.baseMrp || 0}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="Original MRP before discount"
                            />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Status *</label>
                            <select
                                name="status"
                                value={formData.status || 'active'}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors appearance-none"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="bestseller"
                            checked={formData.bestseller || false}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${formData.bestseller ? 'bg-[#D4A24F] border-[#D4A24F]' : 'border-[#F4F1EA]/20 group-hover:border-[#D4A24F]/50'
                            }`}>
                            {formData.bestseller && <CheckIcon className="w-3 h-3 text-[#0B0B0D]" />}
                        </div>
                        <span className="text-[#F4F1EA]/80 font-semibold group-hover:text-[#D4A24F] transition-colors">Bestseller</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="new"
                            checked={formData.new || false}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${formData.new ? 'bg-[#D4A24F] border-[#D4A24F]' : 'border-[#F4F1EA]/20 group-hover:border-[#D4A24F]/50'
                            }`}>
                            {formData.new && <CheckIcon className="w-3 h-3 text-[#0B0B0D]" />}
                        </div>
                        <span className="text-[#F4F1EA]/80 font-semibold group-hover:text-[#D4A24F] transition-colors">New Arrival</span>
                    </label>
                </div>

                {/* Olfactory Profile */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                    <h2 className="luxury-heading text-[#F4F1EA] text-xl mb-6">Olfactory Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Top Notes (comma separated)</label>
                            <input
                                type="text"
                                value={(formData.topNotes || []).join(', ')}
                                onChange={(e) => handleArrayChange('topNotes', e.target.value)}
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="e.g. Saffron, Nutmeg"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Middle Notes (comma separated)</label>
                            <input
                                type="text"
                                value={(formData.middleNotes || []).join(', ')}
                                onChange={(e) => handleArrayChange('middleNotes', e.target.value)}
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="e.g. Oud Wood, Patchouli"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Base Notes (comma separated)</label>
                            <input
                                type="text"
                                value={(formData.baseNotes || []).join(', ')}
                                onChange={(e) => handleArrayChange('baseNotes', e.target.value)}
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="e.g. Amber, Vanilla"
                            />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Longevity</label>
                            <input
                                type="text"
                                name="longevity"
                                value={formData.longevity || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="e.g. 8-12 Hours"
                            />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Projection</label>
                            <input
                                type="text"
                                name="projection"
                                value={formData.projection || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="e.g. Moderate to Strong"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl">Images</h2>
                        <button type="button" onClick={addImage} className="text-[#D4A24F] flex items-center gap-1 text-sm font-semibold uppercase tracking-wider hover:text-[#F4F1EA] transition-colors">
                            <Plus className="w-4 h-4" /> Add Image
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(formData.images || []).map((img, index) => (
                            <div key={img.id} className="relative border border-[#F4F1EA]/20 p-4">
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 text-[#F4F1EA]/40 hover:text-red-500 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="aspect-square bg-[#0B0B0D] mb-4 flex items-center justify-center overflow-hidden">
                                    {img.imageUrl ? (
                                        <img src={img.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[#F4F1EA]/20 text-xs text-center px-4">Image preview</span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={img.imageUrl}
                                    onChange={(e) => updateImage(index, e.target.value)}
                                    placeholder="Image URL (e.g. /product.jpg)"
                                    className="w-full px-3 py-2 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors text-sm"
                                />
                            </div>
                        ))}
                        {!formData.images?.length && (
                            <p className="text-[#F4F1EA]/40 text-sm md:col-span-2 lg:col-span-3">No images added. Please add at least one image.</p>
                        )}
                    </div>
                </div>

                {/* Sizes & Pricing */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl">Sizes & Stock</h2>
                        <button type="button" onClick={addSize} className="text-[#D4A24F] flex items-center gap-1 text-sm font-semibold uppercase tracking-wider hover:text-[#F4F1EA] transition-colors">
                            <Plus className="w-4 h-4" /> Add Size
                        </button>
                    </div>

                    <div className="space-y-4">
                        {(formData.sizes || []).map((size, index) => (
                            <div key={size.id} className="flex flex-col md:flex-row gap-4 items-start md:items-end border-b border-[#F4F1EA]/10 pb-4 last:border-0 last:pb-0">
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Size Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={size.sizeName}
                                        onChange={(e) => updateSize(index, 'sizeName', e.target.value)}
                                        placeholder="e.g. 50ml"
                                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">MRP (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={size.mrp}
                                        onChange={(e) => updateSize(index, 'mrp', Number(e.target.value))}
                                        placeholder="Original MRP"
                                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Selling Price (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={size.price}
                                        onChange={(e) => updateSize(index, 'price', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                    />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Stock *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={size.stock}
                                        onChange={(e) => updateSize(index, 'stock', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                    />
                                </div>
                                <button type="button" onClick={() => removeSize(index)} className="p-3 mb-1 text-[#F4F1EA]/40 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {!formData.sizes?.length && (
                            <p className="text-[#F4F1EA]/40 text-sm">No sizes added. Please add at least one.</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <Link
                        to="/admin/products"
                        className="btn-secondary px-8"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary flex items-center justify-center gap-2 px-8 min-w-[200px]"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><Save className="w-5 h-5" /> {isEditing ? 'Update Product' : 'Save Product'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Simple Icon for checkbox
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}
