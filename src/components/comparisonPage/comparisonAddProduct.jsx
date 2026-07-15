// =============================================================================
// FILE: comparisonAddProduct.jsx (اصلاح‌شده - جستجو + افزودن کار می‌کنه)
// =============================================================================
import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, X, Plus, Check } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ComparisonAddProduct = ({ allProducts = [], selectedIds = [], onAdd, onClose, max = 4 }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Fuse.js برای جستجو
    const fuse = useMemo(() => {
        if (!allProducts.length) return null;
        return new Fuse(allProducts, {
            keys: ['name', 'shortDescription'],
            threshold: 0.3,
        });
    }, [allProducts]);

    // نتایج جستجو
    const results = useMemo(() => {
        if (!allProducts.length) return [];
        if (!searchQuery.trim()) {
            return allProducts.slice(0, 12);
        }
        if (!fuse) return [];
        const searchResults = fuse.search(searchQuery.trim());
        return searchResults.map(r => r.item).slice(0, 12);
    }, [searchQuery, allProducts, fuse]);

    const handleAdd = (product) => {
        if (selectedIds.includes(product.id)) return;
        if (selectedIds.length >= max) return;
        onAdd(product.id);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl max-h-[75vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">افزودن محصول</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {selectedIds.length} از {max} محصول انتخاب شده — می‌توانید {max - selectedIds.length} محصول دیگر اضافه کنید
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <div className="relative">
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="جستجوی نام محصول..."
                            autoFocus
                            className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto">
                    {results.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                            محصولی با این نام یافت نشد
                        </div>
                    ) : (
                        results.map((product, index) => {
                            const isSelected = selectedIds.includes(product.id);
                            const isFull = selectedIds.length >= max && !isSelected;

                            return (
                                <div
                                    key={product.id || index}
                                    className={`flex items-center gap-4 p-4 border-b border-gray-50 dark:border-gray-800/50 transition-colors ${
                                        isSelected
                                            ? 'bg-[#002874]/5 dark:bg-[#4C6FB6]/10'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }`}
                                >
                                    {/* Product Image */}
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-1.5 flex-shrink-0">
                                        {product.image ? (
                                            <LazyLoadImage
                                                src={product.image}
                                                alt={product.name}
                                                effect="blur"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {product.price} تومان
                                        </p>
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        onClick={() => handleAdd(product)}
                                        disabled={isSelected || isFull}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex-shrink-0 ${
                                            isSelected
                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-not-allowed'
                                                : isFull
                                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                                    : 'bg-[#002874] text-white hover:bg-[#001d5a]'
                                        }`}
                                    >
                                        {isSelected ? (
                                            <>
                                                <Check size={16} />
                                                اضافه شده
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={16} />
                                                افزودن
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComparisonAddProduct;