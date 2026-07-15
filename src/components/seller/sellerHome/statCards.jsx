// src/components/seller/SellerHome/StatCards.jsx
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DollarSign, ShoppingBag, Eye, Package, TrendingUp, TrendingDown } from 'react-feather';

const STAT_CONFIG = {
    sales: { title: 'فروش امروز', icon: DollarSign, color: 'blue' },
    orders: { title: 'سفارشات امروز', icon: ShoppingBag, color: 'green' },
    views: { title: 'بازدید امروز', icon: Eye, color: 'purple' },
    products: { title: 'محصولات فعال', icon: Package, color: 'orange' },
};

const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
};

const StatCards = () => {
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            // شبیه‌سازی دریافت از API
            await new Promise(resolve => setTimeout(resolve, 0.1));
            const mockData = [
                { key: 'sales', value: '۱۸,۵۰۰,۰۰۰', change: '+۱۵.۲٪', trend: 'up' },
                { key: 'orders', value: '۶۴', change: '+۸.۱٪', trend: 'up' },
                { key: 'views', value: '۳,۸۴۲', change: '-۲.۴٪', trend: 'down' },
                { key: 'products', value: '۱۲۴', change: '+۴٪', trend: 'up' },
            ];
            const merged = mockData.map(stat => ({
                ...STAT_CONFIG[stat.key],
                ...stat,
            }));
            setStats(merged);
            setIsLoading(false);
        };
        loadStats();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {Object.entries(STAT_CONFIG).map(([key, config]) => (
                    <div key={key} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{config.title}</p>
                                <Skeleton width={100} height={28} className="dark:!bg-gray-800 mt-1" />
                            </div>
                            <div className={`p-3 rounded-xl ${colorClasses[config.color]}`}>
                                <config.icon size={24} />
                            </div>
                        </div>
                        <div className="flex items-center mt-3 text-sm">
                            <Skeleton width={16} height={16} className="dark:!bg-gray-800 ml-1" />
                            <Skeleton width={50} height={16} className="dark:!bg-gray-800" />
                            <Skeleton width={80} height={16} className="dark:!bg-gray-800 mr-2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <p className="text-2xl flex gap-1 items-center font-bold text-gray-900 dark:text-white mt-1">
                                {stat.value} {stat.title.includes('فروش') && <span className="text-xs font-normal text-gray-500">تومان</span>}
                            </p>
                        </div>
                        <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                    <div className="flex items-center mt-3 text-sm">
                        {stat.trend === 'up' ? (
                            <TrendingUp size={16} className="text-green-500 ml-1" />
                        ) : (
                            <TrendingDown size={16} className="text-red-500 ml-1" />
                        )}
                        <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>{stat.change}</span>
                        <span className="text-gray-400 mr-2">نسبت به دیروز</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;