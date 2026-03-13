import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { fetchProductById, adminSaveProduct, uploadImage } from '@/data/api';
import { Save, X, Plus, Trash2, ArrowLeft, Upload, Loader2, ImagePlus } from 'lucide-react';
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
    image: '',
};

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tokens } = useAuthStore();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Partial<Product>>(defaultProduct);
    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

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
        newImages[index] = { ...newImages[index], imageUrl: url };
        setFormData({ ...formData, images: newImages });
    };

    const removeImage = (index: number) => {
        const newImages = [...(formData.images || [])];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    // Cloudinary image upload handler
    const handleImageUpload = async (index: number, file: File) => {
        if (!tokens?.accessToken) {
            toast.error('You need to be logged in as admin to upload images');
            return;
        }

        console.log('[CLEFEEL] Uploading image:', file.name, 'Size:', file.size, 'Type:', file.type);
        setUploadingIndex(index);

        try {
            const result = await uploadImage(file, tokens.accessToken);
            console.log('[CLEFEEL] Upload result:', result);

            if (result) {
                updateImage(index, result.url);
                toast.success('Image uploaded to Cloudinary!');
            } else {
                toast.error('Upload failed. Check console for details.');
            }
        } catch (err: any) {
            console.error('[CLEFEEL] Upload error:', err);
            toast.error(`Upload error: ${err.message || 'Unknown error'}`);
        } finally {
            setUploadingIndex(null);
        }
    };

    // Direct file input change handler per image slot
    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File too large. Max 10MB.');
                return;
            }
            handleImageUpload(index, file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Clean images for API — strip frontend-only IDs
        const cleanImages = (formData.images || [])
            .filter(img => img.imageUrl) // Remove empty images
            .map((img, i) => ({
                imageUrl: img.imageUrl,
                sortOrder: i,
            }));

        // Clean sizes for API — strip frontend-only IDs
        const cleanSizes = (formData.sizes || []).map(s => ({
            sizeName: s.sizeName,
            price: Number(s.price),
            mrp: Number(s.mrp || 0),
            stock: Number(s.stock || 0),
        }));

        const finalData: any = {
            ...formData,
            images: cleanImages,
            sizes: cleanSizes,
            image: cleanImages[0]?.imageUrl || formData.image || '',
        };

        try {
            const res = await adminSaveProduct(finalData, tokens?.accessToken || '', !isEditing);
            console.log('[CLEFEEL] Save product result:', res);
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
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Product Name *</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="e.g. Royal Oud Extrait" />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Category *</label>
                            <input type="text" name="category" value={formData.category || ''} onChange={handleChange} required className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="e.g. Oud, Floral, Amber, Woody" />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Status *</label>
                            <select name="status" value={formData.status || 'active'} onChange={handleChange} required className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors appearance-none">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Description *</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={4} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors resize-none" />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Selling Price (₹) *</label>
                            <input type="number" name="basePrice" value={formData.basePrice || 0} onChange={handleChange} required min="0" className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">MRP (₹)</label>
                            <input type="number" name="baseMrp" value={formData.baseMrp || 0} onChange={handleChange} min="0" className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="Original price before discount" />
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6 flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="bestseller" checked={formData.bestseller || false} onChange={handleChange} className="hidden" />
                        <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${formData.bestseller ? 'bg-[#D4A24F] border-[#D4A24F]' : 'border-[#F4F1EA]/20 group-hover:border-[#D4A24F]/50'}`}>
                            {formData.bestseller && <CheckIcon className="w-3 h-3 text-[#0B0B0D]" />}
                        </div>
                        <span className="text-[#F4F1EA]/80 font-semibold group-hover:text-[#D4A24F] transition-colors">Bestseller</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="new" checked={formData.new || false} onChange={handleChange} className="hidden" />
                        <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${formData.new ? 'bg-[#D4A24F] border-[#D4A24F]' : 'border-[#F4F1EA]/20 group-hover:border-[#D4A24F]/50'}`}>
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
                            <input type="text" value={(formData.topNotes || []).join(', ')} onChange={(e) => handleArrayChange('topNotes', e.target.value)} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="e.g. Saffron, Nutmeg" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Middle Notes (comma separated)</label>
                            <input type="text" value={(formData.middleNotes || []).join(', ')} onChange={(e) => handleArrayChange('middleNotes', e.target.value)} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="e.g. Oud Wood, Patchouli" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Base Notes (comma separated)</label>
                            <input type="text" value={(formData.baseNotes || []).join(', ')} onChange={(e) => handleArrayChange('baseNotes', e.target.value)} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="e.g. Amber, Vanilla" />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Longevity</label>
                            <input type="text" name="longevity" value={formData.longevity || ''} onChange={handleChange} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="e.g. 8-12 Hours" />
                        </div>
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Projection</label>
                            <input type="text" name="projection" value={formData.projection || ''} onChange={handleChange} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" placeholder="e.g. Moderate to Strong" />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl">Product Images</h2>
                        <button type="button" onClick={addImage} className="text-[#D4A24F] flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider hover:text-[#F4F1EA] transition-colors">
                            <ImagePlus className="w-4 h-4" /> Add Image
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(formData.images || []).map((img, index) => (
                            <div key={img.id || index} className="relative border border-[#F4F1EA]/20 p-4">
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-[#0B0B0D]/80 text-[#F4F1EA]/40 hover:text-red-500 transition-colors z-10 rounded">
                                    <X className="w-4 h-4" />
                                </button>
                                {/* Image preview */}
                                <div className="aspect-square bg-[#0B0B0D] mb-4 flex items-center justify-center overflow-hidden relative">
                                    {uploadingIndex === index ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-[#D4A24F] animate-spin" />
                                            <span className="text-[#D4A24F] text-xs">Uploading to Cloudinary...</span>
                                        </div>
                                    ) : img.imageUrl ? (
                                        <img src={img.imageUrl} alt={`Product image ${index + 1}`} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-[#F4F1EA]/20">
                                            <Upload className="w-8 h-8" />
                                            <span className="text-xs">No image</span>
                                        </div>
                                    )}
                                </div>
                                {/* Upload button — each image gets its own file input */}
                                <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#D4A24F]/10 border border-[#D4A24F]/30 text-[#D4A24F] text-sm hover:bg-[#D4A24F]/20 transition-colors cursor-pointer mb-2">
                                    <Upload className="w-4 h-4" />
                                    {uploadingIndex === index ? 'Uploading...' : 'Upload File'}
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        onChange={(e) => handleFileChange(index, e)}
                                        disabled={uploadingIndex !== null}
                                        className="hidden"
                                    />
                                </label>
                                {/* Or paste URL */}
                                <input
                                    type="text"
                                    value={img.imageUrl}
                                    onChange={(e) => updateImage(index, e.target.value)}
                                    placeholder="Or paste image URL"
                                    className="w-full px-3 py-2 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors text-sm"
                                />
                            </div>
                        ))}
                        {!formData.images?.length && (
                            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center gap-3 py-8 text-[#F4F1EA]/30">
                                <ImagePlus className="w-10 h-10" />
                                <p className="text-sm">No images added. Click "Add Image" to upload product images.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sizes & Stock */}
                <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="luxury-heading text-[#F4F1EA] text-xl">Sizes & Stock</h2>
                        <button type="button" onClick={addSize} className="text-[#D4A24F] flex items-center gap-1 text-sm font-semibold uppercase tracking-wider hover:text-[#F4F1EA] transition-colors">
                            <Plus className="w-4 h-4" /> Add Size
                        </button>
                    </div>
                    <div className="space-y-4">
                        {(formData.sizes || []).map((size, index) => (
                            <div key={size.id || index} className="flex flex-col md:flex-row gap-4 items-start md:items-end border-b border-[#F4F1EA]/10 pb-4 last:border-0 last:pb-0">
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Size Name *</label>
                                    <input type="text" required value={size.sizeName} onChange={(e) => updateSize(index, 'sizeName', e.target.value)} placeholder="e.g. 50ml" className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">MRP (₹) *</label>
                                    <input type="number" required min="0" value={size.mrp} onChange={(e) => updateSize(index, 'mrp', Number(e.target.value))} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Selling (₹) *</label>
                                    <input type="number" required min="0" value={size.price} onChange={(e) => updateSize(index, 'price', Number(e.target.value))} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Stock *</label>
                                    <input type="number" required min="0" value={size.stock} onChange={(e) => updateSize(index, 'stock', Number(e.target.value))} className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors" />
                                </div>
                                <button type="button" onClick={() => removeSize(index)} className="p-3 mb-1 text-[#F4F1EA]/40 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {!formData.sizes?.length && (
                            <p className="text-[#F4F1EA]/40 text-sm">No sizes added. Add at least one size variant.</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <Link to="/admin/products" className="btn-secondary px-8">Cancel</Link>
                    <button type="submit" disabled={isSaving} className="btn-primary flex items-center justify-center gap-2 px-8 min-w-[200px]">
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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}
