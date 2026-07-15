// src/components/user/userWallet/walletTransactions.jsx
import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ArrowDown, ArrowUp, RotateCcw, CheckCircle, Clock, XCircle } from 'react-feather';

const typeConfig = {
    deposit: { label: 'شارژ', icon: ArrowDown, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    withdrawal: { label: 'برداشت', icon: ArrowUp, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
    refund: { label: 'استرداد', icon: RotateCcw, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
};

const statusConfig = {
    successful: { label: 'موفق', icon: CheckCircle, color: 'text-green-600' },
    pending: { label: 'در انتظار', icon: Clock, color: 'text-yellow-600' },
    failed: { label: 'ناموفق', icon: XCircle, color: 'text-red-600' },
};

const WalletTransactions = ({ transactions, isLoading }) => {
    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <Skeleton width={120} height={20} className="dark:!bg-gray-800 mb-4" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="flex items-center gap-3">
                            <Skeleton width={32} height={32} borderRadius={8} className="dark:!bg-gray-800" />
                            <div>
                                <Skeleton width={100} height={14} className="dark:!bg-gray-800 mb-1" />
                                <Skeleton width={60} height={12} className="dark:!bg-gray-800" />
                            </div>
                        </div>
                        <div className="text-left">
                            <Skeleton width={80} height={16} className="dark:!bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!transactions.length) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">هنوز تراکنشی انجام نشده</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">تاریخچه تراکنش‌ها</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {sortedTransactions.map(trx => {
                    const type = typeConfig[trx.type] || typeConfig.deposit;
                    const status = statusConfig[trx.status] || statusConfig.successful;
                    const TypeIcon = type.icon;
                    const StatusIcon = status.icon;
                    const isPositive = trx.type === 'deposit' || trx.type === 'refund';

                    return (
                        <div key={trx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${type.color}`}>
                                    <TypeIcon size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">{type.label}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs text-gray-500">{trx.date} - {trx.time}</p>
                                        {trx.trackingCode && (
                                            <p className="text-xs text-gray-400 dir-ltr">{trx.trackingCode}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? '+' : '-'}{trx.amount.toLocaleString('fa-IR')} تومان
                                </p>
                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                    <StatusIcon size={12} className={status.color} />
                                    <span className={`text-xs ${status.color}`}>{status.label}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WalletTransactions;