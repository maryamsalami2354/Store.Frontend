// =============================================================================
// FILE: brandsCategoryTabs.jsx
// =============================================================================
import React from 'react';

const BrandsCategoryTabs = ({ categories = [], activeCategory = '', onSelect }) => {
    const displayCategories = categories.slice(0, 9);

    return (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {/* دکمه همه */}
            <button
                onClick={() => onSelect('')}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    !activeCategory
                        ? 'bg-[#002874] text-white shadow-lg shadow-[#002874]/20'
                        : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-[#002874]/30'
                }`}
            >
                همه برندها
            </button>

            {displayCategories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(String(cat.id))}
                    className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        activeCategory === String(cat.id)
                            ? 'bg-[#002874] text-white shadow-lg shadow-[#002874]/20'
                            : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-[#002874]/30'
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
};

export default BrandsCategoryTabs;