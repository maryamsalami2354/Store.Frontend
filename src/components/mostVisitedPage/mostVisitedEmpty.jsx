// =============================================================================
// mostVisitedEmpty.jsx
// =============================================================================
import React from 'react';
import { Search, RotateCcw } from 'react-feather';

const MostVisitedEmpty = ({ searchQuery, onClear }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"><Search size={32} className="text-gray-400" /></div>
        <h3 className="text-lg font-bold mb-2">{searchQuery ? 'محصولی یافت نشد' : 'محصولی نیست'}</h3>
        <p className="text-sm text-gray-500 mb-6">{searchQuery ? `نتیجه‌ای برای "${searchQuery}" پیدا نشد.` : 'محصول پربازدیدی وجود ندارد.'}</p>
        {searchQuery && <button onClick={onClear} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium"><RotateCcw size={16} /> پاک کردن جستجو</button>}
    </div>
);

export default MostVisitedEmpty;