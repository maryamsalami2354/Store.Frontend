import Skeleton from "react-loading-skeleton";
import React from "react";

const ProductSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="w-full max-w-full px-3 sm:px-4 lg:px-6 py-4 overflow-x-hidden">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                <Skeleton width={60} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={80} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={160} height={16} borderRadius={8} />
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12">

                    {/* Gallery */}
                    <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-800 p-3 sm:p-4 lg:p-6">
                        <div className="relative rounded-2xl overflow-hidden">
                            <Skeleton height={300} borderRadius={16} className="lg:h-96 w-full" />
                            <div className="absolute top-3 left-3">
                                <Skeleton width={50} height={24} borderRadius={8} />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton height={70} borderRadius={12} className={i === 0 ? 'ring-2 ring-[#002874]/30 dark:ring-[#4C6FB6]/30 rounded-xl w-full' : 'w-full'} />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <Skeleton height={40} borderRadius={12} />
                            <Skeleton height={40} borderRadius={12} />
                            <Skeleton height={40} borderRadius={12} />
                        </div>
                    </div>

                    {/* Main Info */}
                    <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-800 p-3 sm:p-4 lg:p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Skeleton width={96} height={24} borderRadius={8} />
                            <Skeleton width={12} height={12} borderRadius="50%" />
                            <Skeleton width={80} height={24} borderRadius={8} />
                        </div>

                        <div className="space-y-2 mb-4">
                            <Skeleton height={24} borderRadius={8} />
                            <Skeleton width="75%" height={24} borderRadius={8} />
                        </div>

                        <Skeleton width="100%" height={16} borderRadius={8} className="mb-4" />

                        <div className="flex flex-wrap items-center gap-3 mb-5 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-xl px-3 py-1.5">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} width={14} height={14} borderRadius={4} />
                                    ))}
                                </div>
                                <Skeleton width={32} height={14} borderRadius={4} />
                            </div>
                            <Skeleton width={96} height={16} borderRadius={8} />
                            <Skeleton width={112} height={16} borderRadius={8} />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <Skeleton width={96} height={20} borderRadius={8} />
                                <Skeleton width={48} height={20} borderRadius={8} />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800">
                                        <Skeleton width={20} height={20} borderRadius="50%" />
                                        <Skeleton width={40} height={12} borderRadius={4} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton width={20} height={20} borderRadius={6} />
                                    <Skeleton width={112} height={20} borderRadius={8} />
                                </div>
                                <Skeleton width={64} height={16} borderRadius={8} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl">
                                        <Skeleton width={28} height={28} borderRadius={8} />
                                        <Skeleton width="70%" height={12} borderRadius={4} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-3 p-3 sm:p-4 lg:p-6">
                        <div className="rounded-2xl p-4 sm:p-5 mb-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <div>
                                    <Skeleton width={80} height={16} borderRadius={8} />
                                    <Skeleton width={64} height={12} borderRadius={4} className="mt-1" />
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Skeleton width={96} height={16} borderRadius={8} />
                                    <Skeleton width={48} height={20} borderRadius={8} />
                                </div>
                                <Skeleton width={160} height={32} borderRadius={8} />
                            </div>

                            <Skeleton height={48} borderRadius={12} className="mb-3" />

                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton height={40} borderRadius={12} />
                                <Skeleton height={40} borderRadius={12} />
                                <Skeleton height={40} borderRadius={12} />
                                <Skeleton height={40} borderRadius={12} />
                            </div>
                        </div>

                        <div className="rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <Skeleton circle width={40} height={40} />
                                <div>
                                    <Skeleton width={96} height={16} borderRadius={8} />
                                    <Skeleton width={64} height={12} borderRadius={4} className="mt-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton width={16} height={16} borderRadius={4} />
                                    <Skeleton width="100%" height={12} borderRadius={4} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton width={16} height={16} borderRadius={4} />
                                    <Skeleton width="80%" height={12} borderRadius={4} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton width={16} height={16} borderRadius={4} />
                                    <Skeleton width="90%" height={12} borderRadius={4} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sellers Section */}
            <div className="mt-6 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 lg:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <Skeleton width={128} height={24} borderRadius={8} />
                    <Skeleton width={80} height={16} borderRadius={8} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <div>
                                    <Skeleton width={80} height={16} borderRadius={8} />
                                    <Skeleton width={56} height={12} borderRadius={4} className="mt-1" />
                                </div>
                            </div>
                            <div className="space-y-2 mb-3">
                                <Skeleton height={12} borderRadius={4} />
                                <Skeleton width="75%" height={12} borderRadius={4} />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <Skeleton width={96} height={24} borderRadius={8} />
                                <Skeleton width={80} height={32} borderRadius={8} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs Section - ساده شده */}
            <div className="mt-6 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-gray-200 dark:border-gray-800">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
                            <Skeleton width={60} height={16} borderRadius={8} />
                        </div>
                    ))}
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 sm:p-4">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <Skeleton width={128} height={20} borderRadius={8} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="flex flex-wrap items-center gap-2">
                                        <Skeleton width={6} height={6} borderRadius="50%" />
                                        <Skeleton width={80} height={12} borderRadius={4} />
                                        <Skeleton width={96} height={12} borderRadius={4} className="sm:ms-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <Skeleton width={160} height={24} borderRadius={8} />
                    <div className="flex gap-2">
                        <Skeleton width={32} height={32} borderRadius={8} />
                        <Skeleton width={32} height={32} borderRadius={8} />
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                            <Skeleton height={128} borderRadius={12} className="mb-2 w-full" />
                            <div className="flex gap-0.5 mb-1">
                                {[...Array(5)].map((_, j) => (
                                    <Skeleton key={j} width={12} height={12} borderRadius={4} />
                                ))}
                            </div>
                            <Skeleton height={16} borderRadius={4} className="mb-1" />
                            <Skeleton width="75%" height={16} borderRadius={4} className="mb-2" />
                            <div className="flex items-center justify-between gap-2">
                                <Skeleton width={80} height={20} borderRadius={8} />
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recently Viewed */}
            <div className="mt-8 mb-10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <Skeleton width={200} height={24} borderRadius={8} />
                    <Skeleton width={100} height={16} borderRadius={8} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                            <Skeleton height={128} borderRadius={12} className="mb-2 w-full" />
                            <Skeleton height={14} borderRadius={4} className="mb-1" />
                            <Skeleton width="60%" height={14} borderRadius={4} className="mb-2" />
                            <Skeleton width={80} height={20} borderRadius={8} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default ProductSkeleton;