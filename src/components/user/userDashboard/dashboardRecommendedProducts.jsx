// src/components/user/userDashboard/dashboardRecommendedProducts.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Zap, ShoppingBag, ChevronLeft } from 'react-feather';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const DashboardRecommendedProducts = ({ products, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-full">
                <Skeleton width={120} height={20} className="dark:!bg-gray-800 mb-4" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3">
                        <Skeleton width={48} height={48} borderRadius={8} className="dark:!bg-gray-800" />
                        <div className="flex-1">
                            <Skeleton width="80%" height={14} className="dark:!bg-gray-800 mb-1" />
                            <Skeleton width="60%" height={12} className="dark:!bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products?.length) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-full text-center">
                <Zap size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">محصول پیشنهادی موجود نیست</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <Zap size={16} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">پیشنهاد ویژه</h2>
                </div>
                <Link to="/" className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline flex items-center gap-0.5">
                    فروشگاه <ChevronLeft size={14} />
                </Link>
            </div>
            <div className="space-y-3">
                {products.slice(0, 3).map(product => (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition group"
                    >
                        <LazyLoadImage
                            src={product.image}
                            effect="blur"
                            wrapperClassName="w-12 h-12 block flex-shrink-0"
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-[#002874]  transition">
                                {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.price} تومان</span>
                                {product.discount > 0 && (
                                    <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">{product.discount}%</span>
                                )}
                            </div>
                        </div>
                        <ShoppingBag size={16} className="text-gray-400 group-hover:text-[#002874]  transition" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DashboardRecommendedProducts;