// src/components/seller/sellerAnalytics/analyticsSummaryCards.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DollarSign, ShoppingBag, Eye, TrendingUp, BarChart2, Users } from 'react-feather';

const AnalyticsSummaryCards = ({ summary, isLoading }) => {
    const cards = [
        { title: 'فروش کل', value: summary?.totalSales || 0, icon: DollarSign, color: 'blue', isCurrency: true },
        { title: 'کل سفارشات', value: summary?.totalOrders || 0, icon: ShoppingBag, color: 'green' },
        { title: 'بازدید کل', value: summary?.totalViews || 0, icon: Eye, color: 'purple' },
        { title: 'میانگین سبد خرید', value: summary?.averageOrderValue || 0, icon: BarChart2, color: 'orange', isCurrency: true },
        { title: 'کل مشتریان', value: summary?.totalCustomers || 0, icon: Users, color: 'red' },
    ];

    const colorClasses = {
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
        red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Skeleton width={60} height={14} className="dark:!bg-gray-800 mb-1" />
                                <Skeleton width={50} height={22} className="dark:!bg-gray-800" />
                            </div>
                            <Skeleton width={32} height={32} borderRadius={8} className="dark:!bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {card.value.toLocaleString('fa-IR')}
                                {card.isCurrency && <span className="text-xs font-normal text-gray-500 mr-1">تومان</span>}
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

export default AnalyticsSummaryCards;