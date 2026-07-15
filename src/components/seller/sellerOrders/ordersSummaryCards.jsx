// src/components/seller/sellerOrders/ordersSummaryCards.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ShoppingBag, Clock, Package, CheckCircle, XCircle, DollarSign } from 'react-feather';

const OrdersSummaryCards = ({ summary, isLoading }) => {
    const cards = [
        { title: 'کل سفارشات', value: summary?.total || 0, icon: ShoppingBag, color: 'blue' },
        { title: 'در انتظار', value: summary?.pending || 0, icon: Clock, color: 'yellow' },
        { title: 'در حال پردازش', value: summary?.processing || 0, icon: Package, color: 'purple' },
        { title: 'تکمیل شده', value: summary?.completed || 0, icon: CheckCircle, color: 'green' },
        { title: 'لغو شده', value: summary?.cancelled || 0, icon: XCircle, color: 'red' },
        { title: 'مجموع فروش', value: summary?.revenue?.toLocaleString('fa-IR') || '۰', icon: DollarSign, color: 'orange', isCurrency: true },
    ];

    const colorClasses = {
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Skeleton width={60} height={14} className="dark:!bg-gray-800 mb-1" />
                                <Skeleton width={40} height={22} className="dark:!bg-gray-800" />
                            </div>
                            <Skeleton width={32} height={32} borderRadius={8} className="dark:!bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {card.isCurrency ? (
                                    <>{card.value} <span className="text-xs font-normal text-gray-500">تومان</span></>
                                ) : (
                                    card.value.toLocaleString('fa-IR')
                                )}
                            </p>
                        </div>
                        <div className={`p-2 rounded-lg ${colorClasses[card.color]}`}>
                            <card.icon size={18} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrdersSummaryCards;