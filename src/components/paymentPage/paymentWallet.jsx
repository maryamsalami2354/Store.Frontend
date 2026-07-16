// =============================================================================
// FILE: paymentWallet.jsx
// =============================================================================
import React from 'react';
import { Archive, Eye, EyeOff } from 'react-feather';

const PaymentWallet = ({ password, onPasswordChange, balance }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Archive size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
            کیف پول کیان شاپ
        </h3>

        <div className="bg-gradient-to-r from-[#002874]/10 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">موجودی</p>
            <p className="text-2xl font-extrabold text-[#002874] dark:text-[#4C6FB6]">{balance.toLocaleString('fa-IR')} تومان</p>
        </div>

        <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">رمز کیف پول</label>
            <div className="relative">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="●●●●●●"
                    className="w-full p-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left"
                />
            </div>
        </div>
    </div>
);

export default PaymentWallet;