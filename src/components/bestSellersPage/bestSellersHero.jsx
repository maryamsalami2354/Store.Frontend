// =============================================================================
// FILE: bestSellersHero.jsx
// =============================================================================
import React from 'react';
import { Award, TrendingUp, Users } from 'react-feather';

const BestSellersHero = ({ total = 0 }) => (
    <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-6 sm:p-8 lg:p-10 mb-6">
        <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
        </div>
        <div className="relative z-10 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur mb-4">
                <Award size={32} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">بهترین فروشندگان</h1>
            <p className="text-sm text-white/70 max-w-xl mx-auto">{total.toLocaleString('fa-IR')} فروشنده برتر کیان شاپ</p>
            <div className="flex items-center justify-center gap-6 mt-6 text-white/80 text-sm">
                <span className="flex items-center gap-1.5"><TrendingUp size={16} className="text-amber-400" />بیشترین فروش</span>
                <span className="flex items-center gap-1.5"><Users size={16} className="text-amber-400" />رضایت مشتری</span>
            </div>
        </div>
    </div>
);

export default BestSellersHero;