// =============================================================================
// FILE: categoriesStats.jsx
// =============================================================================
import React from 'react';
import { Grid, Package, Award, Zap } from 'react-feather';

const items = [
    { key: 'totalCategories', icon: Grid, label: 'دسته‌بندی', gradient: 'from-blue-500 to-blue-600' },
    { key: 'totalProducts', icon: Package, label: 'محصول', gradient: 'from-emerald-500 to-green-600' },
    { key: 'totalBrands', icon: Award, label: 'برند', gradient: 'from-violet-500 to-purple-600' },
    { key: 'activeCategories', icon: Zap, label: 'دسته فعال', gradient: 'from-amber-500 to-orange-600' },
];

const CategoriesStats = ({ stats = {} }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
        {items.map((item) => (
            <div key={item.key} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
                <div className={`flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} text-white group-hover:scale-110 transition-transform`}>
                    <item.icon size={17} />
                </div>
                <div>
                    <div className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {(stats[item.key] || 0).toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                </div>
            </div>
        ))}
    </div>
);

export default CategoriesStats;