// =============================================================================
// FILE: brandsHero.jsx
// =============================================================================
import React, { useState } from 'react';
import { Search, X, Award } from 'react-feather';

const BrandsHero = ({ totalBrands = 0, searchQuery = '', onSearch, onClear }) => {
    const [inputValue, setInputValue] = useState(searchQuery);

    const handleSubmit = () => {
        onSearch(inputValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    const handleClear = () => {
        setInputValue('');
        onClear();
    };

    return (
        <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-5 sm:p-7 lg:p-9 mb-5">
            {/* Decorative */}
            <div className="absolute inset-0 opacity-[0.07]">
                <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Title */}
                <div className="flex-shrink-0">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur">
                            <Award size={26} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                برندهای <span className="text-amber-400">برتر</span>
                            </h1>
                            <p className="text-sm text-white/60 mt-0.5">
                                {totalBrands.toLocaleString('fa-IR')} برند معتبر
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 w-full sm:max-w-md sm:mr-auto">
                    <div className="relative">
                        <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="جستجوی نام برند..."
                            className="w-full py-2.5 pr-10 pl-24 rounded-xl bg-white/12 backdrop-blur border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all"
                        />
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {inputValue && (
                                <button onClick={handleClear} className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                                    <X size={15} />
                                </button>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="px-3 py-1.5 bg-amber-400 text-[#002874] rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors"
                            >
                                جستجو
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandsHero;