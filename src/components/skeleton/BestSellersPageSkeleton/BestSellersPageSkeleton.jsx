// =============================================================================
// FILE: BestSellersPageSkeleton.jsx (اصلاح‌شده - ۳ کارت بزرگ)
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BestSellersPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
                <Skeleton width={50} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={100} height={16} borderRadius={8} />
            </div>

            {/* Hero */}
            <Skeleton height={160} borderRadius={24} className="mb-6" />

            {/* ۳ کارت فروشنده */}
            <div className="space-y-4 sm:space-y-5 max-w-5xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            {/* مدال */}
                            <div className="flex flex-col items-center gap-2">
                                <Skeleton circle width={48} height={48} />
                                <Skeleton width={60} height={16} borderRadius={20} />
                            </div>

                            {/* آواتار */}
                            <Skeleton width={112} height={112} borderRadius={16} />

                            {/* اطلاعات */}
                            <div className="flex-1 w-full space-y-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton width={160} height={24} borderRadius={8} />
                                    <Skeleton circle width={20} height={20} />
                                    <Skeleton width={80} height={18} borderRadius={20} />
                                </div>

                                <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map(j => <Skeleton key={j} width={16} height={16} borderRadius={4} />)}
                                    <Skeleton width={40} height={16} borderRadius={4} />
                                    <Skeleton width={80} height={14} borderRadius={4} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Skeleton width={60} height={14} borderRadius={4} />
                                    <Skeleton width={80} height={14} borderRadius={4} />
                                    <Skeleton width={70} height={14} borderRadius={4} />
                                </div>

                                {/* آمار ۴ ستونه */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/20">
                                    {[1,2,3,4].map(k => (
                                        <div key={k} className="text-center space-y-1">
                                            <Skeleton circle width={16} height={16} className="mx-auto" />
                                            <Skeleton width={50} height={20} borderRadius={4} className="mx-auto" />
                                            <Skeleton width={40} height={10} borderRadius={4} className="mx-auto" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default BestSellersPageSkeleton;