// =============================================================================
// FILE: sellerReturnsFilterBar.jsx (اصلاح‌شده - جستجو با Fuse.js اضافه شد)
// =============================================================================
import React, { useState } from 'react';
import { Search, X } from 'react-feather';
import CustomSelect from '../../common/customSelect/customSelect';

const statusOptions = [
    { value: 'all', label: 'همه' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'approved', label: 'تأیید شده' },
    { value: 'rejected', label: 'رد شده' },
    { value: 'completed', label: 'تکمیل شده' },
];

const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'amount', label: 'مبلغ (بیشترین)' },
];

const SellerReturnsFilterBar = ({ filterStatus, setFilterStatus, sortBy, setSortBy, searchQuery, setSearchQuery }) => {
    const [inputValue, setInputValue] = useState(searchQuery);

    const handleSearch = () => {
        setSearchQuery(inputValue.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleClear = () => {
        setInputValue('');
        setSearchQuery('');
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Search */}
                <div className="w-full sm:flex-1 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="جستجوی مشتری یا کد پیگیری..."
                            className="w-full py-2.5 pr-10 pl-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent"
                        />
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {inputValue && (
                                <button onClick={handleClear} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <X size={14} />
                                </button>
                            )}
                            <button onClick={handleSearch} className="p-1.5 bg-[#002874] text-white rounded-lg hover:bg-[#001d5a]">
                                <Search size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="w-full sm:w-44"><CustomSelect options={statusOptions} value={filterStatus} onChange={setFilterStatus} placeholder="وضعیت" /></div>
                <div className="w-full sm:w-40"><CustomSelect options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="مرتب‌سازی" /></div>
            </div>
        </div>
    );
};

export default SellerReturnsFilterBar;