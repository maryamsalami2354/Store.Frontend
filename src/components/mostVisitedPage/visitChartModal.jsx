// =============================================================================
// FILE: VisitChartModal.jsx
// =============================================================================
import React, { useEffect, useRef } from 'react';
import { X, TrendingUp, Eye, Star, ShoppingBag } from 'react-feather';

const VisitChartModal = ({ isOpen, onClose, product }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    // تولید داده‌های هفتگی
    const weeklyData = product.visitsData || Array.from({ length: 7 }, () => Math.floor(Math.random() * 200) + 50);
    const maxVal = Math.max(...weeklyData);
    const totalVisits = weeklyData.reduce((a, b) => a + b, 0);
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#002874] to-[#4C6FB6] text-white">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">نمودار بازدید</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{product.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 p-5">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                        <Eye size={18} className="text-[#002874] dark:text-[#4C6FB6] mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{totalVisits.toLocaleString('fa-IR')}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">بازدید هفته</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                        <Star size={18} className="text-amber-400 mx-auto mb-1 fill-amber-400" />
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{product.rating || 0}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">امتیاز</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-center">
                        <ShoppingBag size={18} className="text-[#002874] dark:text-[#4C6FB6] mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{product.price}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">تومان</div>
                    </div>
                </div>

                {/* Chart */}
                <div className="px-5 pb-2">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                        {/* Y-axis labels */}
                        <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-2 px-1">
                            <span>{maxVal.toLocaleString('fa-IR')}</span>
                            <span>{Math.floor(maxVal / 2).toLocaleString('fa-IR')}</span>
                            <span>۰</span>
                        </div>

                        {/* Bars */}
                        <div className="flex items-end justify-between gap-2 h-40">
                            {weeklyData.map((val, idx) => {
                                const heightPercent = (val / maxVal) * 100;
                                const isToday = idx === weeklyData.length - 1;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                                        {/* Value label */}
                                        <span className={`text-[10px] font-bold tabular-nums ${isToday ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-500 dark:text-gray-400'}`}>
                      {val.toLocaleString('fa-IR')}
                    </span>
                                        {/* Bar */}
                                        <div className="w-full relative flex justify-center" style={{ height: `${heightPercent}%` }}>
                                            <div
                                                className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ${
                                                    isToday
                                                        ? 'bg-gradient-to-t from-[#002874] to-[#4C6FB6]'
                                                        : 'bg-gradient-to-t from-[#002874]/20 to-[#4C6FB6]/30 dark:from-[#4C6FB6]/30 dark:to-[#002874]/20'
                                                }`}
                                                style={{ height: '100%' }}
                                            >
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                                                    {val.toLocaleString('fa-IR')}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Day label */}
                                        <span className={`text-[10px] ${isToday ? 'font-bold text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-400 dark:text-gray-500'}`}>
                      {days[idx]}
                    </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Product Info Footer */}
                <div className="p-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-gray-800 p-1.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">رتبه بازدید: #{Math.floor(Math.random() * 20) + 1}</p>
                        </div>
                        <button onClick={onClose} className="px-4 py-2 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors">
                            بستن
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VisitChartModal;