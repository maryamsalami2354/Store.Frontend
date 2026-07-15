// src/components/seller/SellerHome/StoreSummary.jsx
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AlertTriangle, Clock, DollarSign, ChevronLeft } from 'react-feather';
import { Link } from 'react-router-dom';

const summaryItems = [
    { title: 'موجودی رو به اتمام', icon: AlertTriangle, color: 'orange', link: '/seller/inventory' },
    { title: 'سفارشات در انتظار', icon: Clock, color: 'blue', link: '/seller/orders?status=pending' },
    { title: 'درآمد این ماه', icon: DollarSign, color: 'green', link: '/seller/finance' },
];

const colorClasses = {
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
};

const StoreSummary = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([
        { value: '', description: '' },
        { value: '', description: '' },
        { value: '', description: '' },
    ]);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 0.1));
            setData([
                { value: '۳ محصول', description: 'نیاز به شارژ مجدد' },
                { value: '۸ سفارش', description: 'نیاز به بررسی' },
                { value: '۴۸.۲ میلیون', description: '+۲۲٪ نسبت به ماه قبل' },
            ]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <DollarSign size={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">خلاصه وضعیت فروشگاه</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {summaryItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                            <div className={`p-2 rounded-lg ${colorClasses[item.color]}`}>
                                <item.icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-white">{item.title}</h3>
                                <Skeleton width={80} height={24} className="dark:!bg-gray-800 mt-0.5" />
                                <Skeleton width={120} height={16} className="dark:!bg-gray-800 mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <DollarSign size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">خلاصه وضعیت فروشگاه</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {summaryItems.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item.link}
                        className="group flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                        <div className={`p-2 rounded-lg ${colorClasses[item.color]}`}>
                            <item.icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-white">{item.title}</h3>
                                <ChevronLeft size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{data[idx].value}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{data[idx].description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default StoreSummary;