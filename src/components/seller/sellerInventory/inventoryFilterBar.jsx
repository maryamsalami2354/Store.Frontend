// src/components/seller/sellerInventory/inventoryFilterBar.jsx
import React from 'react';
import { Search } from 'react-feather';
import CustomSelect from '../../common/customSelect/customSelect';

const statusOptions = [
    { value: 'all', label: 'همه وضعیت‌ها' },
    { value: 'available', label: 'موجود' },
    { value: 'low-stock', label: 'نیاز به شارژ' },
    { value: 'out-of-stock', label: 'ناموجود' },
];

const sortOptions = [
    { value: 'name', label: 'نام محصول' },
    { value: 'stock-asc', label: 'موجودی (صعودی)' },
    { value: 'stock-desc', label: 'موجودی (نزولی)' },
    { value: 'newest', label: 'جدیدترین' },
];

const InventoryFilterBar = ({
                                searchQuery, setSearchQuery,
                                statusFilter, setStatusFilter,
                                categoryFilter, setCategoryFilter,
                                sortBy, setSortBy,
                                categories,
                            }) => {
    const categoryOptions = [
        { value: 'all', label: 'همه دسته‌ها' },
        ...categories.map(c => ({ value: c.id.toString(), label: c.name })),
    ];

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 lg:p-5">
            <div className="flex flex-wrap items-end gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                        type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder="جستجوی نام یا کد محصول..."
                        className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition"
                    />
                </div>
                <div className="min-w-[150px]"><CustomSelect options={statusOptions} value={statusFilter} onChange={setStatusFilter} placeholder="وضعیت" /></div>
                <div className="min-w-[150px]"><CustomSelect options={categoryOptions} value={categoryFilter} onChange={setCategoryFilter} placeholder="دسته‌بندی" /></div>
                <div className="min-w-[180px]"><CustomSelect options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="مرتب‌سازی" /></div>
            </div>
        </div>
    );
};

export default InventoryFilterBar;