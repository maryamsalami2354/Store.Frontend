// src/components/seller/sellerAnalytics/analyticsSalesChart.jsx
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DollarSign, ShoppingBag, Activity } from 'react-feather';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const periods = [
    { key: 'daily', label: 'روزانه' },
    { key: 'weekly', label: 'هفتگی' },
    { key: 'monthly', label: 'ماهانه' },
    { key: 'yearly', label: 'سالانه' },
];

const AnalyticsSalesChart = ({ salesData, isLoading }) => {
    const [period, setPeriod] = useState('monthly');

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 lg:p-6">
                <Skeleton width={200} height={24} className="dark:!bg-gray-800 mb-6" />
                <Skeleton width="100%" height={400} borderRadius={16} className="dark:!bg-gray-800" />
            </div>
        );
    }

    const data = (salesData?.[period] || []).map(item => ({
        ...item,
        salesMillions: Math.round(item.sales / 1000000),
        ordersCount: item.orders || 0,
    }));

    const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
    const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
    const totalViews = data.reduce((sum, d) => sum + (d.views || 0), 0);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">{label}</p>
                    {payload.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-3 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-xs text-gray-500">{entry.name}:</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white ml-auto">
                {entry.dataKey === 'salesMillions'
                    ? `${entry.value} میلیون تومان`
                    : `${entry.value} سفارش`
                }
              </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header & Period Selector */}
            <div className="p-5 lg:p-6 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">عملکرد فروش</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">نمودار فروش و سفارشات</p>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
                        {periods.map(p => (
                            <button
                                key={p.key}
                                onClick={() => setPeriod(p.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    period === p.key
                                        ? 'bg-white dark:bg-gray-700 text-[#002874]  dark:text-[#4C6FB6] shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Cards - Compact */}
            <div className="px-5 lg:px-6 mb-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3 text-center">
                        <DollarSign size={16} className="text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">فروش</p>
                        <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{(totalSales / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-3 text-center">
                        <ShoppingBag size={16} className="text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">سفارشات</p>
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{totalOrders.toLocaleString('fa-IR')}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-3 text-center">
                        <Activity size={16} className="text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">بازدید</p>
                        <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{totalViews.toLocaleString('fa-IR')}</p>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="bg-gray-50/50 dark:bg-gray-900/30 mx-3 lg:mx-4 rounded-xl p-3">
                <div className="h-64 lg:h-72" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                dy={5}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                dx={-5}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="salesMillions"
                                name="فروش (میلیون تومان)"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fill="url(#salesGradient)"
                                dot={false}
                                activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="ordersCount"
                                name="سفارشات"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#ordersGradient)"
                                dot={false}
                                activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-2 pb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">فروش</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">سفارشات</span>
                    </div>
                </div>
            </div>

            {/* Bottom Padding */}
            <div className="h-4"></div>
        </div>
    );
};

export default AnalyticsSalesChart;