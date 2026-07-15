// =============================================================================
// FILE: sellerFormShop.jsx (کامل - با react-hook-form + zod)
// =============================================================================
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, MapPin, Image, ArrowRight, ArrowLeft, Upload, Check, X } from 'react-feather';

// =============================================================================
// SCHEMA
// =============================================================================
const shopSchema = z.object({
    shopName: z.string().min(3, 'نام فروشگاه حداقل ۳ حرف'),
    shaba: z.string().regex(/^IR\d{24}$/, 'شبا باید IR + ۲۴ رقم باشد'),
    cardNumber: z.string().regex(/^\d{16}$/, 'شماره کارت باید ۱۶ رقم باشد'),
    address: z.string().min(10, 'آدرس باید حداقل ۱۰ کاراکتر باشد'),
    description: z.string().optional(),
});

// =============================================================================
// COMPONENT
// =============================================================================
const SellerFormShop = ({ selectedPlan, onSubmit, onBack }) => {
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(shopSchema),
        mode: 'onChange',
        defaultValues: {
            shopName: '',
            shaba: 'IR',
            cardNumber: '',
            address: '',
            description: '',
        },
    });

    // =========================================================================
    // WATCH VALUES
    // =========================================================================
    const watchShaba = watch('shaba');
    const watchCard = watch('cardNumber');

    // =========================================================================
    // SHABA HANDLER
    // =========================================================================
    const handleShabaChange = (e) => {
        const raw = e.target.value.replace(/^IR/i, '').replace(/\D/g, '').slice(0, 24);
        const value = 'IR' + raw;
        setValue('shaba', value, { shouldValidate: true });
    };

    // =========================================================================
    // CARD HANDLER (۴-۴-۴-۴)
    // =========================================================================
    const handleCardChange = (e) => {
        const raw = e.target.value.replace(/[\s-]/g, '').replace(/\D/g, '').slice(0, 16);
        setValue('cardNumber', raw, { shouldValidate: true });
    };

    const formatCardDisplay = (raw) => {
        return raw?.match(/.{1,4}/g)?.join(' - ') || '';
    };

    // =========================================================================
    // LOGO HANDLER
    // =========================================================================
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) return;
        setLogo(file);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeLogo = () => {
        setLogo(null);
        setLogoPreview('');
    };

    // =========================================================================
    // SUBMIT
    // =========================================================================
    const onFormSubmit = (data) => {
        onSubmit({
            ...data,
            logoFileName: logo?.name || null,
        });
    };

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            {selectedPlan && (
                <div className="bg-[#002874]/5 dark:bg-[#4C6FB6]/10 rounded-xl p-3 mb-5 text-sm text-[#002874] dark:text-[#4C6FB6] font-medium text-center">
                    پلن: {selectedPlan.name} — {selectedPlan.price} تومان
                </div>
            )}

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">

                {/* نام فروشگاه */}
                <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">نام فروشگاه</label>
                    <input
                        {...register('shopName')}
                        type="text"
                        className={`w-full py-2.5 px-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent ${errors.shopName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                    />
                    {errors.shopName && <p className="mt-1 text-xs text-red-500">{errors.shopName.message}</p>}
                </div>

                {/* شبا + کارت */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شماره شبا</label>
                        <div className="relative">
                            <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={watchShaba}
                                onChange={handleShabaChange}
                                placeholder="IR..."
                                inputMode="numeric"
                                className={`w-full py-2.5 pr-10 pl-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left ${errors.shaba ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                        </div>
                        {errors.shaba && <p className="mt-1 text-xs text-red-500">{errors.shaba.message}</p>}
                        <p className="text-[10px] text-gray-400 mt-1">IR + ۲۴ رقم</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شماره کارت</label>
                        <input
                            type="text"
                            value={formatCardDisplay(watchCard)}
                            onChange={handleCardChange}
                            placeholder="---- ---- ---- ----"
                            inputMode="numeric"
                            className={`w-full py-2.5 px-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left ${errors.cardNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                        {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber.message}</p>}
                    </div>
                </div>

                {/* آدرس */}
                <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">آدرس کامل</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute right-3 top-3 text-gray-400" />
                        <textarea
                            {...register('address')}
                            rows={3}
                            className={`w-full py-2.5 pr-10 pl-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none ${errors.address ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                    </div>
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                </div>

                {/* توضیحات */}
                <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">درباره فروشگاه</label>
                    <textarea
                        {...register('description')}
                        rows={2}
                        placeholder="توضیح کوتاهی درباره فروشگاه خود بنویسید..."
                        className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none"
                    />
                </div>

                {/* لوگو */}
                <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">لوگوی فروشگاه</label>
                    {logoPreview ? (
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={removeLogo}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors w-fit">
                            <Upload size={16} />
                            بارگذاری لوگو
                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                        </label>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ArrowRight size={16} />
                        بازگشت
                    </button>
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors">
                        <Check size={18} />
                        ثبت و ارسال
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerFormShop;