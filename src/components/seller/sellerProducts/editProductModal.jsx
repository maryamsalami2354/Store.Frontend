// src/components/seller/sellerProducts/EditProductModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    X, Save, Upload, Trash2, Plus
} from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getColorHex, getColorName } from '../../../utils/helpers/colorHelpers.js';

const TABS = [
    { id: 'basic', label: 'اطلاعات پایه' },
    { id: 'media', label: 'تصاویر و گالری' },
    { id: 'seo', label: 'سئو و متاتگ' },
    { id: 'advanced', label: 'پیشرفته' },
];

// کلاس‌های استایل مشترک برای تمام input, select, textarea
const inputClassName = "w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition";

const EditProductModal = ({ isOpen, product, onClose, onSave, categories, brands }) => {
    const fileInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        name: '', price: '', oldPrice: '', stock: '', discount: '',
        categoryId: '', brandId: '', status: 'active', shortDescription: '', sku: '',
        tags: [], tagInput: '',
        image: '', gallery: [],
        metaTitle: '', metaDescription: '',
        weight: '', dimensions: { length: '', width: '', height: '' },
        freeShipping: false, shippingCost: '', deliveryTime: '', description: '',
        colors: [], colorInput: '',
    });
    const [previewImage, setPreviewImage] = useState('');
    const [galleryPreview, setGalleryPreview] = useState([]);

    const formatPriceWithComma = (value) => {
        if (!value) return '';
        const num = value.toString().replace(/[^\d]/g, '');
        if (!num) return '';
        return Number(num).toLocaleString('en-US');
    };

    useEffect(() => {
        if (product) {
            const rawPrice = product.price?.replace(/[^\d]/g, '') || '';
            const rawOldPrice = product.oldPrice?.replace(/[^\d]/g, '') || '';
            const rawShippingCost = product.shipping?.shippingCost?.toString().replace(/[^\d]/g, '') || '';
            const dimensions = product.dimensions || { length: '', width: '', height: '' };
            const shipping = product.shipping || { freeShipping: false, shippingCost: '', deliveryTime: '' };

            setFormData({
                name: product.name || '',
                price: rawPrice ? formatPriceWithComma(rawPrice) : '',
                oldPrice: rawOldPrice ? formatPriceWithComma(rawOldPrice) : '',
                stock: product.stock?.toString() || '0',
                discount: product.discount?.toString() || '0',
                categoryId: product.categoryId?.toString() || '',
                brandId: product.brandId?.toString() || '',
                status: product.status || 'active',
                shortDescription: product.shortDescription || '',
                sku: product.sku || '',
                tags: product.tags || [],
                tagInput: '',
                image: product.image || '',
                gallery: product.gallery || [],
                metaTitle: product.metaTitle || '',
                metaDescription: product.metaDescription || '',
                weight: product.weight?.toString() || '',
                dimensions: {
                    length: dimensions.length?.toString() || '',
                    width: dimensions.width?.toString() || '',
                    height: dimensions.height?.toString() || '',
                },
                freeShipping: shipping.freeShipping || false,
                shippingCost: rawShippingCost ? formatPriceWithComma(rawShippingCost) : '',
                deliveryTime: shipping.deliveryTime || '',
                description: product.description || '',
                colors: product.colors || [],
                colorInput: '',
            });
            setPreviewImage(product.image || '');
            setGalleryPreview(product.gallery || []);
        }
    }, [product]);

    if (!product) return null;

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error('نام محصول الزامی است');
        const rawPrice = formData.price.replace(/[^\d]/g, '');
        if (!rawPrice || Number(rawPrice) <= 0) return toast.error('قیمت نامعتبر');
        if (!formData.categoryId) return toast.error('دسته‌بندی الزامی است');
        if (!formData.brandId) return toast.error('برند الزامی است');

        const updatedProduct = {
            ...product,
            name: formData.name.trim(),
            price: Number(rawPrice).toLocaleString('fa-IR'),
            oldPrice: formData.oldPrice ? Number(formData.oldPrice.replace(/[^\d]/g, '')).toLocaleString('fa-IR') : null,
            stock: Number(formData.stock) || 0,
            discount: Number(formData.discount) || 0,
            categoryId: Number(formData.categoryId),
            brandId: Number(formData.brandId),
            status: formData.status,
            image: formData.image || product.image,
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
        };

        onSave?.(updatedProduct);
        toast.success('محصول با موفقیت ویرایش شد');
        onClose();
    };

    const handleClose = () => onClose();

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
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">ویرایش محصول</h3>
                            <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="flex border-b border-gray-200 dark:border-gray-800 px-5">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#002874] text-[#002874]  dark:border-[#4C6FB6] dark:text-[#4C6FB6]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="p-5">
                            {activeTab === 'basic' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">نام محصول *</label>
                                        <input name="name" value={formData.name} onChange={handleChange} className={inputClassName} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">قیمت (تومان) *</label>
                                            <input name="price" type="text" inputMode="numeric" value={formData.price} onChange={handleChange} className={inputClassName} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">قیمت قدیمی</label>
                                            <input name="oldPrice" type="text" inputMode="numeric" value={formData.oldPrice} onChange={handleChange} className={inputClassName} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">موجودی</label>
                                            <input name="stock" type="number" value={formData.stock} onChange={handleChange} className={inputClassName} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">تخفیف (%)</label>
                                            <input name="discount" type="number" min="0" max="100" value={formData.discount} onChange={handleChange} className={inputClassName} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">دسته‌بندی *</label>
                                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputClassName} required>
                                                <option value="">انتخاب</option>
                                                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">برند *</label>
                                            <select name="brandId" value={formData.brandId} onChange={handleChange} className={inputClassName} required>
                                                <option value="">انتخاب</option>
                                                {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">وضعیت</label>
                                            <select name="status" value={formData.status} onChange={handleChange} className={inputClassName}>
                                                <option value="active">🟢 فعال</option>
                                                <option value="inactive">⚪ غیرفعال</option>
                                                <option value="outofstock">🔴 ناموجود</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">کد محصول (SKU)</label>
                                            <input name="sku" value={formData.sku} onChange={handleChange} className={inputClassName} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">توضیح کوتاه</label>
                                        <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2" className={inputClassName} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">برچسب‌ها</label>
                                        <div className="flex gap-2">
                                            <input name="tagInput" value={formData.tagInput} onChange={handleChange} placeholder="مثال: پرفروش" className={inputClassName} />
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
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">رنگ‌ها</label>
                                        <div className="flex gap-2">
                                            <input name="colorInput" value={formData.colorInput} onChange={handleChange} placeholder="#RRGGBB" className={inputClassName} />
                                            <button type="button" onClick={handleAddColor} className="px-4 py-2 bg-[#002874] text-white rounded-xl">افزودن</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.colors.map(color => (
                                                <span key={color} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: getColorHex(color) }} />
                                                    {getColorName(color)}
                                                    <button type="button" onClick={() => handleRemoveColor(color)} className="text-red-500"><X size={14} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">تصویر اصلی</label>
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                {previewImage ? (
                                                    <LazyLoadImage src={previewImage} effect="blur" className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><Upload size={24} className="text-gray-400" /></div>
                                                )}
                                                {previewImage && (
                                                    <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"><Trash2 size={12} /></button>
                                                )}
                                            </div>
                                            <div>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="edit-main-image" />
                                                <label htmlFor="edit-main-image" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition">
                                                    <Upload size={16} /> انتخاب تصویر جدید
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">گالری تصاویر</label>
                                        <div className="flex flex-wrap gap-3">
                                            {galleryPreview.map((url, idx) => (
                                                <div key={idx} className="relative">
                                                    <LazyLoadImage src={url} className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                                    <button type="button" onClick={() => handleRemoveGalleryItem(idx)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                            <div>
                                                <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" id="edit-gallery-input" />
                                                <label htmlFor="edit-gallery-input" className="w-20 h-20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center cursor-pointer">
                                                    <Plus size={24} className="text-gray-400" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">عنوان متا</label>
                                        <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputClassName} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">توضیحات متا</label>
                                        <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="3" className={inputClassName} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'advanced' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">وزن (کیلوگرم)</label>
                                        <input name="weight" type="number" step="0.01" value={formData.weight} onChange={handleChange} className={inputClassName} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">طول (cm)</label><input name="dimensions.length" value={formData.dimensions.length} onChange={handleChange} className={inputClassName} /></div>
                                        <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">عرض (cm)</label><input name="dimensions.width" value={formData.dimensions.width} onChange={handleChange} className={inputClassName} /></div>
                                        <div><label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">ارتفاع (cm)</label><input name="dimensions.height" value={formData.dimensions.height} onChange={handleChange} className={inputClassName} /></div>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                        <h4 className="font-medium mb-3 text-gray-900 dark:text-white">تنظیمات ارسال</h4>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" name="freeShipping" checked={formData.freeShipping} onChange={handleChange} className="rounded" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">ارسال رایگان</span>
                                        </label>
                                        {!formData.freeShipping && (
                                            <div className="mt-3">
                                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">هزینه ارسال (تومان)</label>
                                                <input name="shippingCost" type="text" inputMode="numeric" value={formData.shippingCost} onChange={handleChange} className={inputClassName} />
                                            </div>
                                        )}
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">زمان تحویل</label>
                                            <input name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} placeholder="مثال: ۳ تا ۵ روز کاری" className={inputClassName} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">توضیحات کامل</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className={inputClassName} />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-5 mt-5 border-t border-gray-200 dark:border-gray-800">
                                <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    انصراف
                                </button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#002874] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#001d5a] transition">
                                    <Save size={18} /> ذخیره تغییرات
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditProductModal;
