// src/components/user/userWallet/walletBalanceCard.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DollarSign, Plus, ArrowUp } from 'react-feather';

const WalletBalanceCard = ({ balance, isLoading, onCharge, onWithdraw }) => {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <Skeleton width={150} height={20} className="dark:!bg-gray-800 mb-4" />
                <Skeleton width={250} height={40} className="dark:!bg-gray-800 mb-4" />
                <div className="flex gap-3">
                    <Skeleton width={120} height={40} className="dark:!bg-gray-800" />
                    <Skeleton width={120} height={40} className="dark:!bg-gray-800" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 bg-gradient-to-l from-[#002874]/10 to-transparent dark:from-[#4C6FB6]/20 dark:to-transparent">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#002874] to-[#4C6FB6] flex items-center justify-center shadow-lg shadow-[#002874]/30">
                        <DollarSign size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">موجودی کیف پول</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">اعتبار قابل استفاده</p>
                    </div>
                </div>

                <p className="text-4xl font-extrabold text-[#002874]  dark:text-[#4C6FB6] mb-6">
                    {balance.toLocaleString('fa-IR')}
                    <span className="text-lg font-normal text-gray-500 mr-2">تومان</span>
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onCharge}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition shadow-md"
                    >
                        <Plus size={16} /> شارژ کیف پول
                    </button>
                    <button
                        onClick={onWithdraw}
                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        <ArrowUp size={16} /> برداشت
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletBalanceCard;