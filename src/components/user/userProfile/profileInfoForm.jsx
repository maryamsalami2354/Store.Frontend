// src/components/user/userProfile/profileInfoForm.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Save, User, Mail, Phone, Calendar, CreditCard } from 'react-feather';
import { toast } from 'react-toastify';
import { toEnglishDigits, toPersianDigits } from '../../../utils/helpers/persianDigits.js';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const optionalEmail = z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().email('ایمیل نامعتبر').optional()
);

const profileSchema = z.object({
    firstName: z.string().trim().min(1, 'نام الزامی است'),
    lastName: z.string().trim().min(1, 'نام خانوادگی الزامی است'),
    email: optionalEmail,
    phone: z.preprocess(
        (value) => toEnglishDigits(value),
        z.string().regex(/^09\d{9}$/, 'شماره موبایل نامعتبر')
    ),
    birthDate: z.string().optional(),
    nationalCode: z.preprocess(
        (value) => toEnglishDigits(value),
        z.string().regex(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد')
    ),
});

const ProfileInfoForm = ({ user, isLoading, onSave }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            birthDate: '',
            nationalCode: '',
        },
    });

    // هر بار که user تغییر کرد، فرم رو با مقادیر جدید پر کن
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: toPersianDigits(user.phoneNumber || user.phone || ''),
                birthDate: user.birthDate || '',
                nationalCode: toPersianDigits(user.nationalCode || ''),
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        let cleanData = { ...data };

        // پاک‌سازی امن داده‌های متنی
        if (typeof window !== 'undefined' && DOMPurify) {
            cleanData.firstName = DOMPurify.sanitize(data.firstName);
            cleanData.lastName = DOMPurify.sanitize(data.lastName);
            cleanData.nationalCode = toEnglishDigits(DOMPurify.sanitize(data.nationalCode || ''));
            cleanData.phone = toEnglishDigits(data.phone || '');
            cleanData.birthDate = DOMPurify.sanitize(data.birthDate || '');
        }

        // بررسی اینکه آیا نام یا نام خانوادگی بعد از پاک‌سازی خالی شده است
        if (!cleanData.firstName.trim() || !cleanData.lastName.trim()) {
            toast.error('نام و نام خانوادگی نمی‌تواند خالی باشد.');
            return;
        }

        await onSave({
            ...cleanData,
            name: `${cleanData.firstName} ${cleanData.lastName}`,
        });
    };

    // -----------------------------------------------------------------------
    // Skeleton
    // -----------------------------------------------------------------------
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i}>
                        <Skeleton width={80} height={14} className="dark:!bg-gray-800 mb-2" />
                        <Skeleton width="100%" height={42} className="dark:!bg-gray-800" />
                    </div>
                ))}
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // فیلدها
    // -----------------------------------------------------------------------
    const fields = [
        { name: 'firstName', label: 'نام', icon: User, type: 'text' },
        { name: 'lastName', label: 'نام خانوادگی', icon: User, type: 'text' },
        { name: 'email', label: 'ایمیل', icon: Mail, type: 'email', dir: 'ltr' },
        { name: 'phone', label: 'شماره موبایل', icon: Phone, type: 'tel', dir: 'ltr' },
        { name: 'birthDate', label: 'تاریخ تولد', icon: Calendar, type: 'text' },
        { name: 'nationalCode', label: 'کد ملی', icon: CreditCard, type: 'text', dir: 'ltr' },
    ];

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            {field.label}
                        </label>
                        <div className="relative">
                            <input
                                {...register(field.name)}
                                type={field.type}
                                className={`w-full p-2.5 pr-10 rounded-xl border bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] transition ${
                                    errors[field.name]
                                        ? 'border-red-500'
                                        : 'border-gray-200 dark:border-gray-700'
                                } ${field.dir === 'ltr' ? 'dir-ltr text-left' : ''}`}
                            />
                            <field.icon
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                        {errors[field.name] && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors[field.name]?.message}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <button
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={16} /> {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
        </form>
    );
};

export default ProfileInfoForm;
