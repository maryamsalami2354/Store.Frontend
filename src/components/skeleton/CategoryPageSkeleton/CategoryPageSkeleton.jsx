// =============================================================================
// FILE: CategoryPageSkeleton.jsx (اصلاح‌شده - overflow-x-hidden)
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import ProductSkeletonSlider from '../ProductSkeletonSlider/ProductSkeletonSlider.jsx';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoryPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4 overflow-hidden">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
                <Skeleton width={50} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={90} height={16} borderRadius={8} />
            </div>

            {/* Hero */}
            <Skeleton height={140} borderRadius={24} className="mb-6" />

            {/* Subcategories */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} width={100} height={30} borderRadius={12} className="flex-shrink-0" />)}
            </div>

            {/* Top Brands */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-4 flex items-center gap-2 flex-shrink-0">
                        <Skeleton circle width={32} height={32} />
                        <Skeleton width={60} height={14} />
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <Skeleton height={44} borderRadius={14} className="mb-4" />

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => <ProductSkeletonSlider key={i} />)}
            </div>
        </div>
    </div>
);

export default CategoryPageSkeleton;