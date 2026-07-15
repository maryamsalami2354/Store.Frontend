// src/components/seller/SellerHome/WeeklySalesChart.jsx
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { ChevronLeft, TrendingUp, BarChart2 } from 'react-feather';

const data = [
    { day: 'شنبه', sales: 12.4, average: 10.2 },
    { day: 'یکشنبه', sales: 9.8, average: 10.5 },
    { day: 'دوشنبه', sales: 15.6, average: 11.0 },
    { day: 'سه‌شنبه', sales: 18.9, average: 12.3 },
    { day: 'چهارشنبه', sales: 14.5, average: 13.1 },
    { day: 'پنجشنبه', sales: 21.0, average: 14.5 },
    { day: 'جمعه', sales: 17.8, average: 15.2 },
];

const COLORS = {
    primary: '#002874',
    secondary: '#4C6FB6',
    accent: '#82ca9d',
    grid: '#e5e7eb',
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">{label}</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full theme-color"></span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">فروش:</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-white">
                            {payload[0].value.toFixed(1)} میلیون
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#4C6FB6]"></span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">میانگین:</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-white">
                            {payload[1].value.toFixed(1)} میلیون
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const WeeklySalesChart = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 0.1);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-[#002874]/20 to-[#4C6FB6]/20">
                            <BarChart2 size={18} className="text-[#002874]  dark:text-[#4C6FB6]" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">روند فروش هفتگی</h2>
                    </div>
                    <Skeleton width={80} height={16} className="dark:!bg-gray-800" />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                            <Skeleton width={50} height={10} className="dark:!bg-gray-800 mx-auto mb-1" />
                            <Skeleton width={40} height={16} className="dark:!bg-gray-800 mx-auto" />
                        </div>
                    ))}
                </div>
                <div className="h-64 lg:h-72">
                    <Skeleton width="100%" height="100%" borderRadius={12} className="dark:!bg-gray-800" />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Skeleton width={150} height={16} className="dark:!bg-gray-800" />
                    <Skeleton width={100} height={12} className="dark:!bg-gray-800" />
                </div>
            </div>
        );
    }

    const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
    const avgSales = totalSales / data.length;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#002874]/20 to-[#4C6FB6]/20">
                        <BarChart2 size={18} className="text-[#002874]  dark:text-[#4C6FB6]" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">روند فروش هفتگی</h2>
                </div>
                <Link
                    to="/seller/analytics"
                    className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline flex items-center gap-0.5"
                >
                    تحلیل کامل <ChevronLeft size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">کل فروش</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{totalSales.toFixed(1)}M</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">میانگین روزانه</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{avgSales.toFixed(1)}M</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">بیشترین</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                        {Math.max(...data.map(d => d.sales)).toFixed(1)}M
                    </p>
                </div>
            </div>

            <div className="h-64 lg:h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={COLORS.secondary} stopOpacity={0.6} />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(v) => `${v}M`} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(v) => `${v}M`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>}
                        />
                        <Bar yAxisId="left" dataKey="sales" name="فروش (میلیون تومان)" radius={[6, 6, 0, 0]} barSize={28} fill="url(#barGradient)" />
                        <Line yAxisId="right" type="monotone" dataKey="average" name="میانگین متحرک" stroke={COLORS.accent} strokeWidth={2} dot={{ r: 3, fill: COLORS.accent }} activeDot={{ r: 6 }} />
                        <Area yAxisId="right" type="monotone" dataKey="average" fill="url(#areaGradient)" stroke="none" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        رشد فروش: <span className="font-bold text-green-600">+۱۸.۵٪</span>
                    </span>
                </div>
                <span className="text-xs text-gray-400">نسبت به هفته گذشته</span>
            </div>
        </div>
    );
};

export default WeeklySalesChart;