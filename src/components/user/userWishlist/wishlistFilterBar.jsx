// src/components/user/userWishlist/wishlistFilterBar.jsx
import React from 'react';
import { Search } from 'react-feather';
import CustomSelect from '../../common/customSelect/customSelect';

const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'name', label: 'نام محصول' },
    { value: 'price-asc', label: 'ارزان‌ترین' },
    { value: 'price-desc', label: 'گران‌ترین' },
];

const WishlistFilterBar = ({ searchQuery, setSearchQuery, sortBy, setSortBy }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-wrap items-end gap-3">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="جستجوی نام محصول..."
                    className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition"
                />
            </div>
            <div className="min-w-[160px]">
                <CustomSelect options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="مرتب‌سازی" />
            </div>
        </div>
    </div>
);

export default WishlistFilterBar;