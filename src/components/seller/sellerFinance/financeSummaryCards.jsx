// src/components/seller/sellerFinance/financeSummaryCards.jsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DollarSign, TrendingUp, Archive, Clock } from 'react-feather';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FinanceSummaryCards = ({ summary, isLoading }) => {
    const [chartPeriod, setChartPeriod] = useState('weekly');

    const cards = [
        { title: 'موجودی کیف پول', value: summary?.balance || 0, icon: DollarSign, color: 'blue', isCurrency: true },
        { title: 'فروش این ماه', value: summary?.monthlySales || 0, icon: TrendingUp, color: 'green', isCurrency: true },
        { title: 'کل درآمد', value: summary?.totalRevenue || 0, icon: Archive, color: 'purple', isCurrency: true },
        { title: 'در انتظار تسویه', value: summary?.pendingWithdrawals || 0, icon: Clock, color: 'orange', isCurrency: true },
    ];

    const colorClasses = {
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };

    // داده‌های نمودار
    const weeklyData = [
        { name: 'ش', income: 12.4, expense: 3.2 },
        { name: 'ی', income: 9.8, expense: 4.1 },
        { name: 'د', income: 15.6, expense: 2.8 },
        { name: 'س', income: 18.9, expense: 5.6 },
        { name: 'چ', income: 14.5, expense: 3.7 },
        { name: 'پ', income: 21.0, expense: 4.8 },
        { name: 'ج', income: 17.8, expense: 2.9 },
    ];

    const monthlyData = [
        { name: 'فروردین', income: 85.2, expense: 22.5 },
        { name: 'اردیبهشت', income: 92.8, expense: 28.1 },
        { name: 'خرداد', income: 78.6, expense: 31.2 },
        { name: 'تیر', income: 105.3, expense: 35.8 },
        { name: 'مرداد', income: 112.7, expense: 29.4 },
        { name: 'شهریور', income: 98.4, expense: 33.1 },
    ];

    const yearlyData = [
        { name: '۱۴۰۰', income: 890, expense: 320 },
        { name: '۱۴۰۱', income: 1050, expense: 410 },
        { name: '۱۴۰۲', income: 1245, expense: 480 },
        { name: '۱۴۰۳', income: 1580, expense: 550 },
        { name: '۱۴۰۴', income: 890, expense: 290 },
    ];

    const chartData = chartPeriod === 'weekly' ? weeklyData : chartPeriod === 'monthly' ? monthlyData : yearlyData;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">{label}</p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#22c55e]"></span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">درآمد:</span>
                            <span className="text-xs font-bold text-gray-800 dark:text-white">{payload[0].value.toFixed(1)} میلیون</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">هزینه:</span>
                            <span className="text-xs font-bold text-gray-800 dark:text-white">{payload[1]?.value?.toFixed(1)} میلیون</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton width={80} height={14} className="dark:!bg-gray-800 mb-1" />
                                    <Skeleton width={60} height={22} className="dark:!bg-gray-800" />
                                </div>
                                <Skeleton width={32} height={32} borderRadius={8} className="dark:!bg-gray-800" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <Skeleton width={150} height={20} className="dark:!bg-gray-800 mb-4" />
                    <Skeleton width="100%" height={250} className="dark:!bg-gray-800" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* کارت‌های آماری */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {card.value.toLocaleString('fa-IR')}
                                    {card.isCurrency && <span className="text-xs font-normal text-gray-500 mr-1">تومان</span>}
                                </p>
                            </div>
                            <div className={`p-2 rounded-lg ${colorClasses[card.color]}`}>
                                <card.icon size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* نمودار با دکمه‌های هفتگی/ماهانه/سالانه */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#22c55e]/10 dark:bg-[#22c55e]/20">
                            <TrendingUp size={18} className="text-[#22c55e]" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">نمودار درآمد و هزینه</h2>
                    </div>

                    {/* دکمه‌های انتخاب دوره */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <button
                            onClick={() => setChartPeriod('weekly')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                chartPeriod === 'weekly'
                                    ? 'bg-white dark:bg-gray-700 text-[#002874]  dark:text-[#4C6FB6] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            هفتگی
                        </button>
                        <button
                            onClick={() => setChartPeriod('monthly')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                chartPeriod === 'monthly'
                                    ? 'bg-white dark:bg-gray-700 text-[#002874]  dark:text-[#4C6FB6] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            ماهانه
                        </button>
                        <button
                            onClick={() => setChartPeriod('yearly')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                chartPeriod === 'yearly'
                                    ? 'bg-white dark:bg-gray-700 text-[#002874]  dark:text-[#4C6FB6] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            سالانه
                        </button>
                    </div>
                </div>

                <div className="h-64 lg:h-72 min-h-[250px]" dir="ltr">
                    <ResponsiveContainer minHeight={250} width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(v) => `${v}M`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="income" name="درآمد" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="expense" name="هزینه" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FinanceSummaryCards;