// =============================================================================
// FILE: sellerLandingStats.jsx
// =============================================================================
import React from 'react';
import { Home, Package, TrendingUp, Smile } from 'react-feather';

const stats = [
    { icon: Home, value: '۱۲,۵۰۰+', label: 'فروشنده', gradient: 'from-blue-500 to-blue-600' },
    { icon: Package, value: '۲.۵M+', label: 'محصول', gradient: 'from-emerald-500 to-green-600' },
    { icon: TrendingUp, value: '۵۰۰M+', label: 'فروش ماهانه', gradient: 'from-purple-500 to-violet-600' },
    { icon: Smile, value: '۹۸٪', label: 'رضایت', gradient: 'from-amber-500 to-orange-600' },
];

const SellerLandingStats = () => (
    <div className="mb-8">
        <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                شاپ مارکت در یک نگاه
            </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-center hover:shadow-lg transition-all group"
                >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
            ))}
        </div>
    </div>
);

export default SellerLandingStats;