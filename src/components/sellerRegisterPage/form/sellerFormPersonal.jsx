// =============================================================================
// FILE: sellerFormPersonal.jsx (کامل - نهایی)
// =============================================================================
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, Home, ArrowRight, ArrowLeft, X, Image } from 'react-feather';
import CustomSelect from '../../common/customSelect/customSelect';

// =============================================================================
// SCHEMA
// =============================================================================
const personalSchema = z.object({
    firstName: z.string().min(2, 'نام حداقل ۲ حرف'),
    lastName: z.string().min(2, 'نام خانوادگی حداقل ۲ حرف'),
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل ۱۱ رقم و با ۰۹ شروع شود'),
    email: z.string().email('ایمیل نامعتبر').optional().or(z.literal('')),
    nationalCode: z.string().regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد'),
    shopName: z.string().min(3, 'نام فروشگاه حداقل ۳ حرف'),
    province: z.string().min(1, 'استان را انتخاب کنید'),
    city: z.string().min(1, 'شهر را انتخاب کنید'),
});

// =============================================================================
// OPTIONS
// =============================================================================
const provinceOptions = [
    { value: 'tehran', label: 'تهران' },
    { value: 'isfahan', label: 'اصفهان' },
    { value: 'fars', label: 'فارس' },
    { value: 'khorasan', label: 'خراسان رضوی' },
    { value: 'azarbaijan', label: 'آذربایجان شرقی' },
];

const cityOptions = {
    tehran: [{ value: 'tehran', label: 'تهران' }, { value: 'karaj', label: 'کرج' }],
    isfahan: [{ value: 'isfahan', label: 'اصفهان' }, { value: 'kashan', label: 'کاشان' }],
    fars: [{ value: 'shiraz', label: 'شیراز' }],
    khorasan: [{ value: 'mashhad', label: 'مشهد' }],
    azarbaijan: [{ value: 'tabriz', label: 'تبریز' }],
};

// =============================================================================
// COMPONENT
// =============================================================================
const SellerFormPersonal = ({ selectedPlan, onSubmit, onBack }) => {
    const [idCardImage, setIdCardImage] = useState(null);
    const [idCardPreview, setIdCardPreview] = useState('');
    const [nationalCardImage, setNationalCardImage] = useState(null);
    const [nationalCardPreview, setNationalCardPreview] = useState('');

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(personalSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            nationalCode: '',
            shopName: '',
            province: '',
            city: '',
        },
    });

    const watchProvince = watch('province');

    // =========================================================================
    // IMAGE HANDLERS
    // =========================================================================
    const handleImageUpload = (e, setImage, setPreview) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) return;
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = (setImage, setPreview) => {
        setImage(null);
        setPreview('');
    };

    // =========================================================================
    // SUBMIT
    // =========================================================================
    const onFormSubmit = (data) => {
        onSubmit({
            ...data,
            idCardImage: idCardImage?.name || null,
            nationalCardImage: nationalCardImage?.name || null,
        });
    };

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            {selectedPlan && (
                <div className="bg-[#002874]/5 dark:bg-[#4C6FB6]/10 rounded-xl p-3 mb-5 text-sm text-[#002874] dark:text-[#4C6FB6] font-medium text-center">
                    پلن انتخابی: {selectedPlan.name} — {selectedPlan.price} تومان
                </div>
            )}

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">

                {/* نام + نام خانوادگی */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">نام</label>
                        <div className="relative">
                            <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register('firstName')}
                                type="text"
                                className={`w-full py-2.5 pr-10 pl-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                        </div>
                        {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">نام خانوادگی</label>
                        <div className="relative">
                            <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register('lastName')}
                                type="text"
                                className={`w-full py-2.5 pr-10 pl-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                        </div>
                        {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                </div>

                {/* موبایل + ایمیل */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شماره موبایل</label>
                        <div className="relative">
                            <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register('phone')}
                                type="tel"
                                inputMode="numeric"
                                className={`w-full py-2.5 pr-10 pl-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">ایمیل (اختیاری)</label>
                        <div className="relative">
                            <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register('email')}
                                type="email"
                                className={`w-full py-2.5 pr-10 pl-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                </div>

                {/* کد ملی + نام فروشگاه */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">کد ملی</label>
                        <input
                            {...register('nationalCode')}
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            className={`w-full py-2.5 px-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left ${errors.nationalCode ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                        />
                        {errors.nationalCode && <p className="mt-1 text-xs text-red-500">{errors.nationalCode.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">نام فروشگاه</label>
                        <div className="relative">
                            <Home size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register('shopName')}
                                type="text"
                                className={`w-full py-2.5 pr-10 pl-4 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent ${errors.shopName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                            />
                        </div>
                        {errors.shopName && <p className="mt-1 text-xs text-red-500">{errors.shopName.message}</p>}
                    </div>
                </div>
                {/* استان + شهر */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">استان</label>
                        <Controller
                            name="province"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    options={provinceOptions}
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        setValue('city', '');
                                    }}
                                    placeholder="انتخاب استان"
                                />
                            )}
                        />
                        {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province.message}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شهر</label>
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    options={cityOptions[watchProvince] || []}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="انتخاب شهر"
                                    disabled={!watchProvince}
                                />
                            )}
                        />
                        {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                </div>
                {/* عکس شناسنامه + عکس کارت ملی */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">عکس شناسنامه</label>
                        {idCardPreview ? (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img src={idCardPreview} alt="شناسنامه" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(setIdCardImage, setIdCardPreview)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 cursor-pointer hover:border-[#002874] dark:hover:border-[#4C6FB6] transition-colors">
                                <Image size={24} className="text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">بارگذاری شناسنامه</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setIdCardImage, setIdCardPreview)} className="hidden" />
                            </label>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">عکس کارت ملی</label>
                        {nationalCardPreview ? (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                <img src={nationalCardPreview} alt="کارت ملی" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(setNationalCardImage, setNationalCardPreview)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 cursor-pointer hover:border-[#002874] dark:hover:border-[#4C6FB6] transition-colors">
                                <Image size={24} className="text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">بارگذاری کارت ملی</span>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setNationalCardImage, setNationalCardPreview)} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ArrowRight size={16} />
                        بازگشت
                    </button>
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors">
                        ادامه
                        <ArrowLeft size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerFormPersonal;