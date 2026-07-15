// =============================================================================
// FILE: SellerProfilePageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ProductSkeletonSlider from '../ProductSkeletonSlider/ProductSkeletonSlider';

const SellerProfilePageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-5">
                <Skeleton width={50} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={100} height={16} borderRadius={8} />
            </div>
            <Skeleton height={180} borderRadius={24} className="mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-3 flex items-center gap-3">
                        <Skeleton circle width={40} height={40} />
                        <div><Skeleton width={50} height={18} /><Skeleton width={40} height={10} className="mt-1" /></div>
                    </div>
                ))}
            </div>
            <div className="flex gap-6">
                <div className="flex-1">
                    <Skeleton width={150} height={24} borderRadius={8} className="mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[1,2,3,4,5,6,7,8].map(i => <ProductSkeletonSlider key={i} />)}
                    </div>
                </div>
                <div className="w-80 hidden lg:block">
                    <Skeleton height={350} borderRadius={20} className="mb-4" />
                    <Skeleton height={250} borderRadius={20} />
                </div>
            </div>
        </div>
    </div>
);

export default SellerProfilePageSkeleton;