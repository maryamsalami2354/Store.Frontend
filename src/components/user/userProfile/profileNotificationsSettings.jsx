// src/components/user/userProfile/profileNotificationsSettings.jsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Save, Mail, Smartphone, Bell } from 'react-feather';
import { toast } from 'react-toastify';

const ProfileNotificationsSettings = ({ isLoading, onSave }) => {
    const [settings, setSettings] = useState({
        email: { orderUpdates: true, promotions: false, newsletter: true },
        sms: { orderUpdates: true, promotions: false },
        push: { orderUpdates: true, promotions: true, chats: true },
    });

    const handleChange = (category, key) => {
        setSettings(prev => ({
            ...prev,
            [category]: { ...prev[category], [key]: !prev[category][key] },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(settings);
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <Skeleton width={120} height={16} className="dark:!bg-gray-800 mb-3" />
                        {[...Array(3)].map((_, j) => (
                            <Skeleton key={j} width="100%" height={24} className="dark:!bg-gray-800 mb-2" />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    const sections = [
        {
            title: 'اعلان‌های ایمیلی',
            icon: Mail,
            category: 'email',
            items: [
                { key: 'orderUpdates', label: 'به‌روزرسانی سفارشات' },
                { key: 'promotions', label: 'تخفیف‌ها و پیشنهادات' },
                { key: 'newsletter', label: 'خبرنامه هفتگی' },
            ],
        },
        {
            title: 'اعلان‌های پیامکی',
            icon: Smartphone,
            category: 'sms',
            items: [
                { key: 'orderUpdates', label: 'به‌روزرسانی سفارشات' },
                { key: 'promotions', label: 'تخفیف‌ها و پیشنهادات' },
            ],
        },
        {
            title: 'اعلان‌های درون برنامه‌ای',
            icon: Bell,
            category: 'push',
            items: [
                { key: 'orderUpdates', label: 'به‌روزرسانی سفارشات' },
                { key: 'promotions', label: 'تخفیف‌ها و پیشنهادات' },
                { key: 'chats', label: 'پیام‌های پشتیبانی' },
            ],
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
            {sections.map(section => (
                <div key={section.category} className="p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-lg bg-[#002874]/10 dark:bg-[#4C6FB6]/20">
                            <section.icon size={16} className="text-[#002874]  dark:text-[#4C6FB6]" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{section.title}</h3>
                    </div>
                    <div className="space-y-3">
                        {section.items.map(item => (
                            <label key={item.key} className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                                <div
                                    onClick={() => handleChange(section.category, item.key)}
                                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                                        settings[section.category][item.key] ? 'bg-[#002874] dark:bg-[#4C6FB6]' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                        settings[section.category][item.key] ? 'right-0.5' : 'right-5'
                                    }`} />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition"
            >
                <Save size={16} /> ذخیره تنظیمات
            </button>
        </form>
    );
};

export default ProfileNotificationsSettings;