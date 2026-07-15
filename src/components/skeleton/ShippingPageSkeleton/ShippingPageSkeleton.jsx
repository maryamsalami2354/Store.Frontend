// =============================================================================
// FILE: ShippingPageSkeleton.jsx
// =============================================================================
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ShippingPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-4">
            <Skeleton height={80} borderRadius={20} className="mb-6" />
            <Skeleton width={200} height={32} borderRadius={8} className="mb-4" />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <Skeleton height={200} borderRadius={20} />
                    <Skeleton height={120} borderRadius={20} />
                </div>
                <div className="w-full lg:w-80"><Skeleton height={350} borderRadius={20} /></div>
            </div>
        </div>
    </div>
);

export default ShippingPageSkeleton;