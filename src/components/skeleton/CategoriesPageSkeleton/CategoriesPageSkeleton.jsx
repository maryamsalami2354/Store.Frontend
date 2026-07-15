// =============================================================================
// FILE: CategoriesPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoriesPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-5">
                <Skeleton width={50} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={90} height={16} borderRadius={8} />
            </div>
            <Skeleton height={120} borderRadius={20} className="mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-3 flex items-center gap-3">
                        <Skeleton circle width={40} height={40} />
                        <div><Skeleton width={40} height={18} /><Skeleton width={30} height={10} className="mt-1" /></div>
                    </div>
                ))}
            </div>
            <Skeleton height={44} borderRadius={14} className="mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-4 flex flex-col items-center">
                        <Skeleton circle width={72} height={72} className="mb-3" />
                        <Skeleton width={90} height={16} className="mb-2" />
                        <Skeleton width={60} height={12} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default CategoriesPageSkeleton;