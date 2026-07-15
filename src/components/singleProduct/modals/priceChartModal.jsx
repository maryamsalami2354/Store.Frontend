// src/components/singleProduct/modals/priceChartModal.jsx
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Activity } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PriceChartModal = ({ isOpen, onClose, product }) => {
    const [period, setPeriod] = useState('monthly');

    const monthlyData = [
        { name: 'فروردین', price: 9.2, avg: 9.8 },
        { name: 'اردیبهشت', price: 8.8, avg: 9.5 },
        { name: 'خرداد', price: 9.5, avg: 9.3 },
        { name: 'تیر', price: 10.0, avg: 9.6 },
        { name: 'مرداد', price: 9.0, avg: 9.4 },
        { name: 'شهریور', price: 8.5, avg: 9.1 },
        { name: 'مهر', price: 9.0, avg: 9.0 },
        { name: 'آبان', price: 8.8, avg: 8.9 },
        { name: 'آذر', price: 10.0, avg: 9.2 },
        { name: 'دی', price: 9.5, avg: 9.3 },
        { name: 'بهمن', price: 10.2, avg: 9.5 },
        { name: 'اسفند', price: 10.0, avg: 9.6 },
    ];

    const yearlyData = [
        { name: '۱۳۹۹', price: 5.0, avg: 6.0 },
        { name: '۱۴۰۰', price: 6.5, avg: 7.0 },
        { name: '۱۴۰۱', price: 8.0, avg: 8.5 },
        { name: '۱۴۰۲', price: 9.0, avg: 9.2 },
        { name: '۱۴۰۳', price: 8.5, avg: 9.0 },
        { name: '۱۴۰۴', price: 10.0, avg: 9.5 },
    ];

    const data = period === 'monthly' ? monthlyData : yearlyData;

    const currentPrice = data[data.length - 1]?.price || 0;
    const previousPrice = data[0]?.price || 0;
    const changePercent = previousPrice ? (((currentPrice - previousPrice) / previousPrice) * 100).toFixed(1) : 0;
    const isUp = parseFloat(changePercent) >= 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3 text-right">{label}</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 justify-end">
                            <span className="text-xs text-gray-600 dark:text-gray-300">{payload[0].value} میلیون</span>
                            <span className="text-xs text-gray-500">قیمت محصول:</span>
                            <span className="w-3 h-3 rounded-full bg-[#22c55e]"></span>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <span className="text-xs text-gray-600 dark:text-gray-300">{payload[1]?.value} میلیون</span>
                            <span className="text-xs text-gray-500">میانگین بازار:</span>
                            <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 p-4 lg:p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 lg:p-2.5 rounded-xl bg-gradient-to-br from-[#22c55e]/20 to-[#ef4444]/20">
                                    <Activity size={20} className="text-[#002874]  dark:text-[#4C6FB6]" />
                                </div>
                                <div>
                                    <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">نمودار تغییرات قیمت</h3>
                                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">{product?.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-5">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mb-1">قیمت فعلی</p>
                                    <p className="text-sm lg:text-lg font-bold text-gray-900 dark:text-white">{currentPrice}M</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mb-1">میانگین بازار</p>
                                    <p className="text-sm lg:text-lg font-bold text-gray-900 dark:text-white">{data[data.length - 1]?.avg}M</p>
                                </div>
                                <div className={`rounded-xl p-3 text-center ${isUp ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mb-1">تغییرات</p>
                                    <div className="flex items-center justify-center gap-1">
                                        {isUp ? <TrendingUp size={14} className="text-green-600" /> : <TrendingDown size={14} className="text-red-600" />}
                                        <p className={`text-sm lg:text-lg font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                                            {isUp ? '+' : ''}{changePercent}٪
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Period Selector */}
                            <div className="flex items-center gap-2 mb-4">
                                <button
                                    onClick={() => setPeriod('monthly')}
                                    className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                                        period === 'monthly'
                                            ? 'bg-[#002874] text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    ماهانه
                                </button>
                                <button
                                    onClick={() => setPeriod('yearly')}
                                    className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                                        period === 'yearly'
                                            ? 'bg-[#002874] text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    سالانه
                                </button>
                            </div>

                            {/* Chart */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3">
                                <div className="h-64 lg:h-72" dir="ltr">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={5} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}M`} width={40} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                                            <Line type="monotone" dataKey="price" name="قیمت" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="avg" name="میانگین" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} strokeDasharray="6 3" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PriceChartModal;