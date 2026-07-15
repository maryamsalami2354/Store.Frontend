// src/components/seller/sellerProducts/AddProductModal.jsx
import React, { useState, useRef } from 'react';
import {
    X, Save, Upload, Trash2, Plus, ChevronDown, ChevronUp
} from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const TABS = [
    { id: 'basic', label: 'اطلاعات پایه' },
    { id: 'media', label: 'تصاویر و گالری' },
    { id: 'seo', label: 'سئو و متاتگ' },
    { id: 'advanced', label: 'پیشرفته' },
];

const AddProductModal = ({ isOpen, onClose, onAdd, categories, brands }) => {
    const fileInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        // پایه
        name: '',
        price: '',
        oldPrice: '',
        stock: '',
        discount: '',
        categoryId: '',
        brandId: '',
        status: 'active',
        shortDescription: '',
        sku: '',
        tags: [],
        tagInput: '',
        // رسانه
        image: '',
        gallery: [],
        // سئو
        metaTitle: '',
        metaDescription: '',
        // پیشرفته
        weight: '',
        dimensions: { length: '', width: '', height: '' },
        freeShipping: false,
        shippingCost: '',
        deliveryTime: '',
        description: '',
        colors: [],
        colorInput: '',
    });
    const [previewImage, setPreviewImage] = useState('');
    const [galleryPreview, setGalleryPreview] = useState([]);

    const formatPriceWithComma = (value) => {
        if (!value) return '';
        const num = value.toString().replace(/[^\d]/g, '');
        if (!num) return '';
        return Number(num).toLocaleString('en-US');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'price' || name === 'oldPrice' || name === 'shippingCost') {
            const numericValue = value.replace(/[^\d]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue ? formatPriceWithComma(numericValue) : ''
            }));
        } else if (name.startsWith('dimensions.')) {
            const dim = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                dimensions: { ...prev.dimensions, [dim]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setPreviewImage(imageUrl);
                setFormData(prev => ({ ...prev, image: imageUrl }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage('');
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result;
                setGalleryPreview(prev => [...prev, url]);
                setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
            };
            reader.readAsDataURL(file);
        });
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const handleRemoveGalleryItem = (index) => {
        setGalleryPreview(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
    };

    const handleAddTag = () => {
        const tag = formData.tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag],
                tagInput: ''
            }));
        }
    };

    const handleRemoveTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const handleAddColor = () => {
        const color = formData.colorInput.trim();
        if (color && !formData.colors.includes(color)) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, color],
                colorInput: ''
            }));
        }
    };

    const handleRemoveColor = (color) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== color)
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '', price: '', oldPrice: '', stock: '', discount: '', categoryId: '', brandId: '',
            status: 'active', shortDescription: '', sku: '', tags: [], tagInput: '',
            image: '', gallery: [],
            metaTitle: '', metaDescription: '',
            weight: '', dimensions: { length: '', width: '', height: '' },
            freeShipping: false, shippingCost: '', deliveryTime: '', description: '',
            colors: [], colorInput: '',
        });
        setPreviewImage('');
        setGalleryPreview([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error('نام محصول الزامی است');
        const rawPrice = formData.price.replace(/[^\d]/g, '');
        if (!rawPrice || Number(rawPrice) <= 0) return toast.error('قیمت نامعتبر');
        if (!formData.categoryId) return toast.error('دسته‌بندی الزامی است');
        if (!formData.brandId) return toast.error('برند الزامی است');

        const newProduct = {
            id: Date.now(),
            name: formData.name.trim(),
            price: Number(rawPrice).toLocaleString('fa-IR'),
            oldPrice: formData.oldPrice ? Number(formData.oldPrice.replace(/[^\d]/g, '')).toLocaleString('fa-IR') : null,
            stock: Number(formData.stock) || 0,
            discount: Number(formData.discount) || 0,
            categoryId: Number(formData.categoryId),
            brandId: Number(formData.brandId),
            status: formData.status,
            image: formData.image || '/images/products/placeholder.jpg',
            gallery: formData.gallery,
            sku: formData.sku,
            shortDescription: formData.shortDescription,
            description: formData.description,
            metaTitle: formData.metaTitle,
            metaDescription: formData.metaDescription,
            tags: formData.tags,
            weight: Number(formData.weight) || null,
            dimensions: {
                length: Number(formData.dimensions.length) || null,
                width: Number(formData.dimensions.width) || null,
                height: Number(formData.dimensions.height) || null,
            },
            shipping: {
                freeShipping: formData.freeShipping,
                shippingCost: formData.shippingCost ? Number(formData.shippingCost.replace(/[^\d]/g, '')) : 0,
                deliveryTime: formData.deliveryTime,
            },
            colors: formData.colors,
            isNew: true,
            isAmazing: false,
            rating: 0,
            sales: 0,
            views: 0,
        };

        onAdd(newProduct);
        toast.success('محصول جدید با موفقیت افزوده شد');
        resetForm();
        onClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">افزودن محصول جدید</h3>
                            <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* تب‌ها */}
                        <div className="flex border-b border-gray-200 dark:border-gray-800 px-5">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-[#002874] text-[#002874]  dark:border-[#4C6FB6] dark:text-[#4C6FB6]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="p-5">
                            {/* تب اطلاعات پایه */}
                            {activeTab === 'basic' && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1.5">نام محصول *</label>
                                            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">قیمت (تومان) *</label>
                                            <input name="price" type="text" inputMode="numeric" value={formData.price} onChange={handleChange} className="w-full p-2.5 rounded-xl border" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">قیمت قدیمی</label>
                                            <input name="oldPrice" type="text" inputMode="numeric" value={formData.oldPrice} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">موجودی</label>
                                            <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">تخفیف (%)</label>
                                            <input name="discount" type="number" min="0" max="100" value={formData.discount} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">دسته‌بندی *</label>
                                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2.5 rounded-xl border" required>
                                                <option value="">انتخاب</option>
                                                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">برند *</label>
                                            <select name="brandId" value={formData.brandId} onChange={handleChange} className="w-full p-2.5 rounded-xl border" required>
                                                <option value="">انتخاب</option>
                                                {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">وضعیت</label>
                                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 rounded-xl border">
                                                <option value="active">🟢 فعال</option>
                                                <option value="inactive">⚪ غیرفعال</option>
                                                <option value="outofstock">🔴 ناموجود</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">کد محصول (SKU)</label>
                                            <input name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">توضیح کوتاه</label>
                                        <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2" className="w-full p-2.5 rounded-xl border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">برچسب‌ها</label>
                                        <div className="flex gap-2">
                                            <input name="tagInput" value={formData.tagInput} onChange={handleChange} className="flex-1 p-2.5 rounded-xl border" placeholder="مثال: پرفروش" />
                                            <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-[#002874] text-white rounded-xl">افزودن</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.tags.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                                    {tag}
                                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-500"><X size={14} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">رنگ‌ها</label>
                                        <div className="flex gap-2">
                                            <input name="colorInput" value={formData.colorInput} onChange={handleChange} placeholder="#RRGGBB" className="flex-1 p-2.5 rounded-xl border" />
                                            <button type="button" onClick={handleAddColor} className="px-4 py-2 bg-[#002874] text-white rounded-xl">افزودن</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.colors.map(color => (
                                                <span key={color} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
                                                    {color}
                                                    <button type="button" onClick={() => handleRemoveColor(color)} className="text-red-500"><X size={14} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* تب رسانه */}
                            {activeTab === 'media' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">تصویر اصلی</label>
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                {previewImage ? (
                                                    <LazyLoadImage src={previewImage} effect="blur" className="w-24 h-24 object-cover rounded-xl border" />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-xl border border-dashed bg-gray-50 flex items-center justify-center">
                                                        <Upload size={24} className="text-gray-400" />
                                                    </div>
                                                )}
                                                {previewImage && (
                                                    <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="main-image" />
                                                <label htmlFor="main-image" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-gray-50 cursor-pointer">
                                                    <Upload size={16} /> انتخاب تصویر اصلی
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">گالری تصاویر</label>
                                        <div className="flex flex-wrap gap-3">
                                            {galleryPreview.map((url, idx) => (
                                                <div key={idx} className="relative">
                                                    <LazyLoadImage src={url} className="w-20 h-20 object-cover rounded-lg border" />
                                                    <button type="button" onClick={() => handleRemoveGalleryItem(idx)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div>
                                                <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" id="gallery-input" />
                                                <label htmlFor="gallery-input" className="w-20 h-20 rounded-lg border border-dashed bg-gray-50 flex items-center justify-center cursor-pointer">
                                                    <Plus size={24} className="text-gray-400" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* تب سئو */}
                            {activeTab === 'seo' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">عنوان متا (Meta Title)</label>
                                        <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">توضیحات متا (Meta Description)</label>
                                        <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="3" className="w-full p-2.5 rounded-xl border" />
                                    </div>
                                </div>
                            )}

                            {/* تب پیشرفته */}
                            {activeTab === 'advanced' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">وزن (کیلوگرم)</label>
                                        <input name="weight" type="number" step="0.01" value={formData.weight} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">طول (سانتی‌متر)</label>
                                            <input name="dimensions.length" value={formData.dimensions.length} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">عرض (سانتی‌متر)</label>
                                            <input name="dimensions.width" value={formData.dimensions.width} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">ارتفاع (سانتی‌متر)</label>
                                            <input name="dimensions.height" value={formData.dimensions.height} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                        </div>
                                    </div>
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-3">تنظیمات ارسال</h4>
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" name="freeShipping" checked={formData.freeShipping} onChange={handleChange} />
                                                <span className="text-sm">ارسال رایگان</span>
                                            </label>
                                            {!formData.freeShipping && (
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">هزینه ارسال (تومان)</label>
                                                    <input name="shippingCost" type="text" inputMode="numeric" value={formData.shippingCost} onChange={handleChange} className="w-full p-2.5 rounded-xl border" />
                                                </div>
                                            )}
                                            <div>
                                                <label className="block text-sm font-medium mb-1.5">زمان تحویل</label>
                                                <input name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className="w-full p-2.5 rounded-xl border" placeholder="مثال: ۳ تا ۵ روز کاری" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">توضیحات کامل</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full p-2.5 rounded-xl border" />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-5 mt-5 border-t border-gray-200 dark:border-gray-800">
                                <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl border text-gray-700 hover:bg-gray-50">انصراف</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#002874] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#001d5a]">
                                    <Save size={18} /> ذخیره محصول
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddProductModal;