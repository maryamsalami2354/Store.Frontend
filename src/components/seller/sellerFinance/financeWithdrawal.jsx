// src/components/seller/sellerFinance/financeWithdrawal.jsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DollarSign, Send } from 'react-feather';

const statusConfig = {
    pending: { label: 'در انتظار', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    paid: { label: 'پرداخت شده', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    rejected: { label: 'رد شده', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const TableSkeleton = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                    {['مبلغ', 'تاریخ درخواست', 'وضعیت', 'تاریخ پرداخت', 'حساب'].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...Array(3)].map((_, i) => (
                    <tr key={i}>
                        {[...Array(5)].map((_, j) => (
                            <td key={j} className="px-4 py-3">
                                <div className={`h-4 ${j === 3 ? 'w-16 rounded-full' : 'w-20'} bg-gray-200 dark:bg-gray-800 rounded animate-pulse`} />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

const FinanceWithdrawal = ({ wallet, withdrawals, isLoading, onRequestWithdrawal }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const numAmount = parseInt(amount.replace(/[^\d]/g, ''));
        onRequestWithdrawal(numAmount);
        setAmount('');
    };

    const formatAmountWithComma = (value) => {
        if (!value) return '';
        const num = value.toString().replace(/[^\d]/g, '');
        if (!num) return '';
        return Number(num).toLocaleString('en-US');
    };

    if (isLoading) {
        return (
            <div className="space-y-5">
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                    <Skeleton width={150} height={24} className="dark:!bg-gray-800 mb-4" />
                    <Skeleton width="100%" height={100} className="dark:!bg-gray-800" />
                </div>
                <TableSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* فرم درخواست تسویه */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                        <DollarSign size={20} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">درخواست تسویه حساب</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    موجودی قابل برداشت: <span className="font-bold text-gray-900 dark:text-white">{wallet?.balance?.toLocaleString('fa-IR') || '۰'} تومان</span>
                </p>
                <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">مبلغ (تومان)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={amount}
                            onChange={(e) => setAmount(formatAmountWithComma(e.target.value))}
                            placeholder="مبلغ مورد نظر"
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition"
                    >
                        <Send size={16} /> ثبت درخواست
                    </button>
                </form>
            </div>

            {/* تاریخچه تسویه‌ها */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">تاریخچه تسویه‌ها</h3>
                {withdrawals.length === 0 ? (
                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">تاریخچه‌ای موجود نیست</p>
                    </div>
                ) : (
                    <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">مبلغ</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاریخ درخواست</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاریخ پرداخت</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">حساب</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {withdrawals.map(w => {
                                    const status = statusConfig[w.status] || {};
                                    return (
                                        <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{w.amount.toLocaleString('fa-IR')} تومان</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{w.requestDate}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{w.paidDate || '---'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 dir-ltr text-left">{w.account}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* کارت‌های موبایل برای تاریخچه */}
                {withdrawals.length > 0 && (
                    <div className="md:hidden space-y-3 mt-4">
                        {withdrawals.map(w => {
                            const status = statusConfig[w.status] || {};
                            return (
                                <div key={w.id} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{w.amount.toLocaleString('fa-IR')} تومان</span>
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{w.requestDate}</span>
                                        <span className="dir-ltr">{w.account}</span>
                                    </div>
                                    {w.paidDate && <p className="text-xs text-gray-500 mt-1">پرداخت: {w.paidDate}</p>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceWithdrawal;