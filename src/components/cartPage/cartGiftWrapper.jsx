// =============================================================================
// FILE: cartGiftWrapper.jsx
// =============================================================================
import React from 'react';
import { Gift } from 'react-feather';

const CartGiftWrapper = ({ checked, onChange }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
        <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/20">
                    <Gift size={18} className="text-pink-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">کادوپیچ</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">۱۵,۰۰۰ تومان</p>
                </div>
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-[#002874] dark:text-[#4C6FB6] focus:ring-[#002874] dark:focus:ring-[#4C6FB6]"
            />
        </label>
    </div>
);

export default CartGiftWrapper;