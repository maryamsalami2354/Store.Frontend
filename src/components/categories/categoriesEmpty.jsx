// =============================================================================
// FILE: categoriesEmpty.jsx
// =============================================================================
import React from 'react';
import { Search, RotateCcw } from 'react-feather';

const CategoriesEmpty = ({ onClear }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Search size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">دسته‌بندی یافت نشد</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">با عبارت دیگری جستجو کنید</p>
        <button onClick={onClear} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors">
            <RotateCcw size={16} /> حذف فیلترها
        </button>
    </div>
);

export default CategoriesEmpty;