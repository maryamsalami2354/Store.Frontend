// =============================================================================
// FILE: sellerLandingBenefits.jsx
// =============================================================================
import React from 'react';
import { Zap, TrendingDown, Headphones, BarChart2, Truck, Shield } from 'react-feather';

const benefits = [
    {
        icon: TrendingDown,
        title: 'کمیسیون کم',
        description: 'کمیسیون از ۴٪ شروع می‌شود—پایین‌ترین نرخ در بازار.',
        color: 'from-emerald-500 to-green-600',
    },
    {
        icon: Zap,
        title: 'راه‌اندازی سریع',
        description: 'کمتر از ۱۰ دقیقه فروشگاه خود را بسازید و شروع به فروش کنید.',
        color: 'from-amber-500 to-orange-600',
    },
    {
        icon: Headphones,
        title: 'پشتیبانی ۲۴/۷',
        description: 'تیم پشتیبانی ما همیشه آماده کمک به شماست.',
        color: 'from-blue-500 to-blue-600',
    },
    {
        icon: BarChart2,
        title: 'داشبورد تحلیلی',
        description: 'گزارشات دقیق فروش، بازدید و رفتار مشتریان.',
        color: 'from-purple-500 to-violet-600',
    },
    {
        icon: Truck,
        title: 'انبار و لجستیک',
        description: 'انبارداری و ارسال را به ما بسپارید.',
        color: 'from-rose-500 to-pink-600',
    },
    {
        icon: Shield,
        title: 'پرداخت امن',
        description: 'تسویه حساب هفتگی و تضمین پرداخت.',
        color: 'from-cyan-500 to-teal-600',
    },
];

const SellerLandingBenefits = () => (
    <div className="mb-8">
        <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                چرا شاپ مارکت؟
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                همه چیز برای موفقیت شما فراهم است
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                        <benefit.icon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
            ))}
        </div>
    </div>
);

export default SellerLandingBenefits;