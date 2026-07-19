// src/components/singleProduct/productStickyAddToCart.jsx
import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, X } from 'react-feather';
import { getProductAvailability } from '../../utils/helpers/productAvailability.js';

const ProductStickyAddToCart = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

    if (!isVisible) return null;

    const formatPrice = (price) => {
        if (!price) return '۰';
        return Number(String(price).replace(/[^\d]/g, '')).toLocaleString('fa-IR');
    };

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0f1117] border-t border-gray-200 dark:border-gray-800 shadow-2xl p-3">
            <button onClick={() => setIsVisible(false)} className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-gray-800 rounded-full p-1 shadow-md">
                <X size={14} className="text-gray-500" />
            </button>
            <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                    <span className="text-lg font-bold text-[#002874]  dark:text-[#4C6FB6]">{formatPrice(product?.price)}</span>
                    <span className={`mt-1 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${availabilityBadgeClass}`}>
                        {availabilityLabel}
                    </span>
                    <span className="text-xs text-gray-500 mr-1">تومان</span>
                </div>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button disabled={isOutOfStock} onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 disabled:opacity-40"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button disabled={isOutOfStock} onClick={() => setQuantity(q => q + 1)} className="p-2 disabled:opacity-40"><Plus size={14} /></button>
                </div>
                <button
                    disabled={isOutOfStock}
                    onClick={() => onAddToCart?.(quantity)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium ${isOutOfStock ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' : 'bg-[#002874] dark:bg-[#4C6FB6] text-white'}`}
                >
                    <ShoppingBag size={16} /> افزودن به سبد
                </button>
            </div>
        </div>
    );
};

export default ProductStickyAddToCart;
