// src/components/seller/sellerOrders/ordersFilterBar.jsx
import React from 'react';
import { Search, Filter } from 'react-feather';
import CustomSelect from '../../common/customSelect/customSelect';
import PersianDatePicker from '../../common/persianDatePicker/persianDatePicker';

const statusOptions = [
    { value: 'all', label: 'همه وضعیت‌ها' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'processing', label: 'در حال پردازش' },
    { value: 'shipped', label: 'ارسال شده' },
    { value: 'completed', label: 'تکمیل شده' },
    { value: 'cancelled', label: 'لغو شده' },
];

const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'amount-desc', label: 'بیشترین مبلغ' },
    { value: 'amount-asc', label: 'کمترین مبلغ' },
];

const OrdersFilterBar = ({
                             searchQuery,
                             setSearchQuery,
                             statusFilter,
                             setStatusFilter,
                             dateRange,
                             setDateRange,
                             sortBy,
                             setSortBy,
                         }) => {
    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setDateRange({ from: '', to: '' });
        setSortBy('newest');
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 lg:p-5">
            <div className="flex flex-wrap items-end gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="جستجوی کد / مشتری / تلفن..."
                        className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition"
                    />
                </div>

                {/* Status Filter */}
                <div className="min-w-[170px]">
                    <CustomSelect
                        options={statusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="وضعیت"
                    />
                </div>

                {/* From Date */}
                <div className="min-w-[140px]">
                    <PersianDatePicker
                        value={dateRange.from}
                        onChange={(val) => setDateRange(prev => ({ ...prev, from: val }))}
                        placeholder="از تاریخ"
                    />
                </div>

                {/* To Date */}
                <div className="min-w-[140px]">
                    <PersianDatePicker
                        value={dateRange.to}
                        onChange={(val) => setDateRange(prev => ({ ...prev, to: val }))}
                        placeholder="تا تاریخ"
                    />
                </div>

                {/* Sort */}
                <div className="min-w-[170px]">
                    <CustomSelect
                        options={sortOptions}
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="مرتب‌سازی"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <Filter size={18} />
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition whitespace-nowrap"
                    >
                        ریست
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersFilterBar;