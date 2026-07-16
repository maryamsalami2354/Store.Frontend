// =============================================================================
// FILE: sellerLandingHero.jsx
// =============================================================================
import React from 'react';
import { Award, TrendingUp, Users, Home, ArrowLeft, Star } from 'react-feather';

const SellerLandingHero = ({ onStart }) => (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-6 sm:p-10 lg:p-14 mb-6">
        <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full border-[16px] border-white" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border-[16px] border-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-[8px] border-white/20" />
        </div>

        <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur rounded-full text-white text-sm mb-6">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    به خانواده بزرگ کیان شاپ بپیوندید
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                    فروشنده <span className="text-amber-400">کیان شاپ</span> شوید
                </h1>
                <p className="text-base sm:text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                    فروشگاه خود را در بزرگترین پلتفرم فروش آنلاین ایران راه‌اندازی کنید و محصولاتتان را به میلیون‌ها مشتری عرضه کنید.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={onStart}
                        className="px-8 py-3.5 bg-amber-400 text-[#002874] rounded-xl font-bold text-base hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/30 flex items-center gap-2"
                    >
                        همین حالا شروع کنید
                        <ArrowLeft size={18} />
                    </button>
                    <button className="px-8 py-3.5 bg-white/15 backdrop-blur text-white rounded-xl font-medium text-base hover:bg-white/25 transition-colors">
                        بیشتر بدانید
                    </button>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 max-w-2xl mx-auto">
                    {[
                        { icon: Home, value: '۱۲,۰۰۰+', label: 'فروشنده فعال' },
                        { icon: TrendingUp, value: '۵۰۰M+', label: 'فروش ماهانه' },
                        { icon: Users, value: '۲M+', label: 'مشتری فعال' },
                    ].map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="inline-flex p-2.5 rounded-xl bg-white/15 backdrop-blur mb-3">
                                <stat.icon size={22} className="text-amber-400" />
                            </div>
                            <div className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</div>
                            <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default SellerLandingHero;