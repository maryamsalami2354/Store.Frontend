// src/components/seller/sellerFinance/financeTransactions.jsx
import React, { useState, useMemo } from 'react';
import CustomSelect from '../../common/customSelect/customSelect';
import { Search } from 'react-feather';

const typeConfig = {
    purchase: { label: 'خرید', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    deposit: { label: 'شارژ', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    withdrawal: { label: 'تسویه', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
};

const statusConfig = {
    successful: { label: 'موفق', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    failed: { label: 'ناموفق', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
};

const typeOptions = [
    { value: 'all', label: 'همه تراکنش‌ها' },
    { value: 'purchase', label: 'خرید' },
    { value: 'deposit', label: 'شارژ' },
    { value: 'withdrawal', label: 'تسویه' },
];

const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
];

const TableSkeleton = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                    {['نوع', 'مبلغ', 'تاریخ', 'وضعیت', 'کد پیگیری'].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                        <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

const MobileSkeleton = () => (
    <div className="md:hidden space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                </div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
        ))}
    </div>
);

const FinanceTransactions = ({ transactions, isLoading, fuse }) => {
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = useMemo(() => {
        let result = searchQuery.trim() && fuse
            ? fuse.search(searchQuery.trim()).map(r => r.item)
            : [...transactions];

        if (typeFilter !== 'all') {
            result = result.filter(t => t.type === typeFilter);
        }

        result.sort((a, b) => {
            return sortBy === 'newest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
        });

        return result;
    }, [transactions, typeFilter, sortBy, searchQuery, fuse]);

    if (isLoading) {
        return (
            <>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                </div>
                <TableSkeleton />
                <MobileSkeleton />
            </>
        );
    }

    return (
        <div className="space-y-4">
            {/* فیلترها و جستجو */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="جستجوی کد پیگیری..."
                        className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition"
                    />
                </div>
                <div className="min-w-[170px]">
                    <CustomSelect options={typeOptions} value={typeFilter} onChange={setTypeFilter} placeholder="نوع تراکنش" />
                </div>
                <div className="min-w-[170px]">
                    <CustomSelect options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="مرتب‌سازی" />
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">تراکنشی یافت نشد</p>
                </div>
            ) : (
                <>
                    {/* جدول دسکتاپ */}
                    <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">نوع</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مبلغ</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">تاریخ</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">کد پیگیری</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {filteredTransactions.map(trx => {
                                    const type = typeConfig[trx.type] || {};
                                    const status = statusConfig[trx.status] || {};
                                    return (
                                        <tr key={trx.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${type.color}`}>{type.label}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{trx.amount.toLocaleString('fa-IR')} تومان</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{trx.date}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 dir-ltr text-left">{trx.trackingCode}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* کارت‌های موبایل */}
                    <div className="md:hidden space-y-4">
                        {filteredTransactions.map(trx => {
                            const type = typeConfig[trx.type] || {};
                            const status = statusConfig[trx.status] || {};
                            return (
                                <div key={trx.id} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${type.color}`}>{type.label}</span>
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{trx.amount.toLocaleString('fa-IR')} تومان</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{trx.date}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 dir-ltr">{trx.trackingCode}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default FinanceTransactions;