// =============================================================================
// FILE: amazingProductsHero.jsx (نسخه نهایی - تایمر سفید شیشه‌ای)
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Zap, Package, Search, X, Clock } from 'react-feather';

const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const days = Math.floor(totalHours / 24);

            setTimeLeft({
                days: days,
                hours: totalHours % 24,
                minutes: totalMinutes % 60,
                seconds: totalSeconds % 60
            });
        };
        calculate();
        const timer = setInterval(calculate, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
};

const AmazingProductsHero = ({ productsCount, searchInput, onSearchChange, onSearch, onClearSearch }) => {
    // ۱۵۰۰ روز (حدود ۴ سال)
    const targetDate = new Date(Date.now() + 1500 * 86400000).toISOString();
    const { days, hours, minutes, seconds } = useCountdown(targetDate);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-5 sm:p-7 lg:p-9 mb-5">
            <div className="absolute inset-0 opacity-[0.07]">
                <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur">
                            <Zap size={26} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                پیشنهاد <span className="text-amber-400">شگفت‌انگیز</span>
                            </h1>
                            <p className="text-sm text-white/60 mt-0.5 flex items-center gap-1.5">
                                <Package size={14} />
                                {productsCount.toLocaleString('fa-IR')} محصول
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full sm:max-w-md sm:mr-auto space-y-3">

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur rounded-xl px-4 py-3 w-fit border border-white/10">
                        <Clock size={16} className="text-amber-400" />
                        <div className="flex items-center gap-1.5" dir="ltr">
                            <div className="flex flex-col items-center min-w-[28px]">
                                <span className="text-lg font-bold text-white tabular-nums">{days.toLocaleString('fa-IR')}</span>
                                <span className="text-[9px] text-white/50">روز</span>
                            </div>
                            <span className="text-white/40 text-sm font-bold">:</span>
                            <div className="flex flex-col items-center min-w-[28px]">
                                <span className="text-lg font-bold text-white tabular-nums">{hours.toString().padStart(2, '۰')}</span>
                                <span className="text-[9px] text-white/50">ساعت</span>
                            </div>
                            <span className="text-white/40 text-sm font-bold">:</span>
                            <div className="flex flex-col items-center min-w-[28px]">
                                <span className="text-lg font-bold text-white tabular-nums">{minutes.toString().padStart(2, '۰')}</span>
                                <span className="text-[9px] text-white/50">دقیقه</span>
                            </div>
                            <span className="text-white/40 text-sm font-bold">:</span>
                            <div className="flex flex-col items-center min-w-[28px]">
                                <span className="text-lg font-bold text-white tabular-nums">{seconds.toString().padStart(2, '۰')}</span>
                                <span className="text-[9px] text-white/50">ثانیه</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                            placeholder="جستجو در محصولات شگفت‌انگیز..."
                            className="w-full py-2.5 pr-10 pl-24 rounded-xl bg-white/12 backdrop-blur border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all"
                        />
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {searchInput && (
                                <button onClick={onClearSearch} className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10">
                                    <X size={15} />
                                </button>
                            )}
                            <button onClick={onSearch} className="px-3 py-1.5 bg-amber-400 text-[#002874] rounded-lg text-xs font-bold hover:bg-amber-300">
                                <Search size={14} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AmazingProductsHero;