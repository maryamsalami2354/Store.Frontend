import React from 'react';
import { TrendingUp, Package, Search, X } from 'react-feather';

const MostVisitedHero = ({ productsCount, searchInput, onSearchChange, onSearch, onClearSearch }) => (
    <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-5 sm:p-7 lg:p-9 mb-5">
        <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur"><TrendingUp size={28} className="text-white" /></div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">پربازدیدترین <span className="text-amber-400">محصولات</span></h1>
                    <p className="text-sm text-white/70 mt-1 flex items-center gap-1.5"><Package size={14} />{productsCount.toLocaleString('fa-IR')} محصول</p>
                </div>
            </div>
            <div className="relative w-full sm:max-w-md sm:mr-auto">
                <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input type="text" value={searchInput} onChange={(e) => onSearchChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSearch()} placeholder="جستجو..." className="w-full py-2.5 pr-10 pl-24 rounded-xl bg-white/12 backdrop-blur border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/20 focus:border-white/30" />
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchInput && <button onClick={onClearSearch} className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10"><X size={15} /></button>}
                    <button onClick={onSearch} className="px-3 py-1.5 bg-amber-400 text-[#002874] rounded-lg text-xs font-bold hover:bg-amber-300"><Search size={14} /></button>
                </div>
            </div>
        </div>
    </div>
);

export default MostVisitedHero;