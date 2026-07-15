// =============================================================================
// FILE: cartEmpty.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'react-feather';

const CartEmpty = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">سبد خرید خالی است</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">محصولی به سبد خرید اضافه نکرده‌اید.</p>
            <Link to="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors">
                <ShoppingBag size={18} />
                رفتن به فروشگاه
            </Link>
        </div>
    </div>
);

export default CartEmpty;