// =============================================================================
// FILE: sellerProfileStats.jsx
// =============================================================================
import React from 'react';
import { TrendingUp, Package, Zap, Heart } from 'react-feather';

const statsData = [
    { key: 'totalSales', icon: TrendingUp, label: 'فروش کل', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { key: 'totalProducts', icon: Package, label: 'محصولات', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { key: 'satisfaction', icon: Zap, label: 'رضایت', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', suffix: '%' },
    { key: 'followers', icon: Heart, label: 'دنبال‌کننده', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
];

const SellerProfileStats = ({ seller }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {statsData.map((stat) => (
            <div key={stat.key} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 flex items-center gap-3">
                <div className={`p-2 sm:p-2.5 rounded-xl ${stat.bg}`}>
                    <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                    <div className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
                        {stat.key === 'totalSales' ? (seller[stat.key] || 0).toLocaleString('fa-IR') :
                            stat.key === 'followers' ? (seller[stat.key] || 0).toLocaleString('fa-IR') :
                                `${seller[stat.key] || 0}${stat.suffix || ''}`}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
            </div>
        ))}
    </div>
);

export default SellerProfileStats;