// src/components/seller/SellerHome/TopProductsList.jsx
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';
import { ChevronLeft, TrendingUp } from 'react-feather';
import { getCatalogProducts } from '../../../services/catalogApi.js';

const TopProductsList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 0.1));
            const rawProducts = [];
            const enhanced = rawProducts.slice(0, 4).map((product, index) => {
                const salesValues = [156, 124, 98, 67];
                const priceValues = [18900000, 2490000, 8900000, 1890000];
                const viewsValues = [4120, 3240, 2150, 1870];
                const percentages = [90, 75, 55, 40];
                return {
                    ...product,
                    sales: salesValues[index] || 100,
                    price: priceValues[index] || 5000000,
                    views: viewsValues[index] || 2000,
                    percentage: percentages[index] || 50
                };
            });
            setProducts(enhanced);
            setIsLoading(false);
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#002874]/20 to-[#4C6FB6]/20">
                            <TrendingUp size={16} className="text-[#002874]  dark:text-[#4C6FB6]" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">محصولات پرفروش</h2>
                    </div>
                    <Skeleton width={60} height={16} className="dark:!bg-gray-800" />
                </div>
                <div className="space-y-4">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="group">
                            <div className="flex items-start justify-between mb-1">
                                <div className="flex-1 min-w-0">
                                    <Skeleton width={140} height={16} className="dark:!bg-gray-800" />
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <Skeleton width={80} height={12} className="dark:!bg-gray-800" />
                                        <Skeleton width={60} height={12} className="dark:!bg-gray-800" />
                                    </div>
                                </div>
                                <Skeleton width={50} height={20} borderRadius={9999} className="dark:!bg-gray-800" />
                            </div>
                            <div className="relative mt-2">
                                <Skeleton width="100%" height={10} borderRadius={9999} className="dark:!bg-gray-800" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">مجموع فروش این محصولات:</span>
                        <Skeleton width={60} height={24} className="dark:!bg-gray-800" />
                    </div>
                </div>
            </div>
        );
    }

    const formatPrice = (price) => {
        if (!price) return '۰';
        if (price >= 1000000) return `${(price / 1000000).toFixed(1)} میلیون`;
        return `${(price / 1000).toFixed(0)} هزار`;
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#002874]/20 to-[#4C6FB6]/20">
                        <TrendingUp size={16} className="text-[#002874]  dark:text-[#4C6FB6]" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">محصولات پرفروش</h2>
                </div>
                <Link
                    to="/seller/products"
                    className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline flex items-center gap-0.5"
                >
                    همه <ChevronLeft size={14} />
                </Link>
            </div>

            <div className="space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="group">
                        <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                    {product.name || 'بدون نام'}
                                </h4>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatPrice(product.price)} تومان
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span>👁</span>
                                        {product.views.toLocaleString('fa-IR')}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-[#002874]  dark:text-[#4C6FB6] bg-[#002874]/10 dark:bg-[#4C6FB6]/20 px-2 py-0.5 rounded-full">
                                {product.sales} فروش
                            </span>
                        </div>
                        <div className="relative mt-2">
                            <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-l from-[#002874] to-[#4C6FB6] rounded-full transition-all duration-700"
                                    style={{ width: `${product.percentage}%` }}
                                />
                            </div>
                            <div
                                className="absolute -top-1.5 text-[9px] font-medium text-gray-600 dark:text-gray-400"
                                style={{ left: `${product.percentage}%`, transform: 'translateX(-50%)' }}
                            >
                                {product.percentage}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">مجموع فروش این محصولات:</span>
                    <span className="text-lg font-bold text-[#002874]  dark:text-[#4C6FB6]">
                        {products.reduce((sum, p) => sum + (p.sales || 0), 0).toLocaleString('fa-IR')} عدد
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TopProductsList;