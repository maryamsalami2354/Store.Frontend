// =============================================================================
// FILE: cartStickyFooter.jsx
// =============================================================================
import React from 'react';
import { ShoppingBag, Shield } from 'react-feather';

const CartStickyFooter = ({ total = 0, onCheckout }) => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 p-3 z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">مبلغ نهایی</p>
                <p className="text-lg font-extrabold text-[#002874] dark:text-[#4C6FB6]">{total.toLocaleString('fa-IR')} تومان</p>
            </div>
            <button
                onClick={onCheckout}
                className="flex-1 max-w-[200px] py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2"
            >
                <ShoppingBag size={18} />
                ادامه خرید
            </button>
        </div>
    </div>
);

export default CartStickyFooter;