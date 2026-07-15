// src/components/seller/sellerAnalytics/analyticsTopProducts.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { TrendingUp, TrendingDown, Minus, Award } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const trendConfig = {
    up: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    down: { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    stable: { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/30' },
};

const AnalyticsTopProducts = ({ products, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <Skeleton width={150} height={20} className="dark:!bg-gray-800 mb-4" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 mb-4">
                        <Skeleton width={28} height={28} borderRadius={8} className="dark:!bg-gray-800" />
                        <Skeleton width={44} height={44} borderRadius={10} className="dark:!bg-gray-800" />
                        <div className="flex-1">
                            <Skeleton width="70%" height={14} className="dark:!bg-gray-800 mb-1" />
                            <Skeleton width="40%" height={10} className="dark:!bg-gray-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products?.length) return null;

    const maxRevenue = Math.max(...products.map(p => p.revenue));

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Award size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">محصولات برتر</h2>
                <span className="text-xs text-gray-500">(این ماه)</span>
            </div>

            <div className="space-y-4">
                {products.map((product, idx) => {
                    const trend = trendConfig[product.trend] || trendConfig.stable;
                    const TrendIcon = trend.icon;
                    const barWidth = (product.revenue / maxRevenue) * 100;

                    return (
                        <div key={product.id} className="group">
                            <div className="flex items-center gap-3 mb-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-amber-400 text-white' :
                        idx === 1 ? 'bg-gray-300 text-gray-700' :
                            idx === 2 ? 'bg-orange-400 text-white' :
                                'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {idx + 1}
                </span>
                                <LazyLoadImage
                                    src={product.image}
                                    effect="blur"
                                    wrapperClassName="w-11 h-11 block flex-shrink-0"
                                    className="w-11 h-11 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{product.name}</h4>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-xs text-gray-500">{product.sales} فروش</span>
                                        <span className="text-xs text-gray-500">{(product.revenue / 1000000).toFixed(0)} میلیون</span>
                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${trend.color} ${trend.bg}`}>
                      <TrendIcon size={10} /> {product.percentage}%
                    </span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-l from-[#002874] to-[#4C6FB6] rounded-full transition-all duration-700"
                                    style={{ width: `${barWidth}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalyticsTopProducts;